import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IAddPagesThirdPartyParams, IPagesThirdParty, IPagesThirdPartyActive, IPagesThirdPartyByPageTypeParams, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function getConnectedThirdPartiesByPageID(client: Pool, pageID: number): Promise<{ seller_id: string; page_type: SocialTypes }[]> {
  const bindings = { pageID };
  const SQL = `
    SELECT seller_id, page_type FROM pages_third_party WHERE page_id = :pageID
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  return await PostgresHelper.execBatchTransaction<{ seller_id: string; page_type: SocialTypes }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function getPageThirdPartyByPageType(client: Pool, params: IPagesThirdPartyByPageTypeParams, shopeeRefreshExpireInDays: number): Promise<IPagesThirdParty> {
  try {
    const bindings = [params.pageType, params.pageID];
    const SQL = `
    SELECT
            id,
            page_id "pageID",
            seller_id "sellerID",
            name "name",
            picture,
            url,
            access_token "accessToken",
            CASE 
              WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              WHEN page_type = 'shopee' THEN to_char(updated_at + (payload::json->>'expire_in') :: NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              END AS "accessTokenExpire",
            page_type "pageType",
              payload::json->>'refresh_token' "refreshToken",
            CASE 
              WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'refresh_expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              WHEN page_type = 'shopee' THEN to_char(updated_at + INTERVAL '1' DAY * ${shopeeRefreshExpireInDays} , 'YYYY-MM-DD HH24:MM:SS') 
              END AS "refreshTokenExpire",
            created_at AS "createdAt",
            updated_at AS "updatedAt",
            payload
    FROM
            pages_third_party
    WHERE
            active = TRUE
            AND page_type = ANY($1)
            AND page_id = $2
    `;

    const result = await PostgresHelper.execQuery<IPagesThirdParty[]>(client, sanitizeSQL(SQL), bindings);
    return Array.isArray(result) ? result[0] : ({} as IPagesThirdParty);
  } catch (error) {
    throw new Error('Error getting pages third party');
  }
}

export async function getAllPageThirdPartyByPageType(client: Pool, pageType: SocialTypes[], shopeeRefreshExpireInDays: number): Promise<IPagesThirdParty[]> {
  try {
    const bindings = [pageType];
    const SQL = `
    SELECT
            id,
            page_id "pageID",
            seller_id "sellerID",
            name "name",
            picture,
            url,
            access_token "accessToken",
            CASE 
              WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              WHEN page_type = 'shopee' THEN to_char(updated_at + (payload::json->>'expire_in') :: NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              END AS "accessTokenExpire",
            page_type "pageType",
              payload::json->>'refresh_token' "refreshToken",
            CASE 
              WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'refresh_expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              WHEN page_type = 'shopee' THEN to_char(updated_at + INTERVAL '1' DAY * ${shopeeRefreshExpireInDays} , 'YYYY-MM-DD HH24:MM:SS') 
              END AS "refreshTokenExpire",
            updated_at AS "updatedAt",
            created_at AS "createdAt",
            payload
    FROM
            pages_third_party
    WHERE
            active = TRUE
            AND page_type = ANY($1)
    `;

    const result = await PostgresHelper.execQuery<IPagesThirdParty[]>(client, sanitizeSQL(SQL), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    throw new Error('Error getting pages third party');
  }
}

export async function addUpdatePageThirdParty(client: Pool, params: IAddPagesThirdPartyParams): Promise<IPagesThirdParty> {
  try {
    const SQL = `
                INSERT INTO pages_third_party 
                ( 
                            page_id, 
                            seller_id, 
                            access_token, 
                            page_type, 
                            payload 
                ) 
                VALUES 
                ( 
                            :pageID , 
                            :sellerID , 
                            :accessToken , 
                            :pageType , 
                            :payload 
                ) 
                ON CONFLICT 
                ( 
                            page_id , 
                            seller_id, 
                            page_type 
                ) 
                DO UPDATE 
                SET    
                            active = true, 
                            seller_id = :sellerID, 
                            access_token =:accessToken, 
                            updated_at = :updatedAt,
                            payload = :payload
                RETURNING 
                            id,
                            page_id "pageID",
                            seller_id "sellerID",
                            name "name",
                            picture,
                            url,
                            access_token "accessToken"
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { updatedAt: getUTCDayjs(), ...params });
    const pageThirdParty = await PostgresHelper.execQuery<IPagesThirdParty[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(pageThirdParty) ? pageThirdParty[0] : ({} as IPagesThirdParty);
  } catch (error) {
    console.log('error add third party page :>> ', error);
    throw new Error('Error adding new third party page');
  }
}

export const updateSellerDetails = async (
  { id, pageID, url, name, picture, sellerPayload }: { id: number; pageID: number; url: string; name: string; picture: string; sellerPayload: string },
  client: Pool,
): Promise<void> => {
  const bindings = {
    name,
    picture: picture ? picture : '',
    sellerPayload,
    url,
    id,
    pageID,
  };
  const SQL = `
              UPDATE
                pages_third_party
              SET
                name = :name,
                picture = :picture,
                seller_payload = :sellerPayload,
                url = :url
              WHERE
                id = :id AND page_id = :pageID
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<IPagesThirdParty[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const pageThirdPartyChangeActive = async (id: number, pageID: number, active: boolean, client: Pool): Promise<void> => {
  const bindings = {
    id,
    active,
    pageID,
  };
  const SQL = `
        UPDATE
          pages_third_party
        SET
          active = :active
        WHERE
          id = :id AND page_id = :pageID
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const getPageThirdPartyInactive = async (pageID: number, client: Pool): Promise<IPagesThirdPartyActive[]> => {
  const bindings = {
    pageID,
  };
  const SQL = `
                SELECT 
                  id,
                  page_id "pageID",
                  seller_id "sellerID",
                  name "name",
                  page_type "pageType",
                  active
                FROM pages_third_party
                WHERE page_id = :pageID AND active = FALSE;
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IPagesThirdPartyActive[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return isEmpty(result) ? [] : result;
};
