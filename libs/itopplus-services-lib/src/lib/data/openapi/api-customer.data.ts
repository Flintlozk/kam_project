import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { ICustomerTemp } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function getOpenAPICustomerByPlatform(client: Pool, uuid: string, platform: AudiencePlatformType, page: number, pageSize: number): Promise<ICustomerTemp[]> {
  try {
    const SQL = `
          SELECT cs.* 
          FROM temp_customers cs
          INNER JOIN pages pa ON cs.page_id = pa.id 
          WHERE
          pa.uuid = $1 AND
          cs.platform = $2
          OFFSET $3 ROWS
          FETCH NEXT $4 ROWS ONLY
      `;
    const data = await PostgresHelper.execQuery<ICustomerTemp[]>(client, SQL, [uuid, platform, page, pageSize]);
    return !isEmpty(data) ? data : ([] as ICustomerTemp[]);
  } catch (error) {
    throw new Error(error);
  }
}

export async function countOpenAPICustomerByPlatform(client: Pool, uuid: string, platform: AudiencePlatformType): Promise<number> {
  try {
    const SQL = `
          SELECT COUNT(*) total 
          FROM temp_customers cs
          INNER JOIN pages pa ON cs.page_id = pa.id 
          WHERE
          pa.uuid = $1 AND
          cs.platform = $2
      `;
    const data = await PostgresHelper.execQuery(client, SQL, [uuid, platform]);
    return !isEmpty(data) ? data[0].total : 0;
  } catch (error) {
    throw new Error(error);
  }
}
