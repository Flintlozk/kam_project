import { getUTCTimestamps, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IPageSettings, IPageListOnMessageTrackMode, PageSettingOptionType, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';
import { RedisClient } from 'redis';

export async function updatePageSettingByType(client: Pool, pageID: number, status: boolean, type: PageSettingType, options: PageSettingOptionType): Promise<IPageSettings> {
  const params = { pageID, status, type, updateAt: getUTCTimestamps(), options };
  const SQL = `
    INSERT INTO 
    page_settings( 
      page_id,
      setting_type,
      options,
      status
    )
    VALUES ( 
      :pageID, 
      :type,
      :options,
      :status) 
    ON CONFLICT ON CONSTRAINT page_settings_un 
    DO UPDATE SET status = :status , updated_at = :updateAt
    WHERE page_settings.page_id = :pageID 
    AND page_settings.setting_type = :type 
    ;`;

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, params);
    const response = await PostgresHelper.execQuery<IPageSettings[]>(client, sanitizeSQL(sql), bindings);
    return response[0] as IPageSettings;
  } catch (err) {
    console.log('updatePageSettingByType error ', err);
    throw new Error(err);
  }
}
export async function getPageSettingUnderGivenSubscription(
  client: Pool,
  { subscriptionID, settingType }: { subscriptionID: string; settingType: PageSettingType },
): Promise<IPageSettings[]> {
  const params = { subscriptionID, settingType };
  const SQL = `
    SELECT 
      ps.*
    FROM
      subscriptions s
    INNER JOIN page_subscriptions_mappings psm ON
      s.id = psm.subscription_id
    INNER JOIN page_settings ps ON
      psm.page_id = ps.page_id 
    WHERE
      s.id = :subscriptionID
    AND
      ps.status IS TRUE
    AND
      ps.setting_type = :settingType
    ;`;
  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, params);
    return await PostgresHelper.execQuery<IPageSettings[]>(client, sanitizeSQL(sql), bindings);
  } catch (err) {
    console.log('getAllPageSetting error  ', err);
    throw new Error(err);
  }
}

export async function getAllPageSetting(client: Pool, pageID: number): Promise<IPageSettings[]> {
  const SQL = `
    SELECT * FROM page_settings WHERE page_id = :pageID
    ;`;
  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { pageID });
    return await PostgresHelper.execQuery<IPageSettings[]>(client, sanitizeSQL(sql), bindings);
  } catch (err) {
    console.log('getAllPageSetting error  ', err);
    throw new Error(err);
  }
}
export async function getPageSetting(client: Pool, pageID: number, settingType: PageSettingType): Promise<IPageSettings> {
  const SQL = `
    SELECT * FROM page_settings WHERE page_id = :pageID AND setting_type = :settingType
    ;`;

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { pageID, settingType });
    const result = await PostgresHelper.execQuery<IPageSettings[]>(client, sanitizeSQL(sql), bindings);
    if (result.length) return result[0];
    return null;
  } catch (err) {
    console.log('getPageSetting error ', err);
    throw new Error(err);
  }
}
export async function savePageSettingOption(client: Pool, pageID: number, settingType: PageSettingType, options: PageSettingOptionType): Promise<IPageSettings> {
  const SQL = `
    UPDATE 
      page_settings
    SET
      options = :options,
      updated_at = :updatedAt
    WHERE
      page_id = :pageID
    AND
      setting_type = :settingType
    ;`;

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { pageID, settingType, options, updatedAt: getUTCTimestamps() });
    const result = await PostgresHelper.execQuery<IPageSettings[]>(client, sanitizeSQL(sql), bindings);
    if (result.length) return result[0];
    return null;
  } catch (err) {
    console.log('savePageSettingOption error ', err);
    throw new Error(err);
  }
}

export const getPageSettingRedis = <T>(CLIENT: RedisClient, key: string): Promise<T> => {
  return new Promise((resolve) => {
    CLIENT.get(key, (err, reply) => {
      if (err) {
        resolve(null);
      } else {
        try {
          resolve(JSON.parse(reply) as T);
        } catch (err) {
          resolve(null);
        }
      }
    });
  });
};
export const setPageSettingRedis = <T>(CLIENT: RedisClient, key: string, value: T): void => {
  CLIENT.set(key, JSON.stringify(value));
};
