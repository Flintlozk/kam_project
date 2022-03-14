import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AllSubscriptionClosedReasonInput,
  AllSubscriptionSLAAllSatff,
  AllSubscriptionSLAStatisiticInput,
  EnumWizardStepType,
  IAllSubscriptionClosedReason,
  IAllSubscriptionFilter,
  IAllSubscriptionSLAAllSatff,
  IAllSubscriptionSLAStatisitic,
  IPageListOnMessageTrackMode,
  PageSettingType,
  SLAFilterType,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export const getAllPageIDsUnderGiveSubscriptionID = async (client: Pool, { subscriptionID }: { subscriptionID: string }): Promise<{ page_id: number }[]> => {
  const query = { subscriptionID };
  const statements = `
    SELECT 
        psm.page_id 
    FROM
        subscriptions s
    INNER JOIN page_subscriptions_mappings psm ON
        s.id = psm.subscription_id
    WHERE
        s.id = :subscriptionID
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<{ subscriptionID: string }>(statements, query);
  return await PostgresHelper.execQuery<{ page_id: number }[]>(client, sanitizeSQL(sql), bindings);
};

export const getAllSubscriptionSLAStatisiticData = async (
  client: Pool,
  { subscriptionID, startDate, endDate, dynamicParams, statementOver, isActiveSLA }: AllSubscriptionSLAStatisiticInput,
  filters: IAllSubscriptionFilter,
  groupPageIDs: string,
): Promise<IAllSubscriptionSLAStatisitic> => {
  const query = { subscriptionID, startDate, endDate, ...dynamicParams, pageID: filters.pageID };
  const filterTypeCondition = filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND a2.page_id = :pageID' : `AND a2.page_id IN ${groupPageIDs}`;
  const statements = `
    SELECT
        SUM(
                ( 
                    SELECT COUNT(a2.id)::Integer 
                    FROM audience a2 
                    WHERE a2.page_id = p.id 
                    AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED') 
                    AND a2."domain" NOT IN ('LEADS') 
                    ${filterTypeCondition}
                )
            ) AS "totalCase",
        SUM(
                ( 
                    SELECT COUNT(a2.id)::Integer 
                    FROM audience a2 
                    WHERE a2.page_id = p.id 
                    AND a2."domain" NOT IN ('LEADS')
                    ${filterTypeCondition}
                    AND created_at BETWEEN :startDate 
                    AND :endDate
                )
            ) AS "todayCase",
        SUM(
              ( 
                  SELECT COUNT(a2.id)::Integer 
                  FROM audience a2 
                  WHERE a2.page_id = p.id 
                  AND a2.status IN ('EXPIRED', 'REJECT', 'CLOSED') 
                  ${filterTypeCondition}
                  AND updated_at BETWEEN :startDate 
                  AND :endDate
                )
            ) AS "closedCaseToday",
        ${
          isActiveSLA
            ? `SUM( 
          ( 
            SELECT COUNT(a2.id)::Integer
            FROM
              audience a2
            INNER JOIN temp_customers tc2 ON
              a2.customer_id = tc2.id
            WHERE
              CASE ${statementOver}
              END
            AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
            AND a2.domain NOT IN ('LEADS')
            AND a2.latest_sent_by = 'AUDIENCE'
            ${filterTypeCondition}
            AND tc2.active IS TRUE	
          )
        ) AS "onProcessOverSla"`
            : '0 AS "onProcessOverSla"'
        }
    FROM
        subscriptions s
    INNER JOIN page_subscriptions_mappings psm ON
        s.id = psm.subscription_id
    INNER JOIN pages p ON
        psm.page_id = p.id
    WHERE
        s.id = :subscriptionID
        ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND p.id = :pageID' : `AND p.id IN ${groupPageIDs}`}
        AND p.wizard_step = '${EnumWizardStepType.SETUP_SUCCESS}';
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<AllSubscriptionSLAStatisiticInput>(statements, query);
  const data = await PostgresHelper.execQuery<IAllSubscriptionSLAStatisitic[]>(client, sanitizeSQL(sql), bindings);
  return data.length > 0 ? data[0] : null;
};

export const getAllSubscriptionClosedReasonData = async (
  client: Pool,
  { subscriptionID, startDate, endDate }: AllSubscriptionClosedReasonInput,
  filters: IAllSubscriptionFilter,
  pageIDs: string,
): Promise<IAllSubscriptionClosedReason[]> => {
  const query = { subscriptionID, pageID: filters.pageID, startDate, endDate };
  const statements = `
    SELECT 
        acrm.reason_id AS "reasonID", 
        COUNT(acrm.id)::Integer AS total , 
        ccr.reason,
        p.id AS "pageID",
        p.page_name as "pageName"
    FROM audience_closed_reason_mapping acrm 
    INNER JOIN customer_closed_reason ccr ON acrm.reason_id = ccr.id 
    INNER JOIN pages p ON ccr.page_id = p.id 
    INNER JOIN page_subscriptions_mappings psm ON psm.page_id = p.id
    WHERE 
      psm.subscription_id = :subscriptionID
      AND acrm.created_at BETWEEN :startDate AND :endDate
      ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND p.id = :pageID' : `AND p.id IN ${pageIDs}`}
    GROUP BY acrm.reason_id , ccr.reason,p.id 
    ORDER BY total DESC
    LIMIT 15
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<AllSubscriptionClosedReasonInput>(statements, query);
  return await PostgresHelper.execQuery<IAllSubscriptionClosedReason[]>(client, sanitizeSQL(sql), bindings);
};
export const getAllSubscriptionSLAAllSatff = async (
  client: Pool,
  { subscriptionID, startDate, endDate, dynamicParams, statementAlmost, statementOver, isActiveSLA }: AllSubscriptionSLAAllSatff,
  filters: IAllSubscriptionFilter,
  groupPageIDs: string,
): Promise<IAllSubscriptionSLAAllSatff[]> => {
  const query = { subscriptionID, startDate, endDate, ...dynamicParams, pageID: filters.pageID };
  const filterTypeCondition = filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND a2.page_id = :pageID' : `AND a2.page_id IN ${groupPageIDs}`;
  const statements = `
  SELECT
    ct.id AS "tagID",
    ct.name AS "tagName",
    psm.page_id AS "pageID",
    (
      SELECT
        count(a2.id)::Integer AS "totalOnProcess"
      FROM
        audience a2
      INNER JOIN customer_tag_mapping ctm2 ON
        ct.page_id = ctm2.page_id
      WHERE
        a2.customer_id = ctm2.customer_id
        AND ctm2.page_id = psm.page_id
        AND ctm2.tag_id = ct.id
        AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
        AND a2."domain" NOT IN ('LEADS') 
        ${filterTypeCondition}
    ) AS "totalOnProcess",
    (
      SELECT
        count(a2.id)::Integer AS "todayClosed"
      FROM
        audience a2
      INNER JOIN customer_tag_mapping ctm2 ON
        ct.page_id = ctm2.page_id
      WHERE
        a2.customer_id = ctm2.customer_id
        AND ctm2.page_id = psm.page_id
        AND ctm2.tag_id = ct.id
        AND a2.status IN ('EXPIRED', 'REJECT', 'CLOSED')
        AND a2.updated_at BETWEEN :startDate AND :endDate
        ${filterTypeCondition}
    ) AS "todayClosed",
    (
      SELECT
        ARRAY_AGG(jsonb_build_object('userID', sub_u.id, 'name', sub_u.name, 'picture', sub_u.profile_img)) AS "users"
      FROM
        user_tag_mapping sub_utm
      INNER JOIN users sub_u ON
        sub_utm.user_id = sub_u.id
      WHERE
        sub_utm.tag_id = ct.id
        AND sub_utm.active IS TRUE
    ) AS "users",
    ${
      isActiveSLA
        ? `
            (SELECT
                COUNT(a2.id)::Integer
              FROM
                audience a2
              INNER JOIN customer_tag_mapping ctm2 ON
                ctm2.customer_id = a2.customer_id
              INNER JOIN temp_customers tc2 ON
                a2.customer_id = tc2.id
              WHERE
                CASE ${statementAlmost}
                END
                ${filterTypeCondition}
                AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
                AND a2.domain NOT IN ('LEADS')
                AND ctm2.tag_id = ct.id
                AND a2.latest_sent_by = 'AUDIENCE'
                AND tc2.active IS TRUE 
            ) AS "almostSLA",
            (SELECT
                COUNT(a2.id)::Integer
              FROM
                audience a2
              INNER JOIN customer_tag_mapping ctm2 ON
                ctm2.customer_id = a2.customer_id
              INNER JOIN temp_customers tc2 ON
                a2.customer_id = tc2.id
              WHERE
                CASE ${statementOver}
                END
                ${filterTypeCondition}
                AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
                AND a2.domain NOT IN ('LEADS')
                AND ctm2.tag_id = ct.id
                AND a2.latest_sent_by = 'AUDIENCE'
                AND tc2.active IS TRUE 
            ) AS "overSLA"
        `
        : `
            0::Integer AS "almostSLA",
            0::Integer AS "overSLA"
          `
    }
  FROM
    customer_tags ct
  INNER JOIN customer_tag_mapping ctm ON
    ct.id = ctm.tag_id
  INNER JOIN page_subscriptions_mappings psm ON
    ctm.page_id = psm.page_id
  WHERE
    ct.active IS TRUE
    AND psm.subscription_id = :subscriptionID
    ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND ctm.page_id = :pageID' : `AND ctm.page_id IN ${groupPageIDs}`}
  GROUP BY
    ct.id,
    ct.name,
    psm.page_id
  ORDER BY "overSLA" DESC
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<AllSubscriptionSLAAllSatff>(statements, query);
  const result = await PostgresHelper.execQuery<IAllSubscriptionSLAAllSatff[]>(client, sanitizeSQL(sql), bindings);
  return result;
};
export const getAllSubscriptionUnassignedSLAAllStaff = async (
  client: Pool,
  { subscriptionID, startDate, endDate, dynamicParams, statementAlmost, statementOver, isActiveSLA }: AllSubscriptionSLAAllSatff,
  filters: IAllSubscriptionFilter,
  groupPageIDs: string,
): Promise<IAllSubscriptionSLAAllSatff[]> => {
  const query = { subscriptionID, startDate, endDate, ...dynamicParams, pageID: filters.pageID };
  const filterTypeCondition = filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND a2.page_id = :pageID' : `AND a2.page_id IN ${groupPageIDs}`;
  const statements = `
  WITH Data_CTE AS (
    SELECT ctm2.customer_id
    FROM  customer_tag_mapping ctm2
    INNER JOIN page_subscriptions_mappings psm2 ON ctm2.page_id = psm2.page_id
    INNER JOIN customer_tags ct ON ctm2.tag_id = ct.id
    WHERE psm2.subscription_id = :subscriptionID
    AND ct.active IS TRUE
    ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND ct.page_id = :pageID' : `AND ct.page_id IN ${groupPageIDs}`}
    GROUP BY ctm2.customer_id
  )
  SELECT 
      SUM((
        SELECT count(a2.id)::Integer AS "totalOnProcess"
        FROM audience a2
        INNER JOIN page_subscriptions_mappings psm2 ON a2.page_id = psm2.page_id 
        WHERE
        psm2.subscription_id = :subscriptionID
        AND psm2.page_id = psm.page_id
        AND	a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
        AND a2."domain" NOT IN ('LEADS')
        AND a2.customer_id NOT IN (SELECT * FROM Data_CTE)
        ${filterTypeCondition}
      )::Integer) AS "totalOnProcess",
      SUM((
        SELECT count(a2.id)::Integer AS "todayClosed"
        FROM audience a2
        INNER JOIN page_subscriptions_mappings psm2 ON a2.page_id = psm2.page_id 
        WHERE
          psm2.subscription_id = :subscriptionID
          AND psm2.page_id = psm.page_id 
          AND a2.status IN ('EXPIRED', 'REJECT', 'CLOSED')
          AND a2.updated_at BETWEEN :startDate AND :endDate 
          AND a2.customer_id NOT IN (SELECT * FROM Data_CTE)
          ${filterTypeCondition}
      )::Integer) AS "todayClosed",
      ${
        isActiveSLA
          ? `
      SUM((
        SELECT COUNT(a2.id)::Integer
        FROM audience a2
        INNER JOIN page_subscriptions_mappings psm2 ON a2.page_id = psm2.page_id 
        WHERE
          CASE ${statementAlmost}
          END
          AND	psm2.subscription_id = :subscriptionID
          AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
          AND a2.domain NOT IN ('LEADS')
          AND a2.latest_sent_by = 'AUDIENCE'
          AND a2.customer_id NOT IN (SELECT * FROM Data_CTE)
          ${filterTypeCondition}
      )::Integer) AS "almostSLA",
      SUM((
        SELECT COUNT(a2.id)::Integer
        FROM audience a2
        INNER JOIN page_subscriptions_mappings psm2 ON a2.page_id = psm2.page_id 
        WHERE
          CASE ${statementOver}
          END
          AND	psm2.subscription_id = :subscriptionID
          AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
          AND a2.domain NOT IN ('LEADS')
          AND a2.latest_sent_by = 'AUDIENCE'
          AND a2.customer_id NOT IN (SELECT * FROM Data_CTE)
          ${filterTypeCondition}
      )::Integer) AS "overSLA"
      `
          : `
              SUM(0::Integer) AS "almostSLA",
              SUM(0::Integer) AS "overSLA"
            `
      }
    FROM page_subscriptions_mappings psm
    WHERE
      psm.subscription_id = :subscriptionID
      ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND psm.page_id = :pageID' : `AND psm.page_id IN ${groupPageIDs}`}
  `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<AllSubscriptionSLAAllSatff>(statements, query);
  const result = await PostgresHelper.execQuery<IAllSubscriptionSLAAllSatff[]>(client, sanitizeSQL(sql), bindings);
  return result;
};

export const getAllSubscriptionSLAStatisiticByAssigneeData = async (
  client: Pool,
  { subscriptionID, startDate, endDate, dynamicParams, statementAlmost, statementOver, isActiveSLA }: AllSubscriptionSLAStatisiticInput,
  filters: IAllSubscriptionFilter,
  pageIDs: string,
): Promise<IAllSubscriptionSLAStatisitic> => {
  const query = { subscriptionID, startDate, endDate, ...dynamicParams, pageID: filters.pageID };

  const filterTypeCondition = filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND a2.page_id = :pageID' : `AND a2.page_id IN ${pageIDs}`;
  const statements = `
    SELECT
        SUM(
                ( 
                    SELECT COUNT(a2.id)::Integer 
                    FROM audience a2 
                    INNER JOIN temp_customers sub_tc ON a2.customer_id = sub_tc.id
                    WHERE a2.page_id = p.id 
                    ${filterTypeCondition}
                    AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED') 
                    AND a2."domain" NOT IN ('LEADS') 
                    AND sub_tc.active IS TRUE	
                )
            ) AS "totalCase",
        SUM(
                ( 
                    SELECT COUNT(a2.id)::Integer 
                    FROM audience a2 
                    INNER JOIN temp_customers sub_tc ON a2.customer_id = sub_tc.id
                    WHERE a2.page_id = p.id 
                    ${filterTypeCondition}
                    AND a2."domain" NOT IN ('LEADS')
                    AND a2.created_at BETWEEN :startDate AND :endDate
                    AND sub_tc.active IS TRUE	
                )
            ) AS "todayCase",
        SUM(
              ( 
                  SELECT COUNT(a2.id)::Integer 
                  FROM audience a2 
                  INNER JOIN temp_customers sub_tc ON a2.customer_id = sub_tc.id
                  WHERE a2.page_id = p.id 
                  ${filterTypeCondition}
                  AND a2.status IN ('EXPIRED', 'REJECT', 'CLOSED') 
                  AND a2."domain" NOT IN ('LEADS')
                  AND a2.updated_at BETWEEN :startDate AND :endDate
                  AND sub_tc.active IS TRUE	
                )
            ) AS "closedCaseToday",
        ${
          isActiveSLA
            ? `SUM( 
              ( 
                SELECT COUNT(a2.id)::Integer
                FROM audience a2
                INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
                WHERE CASE ${statementOver} END
                ${filterTypeCondition}
                AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
                AND a2.domain NOT IN ('LEADS')
                AND a2.latest_sent_by = 'AUDIENCE'
                AND tc2.active IS TRUE	
              )
            ) AS "onProcessOverSla",
            jsonb_build_object(
                'onProcess', SUM((
                  SELECT COUNT(a2.id)::Integer 
                  FROM audience a2 
                  INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
                  WHERE a2.assignee_id IS NULL
                  ${filterTypeCondition}
                  AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
                  AND a2."domain" NOT IN ('LEADS') 
                  AND tc2.active IS TRUE
                )), 
                'almostSLA', SUM((
                  SELECT COUNT(a2.id)::Integer 
                  FROM audience a2 
                  INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
                  WHERE CASE ${statementAlmost} END
                  ${filterTypeCondition}
                  AND a2.assignee_id IS NULL
                  AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
                  AND a2.domain NOT IN ('LEADS')
                  AND a2.latest_sent_by = 'AUDIENCE'
                  AND tc2.active IS TRUE	
                )), 
                'overSLA', SUM((
                  SELECT COUNT(a2.id)::Integer
                  FROM audience a2
                  INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id 
                  WHERE CASE ${statementOver} END
                  ${filterTypeCondition}
                  AND a2.assignee_id IS NULL
                  AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
                  AND a2.domain NOT IN ('LEADS')
                  AND a2.latest_sent_by = 'AUDIENCE'
                  AND tc2.active IS TRUE	
                ))
              ) AS "waitForOpen"`
            : `
            0 AS "onProcessOverSla",
            jsonb_build_object('onProcess', 0, 'almostSLA', 0, 'overSLA', 0) AS "waitForOpen"
            `
        }
    FROM
        subscriptions s
    INNER JOIN page_subscriptions_mappings psm ON
        s.id = psm.subscription_id
    INNER JOIN pages p ON
        psm.page_id = p.id
    WHERE
        s.id = :subscriptionID
        ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND p.id = :pageID' : `AND p.id IN ${pageIDs}`}
        AND p.wizard_step = '${EnumWizardStepType.SETUP_SUCCESS}';
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<AllSubscriptionSLAStatisiticInput>(statements, query);
  const data = await PostgresHelper.execQuery<IAllSubscriptionSLAStatisitic[]>(client, sanitizeSQL(sql), bindings);
  return data.length > 0 ? data[0] : null;
};

export const getAllSubscriptionSLAAllSatffByAssigneeData = async (
  client: Pool,
  { subscriptionID, startDate, endDate, dynamicParams, statementAlmost, statementOver, isActiveSLA }: AllSubscriptionSLAAllSatff,
  filters: IAllSubscriptionFilter,
  pageIDs: string,
): Promise<IAllSubscriptionSLAAllSatff[]> => {
  const query = { subscriptionID, startDate, endDate, ...dynamicParams, pageID: filters.pageID };
  const filterTypeCondition = filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND a2.page_id = :pageID' : `AND a2.page_id IN ${pageIDs}`;

  const statements = `
    SELECT
      u.id AS "tagID",
      u.name AS "tagName",
      ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'upm.page_id AS "pageID",' : ''}
      jsonb_build_object('userID', u.id, 'name', u.name, 'picture', u.profile_img) AS "users",
      (
        SELECT count(a2.id)::Integer AS "totalOnProcess"
        FROM audience a2
        INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
        WHERE a2.assignee_id = u.id
         ${filterTypeCondition}
        AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
        AND a2."domain" NOT IN ('LEADS') 
        AND tc2.active IS TRUE
      ),
      (
        SELECT count(a2.id)::Integer AS "todayClosed"
        FROM audience a2
        INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
        WHERE a2.assignee_id = u.id
         ${filterTypeCondition}
        AND a2.status IN ('EXPIRED', 'REJECT', 'CLOSED')
        AND a2."domain" NOT IN ('LEADS')
        AND a2.updated_at BETWEEN :startDate AND :endDate
        AND tc2.active IS TRUE
      ),
      ${
        isActiveSLA
          ? `
            (
              SELECT count(a2.id)::Integer AS "almostSLA"
              FROM audience a2
              INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
              WHERE
              CASE ${statementAlmost} END
              ${filterTypeCondition}
              AND a2.assignee_id = u.id
              AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
              AND a2.domain NOT IN ('LEADS')
              AND a2.latest_sent_by = 'AUDIENCE'
              AND tc2.active IS TRUE
            ),
            (
              SELECT count(a2.id)::Integer AS "overSLA"
              FROM audience a2
              INNER JOIN temp_customers tc2 ON a2.customer_id = tc2.id
              WHERE
              CASE ${statementOver} END
              ${filterTypeCondition}
              AND a2.assignee_id = u.id
              AND a2.status NOT IN ('EXPIRED', 'REJECT', 'FINISHED', 'CLOSED')
              AND a2.domain NOT IN ('LEADS')
              AND a2.latest_sent_by = 'AUDIENCE'
              AND tc2.active IS TRUE
            )
        `
          : `
          0 AS "almostSLA",
          0 AS "overSLA"
          `
      }
    FROM users u
    INNER JOIN user_subscriptions_mapping usm ON usm.user_id = u.id
    INNER JOIN user_page_mapping upm ON upm.user_id = u.id
    WHERE usm.subscription_id = :subscriptionID
    AND upm.is_active IS TRUE
    ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? 'AND upm.page_id = :pageID' : `AND upm.page_id IN ${pageIDs}`}
    GROUP BY
      u.id,
      u.name
      ${filters.pageID !== SLAFilterType.TAG && filters.pageID !== SLAFilterType.ASSIGNEE ? ',upm.page_id' : ''}
      
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery<AllSubscriptionSLAAllSatff>(statements, query);
  const result = await PostgresHelper.execQuery<IAllSubscriptionSLAAllSatff[]>(client, sanitizeSQL(sql), bindings);
  return result;
};

export async function getPageListOnMessageTrackModeData(
  client: Pool,
  { subscriptionID, settingType }: { subscriptionID: string; settingType: PageSettingType },
): Promise<IPageListOnMessageTrackMode[]> {
  const SQL = `
      SELECT 
        p.id AS "pageID",
        p.page_name AS "pageTitle",
        p.shop_picture AS "pageImgUrl",
        (	
          SELECT ps2.options::json->'trackMode' AS "pageMessageMode" 
          FROM page_settings ps2 
          WHERE ps2.setting_type = :settingType 
          AND ps2.status IS TRUE 
          AND ps2.page_id = p.id
        )
      FROM
        subscriptions s
      INNER JOIN page_subscriptions_mappings psm ON
        s.id = psm.subscription_id
      INNER JOIN pages p ON 
        psm.page_id = p.id
      INNER JOIN user_page_mapping upm ON 
        upm.page_id = p.id
      WHERE
        s.id = :subscriptionID
      GROUP BY p.id
    `;

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { subscriptionID, settingType });
    return await PostgresHelper.execQuery<IPageListOnMessageTrackMode[]>(client, sanitizeSQL(sql), bindings);
  } catch (err) {
    console.log('getPageListOnMessageTrackModeData error  ', err);
    throw new Error(err);
  }
}
