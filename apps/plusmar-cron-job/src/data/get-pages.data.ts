import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';

export async function getPageIDWhereVariantsMoreThanOne(client: Pool): Promise<{ pageIDs: number[] }> {
  try {
    const SQL = `
    SELECT
        JSONB_AGG(product.page_id::integer) as "pageIDs"
    FROM
        (
        SELECT
            p.page_id,
            SUM((
            SELECT COUNT(id) FROM product_variants pv 
            WHERE pv.product_id = p.id
        )) AS "variants"
        FROM
            products p
        GROUP BY
            p.page_id
    ) AS product
    WHERE
        product.variants > 0
                `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, {});
    const response = await PostgresHelper.execBatchTransaction<{ pageIDs: number[] }>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
