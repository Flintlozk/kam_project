import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { ILineChannelInforAPIResponse, ILineResponse, ILineSetting, IPages, ILineLiffResponse } from '@reactor-room/itopplus-model-lib';
import axios from 'axios';
import { SettingError } from '../../../errors/setting.error';

export async function getChannelInfo(channeltoken: string, step: string): Promise<ILineChannelInforAPIResponse> {
  try {
    const url = 'https://api.line.me/v2/bot/info';
    const result = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${channeltoken}`,
      },
    });
    return result.data as ILineChannelInforAPIResponse;
  } catch (err) {
    if (step !== 'LOGIN') throw new SettingError('INVALID_LINE_CHANNEL_ACCESS_TOKEN');
    return { userId: 'INVALID_LINE_CHANNEL_ACCESS_TOKEN' } as ILineChannelInforAPIResponse;
  }
}

export async function registerLineLiff(channeltoken: string, backendUrl: string): Promise<ILineLiffResponse> {
  try {
    const url = 'https://api.line.me/liff/v2/apps';
    const result = await axios.post(
      url,
      {
        view: {
          type: 'full',
          url: `${backendUrl}/webview`,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channeltoken}`,
        },
      },
    );
    return result.data as ILineLiffResponse;
  } catch (err) {
    console.log('err :::', err);
  }
}

export async function setLineChannelDetailByPageID(client: Pool, lineSetting: ILineSetting, pageID: number): Promise<IPages> {
  try {
    const SQL = `
                UPDATE pages 
                SET 
                line_basic_id = $1,
                line_channel_id = $2,
                line_channel_secret = $3,
                line_channel_accesstoken = $4,
                line_shop_name = $5,
                line_profile_picture = $6,
                line_premium_id = $7,
                line_user_id = $8
                WHERE 
                id = $9  RETURNING id, uuid
            `;
    const paramPage = [
      lineSetting.basicid,
      lineSetting.channelid,
      lineSetting.channelsecret,
      lineSetting.channeltoken,
      lineSetting.displayname,
      lineSetting.pictureurl,
      lineSetting.premiumid,
      lineSetting.userid,
      pageID,
    ];
    const data = await PostgresHelper.execQuery<IPages>(client, SQL, paramPage);
    return data[0];
  } catch (err) {
    throw new SettingError('SET_CHANNEL_DETAIL_FAILED');
  }
}

export async function getLineChannelInforByPageID(client: Pool, pageID: number): Promise<ILineResponse> {
  const SQL = 'SELECT line_profile_picture  as "picture", line_shop_name as "name", line_premium_id as "id", line_basic_id FROM pages WHERE id = $1';
  const data = await PostgresHelper.execQuery<ILineResponse[]>(client, SQL, [pageID]);
  return data.length > 0 ? data[0] : ({ name: null, picture: null, id: null } as ILineResponse);
}

export async function getLineChannelSettingByPageID(client: Pool, pageID: number): Promise<ILineSetting> {
  const SQL = `SELECT line_basic_id basicid, line_channel_id channelid, line_channel_secret channelsecret, 
    line_channel_accesstoken channeltoken, uuid, id
    FROM pages 
    WHERE 
    id = $1`;
  const data = await PostgresHelper.execQuery<ILineSetting[]>(client, SQL, [pageID]);
  return data.length > 0 ? data[0] : ({ basicid: null, channelid: null, channelsecret: null, channeltoken: null } as ILineSetting);
}

export async function checkDuplicateLineChannel(client: Pool, line_channel_id: number): Promise<number> {
  const SQL = `SELECT COUNT(*) total
    FROM pages 
    WHERE 
    line_channel_id = $1`;
  const data = await PostgresHelper.execQuery<any>(client, SQL, [line_channel_id]);
  return data.length > 0 ? data[0].total : 0;
}

export async function checkLiffRegistered(client: Pool, pageID: number): Promise<boolean> {
  const SQL = `SELECT COUNT(*) total
      FROM pages 
      WHERE 
      id = $1 AND
      line_liff_id IS NOT NULL`;
  const data = await PostgresHelper.execQuery<any>(client, SQL, [pageID]);
  return data[0].total > 0 ? true : false;
}

export async function checkNewChannelToken(client: Pool, pageID: number, channeltoken: string): Promise<boolean> {
  const SQL = `SELECT COUNT(*) total
      FROM pages 
      WHERE 
      id = $1 AND
      line_channel_accesstoken = $2`;
  const data = await PostgresHelper.execQuery<any>(client, SQL, [pageID, channeltoken]);
  return data[0].total > 0 ? false : true;
}

export async function setLineChannelProfileByPageID(client: Pool, profile_pic: string, pageID: number): Promise<number> {
  try {
    const SQL = `
                UPDATE pages 
                SET 
                line_profile_picture = $1
                WHERE 
                id = $2  RETURNING id
            `;
    const paramPage = [profile_pic, pageID];
    const data = await PostgresHelper.execQuery<IPages>(client, SQL, paramPage);
    return data[0].id;
  } catch (err) {
    throw new SettingError('SET_CHANNEL_PROFILE_FAILED');
  }
}

export async function setLineLiffByPageID(client: Pool, line_liff_id: string, pageID: number): Promise<number> {
  try {
    const SQL = `
                  UPDATE pages 
                  SET 
                  line_liff_id = $1
                  WHERE 
                  id = $2 AND
                  EXISTS (
                      SELECT id FROM pages WHERE id = $3 AND line_liff_id IS NULL
                  ) RETURNING id
              `;
    const paramPage = [line_liff_id, pageID, pageID];
    const data = await PostgresHelper.execQuery<IPages>(client, SQL, paramPage);
    return data[0].id;
  } catch (err) {
    throw new SettingError('SET_CHANNEL_LIFF_FAILED');
  }
}

export async function getLineLiffIDByPageID(client: Pool, pageID: number): Promise<ILineLiffResponse> {
  const SQL = `SELECT line_liff_id as "liffId"
      FROM pages 
      WHERE 
      id = $1`;
  const data = await PostgresHelper.execQuery<ILineLiffResponse[]>(client, SQL, [pageID]);
  return data.length > 0 ? data[0] : null;
}
