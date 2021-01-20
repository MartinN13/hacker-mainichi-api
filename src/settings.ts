export const dev = process.env.NODE_ENV === 'development';

export const Bucket = dev ? 'hacker-mainichi' : (process.env.S3_DATA_BUCKET_NAME as string);
export const DATE = process.env.DATE;
export const TableName = dev ? 'hacker-mainichi' : (process.env.DYNAMO_DB_TABLE_NAME as string);
