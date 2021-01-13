import { DynamoDB } from 'aws-sdk';
import { TableName } from './settings';

interface Story {
  id: number;
  by: string;
  commentCount: number;
  score: number;
  time: number;
  title: string;
}

const chunkSize = 25;
const dynamoDB = new DynamoDB();
const client = new DynamoDB.DocumentClient();
const tableParams = {
  AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'N' }],
  BillingMode: 'PAY_PER_REQUEST',
  TableName,
};

const db = {
  batchWrite: async (stories: Story[]) => {
    const storyChunks = [];

    for (let i = 0; i < stories.length; i += chunkSize) {
      storyChunks.push(stories.slice(i, i + chunkSize));
    }

    await Promise.all(
      storyChunks.map(async stories =>
        client
          .batchWrite({
            RequestItems: {
              [TableName]: stories.map(story => ({
                PutRequest: {
                  Item: story,
                },
              })),
            },
          })
          .promise(),
      ),
    );
  },
  checkIfTableExists: async () => {
    try {
      await dynamoDB.describeTable({ TableName }).promise();

      return true;
    } catch (error) {
      if (error.code !== 'ResourceNotFoundException') {
        throw error;
      }

      return false;
    }
  },
  createTable: () =>
    dynamoDB
      .createTable({
        ...tableParams,
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      })
      .promise(),
  updateTable: () => dynamoDB.updateTable(tableParams).promise(),
};

export { db };
