import { FindWebstat, IAutodigiWebStats, IPageLinkedAutodigi } from '@reactor-room/autodigi-models-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';

import { Pool } from 'pg';

import { AutodigiWebStatModel } from '../../connections/autodigi-db-repo-repo.connection';

export async function getLinkedAutodigiWebsite(pgClient: Pool, pageID: number, subscriptionID: string): Promise<IPageLinkedAutodigi> {
  const params = { pageID, subscriptionID };
  const query = `
      SELECT 
        pam.page_id AS "websiteID",  
        pam.autodigi_website_id AS "autodigiID",
        pam.linkstatus  AS "linkStatus",
        pam.is_primary  AS "isPrimary"
      FROM page_autodigi_mappings pam
      WHERE pam.page_id = :pageID 
      AND pam.is_primary is true
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const result = await PostgresHelper.execQuery<IPageLinkedAutodigi[]>(pgClient, sql, bindings);
  return result.length > 0 ? result[0] : null;
}

export async function getAutodigiWebstat(findParams: FindWebstat): Promise<IAutodigiWebStats[]> {
  return new Promise((resolve, reject) => {
    AutodigiWebStatModel((model) => {
      model
        .find(findParams)
        .lean()
        .exec(async (err, res) => {
          if (err) reject(err);
          else {
            resolve(res);
          }
        });
    });
  });
}
