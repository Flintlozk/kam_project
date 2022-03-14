import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';

export async function createSubscriptionOrderHistoryMapping(client: Pool, subscriptionID: string, orderHistoryID: number): Promise<IHTTPResult> {
  try {
    const bindings = { subscriptionID, orderHistoryID };
    const SQL = `
        INSERT INTO subscription_order_history_mapping (
        order_history_id,
        subscription_id
        )
        VALUES (:orderHistoryID, :subscriptionID)
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Created subscription order history successfully!',
    };

    return response;
  } catch (error) {
    throw new Error(error);
  }
}
