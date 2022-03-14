import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IDropOffTrackingNumber, ILogisticsBundleInput } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function deleteBundle(client: Pool, id: number): Promise<IHTTPResult> {
  const query = 'DELETE FROM admin_logistic_bundles WHERE id = :id ;';

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { id });
  return await PostgresHelper.execQuery<IHTTPResult>(client, sanitizeSQL(sql), bindings);
}

export async function addLogisticBundle(
  client: Pool,
  { expires_at, from, to, total, spent, logistic_operator_id, suffix, prefix }: ILogisticsBundleInput,
): Promise<[{ id: number }]> {
  const query = `
  INSERT INTO 
  admin_logistic_bundles("expires_at", "from", "to", "total", "spent", "logistic_operator_id","suffix","prefix")
  VALUES ( :expires_at , :from , :to , :total , :spent , :logistic_operator_id, :suffix,:prefix)
  RETURNING id;`;

  const binding = { expires_at, from, to, total, spent, logistic_operator_id, suffix, prefix };
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, binding);
  return await PostgresHelper.execQuery<[{ id: number }]>(client, sanitizeSQL(sql), bindings);
}

export async function getDropOffTrackingNumber(client: Pool, logisticOperatorID: number): Promise<IDropOffTrackingNumber[]> {
  const query = `
    SELECT 
      id,
      spent::integer,
      suffix,
      prefix,
      "from"::integer,
      "to"::integer  
    FROM 
      admin_logistic_bundles 
    WHERE 
      logistic_operator_id = :logisticOperatorID
    AND 
      expires_at::date > current_timestamp
    ORDER BY 
      created_at ASC
     LIMIT 1
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { logisticOperatorID });
  return await PostgresHelper.execQuery<IDropOffTrackingNumber[]>(client, sanitizeSQL(sql), bindings);
}
export async function setNextDropOffTrackingUsed(client: Pool, logisticOperatorID: number, refID: number): Promise<void> {
  const query = `
    UPDATE
      admin_logistic_bundles
    SET
      spent = (
          SELECT 
            spent 
          FROM 
            admin_logistic_bundles 
          WHERE
            logistic_operator_id = :logisticOperatorID
          AND 
          	id = :refID
          ORDER BY 
            created_at ASC
          LIMIT 1
      ) + 1
    WHERE
      logistic_operator_id = :logisticOperatorID
    AND 
      id = :refID
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { logisticOperatorID, refID });
  await PostgresHelper.execQuery(client, sanitizeSQL(sql), bindings);
}
