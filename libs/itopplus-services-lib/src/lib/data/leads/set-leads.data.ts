import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  ILeadsForm,
  ILeadsFormComponent,
  ILeadsFormComponentInput,
  ILeadsFormReferral,
  ILeadsFormSubmission,
  ILeadsFormSubmissionInput,
  LeadFormSubmissionType,
} from '@reactor-room/itopplus-model-lib';
import { head as first } from 'lodash';
import { Pool } from 'pg';
import { createReferral, getReferralForm } from './leads-form-referrals.data';

export async function createForm(client: Pool, { name, page_id, greeting_message, button_input, thank_you_message }): Promise<ILeadsForm> {
  const SQL = 'INSERT INTO lead_forms (name, page_id,greeting_message,thank_you_message,button_input) VALUES ($1, $2,$3,$4,$5) RETURNING *';
  const result = await PostgresHelper.execQuery<ILeadsForm[]>(client, SQL, [name, page_id, greeting_message, thank_you_message, button_input]);
  return first(result);
}

export async function createFormSubmission(
  client: Pool,
  submission: ILeadsFormSubmissionInput,
  pageID: number,
  type: LeadFormSubmissionType,
  leadStatus: string,
  user_id: number,
): Promise<ILeadsFormSubmission> {
  const binding = [pageID, submission.form_id, submission.audience_id, submission.customer_id, submission.options, type, leadStatus, user_id];
  const SQL = `
  INSERT INTO lead_form_submissions (
    page_id,
    form_id, 
    audience_id,
    customer_id, 
    options,
    type,
    status,
    user_id
  ) 
  VALUES (
    $1, 
    $2, 
    $3, 
    $4,
    $5,
    $6,
    $7,
    $8
  ) 
  RETURNING *`;
  const result = await PostgresHelper.execQuery<ILeadsFormSubmission[]>(client, SQL, binding);
  return first(result);
}

export async function cancelCustomerLeadForm(client: Pool, pageID: number, audienceID: number): Promise<void> {
  const bindings = { pageID, audienceID };
  const SQL = `
    DELETE FROM lead_form_referrals lfr2 WHERE page_id = :pageID AND audience_id = :audienceID
    `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function createFormComponent(client: Pool, component: ILeadsFormComponentInput): Promise<ILeadsFormComponent> {
  const SQL = 'INSERT INTO lead_form_components (form_id, type, index, options) VALUES ($1, $2, $3, $4) RETURNING id, form_id, type, index, options, created_at';
  const result = await PostgresHelper.execBatchTransaction<ILeadsFormComponent[]>(client, SQL, [
    component.form_id,
    component.type,
    component.index,
    JSON.stringify(component.options),
  ]);
  return first(result);
}

export async function getFormReferral(client: Pool, formID: number, pageID: number, audienceID: number): Promise<ILeadsFormReferral> {
  return await createReferral(client, {
    form_id: formID,
    page_id: pageID,
    audience_id: audienceID,
  });
}
export async function getFormReferralByFormID(client: Pool, formID: number, pageID: number): Promise<ILeadsFormReferral> {
  return await getReferralForm(client, { form_id: formID, page_id: pageID });
}

export async function deletePageLeadForms(client: Pool, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID };
    const SQL = `
                  DELETE 
                  FROM lead_forms
                  WHERE 
                      page_id = :pageID 
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete lead forms successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
