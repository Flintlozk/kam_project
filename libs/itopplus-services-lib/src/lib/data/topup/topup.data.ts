import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumTopUpStatus, ITopupHistories, ITopupReference } from '@reactor-room/itopplus-model-lib';
import { topupReferenceSchemaModel as TopUp } from '@reactor-room/plusmar-model-mongo-lib';

import { Pool } from 'pg';

export const createTopupReference = async (params: ITopupReference): Promise<ITopupReference> => {
  const topUp = new TopUp(params);
  await topUp.validate();
  const result = await topUp.save();
  return result;
};

export const updateTopUpReferenceStatus = (refID: string, UUID: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    TopUp.updateOne({ UUID, refID }, { $set: { isApproved: true } }).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const getTopupReference = async (refID: string): Promise<ITopupReference> => {
  return await TopUp.findOne({ refID });
};

export const createTopUpHistory = async (
  client: Pool,
  subscriptionID: string,
  balance: number,
  description: string,
  refID: string,
  status: EnumTopUpStatus = EnumTopUpStatus.DRAFT,
): Promise<void> => {
  const statement = `
    INSERT INTO topup_histories(subscription_id,balance,description,status,ref_id)
    VALUES (:subscriptionID,:balance,:description,:status,:refID)
`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { subscriptionID, balance, description, status, refID });
  await PostgresHelper.execQuery(client, sql, bindings);
};
export const getTopUpHistory = async (client: Pool, subscriptionID: string): Promise<ITopupHistories[]> => {
  const statement = `
   SELECT balance,description,created_at as "createdAt",status
   FROM topup_histories
   WHERE subscription_id = :subscriptionID
   AND status IN ('APPROVED','VOIDED')
   ORDER BY created_at DESC
   LIMIT 30
`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { subscriptionID });
  return await PostgresHelper.execQuery<ITopupHistories[]>(client, sql, bindings);
};
