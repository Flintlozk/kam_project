import { axiosPost, getUTCDayjs, getUTCTimestamps, isImageByExtension, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  CustomerDomainStatus,
  EnumPurchaseOrderStatus,
  IAgent,
  IAttachment,
  IAudience,
  ImageSetTemplateInput,
  LeadsDomainStatus,
  Message,
  MessageReferral,
  MessageSentByEnum,
  NotificationStatus,
  Socials,
  SocialsInput,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';
import { RedisClient } from 'redis';

const getUpdateAudienceDomainStatusSQL = (): string => {
  return ` 
  UPDATE audience 
  SET domain = :domain, 
  status = :status, 
  updated_at = :updatedAt
  WHERE 
  id = :audienceID AND 
  page_id = :pageID 
  RETURNING * `;
};

export async function updateAudienceDomainStatusByID(
  client: Pool,
  domain: AudienceDomainType | string,
  status: CustomerDomainStatus | AudienceDomainStatus | EnumPurchaseOrderStatus | LeadsDomainStatus | string,
  pageID: number,
  audienceID: number,
): Promise<IAudience> {
  const bindings = { domain, status, audienceID, pageID, updatedAt: getUTCDayjs() };
  const SQL = getUpdateAudienceDomainStatusSQL();
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : null;
}

export async function updateAudienceUserOpen(client: Pool, pageID: number, audienceID: number, userID: number): Promise<IAudience> {
  const bindings = { userID, audienceID, pageID, updatedAt: getUTCDayjs() };
  const SQL = `
  UPDATE 
    audience 
  SET 
    user_open_id = :userID, 
    updated_at = :updatedAt
  WHERE
    id = :audienceID AND
    page_id = :pageID
  
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : null;
}
export async function updateAudienceUserOpenAndAssignee(client: Pool, pageID: number, audienceID: number, userID: number): Promise<IAudience> {
  const bindings = { userID, audienceID, pageID, updatedAt: getUTCDayjs() };
  const SQL = `
  UPDATE 
    audience 
  SET 
    user_open_id = :userID, 
    assignee_id = :userID, 
    updated_at = :updatedAt
  WHERE
    id = :audienceID AND
    page_id = :pageID
  
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : null;
}
export async function updateAudienceUserClose(client: Pool, pageID: number, audienceID: number, userID: number): Promise<IAudience> {
  const bindings = { userID, audienceID, pageID, updatedAt: getUTCDayjs() };
  const SQL = `
  UPDATE 
    audience 
  SET 
    user_close_id = :userID, 
    updated_at = :updatedAt
  WHERE
    id = :audienceID AND
    page_id = :pageID
  
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : null;
}
export async function setAudienceNotifyOnClosed(client: Pool, notifyStatus: string, isNotify: boolean, pageID: number, audienceID: number): Promise<IAudience> {
  const bindings = { notifyStatus, isNotify, audienceID, pageID, updatedAt: getUTCDayjs() };
  const SQL = `
  UPDATE audience 
  SET notify_status = :notifyStatus, 
  is_notify = :isNotify ,
  updated_at = :updatedAt
  WHERE id = :audienceID 
  AND page_id = :pageID
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : null;
}
export async function setAudienceOffTimes(client: Pool, pageID: number, audienceID: number, isOffTime: boolean): Promise<IAudience> {
  const bindings = { audienceID, pageID, isOffTime, updatedAt: getUTCDayjs() };
  const SQL = `
  UPDATE audience 
  SET is_offtime = :isOffTime ,
  updated_at = :updatedAt
  WHERE id = :audienceID 
  AND page_id = :pageID
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : null;
}

export async function updateAudienceDomainStatusByIDTransaction(
  client: Pool,
  domain: AudienceDomainType | string,
  status: CustomerDomainStatus | AudienceDomainStatus | EnumPurchaseOrderStatus | LeadsDomainStatus | string,
  pageID: number,
  audienceID: number,
): Promise<IAudience> {
  const bindings = { domain, status, audienceID, pageID, updatedAt: getUTCDayjs() };
  const SQL = getUpdateAudienceDomainStatusSQL();
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execBatchTransaction<IAudience>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result;
}

export async function updateAudienceStatusByID(
  client: Pool,
  id: number,
  pageID: number,
  status: CustomerDomainStatus | AudienceDomainStatus | EnumPurchaseOrderStatus | LeadsDomainStatus | string,
): Promise<IAudience> {
  const SQL = 'UPDATE audience SET status = $1 WHERE id = $2 AND page_id = $3 Returning * ';
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, [status as string, id, pageID]);
  return result[0];
}

export async function updateChildDomainByParentID(client: Pool, status: LeadsDomainStatus, pageID: number, parentID: number): Promise<IAudience> {
  const SQL = 'UPDATE audience SET status = $1 WHERE parent_id = $2 AND page_id = $3 RETURNING *';
  const result = await PostgresHelper.execQuery(client, SQL, [status, parentID, pageID]);
  return result[0];
}

export async function updateAudiencePageIDByID(client: Pool, audienceID: number, pageIDNew: number, pageIDCurrent: number): Promise<IAudience> {
  const SQL = 'UPDATE audience SET page_id = $1 WHERE id = $2 AND page_id = $3 RETURNING *';
  const result = await PostgresHelper.execQuery(client, SQL, [pageIDNew, audienceID, pageIDCurrent]);
  return result[0];
}
export async function updateAudienceReferral(client: Pool, audienceID: number, pageID: number, referral: MessageReferral): Promise<IAudience> {
  const params = [referral, audienceID, pageID, getUTCDayjs()];
  const SQL = 'UPDATE audience SET referral = $1, updated_at = $4 WHERE id = $2 AND page_id = $3 RETURNING *';
  const result = await PostgresHelper.execQuery(client, SQL, params);
  return result[0];
}

export async function updateParentAudience(
  client: Pool,
  domain: AudienceDomainType | string,
  status: CustomerDomainStatus | AudienceDomainStatus | EnumPurchaseOrderStatus | LeadsDomainStatus | string,
  scope: AudienceDomainType | string,
  pageID: number,
  audienceID: number,
): Promise<IAudience> {
  const SQL = `
  UPDATE audience 
  SET
    domain = $1, status = $2 
  WHERE
    id = $3 
  AND 
    page_id = $4 
  AND 
    domain = (
      SELECT 
        domain 
      FROM audience 
      WHERE 
        domain = $5 
      AND 
        id = $3
      )
  RETURNING *
  `;
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, [domain, status, audienceID, pageID, scope]);
  return Array.isArray(result) ? result[0] : null;
}

export async function createChildAudience(client: Pool, pageID: number, parentAudienceID: number, domain: AudienceDomainType, status: LeadsDomainStatus): Promise<IAudience> {
  // ! Mark as removing
  const SQL = `
        INSERT INTO audience
        (
            customer_id,
            page_id,
            parent_id,
            domain,
            status,
            is_notify
        )
        VALUES
        (
            (SELECT customer_id from audience WHERE id = $1),
            $2,
            $3,
            $4,
            $5,
            false
        )
    RETURNING *`;
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, [parentAudienceID, pageID, parentAudienceID, domain, status]);
  return result[0];
}

export async function addCustomerToAudience(
  client: Pool,
  customerID: number,
  pageID: number,
  domain: AudienceDomainType | string,
  status: AudienceDomainStatus | string,
): Promise<IAudience> {
  const SQL = 'INSERT INTO audience (customer_id, page_id, domain, status, created_at) VALUES ($1, $2, $3, $4, $5)) RETURNING *;';
  const result = await PostgresHelper.execQuery<IAudience>(client, SQL, [customerID, pageID, domain, status, getUTCDayjs()]);
  return result[0];
}

export async function addCustomerToAudienceTransaction(
  client: Pool,
  customerID: number,
  pageID: number,
  domain: AudienceDomainType | string,
  status: AudienceDomainStatus | string,
  readStatus: NotificationStatus,
  lastPlatformActivityDate: string,
): Promise<IAudience> {
  const bindings = [customerID, pageID, domain, status, readStatus, lastPlatformActivityDate];

  const SQL = `
    INSERT INTO audience (
      customer_id,
      page_id,
      "domain",
      status,
      notify_status,
      last_platform_activity_date
    )
    SELECT
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    WHERE NOT EXISTS (
      SELECT
        *
      FROM
        audience
      WHERE
        customer_id = $1 AND
        page_id = $2
      AND
        status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
    )
    RETURNING * ;
    `;
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, bindings);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}

export async function getAudienceAndInsertOnNotExist(
  client: Pool,
  customerID: number,
  pageID: number,
  domain: AudienceDomainType | string,
  status: AudienceDomainStatus | string,
  readStatus: NotificationStatus,
): Promise<IAudience> {
  const columns = `id,customer_id,page_id,"domain",status,created_at,score,parent_id,
  updated_at,is_notify,last_platform_activity_date,user_id,notify_status,
  latest_sent_by,referral,last_incoming_date,is_offtime,last_send_offtime,
  user_open_id,user_close_id`;

  const whereCondition = `customer_id = $1
  AND page_id = $2
  AND status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')`;

  const SQL = `
    WITH cte AS (
      INSERT INTO audience ( 
        customer_id, 
        page_id, 
        "domain", 
        status,
        notify_status,
        last_platform_activity_date
      )
      SELECT
        $1, $2, $3, $4, $5, $6
      WHERE NOT EXISTS (
        SELECT
          *
        FROM
          audience
        WHERE
          ${whereCondition} 
      ) RETURNING *			
    )
    SELECT
      FALSE AS is_select,
      TRUE AS "isNew",
      ${columns}
    FROM
      cte
    UNION ALL
    SELECT
      TRUE AS is_select,
      FALSE AS "isNew",
      ${columns}
    FROM
      audience a
    WHERE
      ${whereCondition}
  `;
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, [customerID, pageID, domain, status, readStatus, getUTCTimestamps()]);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}

export async function toggleAudienceNotification(client: Pool, audienceID: number, pageID: number, isToggle: boolean): Promise<IAudience> {
  const SQL = 'UPDATE audience SET is_notify = $3 WHERE id = $1 AND page_id = $2 RETURNING *';
  const result = await PostgresHelper.execQuery(client, SQL, [audienceID, pageID, isToggle]);
  return Array.isArray(result) ? result[0] : {};
}
export async function toggleChildAudienceNotification(client: Pool, audienceID: number, pageID: number, isToggle: boolean): Promise<IAudience[]> {
  const SQL = "UPDATE audience SET is_notify = $3 WHERE domain = 'LEADS' AND status = 'FOLLOW' AND parent_id = $1 AND page_id = $2 RETURNING *";
  return await PostgresHelper.execQuery(client, SQL, [audienceID, pageID, isToggle]);
}

export async function setLastActivityPlatformDateByAudienceID(client: Pool, pageID: number, audienceID: number): Promise<IAudience[]> {
  const SQL = `
        UPDATE audience 
        SET last_platform_activity_date = $1 
        WHERE 
        page_id = $2 AND
        id =  $3
        RETURNING assignee_id "assigneeID" , *`;
  return await PostgresHelper.execQuery(client, SQL, [getUTCTimestamps(), pageID, audienceID]);
}
export async function setLastIncomingDateByAudienceID(client: Pool, pageID: number, audienceID: number, lastIncomingDate: string): Promise<IAudience[]> {
  const SQL = `
        UPDATE audience 
        SET last_incoming_date = $1 
        WHERE 
        page_id = $2 AND
        id =  $3
        RETURNING *`;
  return await PostgresHelper.execQuery(client, SQL, [lastIncomingDate, pageID, audienceID]);
}

// MESSAGE TEMPLATES
export async function addMessageTemplate(client: Pool, pageID: number, message: Message): Promise<any> {
  const queryUpdate = `UPDATE chat_templates
  SET messages = (select jsonb_build_object( 'text', :text :: text, 'shortcut', :shortcut ::text )::jsonb)
  WHERE page_id = :pageID and id = :id ;`;

  const queryAdd = `INSERT INTO chat_templates(messages, page_id, type)
    VALUES ((select jsonb_build_object( 'text', :text ::text, 'shortcut', :shortcut ::text)::jsonb), :pageID, 'MESSAGE');`;
  const query = message.id ? queryUpdate : queryAdd;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { ...message, pageID });
  try {
    return await PostgresHelper.execQuery<Socials>(client, sql, bindings);
  } catch (error) {
    if (error.constraint === 'chat_templates_un') throw new Error('err_add_alr_exist_msg_tpl');
  }
}

export async function deleteMessageTemplate(client: Pool, pageID: number, id: number): Promise<Socials[]> {
  const query = 'DELETE FROM chat_templates WHERE id = :id and page_id = :pageID ;';
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { id, pageID });
  return await PostgresHelper.execQuery<Socials[]>(client, sql, bindings);
}

// IMAGE SETS TEMPLATES
export async function addImageSets(client: Pool, pageID: number, images_set: ImageSetTemplateInput): Promise<any> {
  const query = `INSERT INTO chat_templates( ${images_set.id ? 'id ,' : ''} messages, page_id, type, shortcut )
    VALUES ( ${images_set.id ? ':id ,' : ''} :url , :pageID , 'IMAGE', :shortcut ) 
    ON CONFLICT ON CONSTRAINT chat_templates_pk 
    DO UPDATE SET messages =  :url , shortcut = :shortcut
    WHERE chat_templates.page_id = :pageID ${images_set.id ? 'and chat_templates.id = :id' : ''} ; `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, {
    ...(images_set.id && { id: images_set.id }),
    shortcut: images_set.shortcut || '',
    url: JSON.stringify(images_set.images),
    pageID,
  });

  try {
    const result = await PostgresHelper.execQuery<Socials>(client, sql, bindings);
    return result;
  } catch (error) {
    console.log('error', error);
    throw new Error('unknown_error');
  }
}

export async function deleteImageSets(client: Pool, pageID: number, id: number): Promise<IHTTPResult> {
  const query = 'DELETE FROM chat_templates WHERE id = :id and page_id = :pageID ;';
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { id, pageID });
  return await PostgresHelper.execQuery<IHTTPResult>(client, sql, bindings);
}

export async function deleteImageFromSet(client: Pool, pageID: number, set_id: number, image_index: number): Promise<IHTTPResult> {
  const query = ` UPDATE chat_templates SET messages  = (SELECT messages::jsonb - ${sanitizeSQL(
    String(image_index),
  )} FROM chat_templates WHERE id = :id ) WHERE id = :id and page_id = :pageID ;`;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { id: set_id, pageID });
  const result = await PostgresHelper.execQuery<IHTTPResult>(client, sql, bindings);
  return result;
}

export async function sendImageSet(token: string, FACEBOOK_MESSAGE_ATTACHMENT_URL: string, url: string, extension: string): Promise<any> {
  const fbURL = FACEBOOK_MESSAGE_ATTACHMENT_URL + token;
  const type = isImageByExtension(extension) ? 'image' : 'file';
  const result = await axiosPost(
    fbURL,
    JSON.stringify({
      message: {
        attachment: {
          type,
          payload: {
            is_reusable: true,
            url,
          },
        },
      },
    } as IAttachment),
  );
  return result;
}

export async function updateSocials(client: Pool, aliases: SocialsInput): Promise<void> {
  const query = `UPDATE pages
	SET social_facebook = :social_facebook, social_line = :social_line, social_shopee = :social_shopee, social_lazada = :social_lazada
  WHERE id = :pageID`;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  await PostgresHelper.execQuery(client, sql, bindings);
}

export async function deletePageChatTemplates(client: Pool, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID };
    const SQL = `
                  DELETE 
                  FROM chat_templates
                  WHERE 
                      page_id = :pageID 
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete Chat Templates successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export const getAgentsFromRedis = (CLIENT: RedisClient, key: string): Promise<IAgent[]> => {
  return new Promise((resolve, reject) => {
    CLIENT.lrange(key, 0, 19, (err, reply) => {
      resolve(reply.map((x) => JSON.parse(x)));
      if (err) {
        reject(err);
      }
    });
  });
};

export async function updateLatestSentBy(client: Pool, audienceID: number, pageID: number, isNotify: boolean, sentBy: MessageSentByEnum): Promise<void> {
  try {
    const bindings = {
      audienceID,
      pageID,
      isNotify,
      sentBy,
      updatedAt: getUTCTimestamps(),
    };
    const SQL = `
    UPDATE 
      audience 
    SET 
      latest_sent_by = :sentBy,
      is_notify = :isNotify,
      updated_at = :updatedAt
    WHERE 
      id = :audienceID 
    AND 
      page_id = :pageID`;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('updateLatestSentBy err [LOG]:--> ', err);
    throw err;
  }
}
export async function updateLastSendOffTime(client: Pool, audienceID: number, pageID: number): Promise<void> {
  try {
    const bindings = {
      audienceID,
      pageID,
      lastSendOfftime: getUTCTimestamps(),
      updatedAt: getUTCTimestamps(),
    };
    const SQL = `
    UPDATE 
      audience 
    SET 
      last_send_offtime = :lastSendOfftime,
      updated_at = :updatedAt
    WHERE 
      id = :audienceID 
    AND 
      page_id = :pageID`;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('updateLatestSentBy err [LOG]:--> ', err);
    throw err;
  }
}

export async function removeAudienceAssignee(client: Pool, pageID: number, audienceID: number): Promise<IAudience> {
  const bindings = {
    pageID,
    audienceID,
    userID: null,
    updatedAt: getUTCDayjs(),
  };
  const SQL = `
  UPDATE
    audience
  SET
    assignee_id = :userID,
    updated_at = :updatedAt
  WHERE 
    id = :audienceID AND
    page_id = :pageID
  RETURNING *
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result.length > 0 ? result[0] : null;
}

export async function setAudienceAssignee(client: Pool, pageID: number, { audienceID, userID }: { audienceID: number; userID: number }): Promise<IAudience> {
  const bindings = {
    pageID,
    audienceID,
    userID,
    updatedAt: getUTCDayjs(),
  };
  const SQL = `
    UPDATE
      audience
    SET
      assignee_id = :userID,
      updated_at = :updatedAt
    WHERE 
      id = :audienceID AND
      page_id = :pageID
    RETURNING *
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result.length > 0 ? result[0] : null;
}
