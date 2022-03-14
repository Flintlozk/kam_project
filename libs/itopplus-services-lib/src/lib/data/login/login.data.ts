import { getUTCTimestamps, PostgresHelper, removeBearerText } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult, IGoogleCredential } from '@reactor-room/model-lib';
import { sanitizeSQL } from 'pg-sanitize';
import { Pool } from 'pg';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { EnumAuthError } from '@reactor-room/itopplus-model-lib';

function getKey(environment): string {
  let key = environment.tokenKey;
  if (environment.production) {
    key = environment.tokenKey;
  }
  return key;
}

type EnvironmentToken = { tokenKey: string | Buffer | { key: string | Buffer; passphrase: string } };

export function signToken(signObject: string | IGoogleCredential, environment): string {
  const token = jwt.sign(signObject, getKey(environment));
  return token;
}

export function verifyToken(token: string, environment): Promise<IHTTPResult> {
  return new Promise((resolve, reject) => {
    const result: IHTTPResult = { value: EnumAuthError.INVALID_TOKEN, status: 500 };
    try {
      token = removeBearerText(token);
      jwt.verify(token, getKey(environment), (err, decoded) => {
        if (decoded) {
          const value = decoded;
          resolve({ value, status: 200 });
        } else {
          resolve(result);
        }
      });
    } catch (err) {
      reject(new Error(EnumAuthError.INVALID_TOKEN));
    }
  });
}

export async function updateLoginTime(client: Pool, userID): Promise<void> {
  const created_at = getUTCTimestamps();
  const SQL = `
  UPDATE 
    users 
  SET 
    latest_login = $1
  WHERE
    id = $2
`;

  await PostgresHelper.execQuery(client, SQL, [created_at, userID]);
}

export function verifyAdminToken(token: string, environment: EnvironmentToken): Promise<IHTTPResult> {
  return new Promise((resolve) => {
    jwt.verify(token, environment.tokenKey, (err, value) => {
      if (err) {
        resolve({ value: 'UNAUTHORIZED', status: 403 });
      } else {
        resolve({ value: JSON.stringify(value), status: 200 });
      }
    });
  });
}

export async function verifyAllowedEmail(client: Pool, credential: IGoogleCredential): Promise<{ user_id: string; email: string; gmail: string }> {
  const statements = `
        SELECT 
        gmail,email
        FROM users
        WHERE 
        (gmail = :email OR email = :email)
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { email: credential.email });
  const result = await PostgresHelper.execQuery<[{ user_id: string; email: string; gmail: string }]>(client, sanitizeSQL(sql), bindings);
  return result?.length > 0 ? result[0] : ({} as { user_id: string; email: string; gmail: string });
}

export async function getGoogleUserByAccessToken(token: string): Promise<{ data: { email: string } }> {
  return await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
}
