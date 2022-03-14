import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ILeadsFormReferral, ILeadsFormReferralInput } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function createReferral(client: Pool, referralInput: ILeadsFormReferralInput): Promise<ILeadsFormReferral> {
  const { form_id, page_id, audience_id, customer_id } = referralInput;
  const exists = await getReferralByFormID(client, referralInput);
  if (exists) return exists;
  const SQL = 'INSERT INTO lead_form_referrals (form_id, page_id,audience_id,customer_id, ref) VALUES ($1, $2,$3,$4, DEFAULT) RETURNING *';
  const result = await PostgresHelper.execQuery<ILeadsFormReferral>(client, SQL, [form_id, page_id, audience_id, customer_id]);
  return result[0];
}

export async function getReferralByFormID(client: Pool, referralInput: ILeadsFormReferralInput): Promise<ILeadsFormReferral> {
  const { form_id, page_id, audience_id } = referralInput;
  const SQL = 'SELECT * FROM lead_form_referrals WHERE form_id = $1 AND page_id = $2 AND audience_id = $3';
  const result = await PostgresHelper.execQuery<ILeadsFormReferral>(client, SQL, [form_id, page_id, audience_id]);
  return result[0];
}
export async function getReferralForm(client: Pool, referralInput: ILeadsFormReferralInput): Promise<ILeadsFormReferral> {
  const { form_id, page_id } = referralInput;
  const SQL = 'SELECT * FROM lead_form_referrals WHERE form_id = $1 AND page_id = $2';
  const result = await PostgresHelper.execQuery<ILeadsFormReferral>(client, SQL, [form_id, page_id]);
  return result[0];
}

export async function getReferral(client: Pool, ref: string): Promise<ILeadsFormReferral> {
  const SQL = 'SELECT * FROM lead_form_referrals WHERE ref = $1';
  const result = await PostgresHelper.execQuery<ILeadsFormReferral>(client, SQL, [ref.trim()]);
  return result[0];
}
export async function deleteReferral(client: Pool, audienceID: number): Promise<ILeadsFormReferral> {
  const SQL = 'DELETE FROM lead_form_referrals WHERE audience_id = $1';
  const result = await PostgresHelper.execQuery<ILeadsFormReferral>(client, SQL, [audienceID]);
  return result[0];
}
