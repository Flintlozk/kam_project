import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceLead,
  ICustomerLead,
  IFacebookLeadFormPipelineModel,
  ILeadsForm,
  ILeadsFormComponent,
  ILeadsFormSubmission,
  IMessageFormInput,
  LeadsDomainStatus,
} from '@reactor-room/itopplus-model-lib';
import { head as first, isEmpty } from 'lodash';
import { Pool } from 'pg';

export async function getLeadPipeline(client: Pool, audienceID: number, pageID: number, formRef: string): Promise<IFacebookLeadFormPipelineModel> {
  const SQL = `
  SELECT
    a.status,
    a.created_at "createdAt",
    a.updated_at "updatedAt",
    a.parent_id "parentAudienceId",
    a.id "audienceId",
    a.customer_id "customerId",
    a.page_id "pageId",
    lfr.REF "ref",
    lfr.form_id "formId",
    tc.psid
  FROM audience a
  INNER JOIN lead_form_referrals lfr ON lfr.audience_id = a.id
  INNER JOIN temp_customers tc ON tc.id = a.customer_id
  WHERE a.parent_id = :audienceID
  AND a.page_id = :pageID
  AND a.status NOT IN ('REJECT');
  `;

  const bindings = { pageID, audienceID, formRef };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IFacebookLeadFormPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) return result[0];
  else return null;
}

export async function getPendingLeadByCustomerID(client: Pool, customerID: number, pageID: number): Promise<IFacebookLeadFormPipelineModel> {
  const SQL = `
    SELECT 
      lfr.REF "ref",
      lfr.form_id "formId",
      lfr.audience_id "audienceId",
      lfr.customer_id "customerId",
      tc.page_id "pageId",
      tc.psid 
    FROM lead_form_referrals lfr
    INNER JOIN temp_customers tc 
      ON tc.id = lfr.customer_id
    WHERE 
      tc.id = :customerID AND
      tc.page_id = :pageID AND 
      lfr.audience_id NOT IN (
        SELECT lfs.audience_id 
        FROM lead_form_submissions lfs 
        WHERE 
        lfs.page_id = :pageID
      )
  `;

  const bindings = { pageID, customerID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IFacebookLeadFormPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) return result[0];
  else return null;
}
export async function getPendingLeadByAudienceID(client: Pool, audienceID: number, pageID: number): Promise<IFacebookLeadFormPipelineModel> {
  const SQL = `
    SELECT 
      lfr.REF "ref",
      lfr.form_id "formId",
      lfr.audience_id "audienceId",
      lfr.customer_id "customerId",
      tc.page_id "pageId",
      tc.psid 
    FROM lead_form_referrals lfr
    INNER JOIN temp_customers tc 
      ON tc.id = lfr.customer_id
    WHERE 
      lfr.audience_id = :audienceID AND
      lfr.page_id = :pageID AND
      lfr.audience_id NOT IN (
        SELECT lfs.audience_id 
        FROM lead_form_submissions lfs 
        WHERE 
        lfs.page_id = :pageID
      )
  `;

  const bindings = { pageID, audienceID };

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IFacebookLeadFormPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) return result[0];
  else return null;
}

export async function getLeadPipelineByParentID(client: Pool, audienceID: number, pageID: number, status: LeadsDomainStatus): Promise<IFacebookLeadFormPipelineModel> {
  const SQL = `
  SELECT
    a.status,
    a.created_at "createdAt",
    a.updated_at "updatedAt",
    a.parent_id "parentAudienceId",
    a.id "audienceId",
    a.page_id "pageId",
    lfr.REF "ref",
    lfr.form_id "formId",
    tc.psid
  FROM audience a
  INNER JOIN lead_form_referrals lfr ON lfr.audience_id = a.id
  INNER JOIN temp_customers tc ON tc.id = a.customer_id
  WHERE a.parent_id = :audienceID
  AND a.page_id = :pageID
  AND a.status = :status
  AND a.status NOT IN ('REJECT');
  `;

  const bindings = { pageID, audienceID, status };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IFacebookLeadFormPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) return result[0];
  else return null;

  // return await LeadPipelineModel.findOne({
  //   parentAudienceId: audienceID,
  //   formId: formID,
  //   pageId: pageID,
  //   status: status,
  // }).exec();
}

export async function createMessageForm(client: Pool, component: IMessageFormInput, pageid: number): Promise<IMessageFormInput> {
  const SQL = `
    UPDATE 
      lead_forms
    SET
      greeting_message = $1,
      thank_you_message = $2,
      button_input = $3
    WHERE
      page_id = $4 AND
      id = $5
      RETURNING *
  `;
  const result = await PostgresHelper.execQuery<IMessageFormInput[]>(client, SQL, [
    component.greeting_message,
    component.thank_you_message,
    component.button_input,
    pageid,
    component.id,
  ]);
  return first(result);
}

export async function getAudiencesLead(client: Pool, pageID: number, audienceID: number): Promise<AudienceLead> {
  const SQL = 'SELECT form_id,ref FROM lead_form_referrals WHERE page_id = $1 AND audience_id = $2';
  const result = await PostgresHelper.execQuery<AudienceLead[]>(client, SQL, [pageID, audienceID]);
  return first(result);
}
export async function getCustomerAllLeads(client: Pool, pageID: number, customerID: number, page: number, pageSize: number, search: string): Promise<ICustomerLead[]> {
  const searchStatement = `
    LOWER(lfs.options::json ->0 ->> 'value') like :search OR
    LOWER(lfs.options::json ->1 ->> 'value') like :search OR
    LOWER(lfs.options::json ->2 ->> 'value') like :search OR
    LOWER(lf.name) like :search 
  `;

  const statement = `
    WITH Data_CTE AS (
      SELECT * FROM (
        SELECT 
          lf.name "formName",
          lfr.audience_id "audienceID", 
          lfr.customer_id "customerID",
          COALESCE(lfs.created_at,lfr.created_at)"updatedAt",
          lfs."options"::json,
          lfs.id IS NULL "isFollow" 
        FROM lead_form_referrals lfr 
        INNER JOIN lead_forms lf ON lfr.form_id = lf.id
        LEFT JOIN (
          SELECT * FROM lead_form_submissions lfs 
          WHERE lfs.page_id = :pageID
          AND lfs.customer_id IS NOT NULL
          AND lfs.customer_id = :customerID
        ) lfs ON lfs.audience_id = lfr.audience_id 
        WHERE 
          lfr.page_id = :pageID
          AND lfr.customer_id IS NOT NULL
          AND lfr.customer_id = :customerID
          ${search !== null ? `AND ${searchStatement}` : ''}
        ) AS form
      ORDER BY "updatedAt" DESC
    ), Count_CTE AS (SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE)
    SELECT * FROM Data_CTE
    CROSS JOIN Count_CTE
    OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY
  `;
  const binding = {
    pageID,
    customerID,
    page,
    pageSize,
    search: search !== null ? `${search.toLowerCase()}%` : '',
  };

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, binding);
  const result = await PostgresHelper.execQuery<ICustomerLead[]>(client, sql, bindings);
  return result;
}
export async function getCustomerLead(client: Pool, pageID: number, audienceID: number): Promise<ICustomerLead> {
  const statement = `
    SELECT 
      lf.name "formName",
      lfr.audience_id "audienceID", 
      lfr.customer_id "customerID",
      COALESCE(lfs.created_at,lfr.created_at)"updatedAt",
      lfs."options"::json,
      lfs.id IS NULL "isFollow" 
    FROM lead_form_referrals lfr 
    INNER JOIN lead_forms lf ON lfr.form_id = lf.id
    LEFT JOIN (
      SELECT * FROM lead_form_submissions lfs 
      WHERE lfs.page_id = :pageID
      AND lfs.customer_id IS NOT NULL
      AND lfs.audience_id = :audienceID
    ) lfs ON lfs.audience_id = lfr.audience_id 
    WHERE 
      lfr.page_id = :pageID
      AND lfr.customer_id IS NOT NULL
      AND lfr.audience_id = :audienceID
  `;
  const binding = {
    pageID,
    audienceID,
  };
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, binding);
  const result = await PostgresHelper.execQuery<ICustomerLead[]>(client, sql, bindings);
  if (result.length > 0) return result[0];
  else return null;
}

export async function getFormByID(client: Pool, ID: number, pageID: number): Promise<ILeadsForm> {
  const SQL = 'SELECT * FROM lead_forms WHERE id = $1 AND page_id = $2 LIMIT 1';
  const result = await PostgresHelper.execQuery<ILeadsForm[]>(client, SQL, [ID, pageID]);
  return first(result);
}

export async function getFormNameByID(client: Pool, ID: number, pageID: number): Promise<ILeadsForm> {
  const SQL = 'SELECT id, name FROM lead_forms WHERE id = $1 and page_id = $2 LIMIT 1';
  const result = await PostgresHelper.execQuery<ILeadsForm[]>(client, SQL, [ID, pageID]);
  return first(result);
}

export async function getFormsByPageID(client: Pool, pageID: number): Promise<ILeadsForm[]> {
  const SQL = 'SELECT * FROM lead_forms WHERE lead_forms.page_id = $1';
  return await PostgresHelper.execQuery(client, SQL, [pageID]);
}

export async function getFormComponentsByFormID(client: Pool, ID: number, pageID: number): Promise<ILeadsFormComponent[]> {
  const SQL = `SELECT lead_forms.*, lead_form_components.* as components FROM lead_forms 
    LEFT JOIN lead_form_components
    ON lead_forms.id = lead_form_components.form_id 
    WHERE lead_forms.id = $1 AND lead_forms.page_id = $2 ORDER BY lead_form_components.index ASC`;

  const result = await PostgresHelper.execQuery<ILeadsFormComponent[]>(client, SQL, [ID, pageID]);

  if (!isEmpty(result)) {
    const rows = result?.map((row) => {
      const json = String(row.options);
      row.options = JSON.parse(json);
      return row;
    });

    return rows;
  } else {
    throw new Error('Something went wrong');
  }
}

export async function getFormComponentsByPageID(client: Pool, pageID: number): Promise<ILeadsFormComponent[]> {
  const SQL = `SELECT lead_forms.*, lead_form_components.* as components FROM lead_forms 
    LEFT JOIN lead_form_components
    ON lead_forms.id = lead_form_components.form_id
    WHERE lead_forms.page_id = $1
    ORDER BY lead_form_components.index ASC`;

  const result = await PostgresHelper.execQuery<ILeadsFormComponent[]>(client, SQL, [pageID]);

  if (result) {
    const rows = result?.map((row) => {
      const json = String(row.options);
      row.options = JSON.parse(json);
      return row;
    });

    return rows;
  }
}

export async function getFormSubmissionByFormID(client: Pool, ID: number, pageID: number): Promise<ILeadsFormSubmission> {
  const SQL = 'SELECT * FROM lead_form_submissions WHERE form_id = $1 and page_id = $2';
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission[]>(client, SQL, [ID, pageID]);
  return first(result);
}

export async function getFormSubmissionByID(client: Pool, ID: number, pageID: number): Promise<ILeadsFormSubmission> {
  const SQL =
    // eslint-disable-next-line max-len
    `SELECT 
      lfs.id, 
      lfs.page_id, 
      lfs.form_id, 
      lfs."options", 
      lfs.created_at, 
      users.name 
    FROM 
      lead_form_submissions lfs 
    LEFT JOIN users ON lfs.user_id = users.id  
    WHERE 
      lfs.id = $1 
    AND 
      lfs.page_id = $2 
    LIMIT 1`;
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission[]>(client, SQL, [ID, pageID]);
  return first(result);
}

export async function getFinishedLeadByAudienceIDWithoutRef(client: Pool, audienceID: number, pageID: number): Promise<ILeadsFormSubmission[]> {
  const SQL = `
    SELECT 
      lfs.*
    FROM lead_form_submissions lfs
    INNER JOIN lead_form_referrals lfr ON lfr.audience_id = lfs.audience_id 
    WHERE 
      lfs.audience_id = :audienceID AND
      lfs.page_id = :pageID
  `;

  const bindings = { pageID, audienceID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) return result;
  else return null;
}

export async function getFinishedLeadByAudienceID(client: Pool, audienceID: number, pageID: number, ref: string): Promise<ILeadsFormSubmission[]> {
  const SQL = `
    SELECT 
      lfs.*
    FROM lead_form_submissions lfs
    INNER JOIN lead_form_referrals lfr ON lfr.audience_id = lfs.audience_id 
    WHERE 
      lfs.audience_id = :audienceID AND
      lfs.page_id = :pageID AND 
      lfr.ref = :ref
  `;

  const bindings = { pageID, audienceID, ref };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) return result;
  else return null;
}

export async function getFormSubmissionByAudienceID(client: Pool, ID: number, pageID: number): Promise<ILeadsFormSubmission[]> {
  const SQL = 'SELECT * FROM lead_form_submissions WHERE audience_id = $1 and page_id = $2';
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission[]>(client, SQL, [ID, pageID]);
  return !Object.keys(result).length ? [] : result;
}

export async function getLeadStatusFromInput(client: Pool, submitname: string, submitmobile: string, submitemail: string, pageID: number): Promise<string> {
  const SQL = 'SELECT get_lead_status($1, $2, $3, $4) status';
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission>(client, SQL, [submitname, submitmobile, submitemail, pageID]);
  return result[0].status;
}
