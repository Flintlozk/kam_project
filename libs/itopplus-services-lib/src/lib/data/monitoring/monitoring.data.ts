import { ISubscription } from '@reactor-room/itopplus-model-lib';
import { logSchemaModel } from '@reactor-room/plusmar-model-mongo-lib';

import { Pool } from 'pg';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';

export async function getLogsForTestConnectionMongo(): Promise<boolean> {
  await logSchemaModel.find().limit(1).lean().exec();
  return true;
}

export async function getSubscriptionPlansForTestConnectionPG(client: Pool): Promise<ISubscription[]> {
  const SQL = 'SELECT id FROM subscription_plans LIMIT 1';
  return await PostgresHelper.execQuery<ISubscription[]>(client, SQL, []);
}
