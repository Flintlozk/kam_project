import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
const TABLE = 'pages';

export async function getDateOfPageCreated(client: Pool, ID: number): Promise<string> {
  const SQL = `SELECT created_at FROM ${TABLE} WHERE id = $1`;
  const result = await PostgresHelper.execQuery(client, SQL, [ID]);
  return result ? result[0] : [];
}

export async function getCurrentTimezone(client: Pool): Promise<void> {
  try {
    const SQL = 'show time zone';
    await PostgresHelper.execQuery(client, SQL, [], true);
  } catch (err) {
    console.log('-< getCurrentTimezone error >- ', err);
  }
}
