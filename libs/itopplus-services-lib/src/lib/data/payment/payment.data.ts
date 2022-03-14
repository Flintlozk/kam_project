import { getUTCTimestamps, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IDObject, IHTTPResult } from '@reactor-room/model-lib';
import {
  BankAccount,
  BankAccountDetail,
  CashOnDeliveryDetail,
  EnumBankAccountType,
  EnumPaymentType,
  I2C2PPaymentModel,
  IOmiseDetail,
  IPayment,
  PaymentDetail,
  PaypalDetail,
  ReturnAddBankAccount,
  SettingPaymentResponse,
} from '@reactor-room/itopplus-model-lib';
import Axios, { AxiosBasicCredentials, AxiosResponse } from 'axios';
import { Pool } from 'pg';

export async function listAllPayment(client: Pool, pageID: number): Promise<[IPayment]> {
  const SQL = `
    SELECT 
      p.*,
      pba.id as bank_id,
      pba.branch_name,
      pba.account_name,
      pba.account_id,
      pba.status as bank_status,
      pba.type as bank_type,
      pba.created_at as bank_created_at, 
      pba.updated_at as bank_updated_at 
    FROM 
      payments p 
    LEFT JOIN 
      payment_bank_accounts pba ON pba.payment_id = p.id 
    WHERE 
      p.page_id = $1
  `;
  const data = await PostgresHelper.execQuery<[IPayment]>(client, SQL, [pageID]);
  return data;
}
export async function listAllPaymentWithCondition(client: Pool, pageID: number): Promise<[IPayment]> {
  const SQL = `
    SELECT 
      p.*,
      pba.id as bank_id,
      pba.branch_name,
      pba.account_name,
      pba.account_id,
      pba.status as bank_status,
      pba.type as bank_type,
      pba.created_at as bank_created_at, 
      pba.updated_at as bank_updated_at 
    FROM 
      payments p 
    LEFT JOIN 
      payment_bank_accounts pba ON pba.payment_id = p.id 
    WHERE 
      p.page_id = $1
    AND
      p.status = TRUE
  `;
  const data = await PostgresHelper.execQuery<[IPayment]>(client, SQL, [pageID]);
  return data;
}

export async function listPayloadPayment(client: Pool, pageID: number): Promise<PaymentDetail[]> {
  const SQL = `
  SELECT 
    p.id,
    p.type,
    p.option
  FROM 
    payments p 
  WHERE 
    p.page_id = $1
  AND
    p.status = $2
`;
  const bankEnable = true;
  const data = await PostgresHelper.execQuery<PaymentDetail[]>(client, SQL, [pageID, bankEnable]);
  return data;
}

export async function listPayloadBankAccount(client: Pool, pageID: number): Promise<BankAccountDetail[]> {
  const SQL = `
  SELECT 
    pba.id as bank_id,
    pba.branch_name,
    pba.account_name,
    pba.account_id,
    pba.status as bank_status,
    pba.type as bank_type,
    pba.created_at as bank_created_at, 
    pba.updated_at as bank_updated_at 
  FROM 
    payments p 
  LEFT JOIN 
    payment_bank_accounts pba ON pba.payment_id = p.id 
  WHERE 
    p.page_id = $1
  and
    p.type = $2
  and
    p.status = $3
  and
    pba.status = $3
  and
    pba.is_deleted = $4
  `;
  const bankEnable = true;
  const isDelete = false;
  const type = 'BANK_ACCOUNT';
  const data = await PostgresHelper.execQuery<BankAccountDetail[]>(client, SQL, [pageID, type, bankEnable, isDelete]);
  return data;
}

export async function getBankAccount(client: Pool, pageID: number): Promise<ReturnAddBankAccount[]> {
  const SQL = `
  SELECT 
    pba.id,
    pba.branch_name,
    pba.account_name,
    pba.account_id,
    pba.status,
    pba.type
  FROM 
    payments p 
  LEFT JOIN 
    payment_bank_accounts pba ON pba.payment_id = p.id 
  WHERE 
    p.page_id = $1
  AND
    p.type = $2
  AND
    pba.is_deleted = $3
  ORDER BY pba.created_at
  `;
  const type = 'BANK_ACCOUNT';
  const data = await PostgresHelper.execQuery<ReturnAddBankAccount[]>(client, SQL, [pageID, type, false]);

  return data;
}

export async function getPaymentById(client: Pool, pageID: number, paymentID: number): Promise<PaymentDetail> {
  const SQL = `
    SELECT 
      * 
    FROM 
      payments p 
    WHERE 
      p.page_id = $1
    AND 
      p.id = $2
`;
  const data = await PostgresHelper.execQuery<PaymentDetail[]>(client, SQL, [pageID, paymentID]);
  return data[0];
}
export async function getBankAccountById(client: Pool, paymentID: number, bankAccountID: number) {
  const SQL = `
    SELECT 
      * 
    FROM 
      payment_bank_accounts p 
    WHERE 
      p.payment_id = $1
    AND 
      p.id = $2
`;
  const data = await PostgresHelper.execQuery(client, SQL, [paymentID, bankAccountID]);
  return data;
}

export async function getBankAccountByIdOnly(client: Pool, bankAccountID: number): Promise<ReturnAddBankAccount> {
  const SQL = `
    SELECT 
      * 
    FROM 
      payment_bank_accounts p 
    WHERE 
      p.id = $1
`;
  const data = await PostgresHelper.execQuery<ReturnAddBankAccount[]>(client, SQL, [bankAccountID]);
  return !isEmpty(data) ? (data[0] as ReturnAddBankAccount) : null;
}

export async function findPayment(client: Pool, pageID: number, type: EnumPaymentType): Promise<PaymentDetail[]> {
  const SQL = `
    SELECT 
      * 
    FROM 
      payments p 
    WHERE 
      p.page_id = $1
    AND 
      type = $2
`;
  const data = await PostgresHelper.execQuery<PaymentDetail[]>(client, SQL, [pageID, type]);
  return data;
}
export async function getPaymentDetail(client: Pool, pageID: number, paymentID: number): Promise<PaymentDetail[]> {
  try {
    const SQL = `
    SELECT 
      * 
    FROM 
      payments p 
    WHERE 
      p.page_id = $1
    AND 
      id = $2
`;
    const data = await PostgresHelper.execQuery<PaymentDetail[]>(client, SQL, [pageID, paymentID]);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getPaymentDetailOfPage(client: Pool, pageID: number): Promise<PaymentDetail[]> {
  const SQL = `
    SELECT 
      * 
    FROM 
      payments p 
    WHERE 
      p.page_id = $1
`;
  const data = await PostgresHelper.execQuery<PaymentDetail[]>(client, SQL, [pageID]);
  return data;
}

export async function insertPayment(client: Pool, pageID: number, type: EnumPaymentType) {
  try {
    const SQL = `
    INSERT INTO payments (
      page_id,
      type,
      status
      )
    VALUES ($1,
          $2,
          $3)
    RETURNING id        
`;
    const data = await PostgresHelper.execSingleWrite<IDObject>(client, SQL, [pageID, type, true]);
    return data;
  } catch (err) {
    console.log('insertPayment err ::::::::::>>> ', err);
  }
}

export async function insertPaymentTypeCOD(client: Pool, pageID: number, type: EnumPaymentType.CASH_ON_DELIVERY, option: CashOnDeliveryDetail) {
  const SQL = `
    INSERT INTO payments (
      page_id,
      type,
      option,
      status
      )
    VALUES ($1,
          $2,
          $3,
          $4)
    RETURNING id        
`;
  const data = await PostgresHelper.execSingleWrite(client, SQL, [pageID, type, JSON.stringify(option), true]);
  return data;
}
export async function updatePaymentTypeCOD(client: Pool, pageID: number, type: EnumPaymentType.CASH_ON_DELIVERY, option: CashOnDeliveryDetail): Promise<void> {
  const SQL = `
    UPDATE
      payments 
    SET 
      option = $1
    WHERE
      page_id = $2
    AND 
      type = $3
        
`;
  await PostgresHelper.execSingleWrite(client, SQL, [JSON.stringify(option), pageID, type]);
}

export async function insertPaymentType2C2P(client: Pool, pageID: number, type: EnumPaymentType.PAYMENT_2C2P, option: I2C2PPaymentModel): Promise<SettingPaymentResponse> {
  const bindings = { pageID, type, option, status: true };
  const SQL = `
    INSERT INTO payments (
      page_id,
      type,
      option,
      status
      )
    VALUES (:pageID,
          :type,
          :option,
          :status) 
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  const response: SettingPaymentResponse = {
    status: 201,
    message: 'Create 2C2P payment successfully!',
  };
  return response;
}

export async function updatePaymentType2C2P(client: Pool, pageID: number, type: EnumPaymentType.PAYMENT_2C2P, option: I2C2PPaymentModel): Promise<SettingPaymentResponse> {
  const bindings = { pageID, type, option };
  const SQL = `
    UPDATE
      payments 
    SET 
      option = :option
    WHERE
      page_id = :pageID
    AND 
      type = :type        
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  const response: SettingPaymentResponse = {
    status: 200,
    message: 'Update 2C2P payment successfully!',
  };
  return response;
}

export async function insertPaymentTypeOmise(client: Pool, pageID: number, type: EnumPaymentType.OMISE, option: IOmiseDetail): Promise<SettingPaymentResponse> {
  const bindings = { pageID, type, option, status: true };
  const SQL = `
    INSERT INTO payments (
      page_id,
      type,
      option,
      status
      )
    VALUES (:pageID,
          :type,
          :option,
          :status) 
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  const response: SettingPaymentResponse = {
    status: 201,
    message: 'Create Omise payment successfully!',
  };
  return response;
}

export async function updatePaymentTypeOmise(client: Pool, pageID: number, type: EnumPaymentType.OMISE, option: IOmiseDetail): Promise<SettingPaymentResponse> {
  const bindings = { pageID, type, option };
  const SQL = `
    UPDATE
      payments 
    SET 
      option = :option
    WHERE
      page_id = :pageID
    AND 
      type = :type        
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  const response: SettingPaymentResponse = {
    status: 200,
    message: 'Update Omise payment successfully!',
  };
  return response;
}

export async function insertPaymentTypePaypal(client: Pool, pageID: number, type: EnumPaymentType.PAYPAL, option: PaypalDetail) {
  const SQL = `
    INSERT INTO payments (
      page_id,
      type,
      option,
      status
      )
    VALUES ($1,
          $2,
          $3,
          $4)
    RETURNING id        
`;
  const data = await PostgresHelper.execSingleWrite(client, SQL, [pageID, type, JSON.stringify(option), true]);
  return data;
}
export async function updatePaymentTypePaypal(client: Pool, pageID: number, type: EnumPaymentType.PAYPAL, option: PaypalDetail) {
  const SQL = `
    UPDATE
      payments 
    SET 
      option = $1
    WHERE
      page_id = $2
    AND 
      type = $3
    RETURNING id        
`;
  const data = await PostgresHelper.execSingleWrite(client, SQL, [JSON.stringify(option), pageID, type]);
  return data;
}

export async function insertBankAccountPayment(client: Pool, paymentID: number, type: EnumBankAccountType, bankAccount: BankAccount) {
  const SQL = `
    INSERT INTO payment_bank_accounts (
        payment_id,
        type,
        branch_name,
        account_id,
        account_name,
        status
        )
    VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
          )
    RETURNING *
`;
  const data = await PostgresHelper.execSingleWrite(client, SQL, [paymentID, type, bankAccount.branchName, bankAccount.accountId, bankAccount.accountName, true]);
  return data;
}

export async function togglePayment(client: Pool, pageID: number, type: EnumPaymentType, status: boolean) {
  const SQL = `
    UPDATE 
      payments 
    SET 
      status = $1,
      updated_at = $2
    WHERE 
      page_id = $3
    AND 
      type = $4
`;
  const data = await PostgresHelper.execQuery(client, SQL, [status, getUTCTimestamps(), pageID, type]);
  return data;
}

export async function findBankAccount(client: Pool, paymentID: number, bankAccountID: number) {
  const SQL = `
      SELECT 
        * 
      FROM 
        payment_bank_accounts pba
      WHERE 
        pba.payment_id = $1
      AND 
        id = $2
`;
  const data = await PostgresHelper.execQuery(client, SQL, [paymentID, bankAccountID]);
  return data;
}

export async function toggleBankAccount(client: Pool, paymentID: number, bankAccountID: number, status: boolean) {
  const SQL = `
    UPDATE 
      payment_bank_accounts 
    SET 
      status = $1,
      updated_at = $2
    WHERE 
      payment_id = $3
    AND 
      id = $4
`;
  const data = await PostgresHelper.execQuery(client, SQL, [status, getUTCTimestamps(), paymentID, bankAccountID]);
  return data;
}

export async function updateBankAccountDetail(client: Pool, paymentID, bankAccountID, bankAccount) {
  const SQL = `
    UPDATE 
      payment_bank_accounts 
    SET 
      branch_name = $1,
      account_name = $2,
      account_id = $3,
      type = $4
    WHERE 
      payment_id = $5
    AND 
      id = $6
`;

  const data = await PostgresHelper.execQuery(client, SQL, [
    bankAccount.branchName,
    bankAccount.accountName,
    bankAccount.accountId,
    bankAccount.bankType,
    paymentID,
    bankAccountID,
  ]);
  return data;
}

export async function removeBankAccountById(client: Pool, paymentID: number, bankAccountID: number): Promise<IHTTPResult> {
  try {
    const bindings = { is_deleted: true, paymentID, bankAccountID };
    const SQL = `
      UPDATE payment_bank_accounts 
      SET is_deleted = :is_deleted
        WHERE 
          payment_id = :paymentID
        AND 
          id = :bankAccountID
`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Remove bank account successfully!',
    };
    return response;
  } catch (err) {
    console.log('err ===> : ', err);
    throw err;
  }
}

export async function getPaypalAuthorization(authUrl: string, authKey: string): Promise<AxiosResponse> {
  try {
    return await Axios.post(authUrl, 'grant_type=client_credentials', {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${authKey}`,
      },
    });
  } catch (err) {
    console.log('getPaypalAuthorization ::::::::::>>> ', err);
    throw err;
  }
}
export async function paypalRefundPost(
  paymentUrl: string,
  accessToken: string,
  captureID: string,
  body: { amount: { currency_code: string; value: string } },
): Promise<AxiosResponse> {
  try {
    return await Axios.post(paymentUrl + captureID + '/refund', body, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    console.log('paypalRefundPost ::::::::::>>> ', err);
    throw err;
  }
}
export async function getPaypalAuthorizedCapture(paymentUrl: string, accessToken: string, captureID: string): Promise<AxiosResponse> {
  return await Axios.get(paymentUrl + captureID, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export async function capturePaypalTransaction(paymentUrl: string, accessToken: string): Promise<AxiosResponse> {
  return await Axios.post(
    paymentUrl,
    {},
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export async function omiseRefundPost(KEY: string, chargeID: string, body: { amount: number }): Promise<AxiosResponse> {
  return await Axios.post(
    `https://api.omise.co/charges/${chargeID}/refunds`,
    body,
    {
      auth: {
        username: KEY,
      } as AxiosBasicCredentials,
      // headers: {
      //   Accept: 'application/json',
      //   Authorization: `Basic ${KEY}`,
      // },
    },
    // {
    //   auth: JSON.parse(JSON.stringify(`{${KEY}:''}`)) as AxiosBasicCredentials,
    // }
  );
}

export async function deleteBankAccountById(client: Pool, paymentID, bankAccountID) {
  const SQL = `
    DELETE FROM 
      payment_bank_accounts 
    WHERE 
      payment_id = $1
    AND 
      id = $2
`;
  const data = await PostgresHelper.execBatchTransaction(client, SQL, [paymentID, bankAccountID]);
  return data;
}

export async function deletePagePayments(client: Pool, pageId: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageId };
    const SQL = `
                  DELETE 
                  FROM payments
                  WHERE 
                      page_id = :pageId 
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

export async function requestPaymentAction2C2P(url, payload: { paymentRequest: string }) {
  const response = await Axios.post(url, payload);
  const { data } = response;
  return data;
}
