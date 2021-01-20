import format from 'date-fns/format';
import startOfYesterday from 'date-fns/startOfYesterday';
import { api, db } from '../lib';
import { DATE } from '../settings';

const handler = async () => {
  const date = DATE || format(startOfYesterday(), 'yyyyMMdd');
  const stories = await api.stories({ date });

  await db.batchWrite({ stories });
};

export { handler };
