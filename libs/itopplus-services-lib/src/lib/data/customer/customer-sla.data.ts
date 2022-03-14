import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICustomerTagCounter, ICustomerTagSLA } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function getTaggedCustomerExceedSLATime(client: Pool, almostTime: string, exceedTime: string, pageID: number): Promise<ICustomerTagSLA[]> {
  try {
    const bindings = { almostTime, exceedTime, pageID };
    const SQL = `
            SELECT 
              ct.id,
              ct."name",
              ct.color ,
              (
                SELECT  
                  COUNT(a2.id)
                FROM  
                  audience a2 
                INNER JOIN
                  customer_tag_mapping ctm2 ON ctm2.tag_id = ct.id 
                INNER JOIN 
                  temp_customers tc2 ON tc2.id = a2.customer_id
                WHERE   
                  a2.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                AND
                  a2.domain NOT IN ('LEADS') 
                AND   
                  a2.page_id = :pageID
                AND   
                  a2.customer_id = ctm2.customer_id 
                AND
                  tc2.active IS TRUE
              )::Integer AS "total" ,
              (
                SELECT  
                  COUNT(a2.id)
                FROM  
                  audience a2 
                INNER JOIN
                  customer_tag_mapping ctm2 ON ctm2.tag_id = ct.id 
                INNER JOIN 
                  temp_customers tc2 ON tc2.id = a2.customer_id
                WHERE
                  a2.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                AND
                  a2.domain NOT IN ('LEADS')  
                AND
                  a2.last_incoming_date < :almostTime
                AND
                  a2.last_incoming_date > :exceedTime
                AND 
                  a2.latest_sent_by = 'AUDIENCE'
                AND   
                  a2.page_id = :pageID
                AND   
                  a2.customer_id = ctm2.customer_id 
                AND
                  tc2.active IS TRUE
              )::Integer AS "alert" ,
              (
                SELECT  
                  COUNT(a2.id)
                FROM  
                  audience a2 
                INNER JOIN
                  customer_tag_mapping ctm2 ON ctm2.tag_id = ct.id 
                INNER JOIN 
                  temp_customers tc2 ON tc2.id = a2.customer_id
                WHERE   
                  a2.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                AND
                  a2.domain NOT IN ('LEADS')    
                AND
                  a2.last_incoming_date < :almostTime
                AND
                  a2.last_incoming_date < :exceedTime
                AND 
                  a2.latest_sent_by = 'AUDIENCE'
                AND   
                  a2.page_id = :pageID
                AND   
                  a2.customer_id = ctm2.customer_id 
                AND
                  tc2.active IS TRUE
              )::Integer AS "customer" 
            FROM
              customer_tag_mapping ctm
            INNER JOIN
              customer_tags ct ON ct.id = ctm.tag_id 
            WHERE
              ctm.page_id = :pageID
            AND
              ctm.active = TRUE
            AND
              ct.active = TRUE
            GROUP BY 
              ct.id 
            ORDER BY 
              customer DESC;
                `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICustomerTagSLA[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (!isEmpty(data)) return data;
    return [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function countUntaggedCustomerExceedSLATime(client: Pool, almostTime: string, exceedTime: string, pageID: number): Promise<ICustomerTagCounter> {
  try {
    const bindings = { almostTime, exceedTime, pageID };
    const SQL = `
      SELECT
      (
        SELECT
          COUNT(a.id)::Integer AS "totalTag"
        FROM
          audience a
        INNER JOIN
          temp_customers tc ON a.customer_id = tc.id
        WHERE
          a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND a.page_id = :pageID
          AND tc.active IS TRUE
          AND a.customer_id NOT IN (
            SELECT
              ctm.customer_id
            FROM
              customer_tag_mapping ctm
            INNER JOIN customer_tags ct ON
              ctm.tag_id = ct.id
            WHERE
              ctm.page_id = :pageID
            AND ct.active IS TRUE
            AND ctm.active IS TRUE
          )
      ),
      (
        SELECT
          COUNT(a.id)::Integer AS "almostExceed"
        FROM
          audience a
        INNER JOIN
          temp_customers tc ON a.customer_id = tc.id
        WHERE
          a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND a.last_incoming_date < :almostTime
          AND a.last_incoming_date > :exceedTime
          AND a.latest_sent_by = 'AUDIENCE'
          AND a.page_id = :pageID
          AND tc.active IS TRUE
          AND a.customer_id NOT IN (
            SELECT
              ctm.customer_id
            FROM
              customer_tag_mapping ctm
            INNER JOIN customer_tags ct ON
              ctm.tag_id = ct.id
            WHERE
              ctm.page_id = :pageID
            AND ct.active IS TRUE
            AND ctm.active IS TRUE
          )
      ),
      (
        SELECT
          COUNT(a.id)::Integer AS "totalExceed"
        FROM
          audience a
        INNER JOIN
          temp_customers tc ON a.customer_id = tc.id
        WHERE
          a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND a.last_incoming_date < :almostTime
          AND a.last_incoming_date < :exceedTime
          AND a.latest_sent_by = 'AUDIENCE'
          AND a.page_id = :pageID
          AND tc.active IS TRUE
          AND a.customer_id NOT IN (
            SELECT
              ctm.customer_id
            FROM
              customer_tag_mapping ctm
            INNER JOIN customer_tags ct ON
              ctm.tag_id = ct.id
            WHERE
              ctm.page_id = :pageID
            AND ct.active IS TRUE
            AND ctm.active IS TRUE
          ) 
        )
      `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICustomerTagCounter[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (!isEmpty(data)) return data[0];
    return { totalExceed: 0, totalTag: 0, almostExceed: 0 };
  } catch (error) {
    throw new Error(error);
  }
}
export async function countTaggedCustomerExceedSLATime(client: Pool, almostTime: string, exceedTime: string, pageID: number): Promise<ICustomerTagCounter> {
  try {
    const bindings = { almostTime, exceedTime, pageID };

    const SQL = `
      SELECT
      (
        SELECT COUNT(a.id)::Integer AS "totalTag"
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
        AND a.domain NOT IN ('LEADS')
        AND a.page_id = :pageID
        AND tc.active IS TRUE
        AND a.customer_id IN (
          SELECT ctm.customer_id
          FROM customer_tag_mapping ctm
          INNER JOIN customer_tags ct ON ctm.tag_id = ct.id
          WHERE ctm.page_id = :pageID
          AND ct.active IS TRUE
          AND ctm.active IS TRUE
          )
        ),
      (
      SELECT COUNT(a.id)::Integer AS "almostExceed"
      FROM  audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
        AND a.domain NOT IN ('LEADS')
        AND a.last_incoming_date < :almostTime
        AND a.last_incoming_date > :exceedTime
        AND a.latest_sent_by = 'AUDIENCE'
        AND a.page_id = :pageID
        AND tc.active IS TRUE
        AND a.customer_id IN (
          SELECT  ctm.customer_id
          FROM customer_tag_mapping ctm
          INNER JOIN customer_tags ct ON ctm.tag_id = ct.id
          WHERE ctm.page_id = :pageID
          AND ct.active IS TRUE
          AND ctm.active IS TRUE
          )
        ),
      (
      SELECT COUNT(a.id)::Integer AS "totalExceed"
      FROM audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
        AND a.domain NOT IN ('LEADS')
        AND a.last_incoming_date < :almostTime
        AND a.last_incoming_date < :exceedTime
        AND a.latest_sent_by = 'AUDIENCE'
        AND a.page_id = :pageID
        AND tc.active IS TRUE
        AND a.customer_id IN (
          SELECT ctm.customer_id
          FROM customer_tag_mapping ctm          
          INNER JOIN customer_tags ct ON ctm.tag_id = ct.id
          WHERE ctm.page_id = :pageID
          AND ct.active IS TRUE
          AND ctm.active IS TRUE
        )
      )
      `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICustomerTagCounter[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (!isEmpty(data)) return data[0];
    return { totalExceed: 0, totalTag: 0, almostExceed: 0 };
  } catch (error) {
    throw new Error(error);
  }
}

export async function countCustomerExceedSLATime(client: Pool, exceedTime: string, pageID: number): Promise<{ count: number }> {
  try {
    const bindings = { exceedTime, pageID };
    const SQL = `
            SELECT COUNT(a.id)::Integer 
            FROM audience a 
            INNER JOIN temp_customers tc ON a.customer_id = tc.id
            WHERE
              a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
            AND a.domain NOT IN ('LEADS')
            AND a.last_incoming_date < :exceedTime
            AND a.latest_sent_by = 'AUDIENCE'
            AND a.page_id = :pageID
            AND tc.active IS TRUE
                `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<{ count: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (!isEmpty(data)) return data[0];
    return { count: 0 };
  } catch (error) {
    throw new Error(error);
  }
}

export async function dynamicCountCustomeSLA(client: Pool, pageIDs: string, bindings: { [name: string]: string | number }, statement: string): Promise<{ [name: string]: number }> {
  const SQL = `
    SELECT 
      ${statement}
    FROM 
      pages p 
    WHERE 
      p.id IN ${pageIDs} 
    LIMIT 1
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<{ [name: string]: number }[0]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(data)) return data[0];
  return null;
}

export async function countAssignedCustomerExceedSLATime(client: Pool, almostTime: string, exceedTime: string, pageID: number): Promise<ICustomerTagCounter> {
  try {
    const bindings = { almostTime, exceedTime, pageID };

    const SQL = `
      SELECT
      SUM((
        SELECT COUNT(a.id)::Integer AS "totalTag"
        FROM audience a 
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND tc.active IS TRUE
          AND a.assignee_id IS NOT NULL
          AND a.page_id = :pageID
      ))::Integer AS "totalTag",
      SUM((
        SELECT COUNT(a.id)::Integer AS "almostExceed"
        FROM audience a 
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND tc.active IS TRUE
          AND a.assignee_id IS NOT NULL
          AND a.last_incoming_date < :almostTime
          AND a.last_incoming_date > :exceedTime
          AND a.latest_sent_by = 'AUDIENCE'
          AND a.page_id = :pageID
      ))::Integer AS "almostExceed",
      SUM((
        SELECT COUNT(a.id)::Integer AS "totalExceed"
        FROM audience a 
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND tc.active IS TRUE
          AND a.assignee_id IS NOT NULL
          AND a.last_incoming_date < :almostTime
          AND a.last_incoming_date < :exceedTime
          AND a.latest_sent_by = 'AUDIENCE'
          AND a.page_id = :pageID
      ))::Integer AS "totalExceed"
      `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICustomerTagCounter[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    if (!isEmpty(data)) return data[0];
    return { totalExceed: 0, totalTag: 0, almostExceed: 0 };
  } catch (error) {
    throw new Error(error);
  }
}
export async function countUnassignedCustomerExceedSLATime(client: Pool, almostTime: string, exceedTime: string, pageID: number): Promise<ICustomerTagCounter> {
  try {
    const bindings = { almostTime, exceedTime, pageID };

    const SQL = `
      SELECT
      SUM((
        SELECT COUNT(a.id)::Integer AS "totalTag"
        FROM audience a 
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND tc.active IS TRUE
          AND a.assignee_id IS NULL
          AND a.page_id = :pageID
      ))::Integer AS "totalTag",
      SUM((
        SELECT COUNT(a.id)::Integer AS "almostExceed"
        FROM audience a 
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND tc.active IS TRUE
          AND a.assignee_id IS NULL
          AND a.last_incoming_date < :almostTime
          AND a.last_incoming_date > :exceedTime
          AND a.latest_sent_by = 'AUDIENCE'
          AND a.page_id = :pageID
      ))::Integer AS "almostExceed",
      SUM((
        SELECT COUNT(a.id)::Integer AS "totalExceed"
        FROM audience a 
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        WHERE a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
          AND a.domain NOT IN ('LEADS')
          AND tc.active IS TRUE
          AND a.assignee_id IS NULL
          AND a.last_incoming_date < :almostTime
          AND a.last_incoming_date < :exceedTime
          AND a.latest_sent_by = 'AUDIENCE'
          AND a.page_id = :pageID
      ))::Integer AS "totalExceed"
      `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICustomerTagCounter[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    if (!isEmpty(data)) return data[0];
    return { totalExceed: 0, totalTag: 0, almostExceed: 0 };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAssigneeCustomerExceedSLATime(client: Pool, almostTime: string, exceedTime: string, pageID: number): Promise<ICustomerTagSLA[]> {
  try {
    const bindings = { almostTime, exceedTime, pageID };
    const SQL = `
                SELECT 
                u.id,
                COALESCE(upm.alias,u."name") AS "name",
                u.profile_img AS "profileImg",
                'CODE_53B1FF' AS "color",
                (
                  SELECT COUNT(a2.id)::Integer
                  FROM audience a2
                  INNER JOIN temp_customers tc2 ON tc2.id = a2.customer_id
                  WHERE a2.assignee_id = u.id
                  AND a2.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                  AND a2.domain NOT IN ('LEADS') 
                  AND a2.page_id = :pageID
                  AND tc2.active IS TRUE
                ) AS "total",
                (
                  SELECT COUNT(a2.id)::Integer
                  FROM audience a2
                  INNER JOIN temp_customers tc2 ON tc2.id = a2.customer_id
                  WHERE a2.assignee_id = u.id
                  AND a2.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                  AND a2.domain NOT IN ('LEADS') 
                  AND a2.last_incoming_date < :almostTime
                  AND a2.last_incoming_date > :exceedTime
                  AND a2.latest_sent_by = 'AUDIENCE'
                  AND a2.page_id = :pageID
                  AND tc2.active IS TRUE
                ) AS "alert",
                (
                  SELECT COUNT(a2.id)::Integer
                  FROM audience a2
                  INNER JOIN temp_customers tc2 ON tc2.id = a2.customer_id
                  WHERE a2.assignee_id = u.id
                  AND a2.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                  AND a2.domain NOT IN ('LEADS') 
                  AND a2.last_incoming_date < :almostTime
                  AND a2.last_incoming_date < :exceedTime
                  AND a2.latest_sent_by = 'AUDIENCE'
                  AND a2.page_id = :pageID
                  AND tc2.active IS TRUE
                ) AS "customer"
                FROM users u
                INNER JOIN user_page_mapping upm ON u.id = upm.user_id 
                WHERE upm.page_id = :pageID
                AND upm.is_active IS TRUE
                GROUP BY upm.alias,u.id
                ORDER BY customer DESC
                `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICustomerTagSLA[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (!isEmpty(data)) return data;
    return [];
  } catch (error) {
    throw new Error(error);
  }
}
