import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ILogisticOperators, ILogisticsBundleSQLResponse } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function getLogisticBundles(client: Pool): Promise<ILogisticsBundleSQLResponse[]> {
  const query = `
    SELECT 
      alb.id, 
      alb.total, 
      alb.spent, 
      alb.expires_at, 
      alo.title, 
      alo.key, 
      alo.id logistic_operator_id,
      alb.from,
      alb.to,
      alb.prefix,
      alb.suffix 
    FROM 
      admin_logistic_bundles alb
    RIGHT JOIN 
      admin_logistic_operators alo 
      ON alo.id = alb.logistic_operator_id
    ORDER BY title DESC
  `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {});
  return await PostgresHelper.execQuery<ILogisticsBundleSQLResponse[]>(client, sanitizeSQL(sql), bindings);
}

export async function getLogisticOperators(client: Pool): Promise<ILogisticOperators[]> {
  const query = `
    SELECT * FROM admin_logistic_operators 
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {});
  return await PostgresHelper.execQuery<ILogisticOperators[]>(client, sanitizeSQL(sql), bindings);
}
