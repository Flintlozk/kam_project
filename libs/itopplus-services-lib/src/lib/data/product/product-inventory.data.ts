import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function singleReduceVariantInventory(client: Pool, pageID: number, variantID: number, quantity: number): Promise<void> {
  const SELLING = 2;
  const OUT_OF_STOCK = 1;
  const SQL = `
    UPDATE 
      product_variants 
    SET 
      inventory = (
        SELECT 
          pv.inventory 
        FROM 
          product_variants pv 
        WHERE 
          page_id = $1
        AND 
          id = $2
      ) - $3,
      status = (
        SELECT 
            CASE  
        WHEN pv.inventory - $3 = 0 THEN ${SELLING}
        WHEN pv.inventory - $3 > 0 THEN ${OUT_OF_STOCK}
        END
          FROM 
            product_variants pv 
          WHERE 
            page_id = $1
          AND 
            id = $2
        )
    WHERE 
      page_id = $4
    AND 
      id = $5
    RETURNING * 
  `;
  await PostgresHelper.execQuery(client, sanitizeSQL(SQL), [pageID, variantID, Number(quantity), pageID, variantID]);
}
