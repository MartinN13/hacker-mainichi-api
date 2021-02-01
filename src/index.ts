import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Bucket as bucketName, isDevelopment, TableName } from './settings';

const environment = {
  DYNAMO_DB_TABLE_NAME: TableName,
  NODE_OPTIONS: '--enable-source-maps',
  S3_DATA_BUCKET_NAME: bucketName,
  TZ: 'Asia/Tokyo',
};

class API extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const bucket = Bucket.fromBucketName(this, 'Bucket', bucketName);

    const exportStories = new NodejsFunction(this, 'exportStories', {
      entry: './src/handlers/exportStories.ts',
      environment,
      timeout: Duration.minutes(1),
    });

    const saveStories = new NodejsFunction(this, 'saveStories', {
      entry: './src/handlers/saveStories.ts',
      environment,
      timeout: Duration.minutes(15),
    });

    const schedule = new Rule(this, 'Rule', {
      enabled: !isDevelopment,
      schedule: Schedule.expression('cron(1 15 * * * *)'),
    });

    const table = new Table(this, 'Table', {
      partitionKey: { name: 'date', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.NUMBER },
      tableName: TableName,
    });

    bucket.grantWrite(exportStories);
    exportStories.grantInvoke(saveStories);
    schedule.addTarget(new LambdaFunction(saveStories));
    table.grantReadWriteData(saveStories);
  }
}

const app = new App();

new API(app, 'HackerMainichiAPI');

app.synth();
