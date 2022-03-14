import { getUTCTimestamps, parseTimestampToDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ISubscriptionActiveHistoryModel } from '@reactor-room/itopplus-model-lib';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';

export async function createSubscriptionActiveHistory(client: Pool, subscriptionID: string, actived_date: Date, expiredDate: Date): Promise<IHTTPResult> {
  try {
    const bindings = { subscriptionID, actived_date: parseTimestampToDayjs(actived_date).format(), expiredDate: parseTimestampToDayjs(expiredDate).format() };
    const SQL = `
        INSERT INTO subscription_active_history (
        subscription_id,
        actived_date,
        expired_date
        )
        VALUES (:subscriptionID, :actived_date, :expiredDate)

        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 200,
      value: 'Create subscription active history successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function removeSubscriptionActiveHistory(client: Pool, subscriptionID: string): Promise<IHTTPResult> {
  try {
    const bindings = { subscriptionID };
    const SQL = `
        DELETE FROM subscription_active_history 
        WHERE subscription_id = :subscriptionID ;
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 200,
      value: 'Remove subscription active history successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionActiveHistory(client: Pool, subscriptionID: string): Promise<ISubscriptionActiveHistoryModel> {
  try {
    const currentDay = getUTCTimestamps();
    const bindings = { subscriptionID, currentDay };
    const SQL = `
        SELECT * FROM subscription_active_history 
        WHERE subscription_id = :subscriptionID
        AND actived_date::date <= :currentDay
        AND expired_date::date >= :currentDay 
        order by actived_date  ASC;
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionActiveHistoryModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.log('error: ', error);
    throw new Error(error);
  }
}

export function createRequestToken(from: string, request: string, tokenKey: string): Promise<IHTTPResult> {
  try {
    return new Promise<IHTTPResult>((resolve) => {
      const payload = {
        from: from,
        request: request,
      };
      const token = jwt.sign(payload, tokenKey, {});
      resolve({ value: token, status: 200 } as IHTTPResult);
    });
  } catch (error) {
    throw new Error(error);
  }
}
