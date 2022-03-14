import { IPageLinkedAutodigi } from '@reactor-room/autodigi-models-lib';
import { getDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumAppScopeType, IPageAppScope } from '@reactor-room/itopplus-model-lib';
import { ClientSession } from 'mongoose';
import { Pool } from 'pg';
import { AutodigiWebsiteModel } from '../../connections/autodigi-db-repo-repo.connection';

export async function updateLinkWebsiteAutodigi(pgClient: Pool, pageID: number, autodigiID: string): Promise<IPageLinkedAutodigi[]> {
  const params = { pageID, autodigiID, linkStatus: true, updatedAt: getDayjs().toDate() };
  const query = `
   INSERT INTO 
    page_autodigi_mappings (
      page_id,
      autodigi_website_id,
      linkStatus
    ) 
    VALUES (
      :pageID,
      :autodigiID,
      :linkStatus
    )
    ON CONFLICT ON CONSTRAINT page_autodigi_mappings_un
    DO UPDATE SET 
      linkStatus = :linkStatus, 
      updated_at = :updatedAt
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  return await PostgresHelper.execQuery(pgClient, sql, bindings);
}
export async function deletePageAutodigiAppScopeAppScope(client: Pool, pageId: number, appScope: EnumAppScopeType): Promise<void> {
  const bindings = { pageId, appScope };
  const SQL = `
                  DELETE 
                  FROM page_application_scopes
                  WHERE 
                      page_id = :pageId AND
                      app_scope = :appScope
              `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function setPageAutodigiAppScopeByPageID(client: Pool, pageID: number, appScope: EnumAppScopeType): Promise<IPageAppScope[]> {
  try {
    const bindings = { pageID, appScope };
    const SQL = `
          INSERT INTO page_application_scopes(page_id,app_scope)
          VALUES (:pageID,:appScope)
          RETURNING *
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageAppScope[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data;
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLinkStatusWebsiteAutodigi(pgClient: Pool, pageID: number, autodigiID: string, linkStatus: boolean): Promise<IPageLinkedAutodigi[]> {
  const params = { pageID, autodigiID, linkStatus, updatedAt: getDayjs().toDate() };

  const query = `
   UPDATE 
    page_autodigi_mappings 
   SET 
    linkStatus = :linkStatus,
    updated_at = :updatedAt
   WHERE
    page_id = :pageID AND
    autodigi_website_id  = :autodigiID
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  return await PostgresHelper.execQuery(pgClient, sql, bindings);
}

export async function deleteLinkWebsiteAutodigiOfPage(pgClient: Pool, pageID: number): Promise<void> {
  const params = { pageID };

  const query = `
   DELETE FROM page_autodigi_mappings 
   WHERE page_id = :pageID 
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  await PostgresHelper.execQuery(pgClient, sql, bindings);
}

export async function deleteLinkPageInAutodigiWebsite(pageID: number, session: ClientSession) {
  return new Promise((resolve, reject) => {
    AutodigiWebsiteModel((model) => {
      model
        .updateMany(
          { more_commerce_page_id: pageID },
          {
            $set: {
              more_commerce_page_id: null,
            },
          },
          {
            multi: true,
          },
        )
        .session(session)
        .lean()
        .exec((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
    });
  });
}
export async function updateMoreCommerceIDToAutodigiWebsite(autodigiIDs: string[], pageID: number | null) {
  return new Promise((resolve, reject) => {
    AutodigiWebsiteModel((model) => {
      model
        .updateMany(
          { _id: { $in: autodigiIDs } },
          {
            $set: {
              more_commerce_page_id: pageID,
            },
          },
          {
            multi: true,
          },
        )
        .lean()
        .exec((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
    });
  });
}

export async function resetAutodigiWebsitePrimaryLink(pgClient: Pool, pageID: number): Promise<void> {
  const params = { pageID, updatedAt: getDayjs().toDate() };

  const query = `
    UPDATE 
      page_autodigi_mappings 
    SET 
      is_primary = FALSE,
      updated_at = :updatedAt
    WHERE
      page_id = :pageID AND
      is_primary IS TRUE
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  return await PostgresHelper.execQuery(pgClient, sql, bindings);
}
export async function setAutodigiWebsitePrimaryLink(pgClient: Pool, pageID: number, autodigiID: string): Promise<void> {
  const params = { pageID, autodigiID, updatedAt: getDayjs().toDate() };

  const query = `
    UPDATE 
      page_autodigi_mappings 
    SET 
      is_primary = TRUE,
      updated_at = :updatedAt
    WHERE
      page_id = :pageID AND
      autodigi_website_id = :autodigiID
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  return await PostgresHelper.execQuery(pgClient, sql, bindings);
}
