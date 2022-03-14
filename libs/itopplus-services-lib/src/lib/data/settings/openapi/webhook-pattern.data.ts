import { getUTCDayjs, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IPageWebhookPatternSetting, IPageWebhookQuickpay } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function getWebhookPatternList(client: Pool, page_id: number): Promise<IPageWebhookPatternSetting[]> {
  try {
    const SQL = `
        SELECT id, name, url, regex_pattern, status
        FROM webhook_pattern_message
        WHERE
        page_id = $1
        ORDER BY
        id
        DESC
      `;
    const data = await PostgresHelper.execQuery<[IPageWebhookPatternSetting]>(client, SQL, [page_id]);
    return isEmpty(data) ? ([] as IPageWebhookPatternSetting[]) : data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getWebhookPatternStatusActive(client: Pool, page_id: number): Promise<IPageWebhookPatternSetting[]> {
  try {
    const SQL = `
        SELECT wm.id, wm.name, wm.url, wm.regex_pattern, wm.status
        FROM webhook_pattern_message wm
        INNER JOIN pages pa ON wm.page_id = pa.id
        WHERE
        wm.page_id = $1 AND
        wm.status = true AND
        pa.benabled_api = true
        ORDER BY
        wm.id
        DESC
      `;
    const data = await PostgresHelper.execQuery<[IPageWebhookPatternSetting]>(client, SQL, [page_id]);
    return isEmpty(data) ? ([] as IPageWebhookPatternSetting[]) : data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getWebhookQuickpay(client: Pool, page_id: number): Promise<IPageWebhookQuickpay> {
  try {
    const SQL = `
        SELECT ps.options ->> 'url' url
        FROM page_settings ps
        INNER JOIN pages pa ON ps.page_id = pa.id
        WHERE
        ps.page_id = $1 AND
        pa.benabled_api = true AND
        ps.setting_type = 'QUICKPAY_WEBHOOK'
      `;
    const data = await PostgresHelper.execQuery<[IPageWebhookQuickpay]>(client, SQL, [page_id]);
    return isEmpty(data) ? null : data[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getWebhookPatternById(client: Pool, webhookId: number, page_id: number): Promise<IPageWebhookPatternSetting> {
  try {
    const SQL = `
        SELECT id, name, url, regex_pattern, status
        FROM webhook_pattern_message
        WHERE
        page_id = $1 AND
        id = $2
      `;
    const data = await PostgresHelper.execQuery<IPageWebhookPatternSetting[]>(client, SQL, [page_id, webhookId]);
    return isEmpty(data) ? null : data[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function addWebhookPattern(client: Pool, { name, url, regex_pattern, status }: IPageWebhookPatternSetting, page_id: number): Promise<IPageWebhookPatternSetting> {
  try {
    const queryPage = `
            INSERT INTO webhook_pattern_message
            (   
                name,
                url,
                regex_pattern,
                status,
                page_id
            ) 
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            ) RETURNING *
        `;
    const paramPage = [name, url, regex_pattern, status, page_id];
    const data = await PostgresHelper.execQuery<IPageWebhookPatternSetting[]>(client, queryPage, paramPage);
    return data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateWebhookPattern(
  client: Pool,
  { id, name, url, regex_pattern, status }: IPageWebhookPatternSetting,
  page_id: number,
): Promise<IPageWebhookPatternSetting> {
  try {
    const queryPage = `
            UPDATE webhook_pattern_message
            SET
            name = $1,
            url = $2,
            regex_pattern = $3,
            status = $4,
            lastupdated_at = $7
            WHERE
            id = $5 AND
            page_id = $6
            RETURNING *
        `;
    const paramPage = [name, url, regex_pattern, status, id, page_id, getUTCDayjs()];
    const data = await PostgresHelper.execQuery<IPageWebhookPatternSetting[]>(client, queryPage, paramPage);
    return data[0];
  } catch (err) {
    console.log('err : ', err);
    throw err;
  }
}

export async function removeWebhookPattern(client: Pool, webhookId: number, page_id: number): Promise<IHTTPResult> {
  try {
    const queryPage = `
            DELETE FROM webhook_pattern_message
            WHERE
            id = $1 AND
            page_id = $2
        `;
    const paramPage = [webhookId, page_id];
    await PostgresHelper.execQuery<IPageWebhookPatternSetting>(client, queryPage, paramPage);
    const res: IHTTPResult = {
      status: 200,
      value: 'Delete webhook successfully!',
    };
    return res;
  } catch (err) {
    console.log('err : ', err);
    throw err;
  }
}

export async function toggleWebhookPatternStatus(client: Pool, webhookId: number, page_id: number, status: boolean): Promise<IPageWebhookPatternSetting> {
  try {
    const queryPage = `
            UPDATE webhook_pattern_message
            SET 
            status = $1,
            lastupdated_at = $4
            WHERE
            id = $2 AND
            page_id = $3
            RETURNING *
        `;
    const paramPage = [status, webhookId, page_id, getUTCDayjs()];
    const data = await PostgresHelper.execQuery<IPageWebhookPatternSetting[]>(client, queryPage, paramPage);
    return data[0];
  } catch (err) {
    console.log('err : ', err);
    throw err;
  }
}
