import { IAutodigiUser } from '@reactor-room/autodigi-models-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IUserCredential } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { AutodigiUserModel } from '../../connections/autodigi-db-repo-repo.connection';

export async function getUserCredentialByID(client: Pool, userID: number): Promise<IUserCredential> {
  try {
    const bindings = { userID };
    const SQL = `
              SELECT u.email, u.name, u.id FROM users u 
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

export async function getAutodigiUser(userID: string, specify?: { [key: string]: number }): Promise<IAutodigiUser> {
  return new Promise((resolve, reject) => {
    AutodigiUserModel((model) => {
      model.findOne({ _id: userID }, specify).exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}
export async function getAutodigiUserBySubscrptionID(subscrptionID: string, specify?: { [key: string]: number }): Promise<IAutodigiUser[]> {
  return new Promise((resolve, reject) => {
    AutodigiUserModel((model) => {
      model.find({ more_commerce_subscription_id: subscrptionID }, specify).exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}
