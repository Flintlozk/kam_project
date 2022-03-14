import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumCreditPaymentStatus, ICreditPaymentHistory } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export const createCreditPaymentHistory = async (
  client: Pool,
  pageID: number,
  orderID: number,
  subscriptionID: string,
  remainCredit: number,
  dropOffCost: number,
  status: EnumCreditPaymentStatus = EnumCreditPaymentStatus.PENDING,
): Promise<ICreditPaymentHistory> => {
  const statement = `
    INSERT INTO credit_payment_histories(page_id,order_id,subscription_id,status,credit_remain,credit)
    VALUES (
      :pageID,
      :orderID,
      :subscriptionID,
      :status,
      :remainCredit,
      :dropOffCost
      )
    RETURNING *
`;
  const params = { pageID, orderID, subscriptionID, remainCredit, dropOffCost, status };
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, params);
  const data = await PostgresHelper.execQuery<ICreditPaymentHistory[]>(client, sql, bindings);
  return isEmpty(data) ? null : data[0];
};

export const getCreditPaymentHistory = async (client: Pool, pageID: number, orderID: number, subscriptionID: string): Promise<ICreditPaymentHistory> => {
  const statement = `
    SELECT * FROM credit_payment_histories 
    WHERE 
      page_id = :pageID
    AND
      order_id = :orderID
    AND
      subscription_id = :subscriptionID 
   
`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { pageID, orderID, subscriptionID });
  const data = await PostgresHelper.execQuery<ICreditPaymentHistory[]>(client, sql, bindings);
  return isEmpty(data) ? null : data[0];
};

export const deductCreditDropOff = async (client: Pool, subscriptionID: string, cost: number): Promise<void> => {
  const statement = `
  UPDATE 
    subscriptions s1 
  SET 
    current_balance = (
      SELECT current_balance::NUMERIC 
      FROM subscriptions s2 
      WHERE s2.id = :subscriptionID
    ) - :cost 
  WHERE 
    s1.id = :subscriptionID
 `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { subscriptionID, cost });
  await PostgresHelper.execQuery(client, sql, bindings);
};
export const updateCreditPaymentStatus = async (
  client: Pool,
  pageID: number,
  orderID: number,
  subscriptionID: string,
  status: EnumCreditPaymentStatus,
): Promise<ICreditPaymentHistory> => {
  const statement = `
  UPDATE 
    credit_payment_histories 
  SET 
    status = :status
  WHERE 
    subscription_id = :subscriptionID
  AND
    order_id = :orderID
  AND
    page_id = :pageID
  RETURNING *
 `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { subscriptionID, status, pageID, orderID });
  const data = await PostgresHelper.execQuery<ICreditPaymentHistory[]>(client, sql, bindings);
  return isEmpty(data) ? null : data[0];
};
