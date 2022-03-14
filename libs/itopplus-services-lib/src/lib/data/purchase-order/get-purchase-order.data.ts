import { getUTCDayjs, parseTimestampToDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IDObject } from '@reactor-room/model-lib';
import {
  CheckProductsAvaliable,
  CustomerDomainStatus,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  IAliases,
  IAudienceWithPurchasing,
  IExpiryPurchaseOrder,
  IExpiryPurchaseOrderItems,
  IFacebookPipelineModel,
  IProductVaraintsOnCheckingStock,
  IPurchaseOrderFailedParams,
  IPurchaseOrderItemListPaperModel,
  IPurchaseOrderPaperModel,
  IPurchaseOrderRelationIDs,
  IPurchasingOrderFailedHistory,
  IPurchasingOrderQuickpayWebHook,
  IPurchasingOrderTrackingInfo,
  IPurhcaseOrderLogistic,
  IPurhcaseOrderPayment,
  PurchaseCustomerDetail,
  PurchaseInventory,
  PurchaseOrderItems,
  PurchaseOrderList,
  PurchaseOrderModel,
  PurchaseOrderProducts,
  PurchaseOrderStats,
  TrackingOrderDetail,
} from '@reactor-room/itopplus-model-lib';
import { purchaseOrderFailedHistoriesSchemaModel as FailedPurchaseOrderModel } from '@reactor-room/plusmar-model-mongo-lib';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function getPurchaseOrderItemsExpiries(client: Pool): Promise<IExpiryPurchaseOrderItems[]> {
  const joinIn = PostgresHelper.joinInQueries([EnumPurchaseOrderStatus.CLOSE_SALE, EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT, EnumPurchaseOrderStatus.REJECT]);

  const SQL = `
    SELECT
        poi.id AS "purchase_order_item_id",
        poi.purchase_order_id AS "order_id",
        po.page_id
    FROM
      purchasing_order_items poi
    INNER JOIN 
      purchasing_orders po ON po.id = poi.purchase_order_id
    WHERE
      purchase_order_id IN (
      SELECT
        id
      FROM
        purchasing_orders po
      WHERE
        status NOT IN ${joinIn}
        AND po.is_quickpay IS FALSE
        AND po.expired_at < $1
        AND po.expired_at IS NOT NULL );
    `;
  return await PostgresHelper.execQuery<IExpiryPurchaseOrderItems[]>(client, sanitizeSQL(SQL), [getUTCDayjs()]);
}
export async function getExpiredPurchaseOrder(client: Pool): Promise<IExpiryPurchaseOrder[]> {
  const joinIn = PostgresHelper.joinInQueries([EnumPurchaseOrderStatus.CLOSE_SALE, EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT, EnumPurchaseOrderStatus.REJECT]);

  const SQL = `
    SELECT
      po.id as order_id,
      po.page_id
    FROM
      purchasing_orders po
    WHERE
      status NOT IN ${joinIn}
    AND po.is_quickpay IS FALSE
    AND po.expired_at < $1
  `;
  return await PostgresHelper.execQuery<IExpiryPurchaseOrder[]>(client, sanitizeSQL(SQL), [getUTCDayjs()]);
}

export async function getPurchaseOrderPipelineData(client: Pool, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
  const SQL = `SELECT 
        a.id AS "audience_id",
        a.page_id AS "page_id",
        tc.psid AS "psid",
        tc.platform AS "platform",
        po.id AS "order_id",
        a.status AS "pipeline",
        po.logistic_id AS "logistic_id",
        po.payment_id AS "payment_id",
        po.bank_account_id AS "bank_account_id",
        po.is_auto AS "is_auto",
        po.flat_rate as "is_flat_rate",
        tc.id as "customer_id"
      FROM audience a 
      INNER JOIN purchasing_orders po ON a.id = po.audience_id 
      INNER JOIN temp_customers tc ON a.customer_id = tc.id 
      WHERE a.page_id = :pageID 
      AND a.id = :audienceID
      AND po.is_quickpay IS FALSE
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, audienceID });
  const data = await PostgresHelper.execQuery<IFacebookPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}
export async function getCompletePurchaseOrderPipelineData(client: Pool, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
  const SQL = `SELECT 
        a.id AS "audience_id",
        a.page_id AS "page_id",
        tc.psid AS "psid",
        tc.platform AS "platform",
        po.id AS "order_id",
        a.status AS "pipeline",
        po.logistic_id AS "logistic_id",
        po.payment_id AS "payment_id",
        po.bank_account_id AS "bank_account_id",
        po.is_auto AS "is_auto"
      FROM audience a 
      INNER JOIN purchasing_orders po ON a.id = po.audience_id 
      INNER JOIN temp_customers tc ON a.customer_id = tc.id 
      WHERE a.page_id = :pageID 
      AND a.id = :audienceID
      AND po.is_quickpay IS FALSE
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, audienceID });
  const data = await PostgresHelper.execQuery<IFacebookPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}

export async function getPurchaseOrderPipelineDataByOrderID(client: Pool, pageID: number, orderID: number): Promise<IFacebookPipelineModel> {
  const SQL = `SELECT 
        a.id AS "audience_id",
        a.page_id AS "page_id",
        tc.psid AS "psid",
        tc.platform AS "platform",
        po.id AS "order_id",
        a.status AS "pipeline",
        po.logistic_id AS "logistic_id",
        po.payment_id AS "payment_id",
        po.bank_account_id AS "bank_account_id",
        po.is_auto AS "is_auto"
      FROM audience a 
      INNER JOIN purchasing_orders po ON a.id = po.audience_id 
      INNER JOIN temp_customers tc ON a.customer_id = tc.id 
      WHERE a.page_id = :pageID 
      AND po.id = :orderID
      AND po.is_quickpay IS FALSE
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, orderID });
  const data = await PostgresHelper.execQuery<IFacebookPipelineModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}

export function getPurchaseOrderFailedHistory(params: IPurchaseOrderFailedParams): Promise<IPurchasingOrderFailedHistory[]> {
  return new Promise((resolve, reject) => {
    FailedPurchaseOrderModel.find(params)
      .sort({ updatedAt: -1 })
      .exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
}

export async function getPurchasingOrderLogisticInfo(client: Pool, orderId: number, pageId: number): Promise<IPurhcaseOrderLogistic> {
  const SQL = ` 
    SELECT 
    pol.* 
    FROM 
      purchasing_order_logistic pol 
    INNER JOIN  
      purchasing_orders po ON po.id = pol.purchase_order_id
    WHERE 
      pol.purchase_order_id = $1
    AND
      po.page_id = $2
    AND po.is_quickpay IS FALSE
  `;

  const result = await PostgresHelper.execQuery<IPurhcaseOrderLogistic[]>(client, SQL, [orderId, pageId]);

  if (result?.length === 1) {
    return result[0];
  }
  return null;
}

export async function getPurchasingOrderPaymentDetail(client: Pool, pageId: number, orderId: number): Promise<IPurhcaseOrderPayment> {
  const SQL = ` 
    SELECT 
      pop.*,
      p.type 
    FROM 
      purchasing_order_payment pop 
    INNER JOIN
      payments p ON p.id = pop.payment_id
    WHERE 
      pop.purchase_order_id = $1
    AND
      p.page_id = $2
  `;

  const result = await PostgresHelper.execQuery<IPurhcaseOrderPayment[]>(client, SQL, [orderId, pageId]);

  if (result?.length === 1) {
    return result[0];
  }
  return null;
}
export async function getPurchasingOrderSelectedPayment(client: Pool, { pageID, orderID }: { pageID: number; orderID: number }): Promise<IPurhcaseOrderPayment> {
  const SQL = ` 
    SELECT p.* 
    FROM payments p 
    INNER JOIN purchasing_orders po 
      ON po.payment_id = p.id 
    WHERE 
      po.id = $1 
      AND po.page_id = $2
  `;
  const result = await PostgresHelper.execQuery<IPurhcaseOrderPayment[]>(client, SQL, [orderID, pageID]);
  if (result?.length === 1) {
    return result[0];
  }
  return null;
}

export async function getPurchasingOrderPaymentInfo(client: Pool, pageId: number, orderId: number): Promise<IPurhcaseOrderPayment[]> {
  const SQL = ` 
    SELECT 
      pop.*
    FROM 
      purchasing_order_payment pop 
    INNER JOIN  
      purchasing_orders po ON po.id = pop.purchase_order_id
    WHERE 
      pop.purchase_order_id = $1
    AND
      po.page_id = $2
    AND po.is_quickpay IS FALSE
  `;

  return await PostgresHelper.execQuery<IPurhcaseOrderPayment[]>(client, SQL, [orderId, pageId]);
}
export async function getPurchasingOrderUnrefundedPaymentInfo(client: Pool, pageId: number, orderId: number): Promise<IPurhcaseOrderPayment[]> {
  const SQL = ` 
    SELECT 
      pop.*,
      p.type
    FROM 
      purchasing_order_payment pop 
    INNER JOIN  
      purchasing_orders po ON po.id = pop.purchase_order_id
    INNER JOIN  
      payments p ON p.id = pop.payment_id
    WHERE 
      pop.purchase_order_id = $1
    AND
      po.page_id = $2
    AND
      pop.is_refund = FALSE
    AND po.is_quickpay IS FALSE
    ORDER BY
      pop.created_at ASC
  `;

  return await PostgresHelper.execQuery<IPurhcaseOrderPayment[]>(client, SQL, [orderId, pageId]);
}
export async function getPurchasingOrderTrackingInfo(client: Pool, orderId: number, pageId: number): Promise<IPurchasingOrderTrackingInfo> {
  const SQL = ` 
    SELECT 
      poti.*, po.alias_order_id as "aliasOrderId"
    FROM 
      purchasing_order_tracking_info poti 
    INNER JOIN  
      purchasing_orders po ON po.id = poti.purchase_order_id
    WHERE 
      poti.purchase_order_id = $1
    AND
      po.page_id = $2
    AND po.is_quickpay IS FALSE
  `;

  const result = await PostgresHelper.execQuery<IPurchasingOrderTrackingInfo[]>(client, SQL, [orderId, pageId]);

  if (result?.length === 1) {
    return result[0];
  }
  return null;
}

export async function getOrderItemList(client: Pool, pageID: number, orderID: number): Promise<PurchaseOrderItems[]> {
  const SQL = `
  SELECT 
    poi.* 
  FROM 
    purchasing_orders po 
  INNER JOIN 
    purchasing_order_items poi on po.id = poi.purchase_order_id 
  WHERE 
    po.page_id = $1
  AND 
    poi.purchase_order_id = $2
  AND po.is_quickpay IS FALSE
  `;
  return await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, SQL, [pageID, orderID]);
}

export async function getPurchasingOrderItems(client: Pool, pageID: number, audienceID: number, orderID: number): Promise<PurchaseOrderProducts[]> {
  const statement = `
  SELECT 
    po.id                                                             AS "orderId",
    po.total_price                                                    AS "totalPrice",
    poi.id                                                            AS "orderItemId",
    poi.product_variant_id                                            AS "variantId",
    p.id                                                              AS "productId",
    poi.item_quantity                                                 AS "quantity",
    poi.item_price                                                    AS "unitPrice",
    poi.purchase_status                                               AS "isSold",
    coalesce (pv.images::jsonb,p.images::jsonb)                       AS "images",
    p.name "productName",
    string_agg(pa.name,' , ') "attributes"
  FROM 
    purchasing_order_items poi 
  INNER JOIN purchasing_orders po 
        ON (po.id = poi.purchase_order_id ) 
  INNER JOIN product_variants pv 
        ON (pv.id = poi.product_variant_id )
  INNER JOIN products p 
        ON (p.id = pv.product_id )
  INNER JOIN product_attribute_list_mapping palm 
        ON (pv.mapping_id = palm.mapping_id )
  INNER JOIN product_attributes pa 
        ON (pa.id  = palm.attribute_id )
  WHERE 
    po.page_id = :pageID
  AND 
    po.audience_id = :audienceID
  AND
    po.id = :orderID
  AND po.is_quickpay IS FALSE
  GROUP BY 
    po.id,
    p.name,
    p.id,
    poi.product_variant_id,
    poi.id,
    pv.images::jsonb
  ORDER BY poi.created_at ASC
  `;
  const statementParams = { pageID, audienceID, orderID };
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, statementParams);
  return await PostgresHelper.execQuery<PurchaseOrderProducts[]>(client, sql, bindings);
}

export async function getPurchaseOrderRelationIDs(client: Pool, pageID: number, orderID: number): Promise<IPurchaseOrderRelationIDs> {
  const aliases = { pageID, orderID };
  const query = `
    SELECT
      id "orderID",
      audience_id "audienceID",
      payment_id "paymentID",
      logistic_id "logisticID",
      bank_account_id "bankAccountID",
      alias_order_id "aliasOrderID",
      uuid "UUID",
      user_id "userID"
    FROM
      purchasing_orders
    WHERE
      id = :orderID AND
      page_id = :pageID
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  const result = await PostgresHelper.execQuery<IPurchaseOrderRelationIDs[]>(client, sql, bindings);
  if (result?.length > 0) {
    return result[0];
  }
  return null;
}

export async function getPurchaseProductInventory(client: Pool, pageID: number, variantsId: number[]): Promise<PurchaseInventory[]> {
  const query = `
    SELECT
      _pv.id,
      _pv.sku,
      inventory::Integer as "stock",
      inventory::Integer - (
        SELECT COALESCE(sum(item_quantity)::Integer,0)
        FROM purchasing_order_items poi 
        INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id 
        WHERE poi.product_variant_id = _pv.id 
        AND is_reserve = TRUE 
        AND po.status != 'REJECT' 
        AND purchase_status = FALSE
      ) as "inventory"
    FROM
      product_variants _pv
    WHERE
      _pv.page_id = $1
    AND
      _pv.id IN (${variantsId.join(',')})
  `;
  return await PostgresHelper.execQuery<PurchaseInventory[]>(client, sanitizeSQL(query), [pageID]);
}

export async function getPoList(client: Pool, aliases: IAliases, { searchQuery, orderBy, orderMethod, statusQuery, exportAllRows }): Promise<PurchaseOrderList[]> {
  const query = `
    WITH data_cte AS 
    ( 
      SELECT  a.id                                    AS "audienceId", 
              tc.id                                   AS "customerId", 
              tc.profile_pic                          AS "customerImgUrl", 
              Concat(tc.first_name,' ',tc.last_name)  AS "customerName", 
              po.id                                   AS "orderNo", 
              po.total_price                          AS "totalPrice", 
              po.created_at                           AS "createdOrder", 
              po.status,
              l.delivery_type,
              l.tracking_url,
              po.tracking_no,
              po.shipping_date,
              tc.platform AS "customerPlatform" 
      FROM       purchasing_orders po 
      INNER JOIN audience a 
      ON         a.id = po.audience_id 
      INNER JOIN temp_customers tc 
      ON         tc.id = a.customer_id 
      FULL OUTER JOIN logistics l 
      ON         l.id = po.logistic_id 
      WHERE      po.page_id = :pageID 
        AND po.is_quickpay IS FALSE
        AND po.created_at::date BETWEEN (:startDate) AND (:endDate)
        ${searchQuery}
        ${statusQuery}
        ORDER BY ${orderBy.join()} ${orderMethod}
    ), count_cte AS 
    ( SELECT Cast(Count(*) AS INT) AS totalrows 
      FROM  data_cte ) 
    SELECT *
    FROM data_cte 
    CROSS JOIN count_cte 
    ${exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'};
  `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return await PostgresHelper.execQuery(client, sql, bindings);
}

export async function getAudienceOrderAddress(client: Pool, pageID: number, audienceId: number): Promise<PurchaseOrderModel[]> {
  const SQL = `
  SELECT 
    id,
    page_id,
    audience_id,
    shipping_address 
  FROM 
    purchasing_orders po 
  WHERE 
    po.page_id = $1
  AND 
    po.audience_id = $2
  AND po.is_quickpay IS FALSE
    `;
  return await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, SQL, [pageID, audienceId]);
}

export async function getPurchasingOrder(client: Pool, pageID: number, audienceId: number): Promise<PurchaseOrderModel[]> {
  const SQL = `
  SELECT 
    po.*, po.alias_order_id as "aliasOrderId", cs.platform, cs.aliases
  FROM 
    purchasing_orders po 
    INNER JOIN audience au ON po.audience_id = au.id
    INNER JOIN temp_customers cs ON au.customer_id = cs.id
  WHERE 
    po.page_id = $1
  AND 
    po.audience_id = $2
  AND po.is_quickpay IS FALSE
    `;
  return await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, SQL, [pageID, audienceId]);
}

export async function getItemsOfPurchasingOrderByUUID(client: Pool, pageUUID: string, orderUUID: string): Promise<IPurchaseOrderItemListPaperModel[]> {
  const SQL = `
  SELECT
    ROW_NUMBER() OVER (ORDER BY poi.id) AS "index",
    poi.item_quantity AS "quantity",
    poi.product_id AS "productID",
    poi.id AS "itemID",
    poi.product_variant_id AS "varaintID",
    p.name AS "productName",
    string_agg(pa.name, ': ') AS "attributes"
  FROM
    purchasing_orders po
  INNER JOIN purchasing_order_items poi ON
    po.id = poi.purchase_order_id
  INNER JOIN product_variants pv ON
    pv.id = poi.product_variant_id
  INNER JOIN product_attribute_mapping pam ON
    pam.id = pv.mapping_id
  INNER JOIN product_attribute_list_mapping palm ON
    pam.id = palm.mapping_id
  INNER JOIN product_attributes pa ON
    pa.id = palm.attribute_id
  INNER JOIN products p ON 
    p.id = poi.product_id 
  INNER JOIN pages pg ON 
    po.page_id = pg.id
  WHERE
    pg.uuid = $1
    AND po.uuid = $2
    AND poi.purchase_status = TRUE
    AND po.is_quickpay IS FALSE
  GROUP BY
    poi.item_quantity ,
    poi.product_id,
    poi.id,
    poi.product_variant_id,
    p.name
  `;
  return await PostgresHelper.execQuery<IPurchaseOrderItemListPaperModel[]>(client, SQL, [pageUUID, orderUUID]);
}

export async function getPurchasingOrderByUUID(client: Pool, pageUUID: string, orderUUID: string): Promise<IPurchaseOrderPaperModel[]> {
  const SQL = `
  SELECT
    po.id AS "orderID",
    po.alias_order_id AS "aliasOrderID",
    poti.tracking_no AS "trackingNo",
    poti.payload AS "trackingPayload",
    pol.delivery_type AS "deliveryType",
    pol.tracking_type AS "trackingType",
    pm.type = 'CASH_ON_DELIVERY' AS "codEnabled",
    p.page_name AS "pageName",
    p.tel AS "pagePhoneNumber",
    po.total_price as "totalPrice",
    (
      SELECT
        jsonb_build_object( 
          'firstname', _pages.firstname, 
          'lastname', _pages.lastname, 
          'postCode', _pages.post_code, 
          'district', _pages.district, 
          'amphoe', _pages.amphoe, 
          'province', _pages.province, 
          'address', _pages.address 
        )
      FROM
        pages _pages
      WHERE
        _pages.id = po.page_id ) AS "sourceLocation",
    csa.name AS "customerName",
    csa.phone_number "customerPhoneNumber",
    csa."location" AS "customerLocation",
    l.wallet_id as "shopWalletID"
  FROM
    purchasing_orders po
  INNER JOIN purchasing_order_tracking_info poti ON
    po.id = poti.purchase_order_id
  LEFT JOIN purchasing_order_logistic pol ON
    po.id = pol.purchase_order_id
  INNER JOIN customer_shipping_address csa ON
    po.id = csa.purchase_order_id
  INNER JOIN payments pm ON
    po.payment_id = pm.id
  INNER JOIN pages p ON
    po.page_id = p.id
  LEFT JOIN logistics l ON pol.logistic_id = l.id 
  WHERE
    po.uuid = $2
    AND p.uuid = $1
    AND po.is_quickpay IS FALSE

    `;
  return await PostgresHelper.execQuery<IPurchaseOrderPaperModel[]>(client, SQL, [pageUUID, orderUUID]);
}

export async function getPurchasingOrderPaymentType(
  client: Pool,
  pageID: number,
  audienceId: number,
  orderId: number,
): Promise<{ id: number; type: EnumPaymentType; payment_id: number; is_auto: boolean }> {
  const SQL = `
  SELECT 
    po.id,
    po.payment_id,
    p.type,
    po.is_auto
  FROM 
    purchasing_orders po 
  INNER JOIN
    payments p ON p.id = po.payment_id
  WHERE 
    po.page_id = $1
  AND 
    po.audience_id = $2
  AND
    po.id = $3
  AND po.is_quickpay IS FALSE
    `;
  const result = await PostgresHelper.execQuery<{ id: number; type: EnumPaymentType; payment_id: number; is_auto: boolean }[]>(client, SQL, [pageID, audienceId, orderId]);
  if (isEmpty(result)) return null;
  else return result[0];
}

export async function getPurchasingTracking(client: Pool, pageID: number, audienceId: number, orderId: number): Promise<TrackingOrderDetail> {
  const SQL = `
  SELECT 
    po.tracking_no as "trackingNo",
    po.tracking_url as "trackingUrl",
    TO_CHAR(po.shipping_date :: DATE, 'dd/mm/yyyy') as "shippingDate",
    po.shipping_time as "shippingTime",
    l.name as "logisticName",
    l.delivery_type as "logisticType"
  FROM 
    purchasing_orders po 
  INNER JOIN
    logistics l ON po.logistic_id = l.id
  WHERE 
    po.page_id = $1
  AND 
    po.audience_id = $2
  AND
    po.id = $3
  AND po.is_quickpay IS FALSE
    `;
  const data = await PostgresHelper.execQuery<TrackingOrderDetail>(client, SQL, [pageID, audienceId, orderId]);
  return isEmpty(data) ? null : data[0];
}

export async function getPurchasingTrackingInfo(client: Pool, pageID: number, audienceId: number, orderId: number): Promise<TrackingOrderDetail> {
  const SQL = `
  SELECT 
    po.tracking_no as "trackingNo",
    po.tracking_url as "trackingUrl",
    TO_CHAR(po.shipping_date :: DATE, 'dd/mm/yyyy') as "shippingDate",
    po.shipping_time as "shippingTime"
  FROM 
    purchasing_orders po 
  WHERE 
    po.page_id = $1
  AND 
    po.audience_id = $2
  AND
    po.id = $3
  AND po.is_quickpay IS FALSE
    `;
  const data = await PostgresHelper.execQuery<TrackingOrderDetail>(client, SQL, [pageID, audienceId, orderId]);
  return isEmpty(data) ? null : data[0];
}

export async function getPurchasingOrderById(client: Pool, pageID: number, orderId: number): Promise<PurchaseOrderModel> {
  const SQL = `
  SELECT 
    *,
    po.alias_order_id as "aliasOrderId",
    extract(epoch from po.created_at) as create_unixtime,
    extract(epoch from po.updated_at) as update_unixtime
  FROM 
    purchasing_orders po 
  WHERE 
    po.page_id = $1
  AND 
    po.id = $2
  AND 
    po.is_quickpay IS FALSE
    `;
  const data = await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, SQL, [pageID, orderId]);
  return isEmpty(data) ? null : data[0];
}
export async function getAudienceIDOfOrder(client: Pool, pageID: number, orderId: number): Promise<{ audience_id: number }> {
  const SQL = `
  SELECT 
    po.audience_id
  FROM 
    purchasing_orders po 
  WHERE 
    po.page_id = $1
  AND 
    po.id = $2
  AND 
    po.is_quickpay IS FALSE
    `;
  const data = await PostgresHelper.execQuery<{ audience_id: number }[]>(client, SQL, [pageID, orderId]);
  return isEmpty(data) ? null : data[0];
}

export async function getPurchasingOrderByPurchasingOrderID(client: Pool, purchaseOrderID: number): Promise<PurchaseOrderModel> {
  const SQL = `
  SELECT 
    *
  FROM 
    purchasing_orders po 
  WHERE 
    po.id = $1
  AND po.is_quickpay IS FALSE
    `;
  const data = await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, SQL, [purchaseOrderID]);
  return data[0];
}

export async function getPurchasingOrdeAndItemForQuickpayWebhookByPurchasingOrderID(client: Pool, purchaseOrderID: number): Promise<IPurchasingOrderQuickpayWebHook> {
  const SQL = `
    SELECT po.total_price, poi.description, au.customer_id
    FROM purchasing_orders po 
    INNER JOIN purchasing_order_items poi ON po.id = poi.purchase_order_id
    INNER JOIN audience au ON po.audience_id = au.id
    WHERE 
    po.id = $1
  `;
  const data = await PostgresHelper.execQuery<IPurchasingOrderQuickpayWebHook[]>(client, SQL, [purchaseOrderID]);
  return data[0];
}

export async function getUnpaidProductByPurchaseOrderID(client: Pool, pageID: number, orderID: number, audienceID: number): Promise<PurchaseOrderItems[]> {
  const bindings = { pageID, orderID, audienceID };
  const SQL = `
    SELECT 
      poi.* 
    FROM purchasing_order_items poi
    INNER JOIN purchasing_orders po ON poi.purchase_order_id = po.id
    WHERE purchase_status = FALSE 
    AND po.page_id = :pageID
    AND po.id = :orderID
    AND po.audience_id = :audienceID
    AND po.is_quickpay IS FALSE
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  return await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}
export async function getUnreservedProductByPurchaseOrderID(client: Pool, pageID: number, orderID: number, audienceID: number): Promise<PurchaseOrderItems[]> {
  const bindings = { pageID, orderID, audienceID };
  const SQL = `
    SELECT 
      poi.* 
    FROM purchasing_order_items poi
    INNER JOIN purchasing_orders po ON poi.purchase_order_id = po.id
    WHERE is_reserve = FALSE 
    AND po.page_id = :pageID
    AND po.id = :orderID
    AND po.audience_id = :audienceID
    AND po.is_quickpay IS FALSE
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  return await PostgresHelper.execQuery<PurchaseOrderItems[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}
export async function getPoStats(client: Pool, aliases: IAliases, notIncludeFilter = false): Promise<PurchaseOrderStats> {
  let filterQuery = ' AND po.created_at::date BETWEEN (:startDate) AND (:endDate)';
  if (notIncludeFilter) {
    filterQuery = '';
  }

  const query = `select * from 
    (
      SELECT 
        count(id)::Integer as all_po, sum(total_price)::Integer as all_total 
      FROM 
        purchasing_orders as po 
      WHERE 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as all_po,

    (
      SELECT 
        count(id)::Integer as follow_po, sum(total_price) ::Integer as follow_total  
      FROM 
        purchasing_orders as po 
      WHERE 
        po.status in ('FOLLOW') AND 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as follow_po,

    (
      SELECT 
        count(id)::Integer as waiting_payment_po, sum(total_price) ::Integer as waiting_payment_total 
      FROM 
        purchasing_orders as po 
      WHERE 
        po.status in ('WAITING_FOR_PAYMENT') AND 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as waiting_payment_po,

    (
      SELECT 
        count(id)::Integer as confirm_po, sum(total_price)::Integer as confirm_total 
      FROM 
        purchasing_orders as po 
      WHERE 
        po.status in ('CONFIRM_PAYMENT') AND 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as confirm_po,

    (
      SELECT 
        count(id)::Integer as waiting_shipment_po, sum(total_price)::Integer as waiting_shipment_total 
      FROM 
        purchasing_orders as po 
      WHERE 
        po.status in ('WAITING_FOR_SHIPMENT') AND 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as waiting_shipment_po ,

    (
      SELECT 
      count(id)::Integer as close_po, sum(total_price)::Integer as close_total 
    FROM 
      purchasing_orders as po 
    WHERE 
      po.status in ('CLOSE_SALE') AND 
      po.page_id = :pageID 
    AND po.is_quickpay IS FALSE
      ${filterQuery}
    ) as close_po,

    (
      SELECT 
        count(id)::Integer as expired_po 
      FROM 
        purchasing_orders as po 
      WHERE 
        po.status in ('EXPIRED') AND 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as expired_po,

    (
      SELECT 
        count(id)::Integer as reject_po 
      FROM 
        purchasing_orders as po 
      WHERE 
        po.status in ('REJECT') AND 
        po.page_id = :pageID 
      AND po.is_quickpay IS FALSE
        ${filterQuery}
    ) as reject_po
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  const [data]: [PurchaseOrderStats] = await PostgresHelper.execQuery(client, sql, bindings);
  return data;
}

export async function getCustomerAudienceByID(client: Pool, audienceID: number, pageID: number): Promise<PurchaseCustomerDetail> {
  const SQL = `SELECT temp_customers.first_name,
                      temp_customers.last_name,
                      audience.id AS id,
                      temp_customers.id AS customer_id,
                      temp_customers.first_name,
                      temp_customers.last_name,
                      temp_customers.profile_pic,
                      temp_customers.psid,
                      temp_customers.name,
                      temp_customers.phone_number,
                      temp_customers.location
                FROM audience
                INNER JOIN temp_customers ON audience.customer_id = temp_customers.id
                WHERE temp_customers.id IS NOT NULL
                  AND audience.id = $1
                  AND audience.page_id = $2
                LIMIT 1;`;
  const result = await PostgresHelper.execQuery<PurchaseCustomerDetail[]>(client, SQL, [audienceID, pageID]);
  if (result?.length === 1) {
    return result[0];
  }
  return null;
}

export async function getProductVariantsGroup(client: Pool, pageID: number, productID: number[]): Promise<CheckProductsAvaliable[]> {
  const SQL = `
  SELECT 
    pv.id,
    pv.product_id,
    pv.inventory::Integer,
    pv.status,
    pv.active 
  FROM 
    product_variants pv 
  WHERE 
    pv.id IN ${PostgresHelper.joinInQueries(productID)}  
  AND
    pv.page_id = $1 `;
  return await PostgresHelper.execQuery<CheckProductsAvaliable[]>(client, sanitizeSQL(SQL), [pageID]);
}
export async function checkItemsAvaliableByIDs(client: Pool, pageID: number, variantIDs: number[]): Promise<CheckProductsAvaliable[]> {
  const SQL = `
  SELECT 
    id,
    product_id,
    in_stock,
    reserved,
    in_stock - reserved as "inventory",
    status,
    active 
  FROM ( 
    SELECT 
      pv.id,
      pv.product_id,
      pv.inventory::Integer as "in_stock",
      (
        SELECT COALESCE(sum(item_quantity)::Integer,0)
        FROM purchasing_order_items poi 
        INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id 
        WHERE poi.product_variant_id = pv.id 
        AND is_reserve = TRUE 
        AND po.status != 'REJECT' 
        AND purchase_status = FALSE
        AND po.is_quickpay IS FALSE
      ) as reserved,
      pv.status,
      pv.active 
    FROM 
      product_variants pv 
    WHERE 
      pv.id IN ${PostgresHelper.joinInQueries(variantIDs)}  
    AND
      pv.page_id = $1 
    ) as MAIN_QUERY
  `;
  return await PostgresHelper.execQuery<CheckProductsAvaliable[]>(client, sanitizeSQL(SQL), [pageID]);
}
export async function getProductVaraintsOnCheckingStock(client: Pool, pageID: number, variantIDs: number[]): Promise<IProductVaraintsOnCheckingStock[]> {
  const SQL = `
  SELECT
	*
  FROM
    (
    SELECT
      pv.id as "variant_id",
      pv.product_id,
      po."name",
      string_agg(pa."name",' , ') as "attribute",
      pv.inventory::Integer,
      pv.status,
      (
      SELECT
        COALESCE(sum(item_quantity)::Integer, 0)
      FROM
        purchasing_order_items poi
      INNER JOIN purchasing_orders po ON
        po.id = poi.purchase_order_id
      WHERE
        poi.product_variant_id = pv.id
        AND poi.is_reserve = TRUE
        AND po.status != 'REJECT'
        AND purchase_status = FALSE
        AND poi.page_id = $1 ) AS reserved
    FROM
      product_variants pv
    INNER JOIN product_attribute_mapping pam ON
      pam.id = pv.mapping_id
    INNER JOIN product_attribute_list_mapping palm ON
      pam.id = palm.mapping_id
    INNER JOIN product_attributes pa ON
      pa.id = palm.attribute_id
    INNER JOIN products po ON
      po.id = pv.product_id
    WHERE
      po.page_id = $1
      AND po.is_quickpay IS FALSE
      AND pv.id IN ${PostgresHelper.joinInQueries(variantIDs)} 
    GROUP BY po."name",pv.inventory ,pv.status ,pv.id 
      ) 
    AS MAIN_QUERY;
  `;
  return await PostgresHelper.execQuery<IProductVaraintsOnCheckingStock[]>(client, sanitizeSQL(SQL), [pageID]);
}

export async function getAllPOByDate(client: Pool, pageID: number, activeDate: Date): Promise<PurchaseOrderModel[]> {
  const date = parseTimestampToDayjs(activeDate).format('YYYY-MM-DD');

  try {
    const bindings = { pageID, dayjs: date };
    const SQL = `
  SELECT * FROM purchasing_orders po
  WHERE page_id = :pageID
  AND created_at::date >= :dayjs
  `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data;
  } catch (error) {
    console.log('error: ', error);
    throw new Error(error);
  }
}

export async function getAllPOInMonth(client: Pool, pageID: number): Promise<PurchaseOrderModel[]> {
  const date = getUTCDayjs().startOf('month').toDate();
  const endDate = getUTCDayjs().endOf('month').toDate();
  try {
    const bindings = { pageID, startDate: date, endDate: endDate };
    const SQL = `
  SELECT * FROM purchasing_orders po
  WHERE page_id = :pageID
  AND created_at::date >= :startDate
  AND created_at::date <= :endDate
  `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data;
  } catch (error) {
    console.log('error: ', error);
    throw new Error(error);
  }
}

export async function getCurrentPurchaseOrderSelectedOptionForMigrate(client: Pool, pageID: number, audienceID: number, orderID: number): Promise<PurchaseOrderModel[]> {
  const SQL = `
    SELECT
      status,
      logistic_id,
      payment_id,
      bank_account_id
    FROM
      purchasing_orders
    WHERE
      page_id = $1
    AND
      audience_id = $2
    AND
      id = $3
    AND po.is_quickpay IS FALSE
  `;
  return await PostgresHelper.execQuery<PurchaseOrderModel[]>(client, SQL, [pageID, audienceID, orderID]);
}
export async function getTemporaryCourierOrder(client: Pool, orderID: number, pageID: number): Promise<IPurchasingOrderTrackingInfo> {
  const SQL = `
  SELECT 
    l.delivery_type,l.id logistic_id, poti.* 
  FROM 
    purchasing_orders po 
  INNER JOIN logistics l ON l.id = po.logistic_id 
  INNER JOIN purchasing_order_tracking_info poti ON poti.purchase_order_id = po.id 
  WHERE 
    po.id = $1 AND
    po.page_id = $2
  AND po.is_quickpay IS FALSE
  `;
  const result = await PostgresHelper.execQuery<IPurchasingOrderTrackingInfo[]>(client, SQL, [orderID, pageID]);

  if (result?.length > 0) {
    return result[0];
  }
  return null;
}

export async function getMarketPlacePurchaseOrderStatusWaitForPayment(client: Pool, pageID: number, status: CustomerDomainStatus): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `
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
        1 AS "product_amount",
        NULL as "interested_product",
        alias_order_id AS "aliasOrderId",
        NULL AS "aliases"
      FROM
        purchasing_orders po_order
      WHERE
        page_id = :pageID
        AND status =  :status
        AND order_channel IN ('LAZADA', 'SHOPEE')
        AND status NOT IN ('REJECT', 'EXPIRED' , 'MARKET_PLACE_RETURNED' , 'MARKET_PLACE_IN_CANCEL', 'MARKET_PLACE_FAILED');
        AND is_quickpay IS FALSE
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { pageID, status });
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getMarketPlacePurchaseOrderStatusWaitForPayment error: ', err);
    return [];
  }
}

export async function getMarketPlacePurchaseOrderStatusWaitForShipment(client: Pool, pageID: number, status: CustomerDomainStatus): Promise<IAudienceWithPurchasing[]> {
  try {
    const statements = `
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
      total_price,
      is_paid,
      NULL AS "flat_rate",
      NULL AS "payment_name",
      order_json->>'payment_method' AS "payment_type",
      NULL AS logistic_name,
      NULL AS logistic_type,
      order_json->>'shipping_fee' as shipping_fee,
      NULL AS bank_account_id,
      NULL AS bank_account_name,
      NULL AS bank_type,
      is_paid AS is_confirm,
      alias_order_id AS "aliasOrderId",
      NULL AS "aliases"
    FROM
      purchasing_orders po_order
    WHERE
      page_id = :pageID
      AND status =  :status
      AND order_channel IN ('LAZADA', 'SHOPEE')
      AND status NOT IN ('REJECT', 'EXPIRED' , 'MARKET_PLACE_RETURNED' , 'MARKET_PLACE_IN_CANCEL', 'MARKET_PLACE_FAILED');
      AND is_quickpay IS FALSE
    `;

    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statements, { pageID, status });
    const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
    return !isEmpty(data) ? data : [];
  } catch (err) {
    console.log('getMarketPlacePurchaseOrderStatusWaitForShipment error: ', err);
    return [];
  }
}

export async function debugPurchasingOrderData(client: Pool, pageID: number, audienceID: number): Promise<void> {
  const SQL = `
      SELECT 
        po.id AS "orderID",
        po.audience_id "audienceID",
        jsonb_agg(po.*) AS "MAIN_PO", 
        jsonb_agg(poi.*) AS "PO_ITEMS",
        jsonb_agg(pop.*) AS "PO_PAYMENT",
        jsonb_agg(pol.*) AS "PO_LOGISTIC"
      FROM purchasing_orders po 
      INNER JOIN purchasing_order_items poi ON poi.purchase_order_id = po.id 
      INNER JOIN purchasing_order_tracking_info poti ON poti.purchase_order_id = po.id
      INNER JOIN purchasing_order_payment pop ON pop.purchase_order_id = po.id
      INNER JOIN purchasing_order_logistic pol ON pol.purchase_order_id = po.id
      WHERE po.audience_id = :audienceID
      AND po.page_id = :pageID
      AND po.is_quickpay IS FALSE
      GROUP BY po.id, po.audience_id ;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { pageID, audienceID });
  const data = await PostgresHelper.execQuery<IAudienceWithPurchasing[]>(client, sanitizeSQL(sql), bindings);
  console.log('debugPurchasingOrderData >>>>>>>>>>>>>> ', JSON.stringify(data));
}

export async function getOrderExistsByVariantID(client: Pool, pageID: number, variantIDs: number[]): Promise<IDObject[]> {
  const SQL = `
    SELECT
      product_variant_id as id
    FROM
      purchasing_order_items poi
    WHERE
      page_id = $1
      AND product_variant_id = ANY($2 :: int[])
      LIMIT 1
  `;
  const result = await PostgresHelper.execQuery<IDObject[]>(client, SQL, [pageID, variantIDs]);
  return Array.isArray(result) ? result : [];
}
