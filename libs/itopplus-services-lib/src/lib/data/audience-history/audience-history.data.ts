import { getUTCTimestamps, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IAudience, IAudienceStep, IAudienceStepExtraData, UserMadeLastChangesToStatus } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function createAudienceHistoryTransaction(
  audienceId: number,
  pageId: number,
  { user_id, user_type, current_domain, current_status, previous_domain, previous_status, parent_id = null }: IAudienceStepExtraData,
  client: Pool,
): Promise<IAudienceStep> {
  const bindings = {
    audienceId,
    pageId,
    current_domain,
    current_status,
    user_id,
    user_type,
    previous_domain,
    previous_status,
    parent_id,
    date: getUTCTimestamps(),
  };

  const SQL = `
                  INSERT INTO audience_history 
                  ( 
                              audience_id, 
                              page_id, 
                              domain, 
                              status, 
                              user_id, 
                              user_type, 
                              previous_domain, 
                              previous_status , 
                              parent_id, 
                              created_at 
                  ) 
                  VALUES 
                  ( 
                              :audienceId, 
                              :pageId, 
                              :current_domain, 
                              :current_status, 
                              :user_id, 
                              :user_type, 
                              :previous_domain, 
                              :previous_status, 
                              :parent_id, 
                              :date 
                  ) 
                  RETURNING * `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudienceStep[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IAudienceStep);
}

export async function getStep(client: Pool, audienceID: number, pageID: number): Promise<IAudience> {
  const bindings = { audienceID, pageID };
  const SQL = 'SELECT * FROM audience WHERE id = :audienceID and page_id = :pageID ORDER BY id DESC LIMIT 1;';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}

export async function updateAudience(client: Pool, step: IAudienceStep, pageID: number): Promise<IAudience> {
  const { domain, status, audience_id } = step || {};
  const bindings = { domain, status, audience_id, pageID };
  const SQL = `
                  UPDATE audience 
                  SET    domain = :domain, 
                        status = :status 
                  FROM   ( 
                                  SELECT   audience_id, 
                                          created_at, 
                                          domain, 
                                          status, 
                                          page_id 
                                  FROM     audience_history 
                                  WHERE    audience_history.audience_id = :audience_id 
                                  AND      audience_history.page_id = :pageID 
                                  ORDER BY created_at DESC limit 1 ) AS audiencehistory 
                  WHERE  audiencehistory.audience_id = audience.id 
                  AND    audiencehistory.page_id = :pageID returning audience.*
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}

export async function getAudienceHistoryByAudienceID(client: Pool, pageID: number, audienceID: number): Promise<IAudienceStep[]> {
  try {
    const bindings = {
      pageID,
      audienceID,
    };
    const SQL = `
                    SELECT
                              ah.id,
                              (
                                SELECT 
                                  reason 
                                FROM 
                                  customer_closed_reason _ccr 
                                INNER JOIN 
                                  audience_closed_reason_mapping _acrm ON _acrm.reason_id = _ccr.id 
                                WHERE 
                                  _acrm.audience_id = ah.audience_id 
                                AND 
                                  _acrm.page_id = ah.page_id 
                              ) AS "reason",
                              (
                                SELECT 
                                  description 
                                FROM 
                                  audience_closed_reason_mapping _acrm 
                                WHERE 
                                  _acrm.audience_id = ah.audience_id 
                                AND 
                                  _acrm.page_id = ah.page_id 
                              ) AS "closeDescription",
                              ah.audience_id ,
                              ah.page_id ,
                              ah.domain ,
                              ah.status ,
                              ah.previous_domain ,
                              ah.previous_status ,
                              ah.user_id ,
                              ah.user_type,
                              ah.parent_id,
                              ah.created_at,
                              COALESCE(
                                (SELECT alias FROM users u2 INNER JOIN user_page_mapping upm ON u2.id = upm.user_id WHERE u2.id = ah.user_id AND upm.page_id = :pageID  ),
                                (SELECT name FROM users u2 WHERE id = ah.user_id ),
                                'Customer')  
                              AS "action_by"
                    FROM
                              audience_history ah
                    WHERE
                              ah.page_id = :pageID
                    AND       (ah.audience_id = :audienceID
                    OR        ah.parent_id = :audienceID)
                    ORDER BY
                              id DESC;  
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IAudienceStep[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log('error', error);
    throw new Error(error);
  }
}

export async function getUserMadeLastChangesToStatus(
  client: Pool,
  aliases: {
    pageID: number;
    audienceID: number;
  },
): Promise<[UserMadeLastChangesToStatus]> {
  const query = `
                    SELECT ah.created_at, 
                          users.id, 
                          COALESCE ((
                            SELECT alias FROM users u2 INNER JOIN user_page_mapping upm ON u2.id = upm.user_id WHERE u2.id = ah.user_id AND upm.page_id = :pageID
                          ),users.name) AS "name"   
                    FROM   audience_history ah
                    INNER JOIN "users" ON ah.user_id = users.id 
                    WHERE  page_id = :pageID 
                          AND audience_id = :audienceID 
                    ORDER  BY ah.created_at DESC 
                    LIMIT  1; 
                `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  return await PostgresHelper.execQuery<[UserMadeLastChangesToStatus]>(client, sql, bindings);
}
