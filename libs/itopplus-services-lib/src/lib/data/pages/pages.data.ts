import { getUTCTimestamps, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICount, IHTTPResult, LanguageTypes } from '@reactor-room/model-lib';
import {
  EnumUserSubscriptionType,
  EnumWizardStepType,
  IAddNewPage,
  IAddShopProfile,
  IFacebookAttachmentUploadResponse,
  IFacebookDomainWhitelisted,
  IFacebookPageResponse,
  IFacebookPageUsername,
  IMessageSetting,
  IPageAdvancedSettings,
  IPageInfoWithOwnerInfo,
  IPages,
  IPlanName,
  ISubscription,
  IUserPageMapInput,
  IPagesAPI,
  IPageAppScope,
  IFacebookPageGetProfileResponse,
  EnumAppScopeType,
} from '@reactor-room/itopplus-model-lib';
import axios from 'axios';
import { head as first } from 'lodash';
import { Pool } from 'pg';

export async function getPageAddress(client: Pool, pageID: number): Promise<IPages> {
  try {
    const SQL = `
    SELECT
      firstname,
      lastname,
      page_name,
      tel,
      post_code,
      district,
      amphoe,
      province,
      address
    FROM
      pages
    WHERE
      id = :pageID
  `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { pageID });
    const result = await PostgresHelper.execQuery<IPages[]>(client, sql, bindings);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    if (error.constraint === 'chat_templates_un') throw new Error('err_add_alr_exist_msg_tpl');
  }
}

export async function getPageByFacebookPageID(client: Pool, fb_page_id: string): Promise<IPages> {
  const SQL = `
  SELECT p.*,psm.subscription_id FROM pages p 
  INNER JOIN page_subscriptions_mappings psm ON p.id = psm.page_id 
  WHERE p.fb_page_id = $1 ORDER BY p.created_at DESC LIMIT 1`;
  const result = await PostgresHelper.execQuery<IPages[]>(client, SQL, [fb_page_id]);
  return first(result);
}

export async function getPageByLineUserID(client: Pool, line_user_id: string): Promise<IPages> {
  const SQL = `
  SELECT p.*,psm.subscription_id FROM pages p 
  INNER JOIN page_subscriptions_mappings psm ON p.id = psm.page_id 
  WHERE p.line_user_id = $1 ORDER BY p.created_at DESC LIMIT 1`;
  const result = await PostgresHelper.execQuery<IPages[]>(client, SQL, [line_user_id]);
  return first(result);
}

export async function getPageByID(client: Pool, pageID: number | string): Promise<IPages> {
  const SQL = 'SELECT * from pages where id = $1 ORDER BY created_at DESC LIMIT 1;';
  const result = await PostgresHelper.execQuery<IPages[]>(client, SQL, [pageID]);
  return first(result);
}
export async function getUnfinishPageSetting(client: Pool, pageID: number): Promise<IPages> {
  const SQL = `
  SELECT 
    p.*,
    (
      SELECT jsonb_agg(pas.app_scope)
      FROM pages p 
      INNER JOIN page_application_scopes pas ON p.id = pas.page_id 
      WHERE p.id = $1
      GROUP BY pas.page_id
    ) AS page_app_scope
  FROM pages p
  WHERE p.id = $1
  ORDER BY created_at 
  DESC LIMIT 1`;
  const result = await PostgresHelper.execQuery<IPages[]>(client, SQL, [pageID]);
  return first(result);
}

export async function getPageByUUID(client: Pool, uuid: string): Promise<IPages> {
  const SQL = `
  SELECT p.*,psm.subscription_id from pages p 
  INNER JOIN page_subscriptions_mappings psm ON p.id = psm.page_id 
  WHERE p.uuid = $1 LIMIT 1;`;
  const result = await PostgresHelper.execQuery<IPages[]>(client, SQL, [uuid]);
  return first(result);
}

export async function getShopSettingByID(client: Pool, pageID: number | string): Promise<IPages> {
  const SQL = `
  SELECT 
    page_name,
    currency
  FROM 
    pages 
  WHERE id = $1`;
  const result = await PostgresHelper.execQuery<IPages[]>(client, SQL, [pageID]);
  return result[0];
}

export async function createDefaultPage(client: Pool, email: string, tel: string): Promise<IPages> {
  try {
    const bindings = { name: 'default name', email, tel, step: EnumWizardStepType.STEP_CONNECT_FACEBOOK };
    const SQL = `
      INSERT INTO PAGES(page_name, email, tel, wizard_step )
      VALUES (:name,:email, :tel, :step)
      RETURNING *;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPages>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data[0];
  } catch (err) {
    console.log('createDefaultPage err: ==> ', err);
    throw err;
  }
}

export async function connectFacebookPageToPage(client: Pool, pageId: number, pageInput: IAddShopProfile): Promise<IHTTPResult> {
  try {
    const option = {
      access_token: pageInput.access_token,
    };
    const { shopName, facebookid, facebookpic } = pageInput;
    const bindings = { pageId, shopName, facebookid, facebookpic, option, step: EnumWizardStepType.STEP_SET_SHOP_INFO };
    const SQL = `
        UPDATE PAGES
        SET 
          page_name = :shopName, 
          fb_page_id = :facebookid, 
          shop_picture = :facebookpic, 
          option = :option, 
          wizard_step = :step
        WHERE id = :pageId
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery<IHTTPResult>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return {
      status: 200,
      value: 'Connect fb page to page successfully!',
    } as IHTTPResult;
  } catch (err) {
    console.log('err: ==> ', err);
    throw err;
  }
}

export async function updatePageWizardStep(client: Pool, pageId: number, step: EnumWizardStepType): Promise<IHTTPResult> {
  try {
    const bindings = { pageId, step };
    const SQL = `
        UPDATE PAGES
        SET wizard_step = :step
        WHERE id = :pageId
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IHTTPResult>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return {
      status: 200,
      value: `Update wizard to step ${step} successfully!`,
    } as IHTTPResult;
  } catch (err) {
    console.log('updatePageWizardStep err: ==> ', err);
    throw err;
  }
}

export async function createUserPageMapping(client: Pool, userPageMapInput: IUserPageMapInput): Promise<IUserPageMapInput> {
  try {
    const { user_id, page_id, email, role, is_active } = userPageMapInput;
    const bindings = { user_id, page_id, email, role, is_active };
    const SQL = `

            INSERT INTO user_page_mapping (
              user_id,
              page_id,
              role,
              email,
              is_active
            )
            VALUES (
              :user_id,
              :page_id,
              :role,
              :email,
              :is_active
            )
            RETURNING *;
         `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execBatchTransaction<IUserPageMapInput>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function addPageWithFB(client: Pool, pageInput: IFacebookPageResponse, email: string): Promise<IPages> {
  const SQL = 'INSERT INTO pages (page_name, fb_page_id, email, option) VALUES ($1, $2, $3, $4) RETURNING *;';
  return await PostgresHelper.execSingleWrite<IPages>(client, SQL, [pageInput.name, pageInput.id, email, JSON.stringify(pageInput)]);
}

export async function addPage(client: Pool, pageInput: IAddNewPage, email: string): Promise<IPages> {
  delete pageInput.facebookPage;
  const created_at = Date.now();
  const SQL = 'INSERT INTO pages (page_name, email, option, created_at) VALUES ($1, $2, $3, $4) RETURNING *';
  return await PostgresHelper.execSingleWrite<IPages>(client, SQL, [pageInput.shopName, email, JSON.stringify(pageInput), created_at]);
}

export async function updatePageAdvancedSettings(client: Pool, pageID: number, settings: IPageAdvancedSettings): Promise<IPages> {
  const page = await getPageByID(client, pageID);
  const options = { ...page.option, advanced_settings: settings };
  const SQL = 'UPDATE pages SET option = $2 WHERE id = $1 RETURNING *';
  return await PostgresHelper.execSingleWrite<IPages>(client, SQL, [pageID, JSON.stringify(options)]);
}
export async function updatePageMessage(client: Pool, pageID: number, messages: IMessageSetting): Promise<IMessageSetting> {
  const { message1, message2, message3, message4, message5, message6, message7, message8, message9, message10, message11, message12, message13, message14, type } = messages;

  const SQL = `
    UPDATE 
      page_messages
    SET
      message1 = $1,
      message2 = $2,
      message3 = $3,
      message4 = $4,
      message5 = $5,
      message6 = $6,
      message7 = $7,
      message8 = $8,
      message9 = $9,
      message10 = $10,
      message11 = $11,
      message12 = $12,
      message13 = $13,
      message14 = $14
    WHERE
      page_id = $15
    AND
      type = $16
    `;
  return await PostgresHelper.execQuery<IMessageSetting>(client, SQL, [
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7,
    message8,
    message9,
    message10,
    message11,
    message12,
    message13,
    message14,
    pageID,
    type,
  ]);
}

export async function updatePageCondition(client: Pool, pageID: number, description: string): Promise<IMessageSetting> {
  const SQL = `
  UPDATE 
    page_messages
  SET
    terms_condition =$1
  WHERE
    page_id = $2
  `;
  const result = await PostgresHelper.execQuery<IMessageSetting[]>(client, SQL, [description, pageID]);
  return result.length > 0 ? result[0] : ({} as IMessageSetting);
}
export async function saveCartMessage(client, pageID: number, message18: string, message19: string, typeOfMessage: string): Promise<IMessageSetting[]> {
  const sql = `INSERT INTO page_messages (message18, message19, page_id,type)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (page_id) 
  DO
  UPDATE set message18 =$1, message19 = $2
  RETURNING *
  `;
  return await PostgresHelper.execQuery<IMessageSetting[]>(client, sql, [message18, message19, pageID, typeOfMessage]);
}

export async function savePageCondition(client, pageID: number, description: string): Promise<IMessageSetting> {
  const SQL = `
    INSERT INTO page_messages
    ( 
      page_id,
      terms_condition
    )
    VALUES
    (
      $1,
      $2
    )
    RETURNING *
  `;
  return await PostgresHelper.execQuery<IMessageSetting>(client, SQL, [pageID, description]);
}
export async function savePageMessage(client: Pool, pageID: number, messages: IMessageSetting, locale = LanguageTypes.THAI): Promise<IMessageSetting> {
  const { message1, message2, message3, message4, message5, message6, message7, message8, message9, message10, message11, message12, message13, message14, type } = messages;

  const SQL = `INSERT INTO page_messages 
  (
    page_id, 
    type, 
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7,
    message8,
    message9,
    message10,
    message11,
    message12,
    message13,
    message14,
    locale
  )
  VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17
  )RETURNING *
    `;
  return await PostgresHelper.execQuery<IMessageSetting>(client, SQL, [
    pageID,
    type,
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7,
    message8,
    message9,
    message10,
    message11,
    message12,
    message13,
    message14,
    locale,
  ]);
}
export async function getPageMessage(client: Pool, pageID: number, typeOfMessage: string, language = LanguageTypes.THAI): Promise<IMessageSetting> {
  const SQL = 'SELECT * from page_messages WHERE page_id = $1 and type = $2 AND locale = $3';
  return await PostgresHelper.execSingleWrite<IMessageSetting>(client, SQL, [pageID, typeOfMessage, language]);
}
export async function updatePageName(client: Pool, pageUsername: string, pageID: number): Promise<void> {
  const SQL = `
    UPDATE
      pages
    SET
      page_username = $1,
      updated_at = $2
    WHERE
      id = $3
  `;
  await PostgresHelper.execQuery(client, SQL, [pageUsername, getUTCTimestamps(), pageID]);
}

export async function updateProfile(client: Pool, profile: string, pageID: number): Promise<[IPages]> {
  const SQL = `
    UPDATE
      pages
    SET
      shop_picture = $1
    WHERE
      id = $2
  `;
  return await PostgresHelper.execQuery<[IPages]>(client, SQL, [profile, pageID]);
}

export async function getPageOption(client: Pool, pageID: number): Promise<[IPages]> {
  const SQL = `
  SELECT 
    id,
    option
  FROM
    pages
  WHERE
    id = $1
  `;
  return await PostgresHelper.execQuery<[IPages]>(client, SQL, [pageID]);
}

export async function getMaximumPageByUserID(client: Pool, userID: number): Promise<IPlanName[]> {
  const SQL = `
  SELECT * FROM user_subscriptions_mapping usm
  INNER JOIN subscriptions s ON (s.id = usm.subscription_id)
  WHERE usm.user_id = $1
  AND usm.role = $2
  `;
  return await PostgresHelper.execQuery<IPlanName[]>(client, SQL, [userID, EnumUserSubscriptionType.OWNER]);
}

export async function countPagesBySubscription(client: Pool, subscription_id: string): Promise<ICount> {
  const SQL = `
    SELECT 
      COUNT(subscription_id) :: Integer
    FROM 
      page_subscriptions_mappings 
    WHERE 
      subscription_id = $1 
    `;
  return await PostgresHelper.execQuery<ICount>(client, SQL, [subscription_id]);
}

export async function getSubScripID(client: Pool, userID: string): Promise<ISubscription> {
  const SQL = 'SELECT subscription_id FROM user_subscriptions_mapping WHERE user_id = $1';
  return await PostgresHelper.execQuery<ISubscription>(client, SQL, [userID]);
}

export async function getPagesByUserID(client: Pool, userID: number): Promise<[IPages] | null> {
  const SQL = `
  SELECT 
    p.id as "id",
    p.id as page_id,
    u.id as user_id,
    p.*,
    u.sid,
    u.name,
    u.email,
    u.tel,
    u.created_at as "user_created_at",
    u.updated_at as "user_updated_at",
    u.latest_login,
    u.profile_img
  FROM pages p 
  INNER JOIN 
    user_page_mapping upm ON (upm.page_id = p.id) 
  INNER JOIN 
    users u ON (upm.user_id = u.id) 
  WHERE u.id = $1 ORDER BY p.created_at ASC`;
  return await PostgresHelper.execQuery<[IPages]>(client, SQL, [userID]);
}

export async function getshopFanPageDetail(client: Pool, pageID: number): Promise<[IPages] | null> {
  const SQL = 'SELECT * from pages where id = $1';
  return await PostgresHelper.execQuery<[IPages]>(client, SQL, [pageID]);
}
export async function getPagesByUserIDAndSubscriptionID(client: Pool, userID: number, subscriptionID: string): Promise<IPages[]> {
  const SQL = `
  SELECT
    p.id,
    u.id as user_id,
    psm.id as page_mapping_id,
    p.page_name,
    p.page_username,
    p.uuid,
    upm.role as page_role,
    p.tel,
    p.email,
    p.option,
    p.created_at,
    p.updated_at,
    p.fb_page_id,
    p.language,
    p.currency,
    p.firstname,
    p.lastname,
    p.flat_status,
    p.delivery_fee,
    p.district,
    p.province,
    p.post_code,
    p.country,
    p.amphoe,
    p.shop_picture,
    p.social_facebook,
    p.social_line,
    p.social_shopee,
    p.social_lazada,
    p.line_channel_secret,
    p.wizard_step
    FROM users u
    INNER JOIN user_page_mapping upm ON upm.user_id  = u.id
    INNER JOIN pages p ON p.id = upm.page_id 
    INNER JOIN page_subscriptions_mappings psm ON psm.page_id = p.id 
    WHERE 
    u.id = $1 AND 
    psm.subscription_id = $2 AND 
    upm.is_active = $3
    ORDER BY 
    p.created_at ASC
      `;
  const data: IPages[] = await PostgresHelper.execQuery<IPages[]>(client, SQL, [userID, subscriptionID, true]);
  if (data.length > 0) {
    return data;
  }
  return null;
}

export async function getPageAppScopeByPageID(client: Pool, pageID: number): Promise<IPageAppScope[]> {
  const bindings = { pageID };
  const SQL = `
            SELECT 
              id,
              page_id,
              app_scope
            FROM page_application_scopes
            WHERE page_id = :pageID
            `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<IPageAppScope[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (data.length > 0) return data;
  return null;
}

export async function setPageAppScopeByPageID(client: Pool, pageID: number, appScope: EnumAppScopeType): Promise<IPageAppScope[]> {
  const bindings = { pageID, appScope };
  const SQL = `
          INSERT INTO page_application_scopes(page_id,app_scope)
          VALUES (:pageID,:appScope)
          RETURNING *
            `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<IPageAppScope[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (data.length > 0) return data;
  return null;
}

export async function deletePageApplicationScope(client: Pool, pageId: number, appScope: EnumAppScopeType): Promise<void> {
  const bindings = { pageId, appScope };
  const SQL = `
                  DELETE 
                  FROM page_application_scopes
                  WHERE 
                      page_id = :pageId AND
                      app_scope = :appScope
              `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function getPagesFromSubscriptionID(client: Pool, subscripitonID: string): Promise<ICount> {
  const SQL = `
  SELECT 
      count(page_id) 
  FROM 
      page_subscriptions_mappings psm 
  WHERE 
      subscription_id = $1
  GROUP BY
    subscription_id
  `;
  const data: any = await PostgresHelper.execQuery<ICount>(client, SQL, [subscripitonID]);
  if (data?.length) {
    return data[0];
  }
  return { count: 0 } as ICount;
}

export async function getPagesFromFacebookUser(ASID: string, accessToken: string): Promise<IFacebookPageResponse[]> {
  // eslint-disable-next-line max-len
  const url = `https://graph.facebook.com/v8.0/${ASID}/accounts?access_token=${accessToken}&fields=id,name,username,picture,category,category_list,access_token&picture?height=450&width=450`;
  try {
    const {
      data: { data },
    } = await axios.get(url);
    return data;
  } catch (err) {
    console.log('-< getPagesFromFacebookUser >- ', err);
    return null;
  }
}
export async function getPagePicutreFromFacebookByFanpageID(ASID: string, accessToken: string): Promise<IFacebookPageGetProfileResponse> {
  const url = `https://graph.facebook.com/v8.0/${ASID}/picture?redirect=0&height=450&width=450&access_token=${accessToken}`;
  try {
    const {
      data: { data },
    } = await axios.get(url);

    return data;
  } catch (err) {
    return null;
  }
}
export async function getFaceBookFanPageByID(ASID: string, accessToken: string): Promise<IFacebookPageResponse[]> {
  const ENDPOINT = `https://graph.facebook.com/${ASID}/insights/page_impressions_unique&access_token=${accessToken}`;
  try {
    const {
      data: { data },
    } = await axios.get(ENDPOINT);
    return data;
  } catch (err) {
    console.log('-< getFaceBookFanPageByID >- ', err);
    return null;
  }
}

export function getBindedPagesAndOwner(client: Pool, fbPageIDs: string[]): Promise<IPageInfoWithOwnerInfo[]> {
  // TODO: Fix this
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IPageInfoWithOwnerInfo[]>(async (resolve, reject) => {
    try {
      const param = fbPageIDs.map((e, i) => {
        return '$' + Number(i + 1);
      });
      const SQL = `
      SELECT upm.user_id, upm.page_id, u.email, p.fb_page_id 
      FROM pages p
      INNER JOIN user_page_mapping upm ON (upm.page_id = p.id)
      INNER JOIN users u ON (u.id = upm.user_id)
      where fb_page_id in (${param.join(', ')})
    `;

      const result = await PostgresHelper.execQuery<IPageInfoWithOwnerInfo[]>(client, SQL, fbPageIDs);
      if (result.length > 0) {
        resolve(result);
      } else {
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
}

export async function subscribePageToApp(facebookPageID: string, pageAccessToken: string): Promise<boolean> {
  try {
    const ENDPOINT = `https://graph.facebook.com/${facebookPageID}/subscribed_apps?access_token=${pageAccessToken}`;

    await axios.post(
      ENDPOINT,
      Object.assign({
        subscribed_fields: [
          'feed',
          'inbox_labels',
          'message_deliveries',
          'message_echoes',
          'message_reactions',
          'message_reads',
          'messaging_account_linking',
          'messaging_checkout_updates',
          'messaging_fblogin_account_linking',
          'messaging_game_plays',
          'messaging_handovers',
          'messaging_optins',
          'messaging_payments',
          'messaging_policy_enforcement',
          'messaging_postbacks',
          'messaging_pre_checkouts',
          'messaging_referrals',
          'standby',
          'messages',
        ],
      }),
    );

    return true;
  } catch (err) {
    console.log('-< subscribePageToApp >- ', err);
    return false;
  }
}

export async function uninstallPageFromApp(ASID: string, pageAccessToken: string): Promise<boolean> {
  try {
    const ENDPOINT = `https://graph.facebook.com/${ASID}/permissions?access_token=${pageAccessToken}`;

    await axios.post(
      ENDPOINT,
      Object.assign({
        data: [
          {
            permission: 'email',
            status: 'granted',
          },
          {
            permission: 'pages_show_list',
            status: 'granted',
          },
          {
            permission: 'pages_messaging',
            status: 'granted',
          },
          {
            permission: 'pages_read_engagement',
            status: 'granted',
          },
          {
            permission: 'pages_manage_metadata',
            status: 'granted',
          },
          {
            permission: 'pages_read_user_content',
            status: 'granted',
          },
          {
            permission: 'pages_manage_engagement',
            status: 'granted',
          },
          {
            permission: 'public_profile',
            status: 'granted',
          },
        ],
      }),
    );

    return true;
  } catch (err) {
    return false;
  }
}

export async function subscribeDomainWhitelistToPage(pageId: number, accessToken: string, domains: string[]): Promise<boolean> {
  try {
    const ENDPOINT = `https://graph.facebook.com/${pageId}/messenger_profile?access_token=${accessToken}`;
    const { data } = await axios.post(ENDPOINT, { whitelisted_domains: domains });

    return true;
  } catch (err) {
    console.log('-< subscribeDomainWhitelistToPage >- ', err);
    return false;
  }
}

export async function getPagesUsername(pageID: string, accessToken: string): Promise<IFacebookPageUsername> {
  try {
    const ENDPOINT = `https://graph.facebook.com/v8.0/${pageID}?access_token=${accessToken}&fields=id,name,username`;

    const { data } = await axios.get(ENDPOINT);
    return data;
  } catch (err) {
    console.log('-< err >- ', err);
    throw new Error(err);
  }
}

export async function getWhitelistedDomains(pageID: number, accessToken: string): Promise<IFacebookDomainWhitelisted> {
  try {
    const ENDPOINT = `https://graph.facebook.com/${pageID}/messenger_profile?access_token=${accessToken}&fields=whitelisted_domains`;

    const {
      data: { data },
    } = await axios.get(ENDPOINT);
    return first(data) ?? null;
  } catch (err) {
    console.log('-< getWhitelistedDomains >- ', err);
    return null;
  }
}

export async function uploadMessageAttachments(accessToken: string, url: string): Promise<IFacebookAttachmentUploadResponse> {
  try {
    const ENDPOINT = `https://graph.facebook.com/v8.0/me/message_attachments?access_token=${accessToken}`;
    const {
      data: { data },
    } = await axios.post(ENDPOINT, {
      message: {
        attachment: {
          type: 'image',
          payload: {
            is_reusable: true,
            url: url,
          },
        },
      },
    });
    return data;
  } catch (err) {
    console.log('Attach Error page ID', err);
    throw new Error(err);
  }
}

export async function getLineChannelTokenByPageID(client: Pool, pageID: number): Promise<IPages> {
  const SQL = `
    SELECT line_channel_accesstoken
    FROM pages
    WHERE 
    id = $1
  `;
  const data = await PostgresHelper.execQuery<ICount>(client, SQL, [pageID]);
  if (data) {
    return data[0] as IPages;
  }
  return null;
}

export async function createClientAPI(client: Pool, pageID: number, pageDetail: IPagesAPI): Promise<IPagesAPI> {
  const SQL = `
    UPDATE
      pages
    SET
      benabled_api = $1,
      api_client_id = $2,
      api_client_secret = $3
    WHERE
      id = $4
    RETURNING *
  `;
  const data = await PostgresHelper.execQuery<IPagesAPI[]>(client, SQL, [pageDetail.benabled_api, pageDetail.api_client_id, pageDetail.api_client_secret, pageID]);
  return data[0];
}

export async function setClientAPIStatus(client: Pool, pageID: number, bactive: boolean): Promise<IPagesAPI> {
  const SQL = `
    UPDATE
      pages
    SET
      benabled_api = $1
    WHERE
      id = $2
    RETURNING *
  `;
  const data = await PostgresHelper.execQuery<IPagesAPI[]>(client, SQL, [bactive, pageID]);
  return data[0];
}

export async function getPageAPISettingByID(client: Pool, pageID: number): Promise<IPagesAPI> {
  const SQL = `
    SELECT 
      benabled_api,
      api_client_id,
      api_client_secret
    FROM 
      pages 
    WHERE 
      id = $1 
    `;
  const data = await PostgresHelper.execQuery<IPagesAPI[]>(client, SQL, [pageID]);
  return data !== null ? data[0] : null;
}

export async function getAPIKeyByUUIDAndSecret(client: Pool, uuid: string, secret: string): Promise<IPagesAPI> {
  const SQL = `
    SELECT 
      benabled_api,
      api_client_id,
      api_client_secret
    FROM 
      pages 
    WHERE 
      uuid = $1 AND
      api_client_secret = $2
    `;
  const data = await PostgresHelper.execQuery<IPagesAPI[]>(client, SQL, [uuid, secret]);
  return data !== null ? data[0] : null;
}

export async function deletePageSubscriptionMapping(client: Pool, pageId: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageId };
    const SQL = `
                  DELETE 
                  FROM page_subscriptions_mappings
                  WHERE 
                      page_id = :pageId 
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete page subscription mapping successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteLogisticSystem(client: Pool, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID };
    const SQL = `
      DELETE FROM page_settings ps WHERE ps.page_id = :pageID AND ps.setting_type = 'LOGISTIC_SYSTEM';
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete LogisticSystem successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function deletePage(client: Pool, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID };
    const SQL = `
                  DELETE 
                  FROM pages
                  WHERE 
                      id = :pageID 
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete Page successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
