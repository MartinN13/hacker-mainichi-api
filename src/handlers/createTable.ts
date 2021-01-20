import { db } from '../lib';

const handler = async () => db.createTable();

export { handler };
