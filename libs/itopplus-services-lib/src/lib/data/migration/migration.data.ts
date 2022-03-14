import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumAuthScope, IUserCredential } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function migrateUserSocialScope(client: Pool): Promise<void> {
  const SQL = `
    SELECT U.* FROM USERS U
    LEFT JOIN (SELECT * FROM USERS_APP_MAPPINGS GROUP BY ID,APP_SCOPE,USER_ID ) UAM ON U.ID = UAM.USER_ID 
    WHERE UAM.APP_SCOPE IS NULL`;
  const users = await PostgresHelper.execQuery<IUserCredential[]>(client, SQL, []);
  console.log('users: ', users);
  for (let i = 0; i < users.length; i++) {
    const { id } = users[i];
    if (!isEmpty(id)) {
      const INSERT_SQL = 'INSERT INTO USERS_APP_MAPPINGS(app_scope,user_id) VALUES($1,$2)';
      await PostgresHelper.execQuery(client, INSERT_SQL, [EnumAuthScope.SOCIAL, id]);
    }
  }
}
