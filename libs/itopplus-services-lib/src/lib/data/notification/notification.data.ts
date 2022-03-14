import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IAliases, INotification, ICountNotification, NotificationStatus, IAudience, IAllPageCountNotification } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function getNotificationInboxByPageID(client: Pool, aliases: IAliases): Promise<INotification[]> {
  try {
    const statements = `
        SELECT 
        au.id,
        au.page_id as "pageID",
        au.domain,
        au.status,
        au.is_notify,
        au.notify_status,
        au.last_platform_activity_date,
        pa.page_name pagename,
        tc.first_name, 
        tc.last_name,
        tc.profile_pic,
        tc.platform
        FROM audience au
        INNER JOIN pages pa ON au.page_id = pa.id 
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        WHERE 
        tc.active IS NOT false AND
        au.page_id = :pageID AND 
        au.parent_id IS NULL AND
        (tc.first_name IS NOT NULL OR tc.last_name IS NOT NULL)
        ORDER BY 
        au.last_platform_activity_date
        DESC
        NULLS LAST
        OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, aliases);
    const data = await PostgresHelper.execQuery<INotification[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCountNotificationInboxByPageID(client: Pool, aliases: IAliases): Promise<ICountNotification> {
  try {
    const statements = `
      SELECT 
      COUNT(*) total
      FROM audience au
      INNER JOIN temp_customers tc ON au.customer_id = tc.id
      WHERE 
      tc.active IS NOT false AND
      au.page_id = :pageID AND
      au.parent_id IS NULL AND
      au.notify_status = 'UNREAD'
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, aliases);
    const data = await PostgresHelper.execQuery<ICountNotification>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data[0] : 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAllPageCountNotificationInboxByPageID(client: Pool, subscriptionID: string): Promise<IAllPageCountNotification[]> {
  try {
    const statements = `
        SELECT 
          pa.id "pageID", 
          COUNT(au.id) total
        FROM audience au
        INNER JOIN pages pa ON au.page_id = pa.id
        INNER JOIN page_subscriptions_mappings psm ON psm.page_id = pa.id 
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        WHERE 
        tc.active IS NOT false AND
        psm.subscription_id = :subscriptionID AND 
        au.parent_id IS NULL AND
        au.notify_status = 'UNREAD'
        GROUP BY pa.id;
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { subscriptionID });
    const data = await PostgresHelper.execQuery<IAllPageCountNotification[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function setNotificationStatusByStatus(client: Pool, audienceID: number, pageID: number, status: NotificationStatus): Promise<IAudience> {
  try {
    const statements = `
      UPDATE audience
      SET
      notify_status = $1
      WHERE
      id = $2 AND
      page_id = $3
      RETURNING *
    `;
    const result = await PostgresHelper.execQuery<IAudience>(client, sanitizeSQL(statements), [status, audienceID, pageID]);
    return Array.isArray(result) ? result[0] : {};
  } catch (error) {
    throw new Error(error);
  }
}

export async function setAllNotificationStatusAsRead(client: Pool, pageID: number): Promise<void> {
  try {
    const statements = `
      UPDATE audience
      SET
      notify_status = $1
      WHERE
      page_id = $2
    `;
    await PostgresHelper.execQuery<IAudience>(client, sanitizeSQL(statements), [NotificationStatus.READ, pageID]);
  } catch (error) {
    throw new Error(error);
  }
}
