import { flashReportReponse } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
export async function getReportFlashDetail(client: Pool, uuid: string[]): Promise<flashReportReponse[]> {
  const SQL = `
                select 
	                    lo.name, po_tracking.payload, customer_id, temp_cus.first_name,
                      temp_cus.last_name, temp_cus.phone_number, 	temp_cus.location,
                      po.tracking_no
                from 
	                    purchasing_orders po 
                inner join
	                    purchasing_order_tracking_info po_tracking on po.id = 	po_tracking.purchase_order_id
                inner join
	                    logistics lo on po.logistic_id = lo.id
                inner join
	                    audience au on po.audience_id = au.id
                inner join
	                    temp_customers temp_cus on au.customer_id = temp_cus.id
                where 
                        po.uuid IN ('${uuid.join("','")}')`;
  return await PostgresHelper.execQuery<flashReportReponse[]>(client, SQL, []);
}
