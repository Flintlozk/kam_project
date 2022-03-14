import { ICompanyInfo, ITaxInput, ITaxModel } from '@reactor-room/itopplus-model-lib';
import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';

export async function createTax(client: Pool, pageID: number): Promise<IHTTPResult> {
  try {
    const name = 'VAT';
    const taxID = '';
    const tax = '7';
    const status = false;
    const bindings = { pageID, name, taxID, tax, status };
    const SQL = `
                INSERT INTO taxs (page_id, name, tax_id, tax, status)
                SELECT :pageID, :name , :taxID, :tax, :status
                WHERE 
                NOT EXISTS ( SELECT * FROM taxs
                              WHERE page_id =  :pageID
                )
                `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 201,
      value: 'Create tax successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getTaxByPageID(client: Pool, pageID: number): Promise<ITaxModel> {
  try {
    const bindings = { pageID };
    const SQL = 'SELECT * FROM taxs WHERE page_id = :pageID LIMIT 1';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ITaxModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateTax(client: Pool, id: number, taxInputData: ITaxInput): Promise<IHTTPResult> {
  try {
    const { tax_id, tax, status } = taxInputData;
    const bindings = { id, tax_id, tax, status, updatedAt: getUTCDayjs() };
    const SQL = `
                UPDATE taxs
                SET
                    tax_id = :tax_id,
                    tax = :tax,
                    status = :status,
                    updated_at = :updatedAt
                WHERE 
                    id = :id    
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update tax successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function updateTaxByPageID(client: Pool, pageID: number, { tax_identification_number, tax_id }: ICompanyInfo): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, tax_identification_number, tax_id, updatedAt: getUTCDayjs() };
    const SQL = `
                UPDATE taxs
                SET
                    tax_id = :tax_identification_number,
                    updated_at = :updatedAt
                WHERE 
                    page_id = :pageID or id = :tax_id   
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update tax successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateTaxStatus(client: Pool, id: number, status: boolean): Promise<IHTTPResult> {
  try {
    const bindings = { id, status, updatedAt: getUTCDayjs() };
    const SQL = `
                UPDATE taxs
                SET
                    status = :status,
                    updated_at = :updatedAt
                WHERE 
                    id = :id    
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update tax successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function deletePageTax(client: Pool, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID };
    const SQL = `
                  DELETE 
                  FROM taxs
                  WHERE 
                      page_id = :pageID 
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete tax successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
