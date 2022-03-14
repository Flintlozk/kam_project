import { IUserCredential, IUserAndPage, IUserList, IUserAndTagsList, IUpsertUserTag, IUserEmail } from '@reactor-room/itopplus-model-lib';
import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';

export async function getUser(client: Pool, email: string): Promise<IUserCredential> {
  try {
    const bindings = { email: email.toLocaleLowerCase() };
    const SQL = `
                SELECT 
                  id,
                  sid,
                  name,
                  email,
                  tel, 
                  created_at,
                  updated_at,
                  status
                FROM 
                  users
                WHERE 
                  email = :email
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getUsers(client: Pool, pageID: number): Promise<IUserList[]> {
  try {
    const bindings = { pageID };
    const SQL = `
    SELECT 
      u.id::Integer as "userID", 
      u.name as "userName",
      u.profile_img as "userImage",
      upm.alias "userAlias",
      upm.role as "userRole",
      COALESCE (u.email,upm.email,null) as "userEmail",
      upm.notify_email as "userNotifyEmail"
    FROM users u 
    INNER JOIN user_page_mapping upm 
      ON u.id = upm.user_id 
    WHERE upm.page_id = :pageID
    AND upm.is_active IS TRUE
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUsersAndTags(client: Pool, pageID: number, tagID: number): Promise<IUserAndTagsList[]> {
  try {
    const bindings: { pageID: number; tagID: number } = { pageID, tagID };
    const SQL = `
    SELECT DISTINCT 
      u.id "userID",
      u."name" "userName" ,
      upm.alias "userAlias",
      u.profile_img as "userImage",
      ( 
        SELECT 
          utm2.active AS "isActive"
        FROM 
          user_tag_mapping utm2
          WHERE utm2.user_id = u.id 
          AND utm2.page_id = :pageID
          AND utm2.tag_id = :tagID
      )
    FROM users u 
    INNER JOIN user_page_mapping upm ON upm.user_id = u.id 
    WHERE upm.page_id = :pageID 
    AND upm.is_active IS TRUE
    ORDER BY u.id ASC;
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserAndTagsList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAudienceAssignee(client: Pool, pageID: number, audienceID: number): Promise<number> {
  const bindings = { pageID, audienceID };
  const SQL = `
    SELECT user_id FROM user_audiences_mapping
    WHERE audience_id = :audienceID
    AND page_id = :pageID
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<{ user_id: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (result.length > 0) {
    return result[0].user_id;
  } else {
    return -1;
  }
}
export async function deleteAudienceAssignedUser(client: Pool, pageID: number, audienceID: number): Promise<void> {
  const bindings = {
    pageID,
    audienceID,
  };
  const SQL = `
    DELETE FROM user_audiences_mapping
    WHERE
      audience_id = :audienceID
    AND 
      page_id = :pageID
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function assignUserToAudience(client: Pool, pageID: number, { audienceID, userID }: { audienceID: number; userID: number }): Promise<void> {
  const bindings = {
    pageID,
    audienceID,
    userID,
  };
  const SQL = `
    INSERT INTO user_audiences_mapping (
      page_id,
      audience_id,
      user_id
    ) VALUES (
      :pageID,
      :audienceID,
      :userID
    ) ON CONFLICT (audience_id) DO UPDATE SET user_id = :userID
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function upsertUserTag(client: Pool, { pageID, userID, tagID, isActive }: IUpsertUserTag): Promise<void> {
  const bindings: IUpsertUserTag = {
    pageID,
    userID,
    tagID,
    isActive,
  };
  const SQL = `
    INSERT INTO
      user_tag_mapping(
        page_id,
        user_id,
        tag_id,
        active
      )
    VALUES (
        :pageID,
        :userID,
        :tagID,
        :isActive
      )
    ON CONFLICT ON CONSTRAINT user_tag_mapping_unique
    DO UPDATE SET active = :isActive, updated_at = :updatedAt
    WHERE user_tag_mapping.page_id = :pageID
    AND user_tag_mapping.user_id = :userID
    AND user_tag_mapping.tag_id = :tagID
   `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { updatedAt: getUTCDayjs(), ...bindings });
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function getUserAndPages(client: Pool, userID: number, subsciptionID: string): Promise<IUserAndPage[]> {
  try {
    const bindings = { userID, subsciptionID };
    const SQL = `
            SELECT 
              u.id AS "userId",
              u.name AS "userName",
              u.profile_img AS "profileImg",
              p.id AS "pageId",
              p.page_name AS "pageName",
              p.page_username AS "pageUsername",
              p.option AS "pageOption",
              p.shop_picture AS "pagePicture",
              p.fb_page_id AS "fbPageID",
              upm.role as "pageRole",
              p.wizard_step as "wizardStep",
              (	
              	SELECT JSONB_AGG(
              		JSONB_BUILD_OBJECT(
                    'page_id',ps.page_id, 
                    'status',ps.status,
                    'setting_type',ps.setting_type,
                    'options',ps."options"
                  ) 
              	) FROM page_settings ps WHERE ps.page_id = p.id 
              ) AS "pageSettings",
              (
                SELECT jsonb_agg(pas.app_scope)
                FROM pages p2 
                INNER JOIN page_application_scopes pas ON p2.id = pas.page_id 
                WHERE p2.id = p.id
                GROUP BY pas.page_id
              ) as "pageAppScope"
            FROM 
              users u 
            INNER JOIN 
              user_page_mapping upm ON upm.user_id = u.id 
            INNER JOIN 
              pages p ON p.id  = upm.page_id
            INNER JOIN 
              page_subscriptions_mappings psm ON (psm.page_id = p.id)
            WHERE 
              u.id = :userID
            AND 
              upm.is_active = true
            AND
              psm.subscription_id = :subsciptionID
            ORDER BY p.created_at ASC

      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserAndPage[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserByID(client: Pool, userID: number): Promise<IUserCredential> {
  try {
    const bindings = { userID };
    const SQL = `
            SELECT u.* FROM users u 
            WHERE id = :userID

      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
}
export async function getUserByIDAndPageID(client: Pool, userID: number, pageID: number): Promise<IUserCredential> {
  try {
    const bindings = { userID, pageID };
    const SQL = `
            SELECT 
              u.*, 
              (
                SELECT alias 
                FROM user_page_mapping upm 
                WHERE upm.user_id = u.id 
                AND upm.page_id = :pageID
              ) alias
            FROM 
              users u
            WHERE 
              id = :userID
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
}

export function updateUserOTPToken(client: Pool, userID: number, token: string): Promise<IHTTPResult> {
  // TODO: Fix this
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IHTTPResult>(async (resolve, reject) => {
    try {
      const SQL = `
          UPDATE users
          SET
            token = $1
          WHERE
            id = $2
        `;
      await PostgresHelper.execQuery<[IHTTPResult]>(client, SQL, [token, userID]);

      const response: IHTTPResult = {
        status: 200,
        value: 'Update user token successfully!',
      };
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
}

export async function getUserByEmail(client: Pool, email: string): Promise<IUserCredential> {
  try {
    const bindings = { email: email.toLocaleLowerCase() };
    const SQL = `SELECT 
      id,
      sid,
      name,
      email,
      tel,
      created_at,
      updated_at,
      status
    FROM 
      users
    WHERE 
      email = :email
      LIMIT 1
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserByEmailOrEmailNotify(client: Pool, email: string, page_id: number): Promise<IUserCredential> {
  try {
    const bindings = { email: email.toLocaleLowerCase(), page_id };
    const SQL = `SELECT 
        us.id,
        us.sid,
        us.name,
        us.email,
        us.tel,
        us.created_at,
        us.updated_at,
        us.status
      FROM users us
      INNER JOIN user_page_mapping upm ON us.id = upm.user_id
      WHERE 
      (upm.notify_email = :email OR us.email = :email) AND
      upm.page_id = :page_id
      LIMIT 1
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserBySID(client: Pool, sid: string): Promise<IUserCredential> {
  try {
    const bindings = { sid };
    const SQL = `
                SELECT 
                  id,
                  sid,
                  name,
                  email,
                  tel, 
                  created_at,
                  updated_at,
                  status
                FROM 
                  users
                WHERE 
                  sid = :sid
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function setNewUserAndSubscription<T>(client: Pool, queries: string[], params: Array<Array<any>>) {
  return await PostgresHelper.execDynamicQueryTransaction(client, queries, params);
}

export async function createNewUser(client: Pool, sid: string, name: string, email: string, tel: string, profile_img: string): Promise<IUserCredential> {
  try {
    const bindings = { sid, name, email, tel, profile_img };
    const SQL = `
          INSERT INTO users (sid, name, email, tel, profile_img )
          VALUES (:sid, :name, :email, :tel, :profile_img)
          RETURNING *
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createNewUserFromInvitaion(client: Pool, email: string): Promise<IUserCredential> {
  try {
    const name = '';
    const tel = '';
    const bindings = { email: email.toLocaleLowerCase(), name, tel };
    const SQL = `
          INSERT INTO users (name, email, tel )
          VALUES (:name, :email, :tel)
          RETURNING *
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserCredential[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteUser(client: Pool, id: number): Promise<IHTTPResult> {
  try {
    const bindings = { id };
    const SQL = `
          DELETE FROM users WHERE id = :id
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete user successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateProfileUser(client: Pool, userID: number, img: string): Promise<IHTTPResult> {
  try {
    const bindings = { userID, img };
    const SQL = `
            UPDATE users
            SET
              profile_img = :img
            WHERE
              id = :userID
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update Profile Picture successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateUserPhoneNumberAndStatus(client: Pool, userID: number, tel: string): Promise<IHTTPResult> {
  // eslint-disable-next-line no-useless-catch
  try {
    const bindings = { status: true, userID, tel };
    const SQL = `
            UPDATE users
            SET
              tel = :tel,
              status = :status
            WHERE
              id = :userID
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update user phone number and status successfully!',
    };
    return response;
  } catch (err) {
    throw err;
  }
}

export async function getEmailOfCaseOwnerOnTrackByTag(client: Pool, pageID: number, audienceID: string): Promise<IUserEmail[]> {
  const bindings = { pageID };
  const SQL = `
      SELECT 
        u.id::integer "userID" ,
        a.id::integer "audienceID" ,
        COALESCE (upm.notify_email,upm.email,u.email,NULL) "email"
      FROM audience a 
      INNER JOIN customer_tag_mapping ctm ON a.customer_id = ctm.customer_id 
      INNER JOIN customer_tags ct ON ctm.tag_id = ct.id 
      INNER JOIN user_tag_mapping utm ON ctm.tag_id = utm.tag_id 
      INNER JOIN users u ON utm.user_id = u.id
      INNER JOIN user_page_mapping upm ON u.id = upm.user_id 
      WHERE a.id IN ${audienceID}
      AND upm.page_id = :pageID
      AND utm.active IS TRUE
      AND ct.active IS TRUE
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery<{ pageID: number }>(SQL, bindings);
  const result = await PostgresHelper.execQuery<IUserEmail[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (result.length > 0) return result;
  else return [];
}
export async function getEmailOfCaseOwnerOnTrackByAssignee(client: Pool, pageID: number, audienceID: string): Promise<IUserEmail[]> {
  const bindings = { pageID };
  const SQL = `
    SELECT 
      a.id "audienceID",
      u.id "userID",
      COALESCE (upm.notify_email,upm.email,u.email,NULL) "email"
    FROM audience a 
    INNER JOIN users u ON a.assignee_id = u.id
    INNER JOIN user_page_mapping upm ON u.id = upm.user_id 
    WHERE a.id IN ${audienceID}
    AND upm.page_id = :pageID 
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery<{ pageID: number }>(SQL, bindings);
  const result = await PostgresHelper.execQuery<IUserEmail[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (result.length > 0) return result;
  else return [];
}
