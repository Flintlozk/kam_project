import { getDateByUnitStartOrEnd, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICount } from '@reactor-room/model-lib';
import {
  AudienceContactStatus,
  AudienceCounter,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceLeadContext,
  AudienceStats,
  AudienceStepResponse,
  FormTemplates,
  IAliases,
  IAudience,
  IAudienceContacts,
  IAudienceHistory,
  IAudienceListInput,
  IAudiencePagination,
  IAudienceWithCustomer,
  IAudienceWithLeads,
  IAudienceWithPurchasing,
  ICustomerTemp,
  ImageSetTemplate,
  IPagesAudience,
  LeadsDomainStatus,
  LeadsFilters,
  LeadsListStatsInput,
  Message,
  MessageTemplates,
  MessageTemplatesFilters,
  PaidFilterEnum,
  ReportDataResponse,
  Socials,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export const getAudienceHistoriesData = async (
  client: Pool,
  pageID: number,
  search: string,
  reasonID: number,
  page: number,
  pageSize: number,
  startDate: string,
  endDate: string,
): Promise<IAudienceHistory[]> => {
  const statement = `
  WITH 
    Close_at_CTE AS (
      SELECT
        a.id,
        a.updated_at 
      FROM audience a 
      WHERE a.page_id = :pageID AND
        a.status IN ('REJECT','CLOSED')
    ),
    Close_reason_CTE AS (
      SELECT 
        acrm.audience_id,
        ccr.reason
      FROM customer_closed_reason ccr
      INNER JOIN audience_closed_reason_mapping acrm ON acrm.reason_id = ccr.id
      WHERE ccr.page_id = :pageID
    ),
    Close_detail_CTE AS (
      SELECT 
        acrm.audience_id,
        acrm.description
      FROM audience_closed_reason_mapping acrm
      WHERE acrm.page_id = :pageID
    ),
    Customer_tag_CTE AS (
      SELECT
        ct.name,
        ct.color,
        ctm.customer_id
      FROM customer_tag_mapping ctm
      INNER JOIN customer_tags ct ON ctm.tag_id = ct.id 
      WHERE ct.page_id = :pageID AND
        ct.active IS TRUE
    ),
    Customer_notes_CTE AS (
      SELECT 
        cn.customer_id,
        cn.note
      FROM customer_notes cn 
      WHERE cn.page_id = :pageID
    ),
    Data_CTE AS (
      SELECT 
        ah.audience_id,
        tc.id AS "customer_id",    
          tc.profile_pic,
          tc.first_name,
          tc.aliases,
          tc.last_name,
          tc.platform,
          a.user_open_id AS "open_by",
          a.user_close_id AS "close_by",
          a.assignee_id AS "assignee",
          ah.domain,
          ah.status,
          ah.created_at AS created_at,
          COALESCE(
              (
                SELECT x.updated_at 
                FROM Close_at_CTE x 
                WHERE x.id = ah.audience_id
            ),
              null
          ) AS closed_at,
          (
            SELECT x.reason 
            FROM Close_reason_CTE x
            WHERE x.audience_id = ah.audience_id 
          ) AS reason,
          (
            SELECT x.description 
            FROM Close_detail_CTE x
            WHERE x.audience_id = ah.audience_id 
          ) AS close_detail,
          (
            SELECT jsonb_agg(json_build_object('name',x."name", 'color',x.color)) :: jsonb
            FROM Customer_tag_CTE x
            WHERE x.customer_id = a.customer_id 
          ) AS tags,
          (
            SELECT jsonb_agg(x.note)
            FROM Customer_notes_CTE x 
            WHERE x.customer_id = a.customer_id 
          ) AS notes
      FROM audience_history ah 
      INNER JOIN audience a ON a.id = ah.audience_id
      INNER JOIN temp_customers tc ON tc.id = a.customer_id 
      ${reasonID !== -1 ? 'INNER JOIN audience_closed_reason_mapping acrm ON acrm.audience_id = a.id ' : ''}
      WHERE ah.page_id = :pageID AND 
        a.parent_id IS NULL AND
        ah.created_at BETWEEN :startDate AND :endDate
        ${
          search !== null
            ? `
        AND (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search
        )`
            : ''
        }
        ${reasonID !== -1 ? 'AND acrm.reason_id = :reasonID' : ''}   
    ),
    Count_CTE AS (
      SELECT 
        CAST(COUNT(*) AS INT) AS totalrows 
      FROM Data_CTE
    )
    SELECT * FROM Data_CTE
    CROSS JOIN Count_CTE
    OFFSET :page ROWS
    FETCH NEXT :pageSize ROWS ONLY
  `;

  const bind = {
    pageID,
    search,
    reasonID,
    page,
    pageSize,
    startDate,
    endDate,
  };

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, bind);
  const result = await PostgresHelper.execQuery<IAudienceHistory[]>(client, sanitizeSQL(sql), bindings);
  if (!isEmpty(result)) return result;
  else return [];
};
export const getAudienceHistoryByIDData = async (client: Pool, pageID: number, audienceID: number): Promise<IAudienceHistory[]> => {
  const statement = `
  SELECT
    ah.audience_id,
    COALESCE(
      (SELECT alias FROM users _u INNER JOIN user_page_mapping _upm ON _u.id = _upm.user_id WHERE _u.id = a.user_open_id AND _upm.page_id = :pageID ),
      (SELECT name FROM users _u WHERE _u.id = a.user_open_id), NULL
    ) AS open_by,
    COALESCE(
      (SELECT alias FROM users _u INNER JOIN user_page_mapping _upm ON _u.id = _upm.user_id WHERE _u.id = a.user_close_id AND _upm.page_id = :pageID ),
      (SELECT name FROM users _u WHERE _u.id = a.user_close_id), NULL
    ) AS close_by,
    a.created_at AS created_at,
    COALESCE(
      (SELECT _a.updated_at FROM audience _a WHERE _a.page_id = :pageID AND _a.id = ah.audience_id AND _a.status IN ('REJECT','CLOSED')),
      null
    ) AS closed_at,
    (
      SELECT reason
      FROM customer_closed_reason _ccr
      INNER JOIN audience_closed_reason_mapping _acrm ON _acrm.reason_id = _ccr.id
      WHERE
        _acrm.audience_id = ah.audience_id
        AND _acrm.page_id = ah.page_id 
        AND ah.status IN ('REJECT','CLOSED')
        ) AS "reason",
    (
      SELECT description
      FROM audience_closed_reason_mapping _acrm
      WHERE 
        _acrm.audience_id = ah.audience_id
        AND _acrm.page_id = ah.page_id
        AND ah.status IN ('REJECT','CLOSED')
        ) AS "close_detail"
    FROM
      audience_history ah
    INNER JOIN audience a ON
      a.id = ah.audience_id
    INNER JOIN temp_customers tc ON
      tc.id = a.customer_id
    WHERE
      ah.page_id = :pageID
      AND ah.audience_id = :audienceID
      AND a.parent_id IS NULL
      AND ah.status IN ('REJECT','CLOSED')
  ORDER BY
    ah.created_at DESC
  ;
`;
  const bind = {
    pageID,
    audienceID,
  };

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, bind);
  return await PostgresHelper.execQuery<IAudienceHistory[]>(client, sanitizeSQL(sql), bindings);
};

export async function getAudienceForMigrateOnly(client: Pool): Promise<IAudience[]> {
  // ! MIGRATION PURPOSE
  const SQL = `SELECT 
                  *
                FROM 
                  audience
                WHERE
                  status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
                AND 
                  domain NOT IN ('LEADS')
                AND
                  latest_sent_by IS NULL
                AND
                  page_id = 91
                ORDER BY id DESC
                LIMIT 10000;`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, {});
  const result = (await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return result;
}

export async function getAudienceByCustomerID(client: Pool, customerID: number, pageID: number): Promise<IAudience> {
  const bindings = { customerID, pageID };
  const SQL = 'SELECT * FROM audience WHERE customer_id = :customerID and page_id = :pageID AND parent_id IS NULL ORDER BY id DESC LIMIT 1;';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}

export async function getAudienceByCustomerIDIncludeChild(client: Pool, customerID: number, pageID: number, childWhereQuery: string): Promise<IAudience[]> {
  const bindings = { customerID, pageID };
  const SQL = `  SELECT id FROM audience WHERE customer_id = :customerID and page_id = :pageID ${childWhereQuery}  ORDER BY last_platform_activity_date DESC ;`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : ([] as IAudience[]);
}

export async function getChildAudienceByAudienceId(client: Pool, audienceID: number, pageID: number): Promise<IAudience> {
  const SQL = `SELECT au.id ,au.page_id, au.parent_id, au.domain, au.status, cs.platform, cs.aliases FROM audience au 
              INNER JOIN temp_customers cs on au.customer_id = cs.id
              WHERE 
              au.parent_id = $1 AND 
              au.page_id = $2`;
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, [audienceID, pageID]);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}

export async function getAudienceNotActive(client: Pool, customerID: number, pageID: number): Promise<IAudience[]> {
  const bindings = { customerID, pageID };
  const SQL = `
    SELECT 
      * 
    FROM 
      audience 
    WHERE 
    customer_id = :customerID 
    AND page_id = :pageID
    AND parent_id IS NULL
    AND status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED') 
    AND domain NOT IN ('LEADS')`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : ([] as IAudience[]);
}
export async function getAudienceNotActiveByID(client: Pool, audienceID: number, pageID: number): Promise<IAudience[]> {
  const bindings = { audienceID, pageID };
  const SQL = `
    SELECT 
      * 
    FROM 
      audience 
    WHERE 
      id = :audienceID 
    AND page_id = :pageID
    AND parent_id IS NULL
    AND status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED') 
    AND domain NOT IN ('LEADS')`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : ([] as IAudience[]);
}

export async function getCustomerByAudienceID(client: Pool, audienceID: number, pageID: number): Promise<ICustomerTemp> {
  const bindings = { audienceID, pageID };
  const SQL = `
  SELECT 
    tc.* 
  FROM 
    audience a 
  INNER JOIN 
    temp_customers tc ON tc.id = a.customer_id 
  WHERE 
    a.id = :audienceID
  AND 
    tc.page_id = :pageID `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as ICustomerTemp);
}

export async function getPageAudienceById(client: Pool, audienceID: number): Promise<IPagesAudience> {
  const bindings = { audienceID };
  const SQL = ' SELECT p.id as "pageID" FROM audience a INNER join pages p ON p.id = a.page_id WHERE a.id = :audienceID ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IPagesAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IPagesAudience);
}

export async function getAudienceStatusById(client: Pool, audienceID: number, pageID: number): Promise<IAudience> {
  const bindings = { audienceID, pageID };
  const SQL = 'SELECT *, assignee_id as "assigneeID" FROM audience WHERE id = :audienceID AND page_id = :pageID ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudience[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IAudience);
}
export async function getChildAudienceStatusById(client: Pool, audienceID: number, pageID: number): Promise<IAudience> {
  // will always get one child per one Audience
  const SQL = `SELECT *,assignee_id as "assigneeID"  FROM audience WHERE parent_id = $1 AND page_id = $2 AND status = 'FOLLOW'`;
  const result = await PostgresHelper.execQuery<IAudience[]>(client, SQL, [audienceID, pageID]);
  return Array.isArray(result) ? result[0] : null;
}

export async function getAudienceByID(client: Pool, audienceID: number, pageID: number): Promise<IAudienceWithCustomer> {
  const bindings = { audienceID, pageID };
  const SQL = `SELECT temp_customers.first_name,
                      temp_customers.last_name,
                      audience.id AS id,
                      audience.page_id as page_id,
                      audience.domain as domain,
                      audience.status as status,
                      audience.customer_id AS customer_id,
                      audience.parent_id AS parent_id,
                      audience.notify_status AS notify_status,
                      audience.is_notify AS is_notify,
                      audience.is_offtime AS is_offtime,
                      audience.latest_sent_by AS latest_sent_by,
                      audience.created_at,
                      audience.last_platform_activity_date,
                      audience.referral,
                      audience.assignee_id as "assigneeID",
                      temp_customers.platform,
                      temp_customers.aliases,
                      temp_customers.can_reply,
                      temp_customers.first_name,
                      temp_customers.last_name,
                      temp_customers.profile_pic,
                      temp_customers.psid,
                      temp_customers.name
                FROM audience
                INNER JOIN temp_customers ON audience.customer_id = temp_customers.id
                WHERE temp_customers.id IS NOT NULL AND audience.id = :audienceID AND audience.page_id = :pageID  LIMIT 1;`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IAudienceWithCustomer[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (result.length) return result[0];
  else return {} as IAudienceWithCustomer;
}

//CAN LEAK MUST BECAREFUL WHEN YOU WANT TO USED;
export async function getAudienceByIDOnly(client: Pool, audienceID: number): Promise<IAudienceWithCustomer> {
  const bindings = { audienceID };
  const SQL = `SELECT temp_customers.first_name,
                      temp_customers.last_name,
                      audience.id AS id,
                      audience.page_id as page_id,
                      audience.domain as domain,
                      audience.status as status,
                      audience.customer_id AS customer_id,
                      audience.parent_id AS parent_id,
                      audience.is_notify AS is_notify,
                      temp_customers.platform,
                      temp_customers.aliases,
                      temp_customers.can_reply,
                      temp_customers.first_name,
                      temp_customers.last_name,
                      temp_customers.profile_pic,
                      temp_customers.psid,
                      temp_customers.name
                FROM audience
                INNER JOIN temp_customers ON audience.customer_id = temp_customers.id
                WHERE temp_customers.id IS NOT NULL AND audience.id = :audienceID  LIMIT 1;`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const [result] = (await PostgresHelper.execQuery<IAudienceWithCustomer[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return result;
}

export async function getAudienceFollow(client: Pool, pageID: number, ID: number): Promise<IAudience> {
  const bindings = { pageID, ID };
  const SQL = `SELECT 
                  id,
                  customer_id,
                  page_id,
                  domain,
                  status,
                  created_at
                FROM 
                  audience
                WHERE 
                  page_id = :pageID
                AND 
                  audience.id = :ID
                LIMIT 1;`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const [result] = (await PostgresHelper.execQuery<[IAudience]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return result;
}

export async function getAudienceIDByCustomerPSID(client: Pool, PSID: string, pageID: number): Promise<AudienceStepResponse> {
  const bindings = { PSID, pageID };
  const SQL = `
                SELECT
                    audience.id as audience_id, 
                    audience.page_id as page_id 
                FROM
                audience
                WHERE
                customer_id = (
                SELECT
                  id
                FROM
                  temp_customers
                WHERE
                  temp_customers.psid = :PSID AND temp_customers.page_id = :pageID)
                AND audience.parent_id IS NULL AND audience.page_id = :pageID
                ORDER BY
                audience.id DESC
                LIMIT 1;
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const [result] = (await PostgresHelper.execQuery<AudienceStepResponse[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return result;
}
export async function getCodStatus(client: Pool, orderID: number, pageID: number): Promise<boolean> {
  const bindings = { orderID, pageID };
  const SQL = `
                SELECT
                  cod_status
                FROM
                  purchasing_orders,
                  logistics
                WHERE
                  purchasing_orders.id = :orderID
                  AND is_quickpay IS FALSE
                  AND purchasing_orders.page_id = :pageID
                  AND logistics.id = purchasing_orders.logistic_id
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<boolean[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : false;
}
export async function getDetailPDFByUuid(client: Pool, uuid: string): Promise<{ id: number; page_id: number; purchase_order_id: number }[]> {
  const SQL = `
  SELECT 
        purchasing_order_tracking_info.id,page_id,purchasing_order_tracking_info.purchase_order_id 
  FROM 
        purchasing_orders, 
	      purchasing_order_tracking_info 
  WHERE 
        uuid = $1 
  AND 
        purchasing_order_tracking_info.purchase_order_id = purchasing_orders.id`;
  return await PostgresHelper.execQuery<{ id: number; page_id: number; purchase_order_id: number }[]>(client, SQL, [uuid]);
}
export async function getOrderDetail(client: Pool, uuid: string[]): Promise<ReportDataResponse[]> {
  //TODO -> Bank needs to look into this
  const SQL = `
    select 
      purchasing_order_logistic.purchase_order_id as purchase_order_id,
      purchasing_orders.created_at AS createOrderDate,
      purchasing_orders.shipping_date,
      product_variant_id,
      item_price,
      item_quantity,
      purchasing_orders.tax,
      purchasing_order_items.sku as sku,
      tracking_no,
      purchasing_order_items.product_id,
      products.name as proname,
      customer_id,
      temp_customers.first_name,
      temp_customers.last_name,
      temp_customers.phone_number,
      temp_customers.location,
      purchasing_orders.page_id as page_id,
      purchasing_orders.logistic_id,
      purchasing_order_logistic.tracking_type as tracking_type,
      purchasing_order_logistic.cod_status as cod_status,
      purchasing_order_logistic.delivery_type as delivery_type,
      purchasing_order_logistic.delivery_fee as delivery_fee
    from
      purchasing_orders, 
      purchasing_order_items, 
      product_variants, 
      products, 
      audience, 
      temp_customers,
      purchasing_order_logistic
    where
        purchasing_orders.uuid IN ('${uuid.join("','")}') and
        purchasing_orders.id = purchasing_order_items.purchase_order_id and
        purchasing_orders.audience_id = audience.id and
        audience.customer_id = temp_customers.id and
        product_variants.product_id = products.id and
        purchasing_order_items.product_variant_id = product_variants.id and
        purchasing_order_logistic.purchase_order_id = purchasing_orders.id
  `;
  return await PostgresHelper.execQuery<ReportDataResponse[]>(client, SQL, []);
}

export async function getAudienceIds(client: Pool, pageID: string, domain: string, status: string): Promise<AudienceStepResponse[]> {
  const bindings = { pageID, domain, status };
  const SQL = ` 
                SELECT
                  DISTINCT(audience.id)
                FROM
                  audience_history
                LEFT JOIN audience ON
                  audience.id = audience_history.audience_id
                WHERE
                  audience.page_id = :pageID
                  AND audience.domain = :domain
                  AND audience.status = :status
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  return (await PostgresHelper.execQuery<AudienceStepResponse[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
}

export async function getLeadsListTotal(client: Pool, { end, start }: LeadsListStatsInput, pageID: number): Promise<{ follow: number; finished: number }> {
  // LEADS STATS
  // TODO: rename properly
  const query = `
      SELECT
        *
      FROM
        (
        SELECT count(lfr.id)::integer AS follow
        FROM lead_form_referrals lfr
        INNER JOIN audience a 
        ON lfr.audience_id = a.id
        WHERE 
          lfr.page_id = :pageID AND
          lfr.customer_id IS NOT NULL AND	
          a.status NOT IN ('REJECT','CLOSED') AND 
          lfr.created_at::date BETWEEN (:start) AND (:end) AND 
          lfr.audience_id NOT IN (
                SELECT lfs.audience_id 
                FROM lead_form_submissions lfs 
                WHERE lfs.page_id = :pageID
              )
        ) AS follow,
        ( 
        SELECT count(lfs.id)::integer AS finished
        FROM lead_form_submissions lfs
        INNER JOIN audience a 
        ON lfs.audience_id = a.id
        WHERE 
          lfs.page_id = :pageID AND 
          lfs.created_at::date BETWEEN (:start) AND (:end) AND
          lfs.customer_id IS NOT NULL
        ) AS finished
    `;
  const bindings = { pageID, start, end };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(query, bindings);
  const result = await PostgresHelper.execQuery<{ follow: number; finished: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result[0];
}

export async function getAudienceListTotal(client: Pool, pageID: number): Promise<{ audience_total: number }> {
  const query = `
                    SELECT
                      inbox_audience::Int + comment_audience::Int AS audience_total
                    FROM
                      (
                      SELECT
                        count(a.id) AS inbox_audience
                      FROM
                        audience AS a
                      LEFT JOIN temp_customers ON
                        a.customer_id = temp_customers.id
                      WHERE
                        a.status IN ('INBOX')
                        AND a.page_id = $1
                        AND temp_customers.active IS NOT FALSE) AS inbox_audience,
                      (
                      SELECT
                        count(a.id) AS comment_audience
                      FROM
                        audience AS a
                      LEFT JOIN temp_customers ON
                        a.customer_id = temp_customers.id
                      WHERE
                        a.status IN ('COMMENT')
                        AND a.page_id = $1
                        AND temp_customers.active IS NOT FALSE) AS comment_audience
    `;
  const result = await PostgresHelper.execQuery(client, query, [pageID]);
  return result[0] as { audience_total: number };
}

export async function countAudienceStatus(client: Pool, pageID: number): Promise<AudienceCounter> {
  const sql = `
                SELECT 
                  sum(CASE WHEN status = 'FOLLOW' AND  domain = 'CUSTOMER'  THEN 1 ELSE 0 end)::Int AS step1,
                  sum(CASE WHEN status = 'WAITING_FOR_PAYMENT' AND  domain = 'CUSTOMER'  THEN 1 ELSE 0 end)::Int AS step2,
                  sum(CASE WHEN status = 'CONFIRM_PAYMENT' AND  domain = 'CUSTOMER'  THEN 1 ELSE 0 end)::Int AS step3,
                  sum(CASE WHEN status = 'WAITING_FOR_SHIPMENT' AND  domain = 'CUSTOMER'  THEN 1 ELSE 0 end)::Int AS step4,
                  sum(CASE WHEN status = 'CLOSED' AND  domain = 'CUSTOMER'  THEN 1 ELSE 0 end)::Int AS step5,
                  sum(CASE WHEN status <> 'REJECT' AND  domain = 'CUSTOMER'  THEN 1 ELSE 0 end)::Int AS total
                FROM audience a WHERE page_id  = $1 ;
            `;
  const result = await PostgresHelper.execQuery<AudienceCounter>(client, sql, [pageID]);
  return Array.isArray(result) ? result[0] : [];
}

export async function getAudienceSLAList(client: Pool, aliases: IAliases): Promise<IAudienceWithCustomer[]> {
  try {
    const statements = `WITH Data_CTE AS
    (
      SELECT DISTINCT
      a.id,
      a.page_id, 
      a.domain, 
      a.status, 
      a.created_at,
      a.score,
      a.last_platform_activity_date,
      a.last_incoming_date,
      a.is_notify,
      a.notify_status,
      tc.id as customer_id, 
      tc.first_name, 
      tc.profile_pic, 
      tc.last_name,
      tc.platform,
      tc.aliases
      FROM audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      ${aliases.tagList !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE
      ${
        aliases.search !== null
          ? `
      (
        lower(a.domain::varchar) LIKE :search OR
        lower(a.status::varchar) LIKE :search OR
        lower(tc.aliases::varchar) LIKE :search OR
        lower(tc.first_name::varchar) LIKE :search OR
        lower(tc.last_name::varchar) LIKE :search
      ) AND
      `
          : ''
      }  
      ${aliases.tagList !== null ? `ctm.tag_id IN ${aliases.tagList} AND` : ''}
      ${
        aliases.noTag === true
          ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = a.customer_id AND ctm.active  IS TRUE AND ct.active IS TRUE  ) IS TRUE AND'
          : ''
      }
      ${
        aliases.exceedSla === true && aliases.slaConfig?.all
          ? `
        (a.last_incoming_date < :alertTime OR a.last_incoming_date < :exceedTime) AND
        `
          : ''
      }
      ${
        aliases.exceedSla === true && aliases.slaConfig?.almost
          ? `
        a.last_incoming_date < :alertTime AND
        a.last_incoming_date > :exceedTime AND
        `
          : ''
      }
      ${
        aliases.exceedSla === true && aliases.slaConfig?.over
          ? `
        a.last_incoming_date < :alertTime AND
        a.last_incoming_date < :exceedTime AND
        `
          : ''
      }
      ${aliases.exceedSla === true ? "a.latest_sent_by = 'AUDIENCE' AND" : ''}
      tc.active IS NOT false AND 
      a.page_id = :pageID AND 
      a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED') AND 
      a.domain NOT IN ('LEADS')
      ORDER BY 
      ${aliases.orderBy.join()}
      ${aliases.orderMethod}
    ), 
    Count_CTE 
    AS 
    (
      SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
    )
    SELECT
      *
    FROM Data_CTE
    CROSS JOIN Count_CTE
    ${aliases.exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'}`;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, aliases);
    const data = await PostgresHelper.execQuery<IAudienceWithCustomer[]>(client, sanitizeSQL(sql), bindings);
    return data;
  } catch (error) {
    console.log('getAudienceListStatusFollow  error ', error);
    return null;
  }
}
export async function getAssignAudienceSLAList(client: Pool, aliases: IAliases): Promise<IAudienceWithCustomer[]> {
  try {
    const statements = `WITH Data_CTE AS
    (
      SELECT DISTINCT
      a.id,
      a.page_id, 
      a.domain, 
      a.status, 
      a.created_at,
      a.score,
      a.last_platform_activity_date,
      a.last_incoming_date,
      a.is_notify,
      a.notify_status,
      tc.id as customer_id, 
      tc.first_name, 
      tc.profile_pic, 
      tc.last_name,
      tc.platform,
      tc.aliases
      FROM audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      WHERE
      ${
        aliases.search !== null
          ? `
      (
        lower(a.domain::varchar) LIKE :search OR
        lower(a.status::varchar) LIKE :search OR
        lower(tc.aliases::varchar) LIKE :search OR
        lower(tc.first_name::varchar) LIKE :search OR
        lower(tc.last_name::varchar) LIKE :search
      ) AND
      `
          : ''
      }  
      ${aliases.tagList !== null ? `a.assignee_id IN ${aliases.tagList} AND` : ''}
      ${aliases.noTag === true ? 'a.assignee_id IS NULL AND' : ''}
      ${
        aliases.exceedSla === true && aliases.slaConfig?.all
          ? `
        (a.last_incoming_date < :alertTime OR a.last_incoming_date < :exceedTime) AND
        `
          : ''
      }
      ${
        aliases.exceedSla === true && aliases.slaConfig?.almost
          ? `
        a.last_incoming_date < :alertTime AND
        a.last_incoming_date > :exceedTime AND
        `
          : ''
      }
      ${
        aliases.exceedSla === true && aliases.slaConfig?.over
          ? `
        a.last_incoming_date < :alertTime AND
        a.last_incoming_date < :exceedTime AND
        `
          : ''
      }
      ${aliases.exceedSla === true ? "a.latest_sent_by = 'AUDIENCE' AND" : ''}
      tc.active IS NOT false AND 
      a.page_id = :pageID AND 
      a.status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED') AND 
      a.domain NOT IN ('LEADS')
      ORDER BY 
      ${aliases.orderBy.join()}
      ${aliases.orderMethod}
    ), 
    Count_CTE 
    AS 
    (
      SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
    )
    SELECT
      *
    FROM Data_CTE
    CROSS JOIN Count_CTE
    ${aliases.exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'}`;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, aliases);
    const data = await PostgresHelper.execQuery<IAudienceWithCustomer[]>(client, sanitizeSQL(sql), bindings);
    return data;
  } catch (error) {
    console.log('getAudienceListStatusFollow  error ', error);
    return null;
  }
}

export async function getAudienceListStatusFollow(client: Pool, aliases: IAliases, domains: string, fetchLeads: boolean): Promise<IAudienceWithCustomer[]> {
  try {
    const search =
      aliases.search !== null
        ? `
          (
            lower(a.domain::varchar) LIKE :search OR
            lower(a.status::varchar) LIKE :search OR
            lower(tc.aliases::varchar) LIKE :search OR
            lower(tc.first_name::varchar) LIKE :search OR
            lower(tc.last_name::varchar) LIKE :search
          ) AND
          `
        : '';
    const statements = `WITH Data_CTE AS
    (
      SELECT
        a.id,
        a.page_id, 
        a.domain, 
        a.status, 
        a.created_at,
        a.score,
        a.last_platform_activity_date,
        a.is_notify,
        a.is_offtime,
        a.notify_status,
        a.latest_sent_by,
        tc.id as customer_id,
        tc.first_name, 
        tc.profile_pic, 
        tc.last_name,
        tc.platform,
        tc.aliases
        ${aliases.status === 'FINISHED' ? ', lead_form_submissions.options' : ''}
      FROM audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
        ${fetchLeads ? 'INNER JOIN lead_form_referrals lfr ON lfr.audience_id = a.id' : ''}
        ${aliases.tagList !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        ${aliases.status === 'FINISHED' ? 'LEFT JOIN lead_form_submissions ON a.id = lead_form_submissions.audience_id ' : ''}
        WHERE 
        ${aliases.tagList !== null ? `ctm.tag_id IN ${aliases.tagList} AND` : ''}
        ${aliases.exceedSla === true ? 'a.last_platform_activity_date < :exceedTime AND' : ''}
        ${aliases.exceedSla === true ? "a.latest_sent_by = 'AUDIENCE' AND" : ''}
        ${
          aliases.noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = a.customer_id AND ctm.active  IS TRUE AND ct.active IS TRUE  ) IS TRUE AND'
            : ''
        }
        tc.active IS NOT false AND 
        a.page_id = :pageID AND 
        ${
          fetchLeads
            ? "a.status NOT IN ('REJECT','CLOSED') AND lfr.audience_id NOT IN ( SELECT lfs.audience_id FROM lead_form_submissions lfs WHERE  lfs.page_id = :pageID) AND"
            : ''
        }
        ${search}
        a.status NOT IN ('REJECT','CLOSED','EXPIRED','FINISHED')
        ${aliases.status === 'activity' ? "AND a.status IN ('INBOX','COMMENT')" : ''}
        ${aliases.status === 'unread' ? "AND a.latest_sent_by = 'AUDIENCE'" : ''}
        ${aliases.status !== null && aliases.status !== 'activity' && aliases.status !== 'unread' ? 'AND a.status = :status' : ''}
        ${domains ? `AND a.domain IN ${domains}` : ''}
      ORDER BY 
        ${aliases.orderBy.join()}
        ${aliases.orderMethod}
    ), 
    Count_CTE  
    AS 
    (
      SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
    ),
    Count_OFFTIME  
    AS 
    (
      SELECT CAST(COUNT(*) as INT) AS offtimes FROM Data_CTE WHERE is_offtime = TRUE
    )
    SELECT
      *
    FROM Data_CTE
    CROSS JOIN Count_OFFTIME
    CROSS JOIN Count_CTE
    ${aliases.exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'}`;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, aliases);
    const data = await PostgresHelper.execQuery<IAudienceWithCustomer[]>(client, sanitizeSQL(sql), bindings);

    return data;
  } catch (error) {
    console.log('getAudienceListStatusFollow  error ', error);
    return null;
  }
}

export async function getAudienceStats(client: Pool, pageID: number): Promise<AudienceStats> {
  const query = ` 
        SELECT * 
        FROM   ( SELECT COUNT(a.id) AS inbox_audience 
                FROM   audience AS a 
                      INNER JOIN temp_customers 
                              ON a.customer_id = temp_customers.id 
                WHERE  a.status IN ( 'INBOX' ) 
                      AND a.page_id = :pageID 
                      AND a.domain = 'AUDIENCE' 
                      AND a.is_notify IS TRUE 
                      AND temp_customers.active IS NOT FALSE) AS inbox_audience, 

              ( SELECT COUNT(a.id) AS comment_audience 
                FROM   audience AS a 
                      INNER JOIN temp_customers 
                              ON a.customer_id = temp_customers.id 
                WHERE  a.status IN ( 'COMMENT' ) 
                      AND a.page_id = :pageID 
                      AND a.domain = 'AUDIENCE' 
                      AND a.is_notify IS TRUE 
                      AND temp_customers.active IS NOT FALSE) AS comment_audience, 
                      
              ( SELECT COUNT(a.id) AS live_audience 
                FROM   audience AS a 
                      INNER JOIN temp_customers 
                              ON a.customer_id = temp_customers.id 
                WHERE  a.status IN ( 'LIVE' ) 
                      AND a.page_id = :pageID 
                      AND a.domain = 'AUDIENCE' 
                      AND a.is_notify IS TRUE 
                      AND temp_customers.active IS NOT FALSE) AS live_audience,

              ( SELECT COUNT(a.id) AS order_audience
                FROM   audience AS a
                      INNER JOIN temp_customers
                              ON a.customer_id = temp_customers.id
                WHERE a.status NOT IN ( 'REJECT','EXPIRED','CLOSED' ) 
                      AND a.domain = 'CUSTOMER'
                      AND a.page_id = :pageID
                      AND a.is_notify IS TRUE
                      AND temp_customers.active IS NOT FALSE) AS order_audience,

              ( SELECT COUNT(a.id) AS lead_audience
                FROM   audience AS a
                      INNER JOIN temp_customers
                              ON a.customer_id = temp_customers.id
                WHERE a.domain = 'LEADS'
                AND a.status = 'FOLLOW'
                      AND a.page_id = :pageID
                      AND a.is_notify IS TRUE
                      AND temp_customers.active IS NOT FALSE) AS lead_audience,

              ( SELECT COUNT(a.id) AS follow_audience
                FROM   audience AS a
                      INNER JOIN temp_customers
                              ON a.customer_id = temp_customers.id
                WHERE a.status IN ( 'FOLLOW' ) 
                      AND a.domain = 'AUDIENCE'
                      AND a.page_id = :pageID
                      AND a.is_notify IS TRUE
                      AND temp_customers.active IS NOT FALSE) AS follow_audience

               `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { pageID });

  const result = await PostgresHelper.execQuery<AudienceStats[]>(client, sql, bindings);
  return result[0];
}
export async function getAudienceAllStats(client: Pool, pageID: number, search = '', searchTags = [], noTag = false): Promise<AudienceStats> {
  const noTagCondition =
    noTag === true
      ? `
          AND ( 
            SELECT COUNT(ctm.id) = 0 
            FROM customer_tag_mapping ctm 
            INNER JOIN customer_tags ct ON ctm.tag_id = ct.id 
            WHERE ctm.customer_id = tc.id AND ctm.active IS TRUE AND ct.active IS TRUE
          ) IS TRUE
        `
      : '';

  const searchCondition = `${
    search !== null
      ? `
        AND (
        lower(a.domain::varchar) LIKE :search OR
        lower(a.status::varchar) LIKE :search OR
        lower(tc.aliases::varchar) LIKE :search OR
        lower(tc.last_name::varchar) LIKE :search OR
        lower(tc.first_name::varchar) LIKE :search
        )
      `
      : ''
  }`;
  const query = ` 
SELECT 
* 
FROM   
  ( 
    SELECT COUNT(inbox.*) AS inbox_audience
    FROM (
      SELECT a.id AS inbox
      FROM   audience a 
      INNER JOIN temp_customers tc ON a.customer_id = tc.id 
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE  a.status IN ( 'INBOX' )
      ${searchCondition}
      ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
      ${noTagCondition}
      AND a.page_id = :pageID 
      AND a.domain = 'AUDIENCE'
      AND tc.active IS NOT FALSE
      GROUP BY a.id
      ) AS inbox 
  ) AS inbox_audience, 

  ( 
    SELECT COUNT(comment.*) AS comment_audience
    FROM (
      SELECT a.id AS comment
      FROM   audience a 
      INNER JOIN temp_customers tc ON a.customer_id = tc.id 
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE  a.status IN ( 'COMMENT' ) 
      ${searchCondition}
      ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
      ${noTagCondition}
      AND a.page_id = :pageID 
      AND a.domain = 'AUDIENCE'
      AND tc.active IS NOT FALSE
      GROUP BY a.id
      ) AS comment
  ) AS comment_audience , 

  ( 
    SELECT COUNT(_order.*) AS order_audience
    FROM (
      SELECT a.id AS _order
      FROM   audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE a.status NOT IN ( 'REJECT','EXPIRED','CLOSED' ) 
      ${searchCondition}
      ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
      ${noTagCondition}
      AND a.domain = 'CUSTOMER'
      AND a.page_id = :pageID
      AND tc.active IS NOT FALSE
      GROUP BY a.id
    ) AS _order
  ) AS order_audience,
  ( 
    SELECT COUNT(_lead.*) as lead_audience
    FROM (
      SELECT * FROM lead_form_referrals lfr
      INNER JOIN audience a ON a.id = lfr.audience_id 
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE
        a.status NOT IN ('REJECT','CLOSED')
        ${searchCondition}
        ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
        ${noTagCondition}
        AND tc.active IS NOT FALSE
        AND lfr.customer_id IS NOT NULL
        AND lfr.page_id = :pageID
        AND lfr.audience_id NOT IN (
            SELECT lfs.audience_id 
            FROM lead_form_submissions lfs 
            WHERE lfs.page_id = :pageID )
    ) AS _lead
  ) AS lead_audience,
  ( 
    SELECT COUNT(follow.*) AS follow_audience
    FROM (
      SELECT a.id
      FROM   audience a
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE a.status IN ( 'FOLLOW' )
      ${searchCondition}
      ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
      ${noTagCondition}
      AND a.domain = 'AUDIENCE'
      AND a.page_id = :pageID
      AND tc.active IS NOT FALSE
      GROUP BY a.id
    ) AS follow 
  ) AS follow_audience,

  ( 
    SELECT COUNT (unread.*) AS unread_audience
      FROM (
        SELECT a.id
        FROM   audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE a.status NOT IN ( 'REJECT','EXPIRED','CLOSED','FINISHED')
        ${searchCondition}
        ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
        ${noTagCondition}
        AND a.page_id = :pageID
        AND a.latest_sent_by = 'AUDIENCE'
        AND tc.active IS NOT FALSE
      ) AS unread
    ) AS unread_audience
               `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { pageID, search });

  const result = await PostgresHelper.execQuery<AudienceStats[]>(client, sql, bindings);
  return result[0];
}

export async function getAudienceListWithPurchaseOrder(client: Pool, query: IAliases): Promise<IAudienceWithPurchasing[]> {
  try {
    /* const statements = `
        SELECT DISTINCT a.id, a.page_id, a.domain, a.status, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, 
        tc.platform, a.created_at, po.updated_at, po.alias_order_id as "aliasOrderId", tc.aliases
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        INNER JOIN purchasing_orders po ON po.audience_id = a.id
        WHERE 
        tc.id IS NOT NULL AND
        a.domain = 'CUSTOMER' AND 
        a.status NOT IN ('REJECT','EXPIRED','CLOSED') AND 
        a.page_id = :pageID
    `; */
    const statements = `
    SELECT DISTINCT a.id, a.page_id, a.domain, a.status::varchar, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, 
     tc.platform::varchar, a.created_at, po.updated_at, po.alias_order_id as "aliasOrderId", tc.aliases
    FROM audience a
    INNER JOIN temp_customers tc ON a.customer_id = tc.id
    INNER JOIN purchasing_orders po ON po.audience_id = a.id
    WHERE 
      tc.id IS NOT NULL AND
      a.domain = 'CUSTOMER' AND 
      a.status NOT IN ('REJECT','EXPIRED','CLOSED') AND 
      a.page_id = :pageID
      AND po.is_quickpay IS FALSE
    UNION
    SELECT
      id,
      page_id ,
      null AS "domain",
      status::varchar,
      order_json->'address_billing'->>'first_name' AS "first_name",
      NULL AS "profile_pic",
      order_json->'address_billing'->>'last_name' AS "last_name",
      NULL AS "psid",
      order_channel::varchar AS "platform",
      created_at,
      updated_at,
      alias_order_id AS "aliasOrderId",
      NULL AS "aliases"
    FROM
      purchasing_orders poi
    WHERE
      page_id = :pageID
    AND order_channel IN ('LAZADA', 'SHOPEE')
    AND poi.is_quickpay IS FALSE
	  AND status NOT IN ('REJECT', 'EXPIRED' , 'MARKET_PLACE_RETURNED' , 'MARKET_PLACE_IN_CANCEL', 'MARKET_PLACE_FAILED')
    ORDER BY updated_at desc
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return data;
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrder error: ', err);
    return null;
  }
}

export async function getAudienceListWithPurchaseOrderStatusFollow(client: Pool, query: IAliases): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `
        SELECT DISTINCT a.id, a.page_id, a.domain, a.status, tc.first_name, tc.profile_pic, tc.last_name, 
          tc.psid, tc.platform, a.created_at, po.updated_at, po.alias_order_id as "aliasOrderId", tc.aliases
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        INNER JOIN purchasing_orders po ON po.audience_id = a.id
        WHERE 
        tc.id IS NOT NULL AND
        a.domain = '${AudienceDomainType.CUSTOMER}' AND 
        a.status NOT IN ('${AudienceDomainStatus.REJECT}') AND 
        a.page_id = :pageID AND 
        a.status = :status
        AND po.is_quickpay IS FALSE
        ORDER BY po.updated_at DESC
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrderStatusFollow error: ', err);
    return [];
  }
}

export async function getAudienceListWithPurchaseOrderStatusWaitForPayment(client: Pool, query: IAliases): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `
        SELECT DISTINCT a.id, a.page_id, a.domain, a.status::varchar, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, tc.platform::varchar, a.created_at, po.updated_at,
        COUNT(distinct p.name) product_amount, string_agg(p.name , ',' order by poi.created_at) interested_product,  po.alias_order_id AS "aliasOrderId", tc.aliases
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        INNER JOIN purchasing_orders po ON po.audience_id = a.id
        LEFT JOIN purchasing_order_items poi  ON poi.purchase_order_id = po.id
        LEFT JOIN product_variants pv ON pv.id = poi.product_variant_id
        LEFT JOIN products p ON p.id = pv.product_id
        WHERE 
        tc.id IS NOT NULL AND
        a.domain = '${AudienceDomainType.CUSTOMER}' AND 
        a.status NOT IN ('${AudienceDomainStatus.REJECT}') AND 
        a.page_id = :pageID AND 
        a.status = :status
        AND po.is_quickpay IS FALSE
        GROUP BY 
        a.id ,tc.first_name,tc.psid ,tc.profile_pic ,tc.last_name ,tc.name, po.updated_at,tc.platform,tc.aliases, po.alias_order_id
        ORDER BY po.updated_at DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);

    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrderStatusWaitForPayment error: ', err);
    return [];
  }
}

export async function getAudienceListWithPurchaseOrderStatusConfirmPayment(client: Pool, query: IAliases): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `SELECT DISTINCT a.id, a.page_id, a.domain, a.status, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, tc.platform, 
        tc.aliases, a.created_at, po.updated_at,
        po.total_price, po.is_paid, pm.name payment_name, pm.type payment_type
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        INNER JOIN purchasing_orders po ON po.audience_id = a.id
        LEFT JOIN payments pm ON po.payment_id = pm.id
        WHERE 
        tc.id IS NOT NULL AND
        a.domain = '${AudienceDomainType.CUSTOMER}' AND 
        a.status NOT IN ('${AudienceDomainStatus.REJECT}') AND 
        a.page_id = :pageID AND 
        a.status = :status
        AND po.is_quickpay IS FALSE
        ORDER BY po.updated_at DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrderStatusConfirmPayment error: ', err);
    return [];
  }
}

export async function getAudienceListWithPurchaseOrderStatusWaitForShipment(client: Pool, query: IAliases): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `SELECT DISTINCT a.id, a.page_id, a.domain, a.status, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, tc.platform, 
        tc.aliases, a.created_at, po.updated_at, po.total_price, po.is_paid, po.flat_rate, pm.name payment_name, pm.type payment_type, lg.name logistic_name,
        lg.type logistic_type, lg.delivery_fee shipping_fee, pba.account_id bank_account_id, pba.account_name bank_account_name,
        pba.type bank_type,csa.is_confirm
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        INNER JOIN purchasing_orders po ON po.audience_id = a.id
        INNER JOIN customer_shipping_address csa ON csa.purchase_order_id = po.id
        LEFT JOIN payments pm ON po.payment_id  = pm.id
        LEFT JOIN payment_bank_accounts pba on po.bank_account_id = pba.id
        LEFT JOIN logistics lg ON po.logistic_id  = lg.id
        WHERE 
        tc.id IS NOT NULL AND
        a.domain = '${AudienceDomainType.CUSTOMER}' AND 
        a.status NOT IN ('${AudienceDomainStatus.REJECT}') AND 
        a.page_id = :pageID AND 
        a.status = :status
        AND po.is_quickpay IS FALSE
        ORDER BY po.updated_at DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrderStatusWaitForShipment error: ', err);
    return [];
  }
}

export async function getAudienceListWithPurchaseOrderStatusClosed(client: Pool, query: IAliases, paidType: PaidFilterEnum): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `WITH Data_CTE 
      AS
      (
        SELECT DISTINCT a.id, a.page_id, a.domain, a.status::varchar, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, tc.platform::varchar,
         a.created_at, po.updated_at,
        po.tracking_no, po.is_paid, po.flat_rate, po.delivery_fee,po.uuid, lg.name logistic_name, lg.type logistic_type,
        lg.delivery_fee, po.id orderno, po.alias_order_id as "aliasOrderId", tc.aliases
        FROM audience a
        INNER JOIN temp_customers tc ON a.customer_id = tc.id
        LEFT JOIN purchasing_orders po ON po.audience_id = a.id
        LEFT JOIN logistics lg ON po.logistic_id  = lg.id
        WHERE 
        tc.id IS NOT NULL AND
        tc.active IS TRUE AND
        a.domain = '${AudienceDomainType.CUSTOMER}' AND 
        a.status NOT IN ('${AudienceDomainStatus.REJECT}') AND 
        a.page_id = :pageID AND 
        a.status = :status AND
        po.is_quickpay IS FALSE AND
        a.created_at::date BETWEEN (:startDate) AND (:endDate)
        ${paidType === PaidFilterEnum.ALL ? '' : paidType === PaidFilterEnum.PAID ? ' AND po.is_paid = true' : ' AND po.is_paid = false'}
        UNION
        SELECT
          id,
          page_id ,
          NULL AS "domain",
          status::varchar,
          order_json->'address_billing'->>'first_name' AS "first_name",
          NULL AS "profile_pic",
          order_json->'address_billing'->>'last_name' AS "last_name",
          NULL AS "psid",
          order_channel::varchar AS "platform",
          created_at,
          updated_at,
          NULL AS "tracking_no",
          is_paid,
          NULL AS "flat_rate",
          CAST(order_json->>'shipping_fee' as NUMERIC) AS delivery_fee,
          NULL AS "uuid",
          NULL AS logistic_name,
          NULL AS logistic_type,
          CAST(order_json->>'shipping_fee' as NUMERIC) AS delivery_fee,
          NULL AS orderno,
          alias_order_id AS "aliasOrderId",
          NULL AS "aliases"
        FROM
          purchasing_orders po
        WHERE
          page_id = :pageID
          AND status =  'CLOSE_SALE'
          AND order_channel IN ('LAZADA', 'SHOPEE')
          AND status NOT IN ('REJECT', 'EXPIRED' , 'MARKET_PLACE_RETURNED' , 'MARKET_PLACE_IN_CANCEL', 'MARKET_PLACE_FAILED')
          AND po.created_at::date BETWEEN (:startDate) AND (:endDate)
          AND po.is_quickpay IS FALSE
          ${paidType === PaidFilterEnum.ALL ? '' : paidType === PaidFilterEnum.PAID ? ' AND po.is_paid = true' : ' AND po.is_paid = false'}
        ORDER BY
        created_at
        ${query.orderMethod === 'asc' ? query.orderMethod : 'desc'}
      ),
      Count_CTE
      AS
      (
        SELECT CAST(COUNT(*) as INT) totalrows FROM Data_CTE
      ),
      Count_PAID_CTE
      AS
      (
        SELECT CAST(COUNT(*) as INT) totalPaidRows FROM Data_CTE WHERE is_paid IS TRUE
      ),
      Count_UNPAID_CTE
      AS
      (
        SELECT CAST(COUNT(*) as INT) totalUnpaidRows FROM Data_CTE WHERE is_paid IS FALSE
      )
      SELECT * FROM Data_CTE
      CROSS JOIN Count_CTE
      CROSS JOIN Count_PAID_CTE
      CROSS JOIN Count_UNPAID_CTE
      ${query.exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'}
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return data;
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrderStatusClosed error: ', err);
    return null;
  }
}

export async function getAudienceListWithPurchaseOrderStatusClosedBySearch(client: Pool, query: IAliases, paidType: PaidFilterEnum): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `WITH Data_CTE 
      AS
      (
        SELECT DISTINCT a.id, a.page_id, a.domain, a.status::varchar, tc.first_name, tc.profile_pic, tc.last_name, tc.psid, tc.platform::varchar, a.created_at, po.updated_at,
        po.tracking_no, po.is_paid, po.flat_rate, po.delivery_fee,po.uuid, lg.name logistic_name, lg.type logistic_type,
        lg.delivery_fee, po.id orderno, po.alias_order_id as "aliasOrderId", tc.aliases
        FROM audience a
          INNER JOIN temp_customers tc ON a.customer_id = tc.id
          LEFT JOIN purchasing_orders po ON po.audience_id = a.id
          LEFT JOIN logistics lg ON po.logistic_id  = lg.id
        WHERE 
          tc.id IS NOT NULL AND
          tc.active IS TRUE AND
          a.domain = '${AudienceDomainType.CUSTOMER}' AND 
          a.status NOT IN ('${AudienceDomainStatus.REJECT}') AND 
          a.page_id = :pageID AND 
          a.status = :status AND
          po.is_quickpay IS FALSE AND
          a.created_at::date BETWEEN (:startDate) AND (:endDate) AND
            (
              lower(tc.first_name) LIKE :search OR
              lower(tc.last_name) LIKE :search OR
              lower(po.id::varchar) LIKE :search
            )
        ${paidType === PaidFilterEnum.ALL ? '' : paidType === PaidFilterEnum.PAID ? ' AND po.is_paid = true' : ' AND po.is_paid = false'}
        UNION
        SELECT
          id,
          page_id ,
          NULL AS "domain",
          status::varchar,
          order_json->'address_billing'->>'first_name' AS "first_name",
          NULL AS "profile_pic",
          order_json->'address_billing'->>'last_name' AS "last_name",
          NULL AS "psid",
          order_channel::varchar AS "platform",
          created_at,
          updated_at,
          NULL AS "tracking_no",
          is_paid,
          NULL AS "flat_rate",
          CAST(order_json->>'shipping_fee' as NUMERIC) AS delivery_fee,
          NULL AS "uuid",
          NULL AS logistic_name,
          NULL AS logistic_type,
          CAST(order_json->>'shipping_fee' as NUMERIC) AS delivery_fee,
          NULL AS orderno,
          alias_order_id AS "aliasOrderId",
          NULL AS "aliases"
        FROM
          purchasing_orders po
        WHERE
          page_id = :pageID
          AND status =  'CLOSE_SALE'
          AND po.is_quickpay IS FALSE
          AND order_channel IN ('LAZADA', 'SHOPEE')
          AND status NOT IN ('REJECT', 'EXPIRED' , 'MARKET_PLACE_RETURNED' , 'MARKET_PLACE_IN_CANCEL', 'MARKET_PLACE_FAILED')
          AND po.created_at::date BETWEEN (:startDate) AND (:endDate)
          AND
            (
              lower(order_json->'address_billing'->>'first_name') LIKE :search OR
              lower(order_json->'address_billing'->>'last_name') LIKE :search OR
              lower(po.id::varchar) LIKE :search
            )
          ${paidType === PaidFilterEnum.ALL ? '' : paidType === PaidFilterEnum.PAID ? ' AND po.is_paid = true' : ' AND po.is_paid = false'}
        ORDER BY
        created_at
        ${query.orderMethod === 'asc' ? query.orderMethod : 'desc'}
      ),
      Count_CTE
      AS
      (
        SELECT CAST(COUNT(*) as INT) totalrows FROM Data_CTE
      ),
      Count_PAID_CTE
      AS
      (
        SELECT CAST(COUNT(*) as INT) totalPaidRows FROM Data_CTE WHERE is_paid IS TRUE
      ),
      Count_UNPAID_CTE
      AS
      (
        SELECT CAST(COUNT(*) as INT) totalUnpaidRows FROM Data_CTE WHERE is_paid IS FALSE
      )
      SELECT * FROM Data_CTE
      CROSS JOIN Count_CTE
      CROSS JOIN Count_PAID_CTE
      CROSS JOIN Count_UNPAID_CTE
      ${query.exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'}
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, query);
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return data;
  } catch (err) {
    console.log('getAudienceListWithPurchaseOrderStatusClosedBySearch error: ', err);
    return null;
  }
}

export async function getAudienceListWithLeadsFollow(client: Pool, query: LeadsFilters, skip: number): Promise<IAudienceWithLeads[]> {
  try {
    const searchStatement = `
      lower(tc.first_name ||' '|| tc.last_name) LIKE :searchvalue
    `;
    const statements = `
      WITH Data_CTE  AS (
        SELECT au.id, au.page_id, au.created_at, au.parent_id, tc.id customer_id, tc.first_name, 
        tc.profile_pic, tc.last_name, tc.psid, tc.platform, tc.aliases, lfr.form_id, lfr.ref, lfr.created_at updated_at
        FROM lead_form_referrals lfr 
        INNER JOIN temp_customers tc ON lfr.customer_id = tc.id
        INNER JOIN audience au ON au.id = lfr.audience_id
        WHERE 
        tc.active IS TRUE AND 
        lfr.page_id = :pageID AND
        lfr.created_at::date BETWEEN (:startdate) AND (:enddate) AND 
        au.status NOT IN ('REJECT','CLOSED') AND 
        ${query.search !== null ? `${searchStatement} AND` : ''}
        lfr.audience_id NOT IN (
            SELECT lfs.audience_id 
            FROM lead_form_submissions lfs 
            WHERE 
            lfs.page_id = :pageID
        )
        ORDER BY
        ${query.orderBy[0] === 'au.created_at' ? query.orderBy : query.orderBy[0] === 'tc.first_name' ? query.orderBy : ''}
        ${query.orderMethod === 'asc' ? query.orderMethod : 'desc'}
      ),
      Count_CTE AS ( SELECT CAST(COUNT(*) as INT) totalrows FROM Data_CTE )
      SELECT * FROM Data_CTE
      CROSS JOIN Count_CTE
      ${query.exportAllRows ? '' : 'OFFSET :skip ROWS FETCH NEXT :limit ROWS ONLY'}
      
    `;
    const { page_id: pageID, status, startDate: startdate, endDate: enddate, pageSize: limit } = query || {};
    const queryBinding = {
      pageID,
      status,
      startdate: getDateByUnitStartOrEnd(startdate, 'START'),
      enddate: getDateByUnitStartOrEnd(enddate, 'END'),
      search: `${query.search !== null ? `${searchStatement} AND` : ''}`,
      skip,
      limit,
    } as IAudienceListInput;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, queryBinding);
    const data = await PostgresHelper.execQuery<IAudienceWithLeads[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getAudienceListWithLeadsFollow err ', err);
    return null;
  }
}

export async function getAudienceListWithLeadsFinished(client: Pool, query: LeadsFilters, skip: number): Promise<IAudienceWithLeads[]> {
  try {
    const searchStatement = `
    (
      lower(tc.first_name ||' '|| tc.last_name) like :searchvalue OR
      lower(lfs.options::json ->0 ->> 'value') like :searchvalue OR
      lower(lfs.options::json ->1 ->> 'value') like :searchvalue OR
      lower(lfs.options::json ->2 ->> 'value') like :searchvalue OR
      lower(lf.name) like :searchvalue 
      ${query.statusBy?.length > 0 ? 'OR lfs.status IN (' + query.statusBy?.join(',') + ')' : ''}
    )
    `;
    const statements = `
    WITH Data_CTE  AS (
      SELECT 
        au.id, au.page_id, au.domain, au.status, au.created_at, au.parent_id, tc.id customer_id, tc.first_name, 
            tc.profile_pic, tc.last_name, tc.psid, tc.platform, tc.aliases, lfs.id submission_id, lfs.created_at updated_at, 
            get_json_value(options, 'name') submit_name, get_json_value(options, 'phoneNumber') submit_mobile,
            get_json_value(options, 'email') submit_email, lf.name form_name,
            CASE lfs.status
              WHEN 'NEW_LEAD' THEN 'เบอร์ใหม่'
              WHEN 'DUPLICATE_NAME' THEN 'ชื่อซ้ำ'
              WHEN 'DUPLICATE_NAME_EMAIL' THEN 'ชื่อและอีเมล์ซ้ำ'
              WHEN 'DUPLICATE_NAME_MOBILE' THEN 'ชื่อและเบอร์ซ้ำ'
              WHEN 'DUPLICATE_EMAIL' THEN 'อีเมล์ซ้ำ'
              WHEN 'DUPLICATE_EMAIL_MOBILE' THEN 'อีเมล์และเบอร์ซ้ำ'
              WHEN 'DUPLICATE_MOBILE' THEN 'เบอร์ซ้ำ'
              WHEN 'DUPLICATE_ALL' THEN 'ข้อมูลซ้ำ'
            END as submit_status
      FROM lead_form_submissions lfs
      INNER JOIN audience au ON lfs.audience_id = au.id
      INNER JOIN temp_customers tc ON lfs.customer_id = tc.id
      INNER JOIN lead_forms lf ON lfs.form_id = lf.id
      WHERE 
        lfs.page_id = :page_id AND 
        lfs.created_at::date BETWEEN (:startdate) AND (:enddate) AND
        lfs.customer_id IS NOT NULL AND 
        ${query.search !== null ? `${searchStatement} AND` : ''}
        tc.active IS TRUE
        ORDER BY 
        ${query.orderBy[0] === 'lfs.created_at' ? query.orderBy : query.orderBy[0] === 'tc.first_name' ? query.orderBy : ''}
        ${query.orderMethod === 'asc' ? query.orderMethod : 'desc'}
      ),
    Count_CTE AS ( SELECT CAST(COUNT(*) AS INT) totalrows FROM Data_CTE )
    SELECT * FROM Data_CTE
    CROSS JOIN Count_CTE
    ${query.exportAllRows ? '' : 'OFFSET :skip ROWS FETCH NEXT :limit ROWS ONLY'}
    `;
    const { page_id, status, startDate: startdate, endDate: enddate, pageSize: limit } = query || {};
    const queryBinding = {
      page_id,
      status,
      startdate: getDateByUnitStartOrEnd(startdate, 'START'),
      enddate: getDateByUnitStartOrEnd(enddate, 'END'),
      searchvalue: query.search !== null ? `${query.search.toLowerCase()}%` : null,
      skip,
      limit,
    } as IAudienceListInput;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, queryBinding);
    const data = await PostgresHelper.execQuery<IAudienceWithLeads[]>(client, sanitizeSQL(sql), bindings);
    return data;
  } catch (err) {
    console.log('getAudienceListWithLeadsFinished err', err);
    return null;
  }
}
export const getAllAudienceByCustomerID = async (
  pageID: number,
  customerID: number,
  searchQuery: string,
  orderQuery: string,
  page: number,
  pageSize: number,
  reasonID: number,
  client: Pool,
): Promise<IAudience[]> => {
  try {
    const bindings = { pageID, customerID, searchQuery: searchQuery, page, pageSize, reasonID };
    const searchQueryString = searchQuery !== '' ? searchQuery : '';
    const SQL = ` 
    WITH Data_CTE 
              AS
                (
                  SELECT 
                    a.id,
                    a.customer_id,
                    (
                      SELECT 
                        reason 
                      FROM 
                        customer_closed_reason _ccr 
                      INNER JOIN 
                        audience_closed_reason_mapping _acrm ON _acrm.reason_id = _ccr.id 
                      WHERE 
                        _acrm.audience_id = a.id 
                      AND 
                        _acrm.page_id = a.page_id 
                    ) AS "reason",
                    a.user_id,
                    a.DOMAIN,
                    a.status,
                    a.created_at,
                    a.score,
                    a.parent_id,
                    a.updated_at,
                    a.is_notify,
                    a.last_platform_activity_date
                  FROM audience a
                  ${reasonID !== -1 ? 'INNER JOIN audience_closed_reason_mapping acrm ON acrm.audience_id = a.id ' : ''}
                  WHERE a.customer_id = :customerID
                  ${reasonID !== -1 ? 'AND acrm.reason_id = :reasonID' : ''}
                  AND a.page_id = :pageID 
                  AND a.parent_id IS NULL
                  ORDER BY  a.last_platform_activity_date DESC NULLS LAST
                ),
                Count_CTE 
                AS 
                (
                    SELECT CAST(COUNT(*) as INT) AS totalrows FROM Data_CTE ${searchQueryString}
                )
                SELECT   *
                FROM Data_CTE
                CROSS JOIN Count_CTE
                ${searchQueryString}
                ORDER BY ${orderQuery}
                OFFSET :page ROWS
                FETCH NEXT :pageSize ROWS ONLY;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);

    const result = await PostgresHelper.execQuery<IAudience[]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
    return result;
  } catch (err) {
    console.log('Error in getting all audience', err);
    return [];
  }
};

export const getPaginationNumberByAudienceID = async (
  pageID: number,
  customerID: number,
  searchQuery: string,
  orderQuery: string,
  page: number,
  pageSize: number,
  reasonID: number,
  client: Pool,
  audienceID: number,
): Promise<IAudiencePagination[]> => {
  try {
    const bindings = { pageID, customerID, searchQuery, page, pageSize, reasonID };
    const SQL = ` 
    WITH Data_CTE 
              AS
                (
                  SELECT 
                    a.id,
                    a.customer_id,
                    (
                      SELECT 
                        reason 
                      FROM 
                        customer_closed_reason _ccr 
                      INNER JOIN 
                        audience_closed_reason_mapping _acrm ON _acrm.reason_id = _ccr.id 
                      WHERE 
                        _acrm.audience_id = a.id 
                      AND 
                        _acrm.page_id = a.page_id 
                    ) AS "reason",
                    a.user_id,
                    a.DOMAIN,
                    a.status,
                    a.created_at,
                    a.score,
                    a.parent_id,
                    a.updated_at,
                    a.is_notify,
                    a.last_platform_activity_date
                  FROM audience a
                  ${reasonID !== -1 ? 'INNER JOIN audience_closed_reason_mapping acrm ON acrm.audience_id = a.id ' : ''}
                  WHERE
                    a.customer_id = :customerID
                  ${reasonID !== -1 ? 'AND acrm.reason_id = :reasonID' : ''}
                  AND 
                  a.page_id = :pageID
                  ORDER BY  a.last_platform_activity_date DESC NULLS LAST
                ),
                Count_CTE 
                AS 
                (
                    SELECT CAST(COUNT(*) as INT) AS totalrows FROM Data_CTE
                )
                SELECT   *
                FROM Data_CTE
                CROSS JOIN Count_CTE
                ${searchQuery !== '' ? searchQuery : ''}
                ORDER BY ${orderQuery}
                OFFSET :page ROWS
                FETCH NEXT :pageSize ROWS ONLY;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execQuery<IAudiencePagination[]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);

    return result;
  } catch (err) {
    console.log('Error in getting all audience', err);
    return [];
  }
};

export const getLastAudienceByCustomerID = async (pageID: number, customerID: number, client: Pool): Promise<IAudience[]> => {
  const bindings = { pageID, customerID };
  const SQL = ` 
      SELECT
        au.id,
        au.customer_id ,
        au.status,
        cs.platform,
        cs.aliases,
        au.last_platform_activity_date
      FROM
        audience au
        INNER JOIN temp_customers cs on au.customer_id = cs.id
      WHERE
        au.customer_id = :customerID
        AND au.page_id = :pageID
        AND au.parent_id IS null
        ORDER BY  au.updated_at DESC
      LIMIT 1;
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  return await PostgresHelper.execQuery<IAudience[]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
};

export const getAudienceLeadContext = async (client: Pool, pageID: number, audienceID: number): Promise<AudienceLeadContext[]> => {
  const SQL = `
    SELECT 
      au.id "audienceID", 
      au.parent_id "parentID", 
      lfr.form_id "formID", 
      lfr.ref "refID", 
      (
        SELECT lfs.id FROM lead_form_submissions lfs WHERE au.id = lfs.audience_id
      ) "submissionID" 
    FROM 
      audience au
    INNER JOIN 
      lead_form_referrals lfr ON au.id = lfr.audience_id
    WHERE 
    au.page_id = $1 AND 
    au.id = $2`;

  return await PostgresHelper.execQuery<AudienceLeadContext[]>(client, SQL, [pageID, audienceID]);
};

export async function getTemplatesByShortcut(client: Pool, aliases: { pageID: number; shortcut: string }, searchQuery: string): Promise<Message[]> {
  const query = `SELECT messages->>'text' as text, messages->>'shortcut' as shortcut FROM chat_templates
  WHERE page_id = :pageID ${sanitizeSQL(searchQuery)} AND type = 'MESSAGE' LIMIT 20`;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  return await PostgresHelper.execQuery<Message[]>(client, sql, bindings);
}

export async function getImageSetsByShortcut(client: Pool, aliases: { pageID: number; shortcut: string }, searchQuery: string): Promise<Message[]> {
  const query = `SELECT messages as images, shortcut FROM chat_templates
  WHERE page_id = :pageID ${sanitizeSQL(searchQuery)} AND type = 'IMAGE' LIMIT 20`;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  return await PostgresHelper.execQuery<Message[]>(client, sql, bindings);
}

export async function getMessageTemplates(client: Pool, pageID: number, filters: MessageTemplatesFilters, searchQuery: string, orderQuery: string): Promise<MessageTemplates[]> {
  const query = `WITH Data_CTE 
  AS (
    SELECT * FROM chat_templates
    WHERE page_id = :pageID
    AND type = 'MESSAGE'
    ${sanitizeSQL(searchQuery)}
    ORDER BY ${sanitizeSQL(orderQuery)}
  ), 
  Count_CTE 
  AS 
  (
      SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
  )
  SELECT * FROM Data_CTE
  CROSS JOIN Count_CTE
  OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { ...filters, pageID });
  return await PostgresHelper.execQuery<MessageTemplates[]>(client, sql, bindings);
}

export async function getImageSets(client: Pool, pageID: number, filters: MessageTemplatesFilters, searchQuery: string): Promise<ImageSetTemplate[]> {
  // ${orderQuery}
  const query = `WITH Data_CTE 
  AS (
    SELECT id, messages as images, shortcut FROM chat_templates
    WHERE page_id = :pageID
    AND type = 'IMAGE'
    ${sanitizeSQL(searchQuery)}
    ORDER BY id DESC
  ), 
  Count_CTE 
  AS 
  (
      SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
  )
  SELECT * FROM Data_CTE
  CROSS JOIN Count_CTE
  OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { ...filters, pageID });
  return await PostgresHelper.execQuery<ImageSetTemplate[]>(client, sql, bindings);
}

// MESSAGE TEMPLATES

export async function getForms(client: Pool, filters: MessageTemplatesFilters, searchQuery: string, orderQuery: string, pageID: number): Promise<FormTemplates[]> {
  const query = ` WITH Data_CTE 
  AS (
    SELECT id, name FROM lead_forms lf WHERE page_id = :pageID
    ${sanitizeSQL(searchQuery)}
    ORDER BY ${sanitizeSQL(orderQuery)}
  ), 
  Count_CTE 
  AS 
  (
      SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
  )
  SELECT * FROM Data_CTE
  CROSS JOIN Count_CTE
  OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { ...filters, pageID });
  return await PostgresHelper.execQuery<FormTemplates[]>(client, sql, bindings);
}

export async function getSocials(client: Pool, pageID: number): Promise<Socials> {
  const sql = `SELECT * FROM 
    (SELECT social_facebook FROM pages WHERE id = $1) AS social_facebook,
    (SELECT social_line FROM pages WHERE id = $1) AS social_line,
    (SELECT social_shopee FROM pages WHERE id = $1) AS social_shopee, 
    (SELECT social_lazada FROM pages WHERE id = $1) AS social_lazada`;

  const result = await PostgresHelper.execQuery<Socials>(client, sql, [pageID]);
  return result[0];
}

export async function getIsAudienceValidForProductLink(client: Pool, audienceID: number, pageID: number): Promise<boolean> {
  try {
    const query = `SELECT
                  count(1) AS "count"
                FROM
                  audience a
                WHERE
                  "domain" IN ('CUSTOMER' ,
                  'AUDIENCE')
                  AND status NOT IN ('REJECT',
                  'CLOSED',
                  'EXPIRED' )
                  AND id = :audienceID 
                  AND page_id = :pageID ; `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { audienceID, pageID });
    const data = await PostgresHelper.execQuery<ICount[]>(client, sql, bindings);
    return isEmpty(data) ? false : +data[0]?.count === 0 ? false : true;
  } catch (error) {
    return false;
  }
}

export async function getAudienceContactListByFollowDomain(
  client: Pool,
  pageID: number,
  listIndex: number,
  skip: number,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT DISTINCT
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.page_id = :pageID AND 
        au.status NOT IN ('${AudienceDomainStatus.CLOSED}','${AudienceDomainStatus.REJECT}','${AudienceDomainStatus.EXPIRED}','${LeadsDomainStatus.FINISHED}') AND
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        }
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.parent_id IS NULL
        ORDER BY 
        au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { pageID, skip, listIndex, search });
    return await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAudienceContactListByOrderDomain(
  client: Pool,
  pageID: number,
  listIndex: number,
  skip: number,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT DISTINCT
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.page_id = :pageID AND
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        } 
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.parent_id IS NULL AND
        domain IN ('CUSTOMER') AND
        status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
        ORDER BY 
        au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { pageID, skip, listIndex, search });
    return await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAudienceContactListByLeadDomain(
  client: Pool,
  pageID: number,
  listIndex: number,
  skip: number,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT DISTINCT
        au.id,
        au.parent_id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
          tc.active IS NOT false AND
          au.page_id = :pageID AND 
          ${
            search !== null
              ? `
          (
            lower(tc.aliases::varchar) LIKE :search OR
            lower(tc.last_name::varchar) LIKE :search OR
            lower(tc.first_name::varchar) LIKE :search
          ) AND
          `
              : ''
          }
          ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
          ${
            noTag === true
              ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
              : ''
          }
          au.domain IN ('AUDIENCE','CUSTOMER') AND
          au.id IN (
            SELECT 
              parent_id
            FROM
              audience a2
            WHERE 
              parent_id IS NOT NULL AND 
              a2.status = 'FOLLOW' AND 
              a2.domain = 'LEADS' AND
              a2.page_id = :pageID  
          )
        ORDER BY 
          au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
        `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID, skip, listIndex });
    return await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAudienceContactFollowDomain(
  client: Pool,
  pageID: number,
  audienceID: number,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts> {
  try {
    const statements = `
        SELECT DISTINCT
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.id = :audienceID AND
        au.page_id = :pageID AND 
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        }
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.status NOT IN ('${AudienceDomainStatus.CLOSED}','${AudienceDomainStatus.REJECT}','${AudienceDomainStatus.EXPIRED}','FINISHED') AND
        au.parent_id IS NULL
        ORDER BY 
        au.last_platform_activity_date
        DESC
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID, audienceID });
    const data = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    if (data.length > 0) {
      return data[0];
    } else return null;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAudienceContactOrderDomain(
  client: Pool,
  pageID: number,
  audienceID: number,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts> {
  try {
    const statements = `
        SELECT DISTINCT
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.id = :audienceID AND
        au.page_id = :pageID AND
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        }
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.parent_id IS NULL AND
        domain IN ('CUSTOMER') AND
        status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
        ORDER BY 
        au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID, audienceID });
    const data = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    if (data.length > 0) {
      return data[0];
    } else return null;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAudienceContactLeadDomain(
  client: Pool,
  pageID: number,
  audienceID: number,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts> {
  try {
    const statements = `
        SELECT DISTINCT
        au.id,
        au.parent_id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
          tc.active IS NOT false AND
          au.page_id = :pageID AND 
          ${
            search !== null
              ? `
          (
            lower(tc.aliases::varchar) LIKE :search OR
            lower(tc.last_name::varchar) LIKE :search OR
            lower(tc.first_name::varchar) LIKE :search
          ) AND
          `
              : ''
          }
          ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
          ${
            noTag === true
              ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
              : ''
          }
          au.id = :audienceID AND 
          au.domain IN ('AUDIENCE','CUSTOMER') AND
          au.id IN (
            SELECT 
              parent_id
            FROM
              audience a2
            WHERE 
              parent_id IS NOT NULL AND 
              a2.status = 'FOLLOW' AND 
              a2.domain = 'LEADS' AND
              a2.page_id = :pageID  
          )
        ORDER BY 
          au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
        `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID, audienceID });
    const data = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    if (data.length > 0) {
      return data[0];
    } else return null;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAudienceContactsFollowDomain(
  client: Pool,
  pageID: number,
  audienceIDs: string,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT  
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.id IN ${audienceIDs} AND
        au.page_id = :pageID AND 
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        }
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.status NOT IN ('${AudienceDomainStatus.CLOSED}','${AudienceDomainStatus.REJECT}','${AudienceDomainStatus.EXPIRED}','FINISHED') AND
        au.parent_id IS NULL
        ORDER BY 
        au.last_platform_activity_date
        DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID });
    const result = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAudienceContactsOffTimes(client: Pool, pageID: number, search: string, searchTags: string, noTag: boolean): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT  
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.page_id = :pageID AND 
        au.is_offtime IS TRUE AND
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        }
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.status NOT IN ('${AudienceDomainStatus.CLOSED}','${AudienceDomainStatus.REJECT}','${AudienceDomainStatus.EXPIRED}','FINISHED') AND
        au.parent_id IS NULL
        ORDER BY 
        au.is_offtime DESC,
        au.last_platform_activity_date DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID });
    const result = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAudienceContactsOrderDomain(
  client: Pool,
  pageID: number,
  audienceIDs: string,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT  
        au.id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
        tc.active IS NOT false AND
        au.id IN ${audienceIDs} AND
        au.page_id = :pageID AND
        ${
          search !== null
            ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND
        `
            : ''
        }
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
            : ''
        }
        au.parent_id IS NULL AND
        domain IN ('CUSTOMER') AND
        status NOT IN ('EXPIRED','REJECT','FINISHED','CLOSED')
        ORDER BY 
        au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
    `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID });
    const result = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getAudienceContactsLeadDomain(
  client: Pool,
  pageID: number,
  audienceIDs: string,
  search: string,
  searchTags: string,
  noTag: boolean,
): Promise<IAudienceContacts[]> {
  try {
    const statements = `
        SELECT  
        au.id,
        au.parent_id,
        au.page_id,
        au.domain,
        au.status,
        au.is_notify,
        au.is_offtime,
        au.last_platform_activity_date,
        au.customer_id,
        au.notify_status,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
        FROM audience au
        INNER JOIN temp_customers tc ON au.customer_id = tc.id
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
          tc.active IS NOT false AND
          au.page_id = :pageID AND 
          ${
            search !== null
              ? `
          (
            lower(tc.aliases::varchar) LIKE :search OR
            lower(tc.last_name::varchar) LIKE :search OR
            lower(tc.first_name::varchar) LIKE :search
          ) AND
          `
              : ''
          }
          ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
          ${
            noTag === true
              ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
              : ''
          }
          au.id IN ${audienceIDs} AND 
          au.domain IN ('AUDIENCE','CUSTOMER') AND
          au.id IN (
            SELECT 
              parent_id
            FROM
              audience a2
            WHERE 
              parent_id IS NOT NULL AND 
              a2.status = 'FOLLOW' AND 
              a2.domain = 'LEADS' AND
              a2.page_id = :pageID  
          )
        ORDER BY 
          au.last_platform_activity_date
        DESC
        OFFSET :skip
        LIMIT :listIndex
        `;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID });
    const result = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getLastTwoOfAudienceByAudienceID(client: Pool, audienceID: number, pageID: number): Promise<{ audienceID: number }[]> {
  const statement = `
    WITH Customer_CTE AS (
      SELECT 
        customer_id 
      FROM 
        audience a 
      WHERE 
        a.id = :audienceID 
      AND
        a.page_id = :pageID
      ) 
    SELECT
      a.id AS "audienceID"
    FROM 
      audience a 
    CROSS JOIN 
      Customer_CTE 
    WHERE 
      a.customer_id = Customer_CTE.customer_id 
    AND
      a.page_id = :pageID
    ORDER BY 
      a.created_at DESC 
    LIMIT 2
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { audienceID, pageID });
  return await PostgresHelper.execQuery<{ audienceID: number }[]>(client, sanitizeSQL(sql), bindings);
}

// Specify audience IDs
export async function getCustomerContacts(
  client: Pool,
  pageID: number,
  audienceIDs: string,
  filters: {
    search: string;
    searchTags: string;
    noTag: boolean;
    contactStatus: AudienceContactStatus;
    groupDomainType: string;
    groupDomainStatus: string;
  },
): Promise<IAudienceContacts[]> {
  const { search, searchTags, noTag, contactStatus } = filters;
  try {
    const contactStatus1 =
      contactStatus === AudienceContactStatus.ALL
        ? ''
        : `a2.status 
          ${contactStatus === AudienceContactStatus.INACTIVE ? 'IN' : 'NOT IN'} 
          (
            '${AudienceDomainStatus.CLOSED}',
            '${AudienceDomainStatus.REJECT}',
            '${AudienceDomainStatus.EXPIRED}',
            '${LeadsDomainStatus.FINISHED}'
          ) AND`;

    const contactStatus2 =
      contactStatus === AudienceContactStatus.ALL
        ? ''
        : `a.status 
      ${contactStatus === AudienceContactStatus.INACTIVE ? 'IN' : 'NOT IN'} 
      (
        '${AudienceDomainStatus.CLOSED}',
        '${AudienceDomainStatus.REJECT}',
        '${AudienceDomainStatus.EXPIRED}',
        '${LeadsDomainStatus.FINISHED}'
      ) AND`;
    const _search =
      search !== null
        ? `
        (
          lower(tc.aliases::varchar) LIKE :search OR
          lower(tc.last_name::varchar) LIKE :search OR
          lower(tc.first_name::varchar) LIKE :search
        ) AND`
        : '';
    const statements = `
    SELECT 
      ( 
        SELECT 
          jsonb_build_object(
            'id',a2.id::Integer,
            'parent_id',a2.parent_id::Integer,
            'status',a2.status,
            'domain',a2.domain,
            'is_notify',a2.is_notify,
            'is_offtime',a2.is_offtime,
            'last_platform_activity_date',a2.last_platform_activity_date,
            'notify_status',a2.notify_status
          )
        FROM audience a2
        WHERE a2.page_id = :pageID AND
        a2.customer_id  = tc.id AND
        a2.id IN ${audienceIDs} AND
        ${contactStatus1}
        a2.parent_id IS NULL
        ORDER BY last_platform_activity_date DESC 
        LIMIT 1
      ) AS a_data,
      tc.id as customer_id,
      tc.page_id,
      tc.first_name, 
      tc.name,
      tc.last_name,
      tc.profile_pic,
      tc.platform,
      tc.aliases
    FROM temp_customers tc
    INNER JOIN audience a ON tc.id = a.customer_id 
    ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
    WHERE 
      tc.page_id = :pageID AND
      a.parent_id IS NULL AND
      a.id IN ${audienceIDs} AND
      ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
      ${
        noTag === true
          ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active  IS TRUE AND ct.active IS TRUE) IS TRUE AND'
          : ''
      }
      ${contactStatus2}
      ${_search}
      tc.active IS TRUE
    GROUP BY tc.id
    ORDER BY MAX(a.last_platform_activity_date) DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { pageID, search });
    return await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
  } catch (error) {
    throw new Error(error);
  }
}

// Limit result(audiences) by number
export async function getCustomerContactList(
  client: Pool,
  pageID: number,
  {
    listIndex,
    skip,
    search,
    searchTags,
    noTag,
    contactStatus,
    groupDomainType: domainType,
    groupDomainStatus: domainStatus,
    fetchLeads,
  }: {
    listIndex: number;
    skip: number;
    search: string;
    searchTags: string;
    noTag: boolean;
    contactStatus: AudienceContactStatus;
    groupDomainType: string;
    groupDomainStatus: string;
    fetchLeads?: boolean;
  },
): Promise<IAudienceContacts[]> {
  try {
    const binding = { pageID, skip, listIndex, search };
    const contactStatusStatement = fetchLeads
      ? ''
      : contactStatus === AudienceContactStatus.ALL
      ? ''
      : `a.status ${contactStatus === AudienceContactStatus.INACTIVE ? 'IN' : 'NOT IN'} ${domainStatus} AND`;
    const contactStatusStatement2 = fetchLeads
      ? ''
      : contactStatus === AudienceContactStatus.ALL
      ? ''
      : `a2.status ${contactStatus === AudienceContactStatus.INACTIVE ? 'IN' : 'NOT IN'} ${domainStatus} AND`;
    const statements = `
        SELECT 
          ( 
            SELECT 
              jsonb_build_object(
                'id',a2.id::Integer,
                'parent_id',a2.parent_id::Integer,
                'status',a2.status,
                'domain',a2.domain,
                'is_notify',a2.is_notify,
                'is_offtime',a2.is_offtime,
                'last_platform_activity_date',a2.last_platform_activity_date,
                'notify_status',a2.notify_status
              )
            FROM audience a2
            WHERE a2.page_id = :pageID AND
            a2.customer_id  = tc.id AND
            ${contactStatusStatement2}
            a2.parent_id IS NULL
            ORDER BY last_platform_activity_date DESC 
            LIMIT 1
          ) AS a_data,
          tc.id as customer_id,
          tc.page_id,
          tc.first_name, 
          tc.name,
          tc.last_name,
          tc.profile_pic,
          tc.platform,
          tc.aliases
        FROM temp_customers tc
        INNER JOIN audience a ON tc.id = a.customer_id 
        ${fetchLeads ? 'INNER JOIN lead_form_referrals lfr ON lfr.audience_id = a.id' : ''}
        ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
        WHERE 
          tc.page_id = :pageID AND
          a.parent_id IS NULL AND
          ${
            fetchLeads
              ? "a.status NOT IN ('REJECT','CLOSED') AND lfr.audience_id NOT IN ( SELECT lfs.audience_id FROM lead_form_submissions lfs WHERE  lfs.page_id = :pageID) AND"
              : ''
          }
          ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
          ${
            noTag === true
              ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = a.customer_id AND ctm.active  IS TRUE AND ct.active IS TRUE  ) IS TRUE AND'
              : ''
          }
          ${contactStatusStatement}
          ${
            search !== null
              ? `
              (
                lower(tc.aliases::varchar) LIKE :search OR
                lower(tc.last_name::varchar) LIKE :search OR
                lower(tc.first_name::varchar) LIKE :search
              ) AND`
              : ''
          }
          ${domainType === null ? '' : `a.domain IN ${domainType} AND`}
          tc.active IS TRUE
        GROUP BY tc.id
        ORDER BY MAX(a.last_platform_activity_date) DESC
        OFFSET :skip
        LIMIT :listIndex 
        `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, binding);
    const result = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCustomerContactsOffTimes(
  client: Pool,
  pageID: number,
  {
    search,
    searchTags,
    noTag,
    contactStatus,
    groupDomainType: domainType,
  }: {
    search: string;
    searchTags: string;
    noTag: boolean;
    contactStatus: AudienceContactStatus;
    groupDomainType: string;
    groupDomainStatus: string;
  },
): Promise<IAudienceContacts[]> {
  try {
    const _contactStatus =
      contactStatus === AudienceContactStatus.ALL
        ? ''
        : `a2.status 
      ${contactStatus === AudienceContactStatus.INACTIVE ? 'IN' : 'NOT IN'} 
      (
        '${AudienceDomainStatus.CLOSED}',
        '${AudienceDomainStatus.REJECT}',
        '${AudienceDomainStatus.EXPIRED}',
        '${LeadsDomainStatus.FINISHED}'
      ) AND`;
    const statements = `
      SELECT 
        ( 
          SELECT 
            jsonb_build_object(
              'id',a2.id::Integer,
              'parent_id',a2.parent_id::Integer,
              'status',a2.status,
              'domain',a2.domain,
              'is_notify',a2.is_notify,
              'is_offtime',a2.is_offtime,
              'last_platform_activity_date',a2.last_platform_activity_date::timestamp,
              'notify_status',a2.notify_status
            )
          FROM audience a2
          WHERE a2.page_id = :pageID AND
          a2.customer_id  = tc.id AND
          a2.is_offtime IS TRUE AND
          ${_contactStatus}
          a2.parent_id IS NULL
          ORDER BY last_platform_activity_date DESC 
          LIMIT 1
        ) AS a_data,
        tc.id as customer_id,
        tc.page_id,
        tc.first_name, 
        tc.name,
        tc.last_name,
        tc.profile_pic,
        tc.platform,
        tc.aliases
      FROM temp_customers tc
      INNER JOIN audience a ON tc.id = a.customer_id 
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE 
        tc.page_id = :pageID AND
        a.parent_id IS NULL AND
        a.is_offtime IS TRUE AND
        ${searchTags !== null ? `ctm.tag_id IN ${searchTags} AND` : ''}
        ${
          noTag === true
            ? '( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = a.customer_id AND ctm.active  IS TRUE AND ct.active IS TRUE ) IS TRUE AND'
            : ''
        }
        ${
          contactStatus === AudienceContactStatus.ALL
            ? ''
            : `a.status 
              ${contactStatus === AudienceContactStatus.INACTIVE ? 'IN' : 'NOT IN'} 
              (
                '${AudienceDomainStatus.CLOSED}',
                '${AudienceDomainStatus.REJECT}',
                '${AudienceDomainStatus.EXPIRED}',
                '${LeadsDomainStatus.FINISHED}'
              ) AND`
        }
        ${
          search !== null
            ? `
            (
              lower(tc.aliases::varchar) LIKE :search OR
              lower(tc.last_name::varchar) LIKE :search OR
              lower(tc.first_name::varchar) LIKE :search
            ) AND`
            : ''
        }
        ${domainType === null ? '' : `a.domain IN ${domainType} AND`}
        tc.active IS TRUE
      GROUP BY tc.id
      ORDER BY MAX(a.last_platform_activity_date) DESC
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { search, pageID });
    const result = await PostgresHelper.execQuery<IAudienceContacts[]>(client, sanitizeSQL(sql), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    throw new Error(error);
  }
}
