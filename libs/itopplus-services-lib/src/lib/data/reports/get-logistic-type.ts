import { logisticTrackingDetail } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
export async function getLogisticTypesByUuid(client: Pool, uuid: string[]): Promise<logisticTrackingDetail> {
  const SQL = `
   select 
            delivery_type,
            tracking_type,
            cod_status,
            uuid
   from
            purchasing_orders
   inner join
            logistics on logistics.id  = purchasing_orders.logistic_id
   where
            purchasing_orders.uuid IN ('${uuid.join("','")}')
      
    `;
  return await PostgresHelper.execQuery<logisticTrackingDetail>(client, SQL, []);
}
