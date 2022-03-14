import { Pool } from 'pg';
import { IUserAppRole, IUserResponseData } from '@reactor-room/cms-models-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IUserCredential } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult, IInvitationEmail } from '@reactor-room/model-lib';

export async function getAllUserService(client: Pool): Promise<IUserResponseData[]> {
  try {
    const SQL = `
    SELECT u.name, u.email, ur."role"
    FROM users u 
    JOIN users_app_mappings um on u.id = um.user_id
    JOIN users_app_role ur on u.id = ur.user_id
    Where um.app_scope = 'ADMIN_CMS' 
          `;
    const { rows } = await client.query<IUserResponseData>(SQL);
    if (rows.length > 0) {
      return rows;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function craeteOrUpdateUser(client: Pool, email: string): Promise<IUserCredential> {
  try {
    const bindings = { email: email };
    const SQL = `
    INSERT INTO users(email,status)
    VALUES(:email,TRUE)
    ON CONFLICT (email)
    DO
      UPDATE SET status = TRUE
    RETURNING *;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const user = await PostgresHelper.execBatchTransaction<IUserCredential>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return user;
  } catch (e) {
    throw new Error(e);
  }
}

export async function craeteOrUpdateAppRole(client: Pool, role: string, id: number): Promise<IUserAppRole> {
  try {
    const bindings = { id: id, role: role };
    const SQL = `
    INSERT INTO users_app_role(user_id,role)
    VALUES (:id ,:role)
    ON CONFLICT (user_id)
    DO
      UPDATE SET role = :role
    RETURNING *;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const user = await PostgresHelper.execBatchTransaction<IUserAppRole>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return user;
  } catch (e) {
    throw new Error(e);
  }
}

export async function craeteAppMapping(client: Pool, id: number): Promise<IUserAppRole> {
  try {
    const bindings = { id: id };
    const SQL = `
    INSERT INTO users_app_mappings(user_id,app_scope) VALUES (:id ,'ADMIN_CMS') RETURNING *; 
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const user = await PostgresHelper.execBatchTransaction<IUserAppRole>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return user;
  } catch (e) {
    throw new Error(e);
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
