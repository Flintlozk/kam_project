import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICount, IHTTPResult, IInvitationEmail } from '@reactor-room/model-lib';
import { EnumPageMemberType, IPageMappingDB, IPageMemberModel, IPageMemberToken, IUserPageMapInput } from '@reactor-room/itopplus-model-lib';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';

export async function getPageMembersByPageID(client: Pool, pageID: number): Promise<IPageMemberModel[]> {
  try {
    const bindings = { pageID };
    const SQL = `
            SELECT 
              upm.id, 
              upm.user_id, 
              upm.page_id, 
              upm.role, 
              u.name, 
              u.email, 
              upm.alias,
              upm.is_active,
              upm.notify_email 
            FROM user_page_mapping upm
            INNER JOIN users u ON upm.user_id = u.id
            WHERE upm.page_id = :pageID
            ORDER BY upm.created_at ASC
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data;
    return [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageMembersByPageIDandUserIDs(client: Pool, pageID: number, IDs: string): Promise<IPageMemberModel[]> {
  try {
    const bindings = { pageID };
    const SQL = `
            SELECT 
              upm.id, 
              upm.user_id, 
              upm.page_id, 
              upm.role, 
              u.name, 
              u.email, 
              upm.alias,
              upm.is_active 
            FROM user_page_mapping upm
            INNER JOIN users u ON upm.user_id = u.id
            WHERE upm.page_id = :pageID
            AND u.id IN ${IDs}
            ORDER BY upm.created_at ASC
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data;
    return [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageMemberNonUserByPageID(client: Pool, pageID: number): Promise<IPageMemberModel[]> {
  try {
    const bindings = { pageID };
    const SQL = `
            SELECT * 
            FROM user_page_mapping upm
            WHERE upm.page_id = :pageID
            AND upm.user_id IS NULL
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) return data;
    return [];
  } catch (error) {
    throw new Error(error);
  }
}
export async function getPageMembersAmountByPageID(client: Pool, pageID: number): Promise<{ amount_of_users: number }> {
  try {
    const bindings = { pageID };
    const SQL = `
      SELECT COUNT(upm.user_id)::int as amount_of_users
      FROM user_page_mapping upm
      WHERE upm.page_id = :pageID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const [data] = await PostgresHelper.execQuery<[{ amount_of_users: number }]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageMemberByPageIDAndUserID(client: Pool, pageID: number, userID: number): Promise<IPageMemberModel> {
  try {
    const bindings = { pageID, userID };
    const SQL = `
            SELECT upm.id, upm.user_id, upm.page_id, upm.role, u.name, u.email, upm.is_active 
            FROM user_page_mapping upm
            INNER JOIN users u On (u.id = :userID)
            WHERE upm.page_id = :pageID
            AND upm.user_id = :userID
            `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageMemberByPageIDAndEmail(client: Pool, pageID: number, email: string): Promise<IPageMemberModel> {
  try {
    const bindings = { pageID, email };
    const SQL = `
            SELECT *
            FROM user_page_mapping upm
            WHERE upm.page_id = :pageID
            AND upm.email = :email
            `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function sendInvitationEmail(invitationEmail: IInvitationEmail, transporter): Promise<IHTTPResult> {
  await transporter.sendMail(invitationEmail);
  try {
    const res: IHTTPResult = {
      status: 200,
      value: 'Send invitaion email successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePageMember(client: Pool, id: number, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, id };
    const SQL = `
            DELETE FROM user_page_mapping WHERE user_id = :id
            AND page_id = :pageID
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 200,
      value: 'Delete shop member successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePageMemberByEmailAndPage(client: Pool, email: string, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, email };
    const SQL = `
            DELETE FROM user_page_mapping WHERE email = :email
            AND page_id = :pageID
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 200,
      value: 'Delete shop member successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createUserPageTokenMapping(client: Pool, userID: number, pageID: number, email: string, token: string): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, userID, email, token };
    const SQL = `
          INSERT INTO user_page_token_mappings (user_id, page_id, email, token )
          VALUES (:userID, :pageID, :email, :token)
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 201,
      value: 'Create user page token mapping successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createNoneUserPageTokenMapping(client: Pool, pageID: number, email: string, token: string): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, email, token };
    const SQL = `
          INSERT INTO user_page_token_mappings ( page_id, email, token )
          VALUES (:pageID, :email, :token)
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 201,
      value: 'Create user page token mapping successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export function createPageMemberToken(fromEmail: string, pageMember: IUserPageMapInput, toEmail: string, tokenKey: string): Promise<IHTTPResult> {
  try {
    return new Promise<IHTTPResult>((resolve) => {
      const payload = {
        from: fromEmail,
        user_id: pageMember.user_id,
        page_id: pageMember.page_id,
        email: toEmail,
        role: pageMember.role,
      };
      const token = jwt.sign(payload, tokenKey, {});
      resolve({ value: token, status: 200 } as IHTTPResult);
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageMemberTokenByPageIDAndUserID(client: Pool, pageID: number, userID: number): Promise<IPageMemberToken> {
  try {
    const bindings = { userID, pageID };
    const SQL = `
            SELECT * 
            FROM user_page_token_mappings uptm
            WHERE uptm.page_id = :pageID 
            AND uptm.user_id = :userID
            LIMIT 1;
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberToken[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageMemberTokenByPageIDAndUserEmail(client: Pool, pageID: number, email: string): Promise<IPageMemberToken> {
  try {
    const bindings = { email, pageID };
    console.log('USERID: ', email);
    console.log('pageID: ', pageID);
    const SQL = `
            SELECT * 
            FROM user_page_token_mappings uptm
            WHERE uptm.page_id = :pageID 
            AND uptm.email = :email
            LIMIT 1;
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMemberToken[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePageMemberToken(client: Pool, id: number): Promise<IHTTPResult> {
  try {
    const bindings = { id };
    const SQL = `
            DELETE FROM user_page_token_mappings WHERE id = :id
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 200,
      value: 'Delete shop member token successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function activePageMember(client: Pool, id: number, userID: number, status): Promise<IHTTPResult> {
  try {
    const bindings = { id, userID, status };
    const SQL = `
          UPDATE user_page_mapping 
          SET
            is_active = :status,
            user_id = :userID
          WHERE id = :id
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 201,
      value: 'Update shop member status successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
export async function setPageMemeberAlias(client: Pool, pageID: number, userID: number, alias: string): Promise<void> {
  try {
    const bindings = { pageID, userID, alias, updatedAt: getUTCDayjs() };
    const SQL = `
          UPDATE user_page_mapping 
          SET
            alias = :alias,
            updated_at = :updatedAt
          WHERE user_id = :userID
          AND page_id = :pageID
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    throw new Error(error);
  }
}
export async function setPageMemberNotifyEmail(client: Pool, pageID: number, userID: number, email: string): Promise<void> {
  try {
    const bindings = { pageID, userID, email, updatedAt: getUTCDayjs() };
    const SQL = `
          UPDATE user_page_mapping 
          SET
            notify_email = :email,
            updated_at = :updatedAt
          WHERE user_id = :userID
          AND page_id = :pageID
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    throw new Error(error);
  }
}
export async function setPageMemberRole(client: Pool, pageID: number, userID: number, role: EnumPageMemberType): Promise<void> {
  try {
    const bindings = { pageID, userID, role, updatedAt: getUTCDayjs() };
    const SQL = `
        UPDATE user_page_mapping 
        SET 
          role = :role,
          updated_at = :updatedAt
        WHERE user_id = :userID
        AND page_id = :pageID
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    throw new Error(error);
  }
}
export async function getPageMemberCountByPageID(client: Pool, pageID: number): Promise<ICount> {
  try {
    const bindings = { pageID };
    const SQL = `
      SELECT 
          count(user_id) 
      FROM 
          user_page_mapping 
      WHERE 
          page_id = :pageID
      GROUP BY
          user_id
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data: any = await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data?.length) {
      return data[0];
    }
    return { count: 0 } as ICount;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getPageMappingData(pageID: number, userID: number, client: Pool): Promise<IPageMappingDB> {
  try {
    const bindings = { userID, pageID };
    const SQL = `
                SELECT
                      id,
                      user_id ,
                      page_id ,
                      role,
                      is_active
                FROM
                      user_page_mapping
                WHERE
                      page_id = :pageID
                      AND user_id = :userID
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageMappingDB[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(data) ? data[0] : null;
  } catch (error) {
    throw new Error(error);
  }
}
