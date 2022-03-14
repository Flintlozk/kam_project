import { getUTCMongo, getUTCTimestamps, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceStepStatus,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  IPurchaseOrderFailedParams,
  IPurchaseOrderItemsMarketPlace,
  IPurchaseOrderItemsMarketPlaceUpsertParams,
  IPurchaseOrderMarketPlace,
  IPurchaseOrderMarketPlaceUpsertParamsRequired,
  IPurchasingOrderFailedHistory,
  IPurchasingOrderItemsQuickPayParams,
  IPurchasingOrderQuickPayParams,
  IPurchasingOrderTrackingInfo,
  IPurhcaseOrderLogistic,
  IPurhcaseOrderPayment,
  IQuickPayPaymentSave,
  OrderSettings,
  PurchaseOrderItems,
  TrackingNoInput,
  UpdatePurchasePaymentInput,
} from '@reactor-room/itopplus-model-lib';
import { purchaseOrderFailedHistoriesSchemaModel as FailedPurchaseOrderModel } from '@reactor-room/plusmar-model-mongo-lib';
import { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function updateRefundedPaymentInfo(client: Pool, pageId: number, orderId: number): Promise<IPurhcaseOrderPayment> {
  const SQL = ` 
    UPDATE purchasing_order_payment 
    SET 
      is_refund = TRUE,
      updated_at = $3
    FROM purchasing_order_payment pop
    INNER JOIN  
      purchasing_orders po ON po.id = pop.purchase_order_id
    WHERE
      pop.purchase_order_id = $1
    AND
      po.page_id = $2
    RETURNING *
  `;

  return await PostgresHelper.execQuery<IPurhcaseOrderPayment>(client, SQL, [orderId, pageId, getUTCTimestamps()]);
}
export async function setPurchaseOrderToUnpaid(client: Pool, pageId: number, orderId: number): Promise<void> {
  const SQL = ` 
    UPDATE purchasing_orders
    SET 
      is_paid = FALSE
    WHERE
      id = $1
    AND
      page_id = $2
    RETURNING *
  `;

  await PostgresHelper.execQuery<IPurhcaseOrderPayment>(client, SQL, [orderId, pageId]);
}

export function upsertFailPurchaseOrderStatus(query: IPurchaseOrderFailedParams, fixed: boolean): Promise<IPurchasingOrderFailedHistory> {
  return new Promise((resolve, reject) => {
    const set = {
      isFixed: fixed,
      updatedAt: getUTCMongo(),
    };

    FailedPurchaseOrderModel.findOneAndUpdate(query, set, { new: true, upsert: true }).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

const updatePurchasingStatusSQL = `
    UPDATE
      purchasing_orders    
    SET 
      status = $1,
      updated_at = $2
    WHERE
      page_id = $3
    AND 
      audience_id = $4
    AND
      id = $5
    RETURNING id        
  `;

export async function updatePurchasingStatus(client: Pool, status: EnumPurchaseOrderStatus | AudienceStepStatus, pageID: number, audienceId: number, orderId: number) {
  const SQL = updatePurchasingStatusSQL;
  const binding = [status, getUTCTimestamps(), pageID, audienceId, orderId];

  const data = await PostgresHelper.execQuery(client, SQL, binding);
  return data;
}

export async function updatePurchasingStatusTransaction(client: Pool, status: EnumPurchaseOrderStatus | AudienceStepStatus, pageID: number, audienceId: number, orderId: number) {
  const SQL = updatePurchasingStatusSQL;
  const binding = [status, getUTCTimestamps(), pageID, audienceId, orderId];
  const data = await PostgresHelper.execBatchTransaction(client, SQL, binding);
  return data;
}

export async function updatePurchasingTotalPrice(client: Pool, totalPrice: number, pageID: number, orderId: number): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      total_price = $1,
      net_price = $1,
      updated_at = $2
    WHERE
      page_id = $3
    AND
      id = $4
  `;
  await PostgresHelper.execQuery(client, SQL, [totalPrice, getUTCTimestamps(), pageID, orderId]);
}

export async function updateAutomatePurchasing(client: Pool, isAuto: boolean, pageID: number, orderId: number): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      is_auto = $1,
      updated_at = $2
    WHERE
      page_id = $3
    AND
      id = $4
  `;
  await PostgresHelper.execQuery(client, SQL, [isAuto, getUTCTimestamps(), pageID, orderId]);
}
export async function updateOrderPaymentMethod(client: Pool, paymentID: number, pageID: number, audienceId: number, orderId: number) {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      payment_id = $1,
      updated_at = $2
    WHERE
      page_id = $3
    AND 
      audience_id = $4
    AND
      id = $5
    RETURNING id        
  `;
  const binding = [paymentID, getUTCTimestamps(), pageID, audienceId, orderId];
  try {
    const data = await PostgresHelper.execQuery(client, SQL, binding);
    return data;
  } catch (err) {
    throw new Error(err);
  }
}
export async function updateOrderLogisticMethod(client: Pool, logisiticID: number, pageID: number, audienceId: number, orderId: number) {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      logistic_id = $1,
      updated_at = $2
    WHERE
      page_id = $3
    AND 
      audience_id = $4
    AND
      id = $5
    RETURNING id        
  `;
  const data = await PostgresHelper.execQuery(client, SQL, [logisiticID, getUTCTimestamps(), pageID, audienceId, orderId]);
  return data;
}
export async function updateOrderLogisticInfo(client: Pool, logisticParams: IPurhcaseOrderLogistic): Promise<void> {
  const SQL = `
  INSERT INTO purchasing_order_logistic(
    purchase_order_id, 
    logistic_id, 
    tracking_type, 
    fee_type, 
    delivery_fee, 
    delivery_type, 
    cod_status, 
    courier_pickup
  ) VALUES (
    :purchase_order_id, 
    :logistic_id, 
    :tracking_type, 
    :fee_type, 
    :delivery_fee, 
    :delivery_type, 
    :cod_status, 
    :courier_pickup
  ) 
    ON CONFLICT 
    ON CONSTRAINT 
      purchasing_order_logistic_purchase_order_id_key 
    DO
      UPDATE SET
        logistic_id = :logistic_id,
        tracking_type = :tracking_type,
        fee_type = :fee_type,
        delivery_fee = :delivery_fee,
        delivery_type = :delivery_type,
        cod_status = :cod_status,
        courier_pickup = :courier_pickup,
        updated_at = :updated_at
      RETURNING *
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { ...logisticParams, updated_at: getUTCTimestamps() });
  await PostgresHelper.execQuery(client, sql, bindings);
}

export async function updateOrderTrackingType(client: Pool, orderID: number): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_order_logistic
    SET
      tracking_type = 'MANUAL'
    WHERE
      purchase_order_id = $1 
  `;
  await PostgresHelper.execQuery(client, SQL, [orderID]);
}
export async function updateOrderPaymentInfo(client: Pool, payload: string, transactionID: string, orderID: number, paymentID: number): Promise<void> {
  const binding = { payload, orderID, paymentID, transactionID, updated_at: getUTCTimestamps() };
  const SQL = `
  INSERT INTO purchasing_order_payment(
    purchase_order_id, 
    payment_id, 
    transaction_id,
    payload
  ) VALUES (
    :orderID, 
    :paymentID, 
    :transactionID,
    :payload
  )
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, binding);
  await PostgresHelper.execQuery(client, sql, bindings);
}
export async function updateOrderRefundHistory(client: Pool, payload: string, orderID: number, paymentID: number): Promise<void> {
  const binding = { payload, orderID, paymentID };
  const SQL = `
  INSERT INTO purchasing_order_refund(
    purchase_order_id, 
    payment_id, 
    payload
  ) VALUES (
    :orderID, 
    :paymentID, 
    :payload
  )
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, binding);
  await PostgresHelper.execQuery(client, sql, bindings);
}

export async function updateOrderPayment(client: Pool, pageID: number, payment: UpdatePurchasePaymentInput) {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      paid_amount = $1,
      paid_date = $2,
      paid_time = $3,
      is_paid = $4
    WHERE
      page_id = $5
    AND 
      audience_id = $6
    AND
      id = $7
    RETURNING id        
  `;
  const data = await PostgresHelper.execQuery(client, SQL, [
    Number(payment.amount),
    payment.date,
    payment.time,
    payment.paymentStatus,
    pageID,
    payment.audienceId,
    payment.orderId,
  ]);
  return data;
}
export async function updateOrderPaymentOnBankAccount(client: Pool, pageID: number, payment: UpdatePurchasePaymentInput): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      paid_amount = $1,
      paid_date = $2,
      paid_time = $3,
      is_paid = $4,
      bank_account_id = $5
    WHERE
      page_id = $6
    AND 
      audience_id = $7
    AND
      id = $8
  `;
  await PostgresHelper.execQuery(client, SQL, [
    Number(payment.amount),
    payment.date,
    payment.time,
    payment.paymentStatus,
    payment.bankAccount,
    pageID,
    payment.audienceId,
    payment.orderId,
  ]);
}
export async function updateOrderPaymentProof(client: Pool, pageID: number, payment: UpdatePurchasePaymentInput): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      paid_proof = $1
    WHERE
      page_id = $2
    AND 
      audience_id = $3
    AND
      id = $4
  `;
  await PostgresHelper.execQuery(client, SQL, [payment.imagePayment, pageID, payment.audienceId, payment.orderId]);
}
export async function updateOrderCODProof(client: Pool, pageID: number, audienceID: number, orderID: number): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      paid_proof = $1
    WHERE
      page_id = $2
    AND 
      audience_id = $3
    AND
      id = $4
  `;
  await PostgresHelper.execQuery(client, SQL, [EnumPaymentType.CASH_ON_DELIVERY, pageID, audienceID, orderID]);
}

export async function updatePurchaseOrderItemStatus(client: Pool, pageID: number, orderID: number, isSell: boolean, isReverse: boolean): Promise<PurchaseOrderItems[]> {
  const SQL = `
  UPDATE
    purchasing_order_items
  SET
    purchase_status = $1,
    is_reserve = $2
  WHERE
    page_id = $3
  AND
    purchase_order_id = $4
  RETURNING *
  `;

  const data = await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, SQL, [isSell, isReverse, pageID, orderID]);
  return data;
}
export async function reservedPurchaseOrderItem(client: Pool, pageID: number, orderID: number): Promise<PurchaseOrderItems[]> {
  const isReserve = true;
  const SQL = `
  UPDATE
    purchasing_order_items
  SET
    is_reserve = $1
  WHERE
    page_id = $2
  AND
    purchase_order_id = $3
  RETURNING *
  `;

  const data = await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, SQL, [isReserve, pageID, orderID]);
  return data;
}

export async function singleUpdatePurchaseOrderItemStatus(client: Pool, pageID: number, orderID: number, variantID: number): Promise<PurchaseOrderItems[]> {
  const isSell = true;
  const unsetReserved = false;
  const SQL = `
  UPDATE
    purchasing_order_items
  SET
    purchase_status = $1,
    is_reserve = $2
  WHERE
    page_id = $3
  AND
    purchase_order_id = $4
  AND
    product_variant_id = $5
  RETURNING *
  `;

  const data = await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, SQL, [isSell, unsetReserved, pageID, orderID, variantID]);
  return data;
}

export async function updateProductReserveExpiration(client: Pool, expiredAt: Dayjs, orderID: number, pageID: number, audienceID: number): Promise<void> {
  const SQL = `
  UPDATE
    purchasing_orders    
  SET 
    expired_at = $1
  WHERE
    page_id = $2
  AND 
    audience_id = $3
  AND
    id = $4
`;

  const params = [expiredAt, pageID, audienceID, orderID];
  await PostgresHelper.execQuery(client, SQL, params);
}
export async function updateOrderTracking(client: Pool, pageID: number, audienceID: number, orderID: number, tracking: TrackingNoInput): Promise<TrackingNoInput> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      tracking_no = $1,
      tracking_url = $2,
      shipping_date = $3,
      shipping_time = $4
    WHERE
      page_id = $5
    AND 
      audience_id = $6
    AND
      id = $7
    RETURNING tracking_no as "trackingNo",
              tracking_url as "trackingUrl",
              shipping_date as "shippingDate",
              shipping_time as "shippingTime"

  `;

  const params = [tracking.trackingNo, tracking.trackingUrl, tracking.shippingDate, tracking.shippingTime, pageID, audienceID, orderID];
  const data = await PostgresHelper.execQuery(client, SQL, params);
  return data[0];
}
export async function updateOrderTrackingWihtoutAudienceID(client: Pool, pageID: number, orderID: number, tracking: TrackingNoInput): Promise<TrackingNoInput> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      tracking_no = $1,
      tracking_url = $2,
      shipping_date = $3,
      shipping_time = $4
    WHERE
      page_id = $5
    AND
      id = $6
    RETURNING tracking_no as "trackingNo",
              tracking_url as "trackingUrl",
              shipping_date as "shippingDate",
              shipping_time as "shippingTime"

  `;

  const params = [tracking.trackingNo, tracking.trackingUrl, tracking.shippingDate, tracking.shippingTime, pageID, orderID];
  const data = await PostgresHelper.execQuery(client, SQL, params);
  return data[0];
}
export async function updateCourierTracking(
  client: Pool,
  orderID: number,
  trackingNo: string,
  trackingURL: string,
  payload: string,
  status: boolean,
): Promise<IPurchasingOrderTrackingInfo> {
  const SQL = `
    UPDATE
      purchasing_order_tracking_info
    SET 
      tracking_no = $1,
      tracking_url = $2,
      active = $3,
      payload = $4,
      version = version + 1
    WHERE
      purchase_order_id = $5
    RETURNING *

  `;

  const params = [trackingNo, trackingURL, status, payload, orderID];
  const data = await PostgresHelper.execQuery<IPurchasingOrderTrackingInfo[]>(client, SQL, params);
  return data[0];
}
export async function updateCourierTrackingDate(client: Pool, orderID: number, tracking: TrackingNoInput): Promise<IPurchasingOrderTrackingInfo> {
  const SQL = `
    UPDATE
      purchasing_order_tracking_info
    SET 
      shipping_date = $1,
      shipping_time = $2,
      tracking_no = $3
    WHERE
      purchase_order_id = $4
    RETURNING *

  `;

  const params = [tracking.shippingDate, tracking.shippingTime, tracking.trackingNo, orderID];
  const data = await PostgresHelper.execQuery<IPurchasingOrderTrackingInfo[]>(client, SQL, params);
  return data[0];
}
export async function createPurchasingOrder(
  client: Pool,
  pageID: number,
  audienceID: number,
  status: EnumPurchaseOrderStatus,
  orderSettings: OrderSettings,
  aliasePOID: string,
): Promise<[{ id: number }]> {
  const SQL = `
    INSERT INTO purchasing_orders (
        page_id,
        audience_id,
        status,
        flat_rate,
        delivery_fee,
        tax,
        tax_included,
        alias_order_id
    )
    VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
    )
    RETURNING id
  `;
  const params = [pageID, Number(audienceID), status, orderSettings.flatRate, orderSettings.deliveryFree, orderSettings.taxAmount, orderSettings.taxStatus, aliasePOID];
  const data = await PostgresHelper.execQuery<[{ id: number }]>(client, SQL, params);
  return data;
}

export async function createPurchasingOrderItems(
  client: Pool,
  purchaseOrderId: number,
  productVariantId: number,
  quantity: number,
  pageID: number,
  audienceId: number,
  productId: number,
): Promise<void> {
  const SQL = `
    INSERT INTO purchasing_order_items 
      (
        purchase_order_id,
        product_variant_id,
        item_price,
        item_quantity,
        page_id,
        audience_id,
        product_id
      )
    VALUES (
        $1,
        $2,
        (SELECT unit_price FROM product_variants WHERE id = $2),
        $3,
        $4,
        $5,
        $6
    );
  `;
  const params = [Number(purchaseOrderId), Number(productVariantId), quantity, pageID, audienceId, productId];
  await PostgresHelper.execQuery(client, SQL, params);
}

export async function updatePurchasingOrderItems(client: Pool, orderId: number, variantId: number, quantity: number, itemId: number, pageID: number): Promise<{ id: number }[]> {
  const SQL = `
  UPDATE
    purchasing_order_items    
  SET 
    item_quantity = $1,
    updated_at = $2
  WHERE
    purchase_order_id = $3
  AND 
    product_variant_id = $4
  AND
    id = $5
  AND
    page_id = $6
  RETURNING id 
  `;
  const params = [quantity, getUTCTimestamps(), orderId, variantId, itemId, pageID];
  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, SQL, params);
  return data;
}
export async function activateCustomer(client: Pool, pageID: number, customerID: number) {
  const SQL = `
  UPDATE
    temp_customers    
  SET 
    active = $1,
    updated_at = $2
  WHERE
    page_id = $3
  AND
    id = $4
  `;
  const params = [true, getUTCTimestamps(), pageID, customerID];
  const data = await PostgresHelper.execQuery(client, SQL, params);
  return data;
}

export async function createTemporaryCourierTracking(client: Pool, purchasingOrderID: number): Promise<IPurchasingOrderTrackingInfo> {
  const SQL = `
    INSERT INTO purchasing_order_tracking_info
      (
        purchase_order_id
      )
    SELECT $1 WHERE NOT EXISTS ( 
      SELECT * FROM purchasing_order_tracking_info WHERE purchase_order_id = $1
    )
    RETURNING *
  `;

  const params = [purchasingOrderID];
  const data = await PostgresHelper.execQuery<IPurchasingOrderTrackingInfo>(client, SQL, params);
  return data;
}

export async function releaseReservedPurchaseOrderItem(client: Pool, orderIDs: string, pageIDs: string): Promise<PurchaseOrderItems[]> {
  const isReserve = false;
  const SQL = `
  UPDATE
    purchasing_order_items
  SET
    is_reserve = $1
  WHERE
    page_id = ${pageIDs}
  AND
    purchase_order_id = ${orderIDs}
  RETURNING *
  `;

  const data = await PostgresHelper.execBatchTransaction<PurchaseOrderItems[]>(client, sanitizeSQL(SQL), [isReserve]);
  return data;
}
export async function releaseReservedPurchaseOrderItemBySingleOrderID(client: Pool, orderID: number, pageID: number): Promise<PurchaseOrderItems[]> {
  const isReserve = false;
  const SQL = `
  UPDATE
    purchasing_order_items
  SET
    is_reserve = $1
  WHERE
    page_id = $2
  AND
    purchase_order_id = $3
  RETURNING *
  `;

  const data = await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, sanitizeSQL(SQL), [isReserve, pageID, orderID]);
  return data;
}

export async function resetPurchaseOrderExpired(client: Pool, orderIDs: string, pageIDs: string): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders
    SET
      expired_at = NULL
    WHERE
      id IN ${orderIDs}
    AND
      page_id IN ${pageIDs}
  `;

  await PostgresHelper.execBatchTransaction(client, sanitizeSQL(SQL), []);
}

export async function createPurchasingOrderMarketPlace(client: Pool, orderParams: IPurchaseOrderMarketPlaceUpsertParamsRequired): Promise<IPurchaseOrderMarketPlace> {
  const SQL = `
    INSERT INTO purchasing_orders (
        page_id,
        total_price,
        status,
        created_at,
        updated_at,
        is_paid,
        is_auto,  
        discount,
        order_channel,
        alias_order_id,
        order_json
    )
    VALUES(
      :page_id,
      :total_price,
      :status,
      :created_at,
      :updated_at,
      :is_paid,
      :is_auto,
      :discount,
      :order_channel,
      :alias_order_id,
      :order_json
    )
    ON CONFLICT (alias_order_id, order_channel, page_id)
    DO UPDATE SET status = :status, updated_at = :updated_at, order_json = :order_json
    RETURNING id as "orderID", alias_order_id as "marketPlaceOrderID", order_channel as "orderChannel", page_id as "pageID", status, 
    created_at as "createdAt", updated_at as "updatedAt"
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, orderParams);
  const result = await PostgresHelper.execBatchTransaction<IPurchaseOrderMarketPlace>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(result) ? result : null;
}

export async function createPurchasingOrderItemsMarketPlace(client: Pool, orderItemsParams: IPurchaseOrderItemsMarketPlaceUpsertParams): Promise<IPurchaseOrderItemsMarketPlace> {
  const SQL = `
  INSERT INTO
    purchasing_order_items 
    (
      purchase_order_id,
      product_variant_id,
      product_id,
      page_id,
      item_price,
      item_quantity,
      canceled_quantity,
      purchase_status,
      order_channel,
      sku,
      status,
      discount,
      created_at,
      updated_at,
      canceled_count,
      marketplace_type,
      order_item_json,
      marketplace_variant_id
    )
    VALUES
    (
      :purchase_order_id,
      :product_variant_id,
      :product_id,
      :page_id,
      :item_price,
      :item_quantity,
      :canceled_quantity,
      :purchase_status,
      :order_channel,
      :sku,
      :status,
      :discount,
      :created_at,
      :updated_at,
      :canceled_count,
      :marketplace_type,
      :order_item_json,
      :marketplace_variant_id
    )
    ON CONFLICT (purchase_order_id, sku, order_channel)
    DO UPDATE SET purchase_status = :purchase_status, updated_at = :updated_at, 
    order_item_json = :order_item_json, status = :status, item_quantity = :item_quantity, canceled_quantity = :canceled_quantity, canceled_count = :canceled_count
    Returning id, page_id as "pageID",  purchase_order_id as "purchaseOrderID", status , order_channel as "orderChannel"
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, orderItemsParams);
  const result = await PostgresHelper.execBatchTransaction<IPurchaseOrderItemsMarketPlace>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (!isEmpty(result)) {
    return result;
  } else {
    throw new Error('Error at createPurchasingOrderItemsMarketPlace');
  }
}

export async function updatePurchaseOrderItemsIsQuantityCheck(pageID: number, id: number, isQuantityCheck: boolean, client: Pool): Promise<void> {
  const bindings = {
    id,
    pageID,
    isQuantityCheck,
  };
  const SQL = `
              UPDATE
              purchasing_order_items
              SET
              is_quantity_check = :isQuantityCheck
              WHERE
              page_id = :pageID
              AND id = :id
              Returning *
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function updatePurchaseOrderItemsIsQuantityCheckCountZero(pageID: number, id: number, isQuantityCheck: boolean, client: Pool): Promise<void> {
  const bindings = {
    id,
    pageID,
    isQuantityCheck,
  };
  const SQL = `
              UPDATE
              purchasing_order_items
              SET
              is_quantity_check = :isQuantityCheck, canceled_count = 0
              WHERE
              page_id = :pageID
              AND id = :id
              Returning *
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function createPurchasingOrderForQuickPay(purchasingOrderParams: IPurchasingOrderQuickPayParams, client: Pool): Promise<{ id: number }> {
  const SQL = `
    INSERT INTO purchasing_orders (
      total_price,
      tax,
      status,
      page_id,
      audience_id,
      user_id,
      expired_at,
      is_quickpay,
      discount,
      is_withholding_tax,
      withholding_tax,
      net_price
    )
    VALUES(
      :total_price,
      :tax,
      :status,
      :page_id,
      :audience_id,
      :user_id,
      :expired_at,
      :is_quickpay,
      :discount,
      :is_withholding_tax,
      :withholding_tax,
      :amount_total
    )
    RETURNING id
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, purchasingOrderParams);
  const result = await PostgresHelper.execBatchTransaction<{ id: number }>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result;
}

export async function createPurchasingOrderItemsForQuickPay(purchasingOrderItemsParams: IPurchasingOrderItemsQuickPayParams, client: Pool): Promise<void> {
  const SQL = `
    INSERT INTO purchasing_order_items (
      purchase_order_id,
      page_id,
      audience_id,
      item_price,
      item_quantity,
      is_vat,
      discount,
      description
    )
    VALUES(
      :purchase_order_id,
      :page_id,
      :audience_id,
      :item_price,
      :item_quantity,
      :is_vat,
      :discount,
      :description
    )
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, purchasingOrderItemsParams);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function updatePurchasingOrderCancelFlagAndReason(
  client: Pool,
  pageID: number,
  orderID: number,
  userID: number,
  cancelFlag: boolean,
  description: string,
  status: EnumPurchaseOrderStatus,
): Promise<void> {
  const SQL = `
    UPDATE
      purchasing_orders    
    SET 
      is_cancel = $1,
      description = $2,
      user_id = $3,
      status = $4,
      updated_at = $5
    WHERE
      page_id = $6
    AND
      id = $7
      `;
  await PostgresHelper.execQuery(client, SQL, [cancelFlag, description, userID, status, getUTCTimestamps(), pageID, orderID]);
}

export const saveQuickPayPayment = async (
  pageID: number,
  userID: number,
  id: number,
  status: EnumPurchaseOrderStatus,
  { method, amount, date, time, bankAccountID }: IQuickPayPaymentSave,
  paymentID: number,
  paidProof: string,
  paidFlag: boolean,
  client: Pool,
): Promise<void> => {
  const bindings = {
    id,
    status,
    pageID,
    userID,
    method,
    amount,
    date,
    time,
    paidFlag,
    paidProof,
    paymentID,
    bankAccountID,
    updatedAt: getUTCTimestamps(),
  };
  const SQL = `
  UPDATE
    purchasing_orders    
  SET 
    description = :method,
    paid_amount = :amount,
    user_id = :userID,
    paid_date = :date,
    paid_time = :time,
    paid_proof = :paidProof,
    status = :status,
    is_paid = :paidFlag,
    payment_id = :paymentID,
    bank_account_id = :bankAccountID,
    updated_at = :updatedAt
  WHERE
    page_id = :pageID
  AND
    id = :id
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};
