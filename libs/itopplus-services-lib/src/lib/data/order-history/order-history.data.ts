import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ISubscriptionOrderInput, IOrderHistory, ICreateOrderHistoryResponse, IPayment2C2PResponse } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function getSubScriptionOrderByID(client: Pool, orderID: number): Promise<IOrderHistory> {
  try {
    const bindings = { orderID };
    const SQL = `
      SELECT * from order_history
      WHERE id = :orderID
        `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IOrderHistory[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createSubscriptionOrder(
  client: Pool,
  subscriptionID: string,
  userID: number,
  subscriptionPlanID: number,
  subscriptionOrderInput: ISubscriptionOrderInput,
): Promise<ICreateOrderHistoryResponse> {
  try {
    const { price, discount, first_name, last_name, tel, tax_id, address, sub_district, district, province, post_code, country } = subscriptionOrderInput;
    const bindings = {
      subscriptionID,
      userID,
      subscriptionPlanID,
      price,
      discount,
      first_name,
      last_name,
      tel,
      tax_id,
      address,
      sub_district,
      district,
      province,
      post_code,
      country,
    };
    /* eslint-disable max-len */
    const SQL = `
      INSERT INTO order_history (
        subscription_id,
        user_id,
        subscription_plan_id,
        price,
        discount,
        first_name,
        last_name,
        tel,
        tax_id,
        address,
        sub_district,
        district,
        province,
        post_code,
        country
        )
        VALUES (:subscriptionID, :userID, :subscriptionPlanID, :price, :discount, :first_name, :last_name, :tel, :tax_id, :address, :sub_district, :district, :province, :post_code, :country)
        RETURNING id, subscription_id, price as "recurring_amount"
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ICreateOrderHistoryResponse[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createSubscriptionAdditionOrder(
  client: Pool,
  subscriptionID: string,
  userID: number,
  additionPlanID: number,
  subscriptionOrderInput: ISubscriptionOrderInput,
): Promise<ISubscriptionOrderInput> {
  try {
    const { price, discount, first_name, last_name, tel, tax_id, address, sub_district, district, province, post_code, country } = subscriptionOrderInput;
    const bindings = { subscriptionID, userID, additionPlanID, price, discount, first_name, last_name, tel, tax_id, address, sub_district, district, province, post_code, country };
    const SQL = `
        INSERT INTO order_histosy (
          subscription_id,
          user_id,
          addition_plan_id,
          price,
          discount,
          first_name,
          last_name,
          tel,
          tax_id,
          address,
          sub_district,
          district,
          province,
          post_code,
          country
          )
          VALUES (:subscriptionID, :userID, :additionPlanID, :price, :discount, :first_name, :last_name, :tel, :tax_id, :address, :sub_district, :district, :province, :post_code, :country)
          RETURNING id
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionOrderInput[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateOrderHistory(client: Pool, orderID: number, paymentStatus: string): Promise<IOrderHistory> {
  try {
    const bindings = { orderID, paymentStatus, updatedAt: getUTCDayjs() };
    const SQL = `
    UPDATE order_history 
      SET
        payment_status = :paymentStatus,
        updated_at = :updatedAt,
        paid_at = :updatedAt
      WHERE id = :orderID
      RETURNING * 
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IOrderHistory[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateOrderHistoryFromPaymentResponse(client: Pool, res: IPayment2C2PResponse): Promise<IOrderHistory> {
  try {
    const { payment_status, order_id } = res;
    const bindings = { order_id, payment_status, updatedAt: getUTCDayjs() };
    const SQL = `
      UPDATE order_history 
            SET
              payment_status = :payment_status,
              updated_at = :updatedAt,
              paid_at = :updatedAt
            WHERE id = :order_id
            RETURNING * 
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IOrderHistory[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}
