import { getUTCTimestamps, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICustomerCloseReason, ICustomerCloseReasonMapping, IInputAddAudienceReason } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';

export async function addReasonToAudience(client: Pool, pageID: number, audienceID: number, params: IInputAddAudienceReason): Promise<ICustomerCloseReasonMapping> {
  const query = `
    INSERT INTO audience_closed_reason_mapping (
      page_id,
      audience_id,
      reason_id,
      description
    ) VALUES (
      :pageID,
      :audienceID,
      :reasonID,
      :description
    ) RETURNING *

  `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    pageID,
    audienceID,
    reasonID: params.reasonID,
    description: params.description,
  });

  const data = await PostgresHelper.execQuery<ICustomerCloseReasonMapping[]>(client, sql, bindings);

  if (isEmpty(data)) return null;
  else return data[0];
}
export async function getCustomerClosedReason(client: Pool, pageID: number): Promise<ICustomerCloseReason[]> {
  const query = `
    SELECT id,reason FROM customer_closed_reason WHERE page_id = :pageID AND status = TRUE
`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    pageID,
  });

  const data = await PostgresHelper.execQuery<ICustomerCloseReason[]>(client, sql, bindings);

  if (isEmpty(data)) return [];
  else return data;
}
export async function getAudienceReasonDetail(client: Pool, pageID: number, reasonID: number): Promise<ICustomerCloseReason> {
  const query = `
    SELECT id,reason FROM customer_closed_reason WHERE page_id = :pageID AND id = :reasonID
`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    pageID,
    reasonID,
  });

  const data = await PostgresHelper.execQuery<ICustomerCloseReason>(client, sql, bindings);

  if (isEmpty(data)) return null;
  else return data[0];
}

export async function insertNewCustomerClosedReason(client: Pool, pageID: number, reason: string): Promise<ICustomerCloseReason[]> {
  const query = `
        INSERT INTO customer_closed_reason (page_id,reason)
        VALUES (:pageID,:reason)
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    pageID,
    reason,
  });

  return await PostgresHelper.execQuery<ICustomerCloseReason[]>(client, sql, bindings);
}
export async function updateCustomerClosedReason(client: Pool, pageID: number, ID: number, reason: string): Promise<ICustomerCloseReason[]> {
  const query = `
        UPDATE 
            customer_closed_reason 
        SET 
            reason = :reason,
            updated_at = :updatedAt
        WHERE 
            page_id = :pageID
        AND
            id = :ID
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    pageID,
    ID,
    reason,
    updatedAt: getUTCTimestamps(),
  });

  return await PostgresHelper.execQuery<ICustomerCloseReason[]>(client, sql, bindings);
}
export async function deleteCustomerClosedReason(client: Pool, pageID: number, ID: number): Promise<ICustomerCloseReason[]> {
  const query = `
        UPDATE 
            customer_closed_reason 
        SET 
            status =FALSE,
            updated_at = :updatedAt
        WHERE 
            page_id = :pageID
        AND
            id = :ID
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    pageID,
    ID,
    updatedAt: getUTCTimestamps(),
  });

  return await PostgresHelper.execQuery<ICustomerCloseReason[]>(client, sql, bindings);
}
