import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IUserCredential } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function getUserByID(client: Pool, userID: number): Promise<IUserCredential> {
  try {
    const bindings = { userID };
    const SQL = `
              SELECT u.* FROM users u 
              WHERE id = :userID
  
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
}
