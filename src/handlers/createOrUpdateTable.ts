import { db } from '../db';

const handler = async () => {
  const tableExists = await db.checkIfTableExists();

  if (tableExists) {
    await db.updateTable();
  } else {
    await db.createTable();
  }
};

export { handler };
