import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ILotNumberModel, IUpdatedLotNumber } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function createLotNumber(client: Pool, lotNumberInputData: IUpdatedLotNumber): Promise<IHTTPResult> {
  try {
    const { logistic_id, suffix, prefix, from, to, is_active, is_remaining, expired_date } = lotNumberInputData;
    const bindings = { logistic_id, suffix, prefix, from, to, is_active, is_remaining, expired_at: expired_date };
    const SQL = `
        INSERT INTO logistic_lot_numbers ( 
            "logistic_id",
            "suffix",
            "prefix",
            "from",
            "to",
            "is_active",
            "is_remaining",
            "expired_at"
        )
        VALUES (:logistic_id, :suffix, :prefix, :from, :to, :is_active, :is_remaining, :expired_at)
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 201,
      value: 'Create lot number successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLotNumbersByLogisticID(client: Pool, logisticID: number): Promise<ILotNumberModel[]> {
  try {
    const bindings = { logisticID };
    const SQL = `
            SELECT * 
            FROM logistic_lot_numbers
            WHERE logistic_id = :logisticID
            ORDER BY created_at DESC
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILotNumberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data;
    return [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUnexpiredLotNumbersByLogisticID(client: Pool, logisticID: number): Promise<ILotNumberModel[]> {
  try {
    const status = false;
    const bindings = { logisticID, status };
    const SQL = `
            SELECT * 
            FROM logistic_lot_numbers
            WHERE logistic_id = :logisticID
            AND is_expired = :status
            ORDER BY created_at DESC
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILotNumberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data;
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getActiveLotNumber(client: Pool, logisticID: number, status: boolean): Promise<ILotNumberModel> {
  try {
    const bindings = { logisticID, status };
    const SQL = `
            SELECT * 
            FROM logistic_lot_numbers
            WHERE logistic_id = :logisticID
            AND is_active = :status
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILotNumberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data[0];
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAvalibleLotNumber(client: Pool, logisticID: number): Promise<ILotNumberModel> {
  try {
    const currentDay = getUTCDayjs().format('YYYY-MM-DD');
    const bindings = { logisticID, isRemaining: true, currentDay };
    const SQL = `
            SELECT * 
            FROM logistic_lot_numbers
            WHERE logistic_id = :logisticID
            AND is_remaining = :isRemaining
            AND expired_at >= :currentDay 
            ORDER BY created_at ASC
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILotNumberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data[0];
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteLotNumber(client: Pool, id: number): Promise<IHTTPResult> {
  try {
    const bindings = { id };
    const SQL = `
            DELETE FROM logistic_lot_numbers WHERE id = :id
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete logistic lot number successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLotNumberStatus(client: Pool, lotNumberId: number, status: boolean): Promise<IHTTPResult> {
  try {
    const bindings = { lotNumberId, status };
    const SQL = 'UPDATE logistic_lot_numbers SET is_active = :status WHERE id = :lotNumberId';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update lot number status successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLotNumberIsRemaining(client: Pool, lotNumberId: number, status: boolean): Promise<IHTTPResult> {
  try {
    const bindings = { lotNumberId, status };
    const SQL = 'UPDATE logistic_lot_numbers SET is_remaining = :status WHERE id = :lotNumberId';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update lot number expired status successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLotNumberLatestUsedNumber(client: Pool, lotNumberId: number, usedLotNumber: string): Promise<IHTTPResult> {
  try {
    const bindings = { lotNumberId, usedLotNumber };
    const SQL = 'UPDATE logistic_lot_numbers SET latest_used_number = :usedLotNumber WHERE id = :lotNumberId';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update lot number latest used number successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
