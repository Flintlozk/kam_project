import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumUserAppRole } from '@reactor-room/model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function addUserScopePermission(client: Pool, appScope: EnumAuthScope, userID: number): Promise<boolean> {
  const INSERT_SQL = 'INSERT INTO USERS_APP_MAPPINGS(app_scope,user_id) VALUES($1,$2) RETURNING *;';
  const result = await PostgresHelper.execQuery<any[]>(client, INSERT_SQL, [appScope, userID]);
  if (result.length > 0) return true;
  else return false;
}
export async function getUserScopePermission(client: Pool, userID: number): Promise<EnumAuthScope[]> {
  const INSERT_SQL = 'SELECT app_scope FROM USERS_APP_MAPPINGS WHERE user_id = $1';
  const result = await PostgresHelper.execQuery<EnumAuthScope[]>(client, INSERT_SQL, [userID]);
  if (result.length > 0) return result.map((x) => x['app_scope']);
  else return [];
}
export async function getAppRoleScopePermission(client: Pool, userID: number): Promise<EnumUserAppRole[]> {
  const INSERT_SQL = `
    SELECT *
    FROM  users_app_role u
    Where u.user_id = $1 ;
    `;
  const result = await PostgresHelper.execQuery<EnumAuthScope[]>(client, INSERT_SQL, [userID]);
  if (result.length > 0) return result.map((x) => x['role']);
  else return [];
}
