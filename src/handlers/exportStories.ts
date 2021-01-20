import format from 'date-fns/format';
import startOfYesterday from 'date-fns/startOfYesterday';
import { db, storage } from '../lib';
import { DATE } from '../settings';

const handler = async () => {
  const date = DATE || format(startOfYesterday(), 'yyyyMMdd');
  const unsortedStories = await db.stories({ date });
  const stories = unsortedStories.sort((a, b) => (a.score > b.score ? -1 : 1));

  await storage.upload({ date, stories });
};

export { handler };
