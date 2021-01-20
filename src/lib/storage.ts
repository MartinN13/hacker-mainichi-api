import { S3 } from 'aws-sdk';
import { Bucket, dev } from '../settings';
import { db } from './db';

type Await<T> = T extends PromiseLike<infer U> ? U : T;

const devOptions = {
  accessKeyId: 'S3RVER',
  endpoint: 'http://localhost:4568',
  s3ForcePathStyle: true,
  secretAccessKey: 'S3RVER',
};

const s3 = new S3(dev ? devOptions : undefined);

const storage = {
  upload: async ({ date, stories }: { date: string; stories: Await<ReturnType<typeof db['stories']>> }) => {
    const Body = Buffer.from(JSON.stringify(stories));

    await s3.upload({ Body, Bucket, Key: `stories-${date}.json` }).promise();
  },
};

export { storage };
