import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function getAllPageIDWithoutAppScope(client: Pool): Promise<{ pageID: number }[]> {
  const query = `
  SELECT 
    p.id AS "pageID"
    FROM pages p
    LEFT JOIN page_application_scopes pas ON p.id = pas.page_id 
    WHERE pas.app_scope IS NULL
    ORDER BY created_at ASC`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {});
  return await PostgresHelper.execQuery<{ pageID: number }[]>(client, sanitizeSQL(sql), bindings);
}

export async function getAllPageIDWithAppScope(client: Pool, id: number): Promise<{ pageID: number }[]> {
  const query = `
    SELECT 
      p.id AS "pageID",
      (
          SELECT jsonb_agg(pas.app_scope)
          FROM pages p 
          INNER JOIN page_application_scopes pas ON p.id = pas.page_id 
          WHERE p.id = $1
          GROUP BY pas.page_id
      ) AS page_app_scope
      FROM pages p
      ORDER BY created_at 
      DESC LIMIT 1`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { id });
  return await PostgresHelper.execQuery<{ pageID: number }[]>(client, sanitizeSQL(sql), bindings);
}
