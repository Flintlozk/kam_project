import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';

export async function deletePurchaseOrderItems(client: Pool, orderID: number, itemId: number, pageID: number): Promise<void> {
  const bindings = [orderID, itemId, pageID];
  const SQL = `
    DELETE FROM purchasing_order_items
    WHERE
      purchase_order_id = $1
    AND 
      id = $2
    AND 
      page_id = $3
  `;
  await PostgresHelper.execQuery(client, SQL, bindings);
}
