import { api } from '../api';
import { db } from '../db';

const handler = async () => {
  const stories = await api.getStories();

  await db.batchWrite(stories);
};

export { handler };
