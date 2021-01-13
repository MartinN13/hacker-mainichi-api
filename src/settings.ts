import { config as dotenv } from 'dotenv-safe';
import { config as awsConfig } from 'aws-sdk';

dotenv();

export const TableName = process.env.TABLE_NAME as string;

if (process.env.NODE_ENV === 'development') {
  awsConfig.update({
    credentials: {
      accessKeyId: 'key',
      secretAccessKey: 'key',
    },
    dynamodb: {
      endpoint: 'http://localhost:8000',
    },
    region: 'us-east-1',
  });
}
