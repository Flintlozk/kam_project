import { IAutodigiWebsite, IPageLinkedAutodigi } from '@reactor-room/autodigi-models-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { AutodigiWebsiteModel } from '../../connections/autodigi-db-repo-repo.connection';

export async function getAutodigiWebsites(userID: string[], specify?: { [key: string]: number }): Promise<IAutodigiWebsite[]> {
  return new Promise((resolve, reject) => {
    AutodigiWebsiteModel((model) => {
      model
        .find({ owner_id: { $in: userID } }, specify)
        .lean()
        .exec((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
    });
  });
}
export async function getLinkedAutodigiWebsites(pgClient: Pool, pageID: number, subscriptionID: string): Promise<IPageLinkedAutodigi[]> {
  const params = { pageID, subscriptionID };
  const query = `
    SELECT 
      psm.page_id AS "websiteID",  
      pam.autodigi_website_id AS "autodigiID",
      pam.linkstatus  AS "linkStatus",
      pam.is_primary  AS "isPrimary"
    FROM subscriptions s 
    INNER JOIN page_subscriptions_mappings psm ON s.id = psm.subscription_id
    INNER JOIN page_autodigi_mappings pam ON psm.page_id = pam.page_id 
    WHERE s.id  = :subscriptionID
    AND psm.page_id = :pageID
    ORDER BY is_primary
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  return await PostgresHelper.execQuery(pgClient, sql, bindings);
}
