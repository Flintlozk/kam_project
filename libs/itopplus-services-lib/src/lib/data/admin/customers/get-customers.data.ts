import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICustoemrListFilter, ICustomerListAdmin } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export const getCustomersListAdmin = async (client: Pool, filters: ICustoemrListFilter): Promise<ICustomerListAdmin[]> => {
  const query = `
    WITH Data_CTE AS (
        SELECT 
            s.id "subscriptionID",
            s.status,
            s.plan_id "planID",
            s.expired_at "expiredAt",
            s.created_at "createdAt",
            s.current_balance::Integer "currentBalance" ,
            u.id "userID",
            u.name,
            u.email,
            u.tel 
        FROM subscriptions s
        INNER JOIN user_subscriptions_mapping usm ON usm.subscription_id = s.id
        INNER JOIN users u ON u.id = usm.user_id 
        WHERE 
          usm.ROLE = 'OWNER'
        ORDER BY
          s.created_at DESC
      ),
    Count_CTE AS (
      SELECT 
        CAST(COUNT(*) AS INT) AS TotalRows 
      FROM 
        Data_CTE
    ) 
    SELECT 
      * 
    FROM 
      Data_CTE 
    CROSS JOIN 
      Count_CTE
    OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { page: filters.page, pageSize: filters.pageSize });
  return await PostgresHelper.execQuery<ICustomerListAdmin[]>(client, sanitizeSQL(sql), bindings);
};
export const getCustomersListAdminBySearch = async (client: Pool, filters: ICustoemrListFilter): Promise<ICustomerListAdmin[]> => {
  const query = `
    WITH Data_CTE AS (
        SELECT 
            s.id "subscriptionID",
            s.status,
            s.plan_id "planID",
            s.expired_at "expiredAt",
            s.created_at "createdAt",
            s.current_balance::Integer "currentBalance" ,
            u.id "userID",
            u.name,
            u.email,
            u.tel 
        FROM subscriptions s
        INNER JOIN user_subscriptions_mapping usm ON usm.subscription_id = s.id
        INNER JOIN users u ON u.id = usm.user_id 
        WHERE 
          usm.ROLE = 'OWNER'
        AND
          (
            lower(u.name::varchar) LIKE :search OR
            lower(u.email::varchar) LIKE :search OR
            s.id::varchar LIKE :search OR
            u.tel::varchar LIKE :search
          )
        ORDER BY
          s.created_at DESC
      ),
    Count_CTE AS (
      SELECT 
        CAST(COUNT(*) AS INT) AS TotalRows 
      FROM 
        Data_CTE
    ) 
    SELECT 
      * 
    FROM 
      Data_CTE 
    CROSS JOIN 
      Count_CTE
    OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { page: filters.page, pageSize: filters.pageSize, search: filters.search });
  return await PostgresHelper.execQuery<ICustomerListAdmin[]>(client, sanitizeSQL(sql), bindings);
};
