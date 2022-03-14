import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  IMarketPlaceOrderDetails,
  IMarketPlaceOrderDetailsParams,
  IPurchaseOrderItemsMarketPlace,
  IPurchaseOrderItemsToUpdateInventory,
  OrderChannelTypes,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';

export const getMarketPlaceOrderDetails = async (params: IMarketPlaceOrderDetailsParams, client: Pool): Promise<IMarketPlaceOrderDetails> => {
  const SQL = `
                SELECT
                        id,
                        alias_order_id AS "marketPlaceOrderID",
                        status,
                        total_price AS "totalPrice",
                        order_json->>'payment_method' AS "paymentMethod",
                        order_json->'items_count' AS "itemCount",
                        order_json->'shipping_fee' AS "shippingFee",
                        order_json->'statuses'->>0 AS "marketOrderStatus",
                        created_at AS "createdAt",
                        trim((order_json->'address_billing'->>'first_name') ||' ' || (order_json->'address_billing'->>'last_name')) AS "customerName",
                        (
                          SELECT
                          jsonb_agg(jsonb_build_object(
                              'purchaseOrderItemID', id , 'productID', product_id , 'name',order_item_json->'name',
                              'productVariantID',  product_variant_id, 'unitPrice', item_price, 'sku', sku,'quantity',item_quantity, 
                              'discount', discount, 'productImage' , order_item_json->'product_main_image', 'productMarketLink', order_item_json->'product_detail_url'
                              ))
                          FROM purchasing_order_items poi
                          WHERE
                          purchase_order_id = po.id
                        ) AS "orderItems"
                FROM
                        purchasing_orders po
                WHERE
                        alias_order_id = :marketPlaceOrderID
                        AND order_channel = :orderChannel
                        AND page_id = :pageID
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, params);
  const result = await PostgresHelper.execQuery<IMarketPlaceOrderDetails[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : null;
};

export const getLatestCreatedAtMarketPlaceOrderDate = async (pageID: number, orderChannel: OrderChannelTypes, client: Pool): Promise<Date> => {
  const SQL = `
                SELECT
                          created_at
                FROM
                          purchasing_orders po
                WHERE
                          page_id = :pageID
                AND       order_channel = :orderChannel
                ORDER BY
                          created_at desc
                LIMIT 1;
              `;
  const bindings = {
    pageID,
    orderChannel,
  };

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = (await PostgresHelper.execQuery<[{ created_at: Date }]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return result?.length ? result[0].created_at : null;
};

export const getPurchaseOrderItemsToUpdateInventory = async (client: Pool): Promise<IPurchaseOrderItemsToUpdateInventory[]> => {
  const SQL = `
              SELECT
                poi.id AS "purchaseOrderItemID",
                poi.purchase_order_id AS "purchaseOrderID",
                (select pv.product_id from product_variants pv where pv.id = pmv.product_variant_id) AS "productID",
                pmv.id AS "productMarketVariantID",
                pmv.product_variant_id::INTEGER AS "productVariantID",
                pmv.page_id AS "pageID" ,
                pmv.sku, 
                poi.status AS "orderStatus" ,
                poi.item_quantity AS "orderQuantity",
                poi.canceled_quantity::INTEGER AS "canceledQuantity",
                poi.canceled_count::INTEGER AS "canceledCount",
                poi.order_channel AS "orderChannelType"
              FROM
                product_marketplace_variants pmv
              JOIN purchasing_order_items poi ON
                (poi.sku = pmv.sku AND poi.marketplace_type = pmv.marketplace_type)
              WHERE
                (pmv.sku,poi.id) IN (
                SELECT
                  sku,
                  id
                FROM
                  purchasing_order_items poi
                WHERE
                  poi.is_quantity_check = FALSE AND order_channel IS NOT NULL AND poi.sku IS NOT NULL AND poi.sku <> '')
                AND pmv.product_variant_id IS NOT NULL;
              `;

  const result = (await PostgresHelper.execQuery<IPurchaseOrderItemsToUpdateInventory[]>(client, SQL, [])) || [];
  return result?.length ? result : null;
};

export const getMarketPlaceOrderItemBySku = async (
  pageID: number,
  orderID: number,
  sku: string,
  orderChannel: OrderChannelTypes,
  client: Pool,
): Promise<IPurchaseOrderItemsMarketPlace> => {
  const SQL = `
            SELECT
              id,
              page_id AS "pageID",
              purchase_order_id AS "purchaseOrderID",
              status ,
              order_channel AS "orderChannel",
              order_item_json AS "orderItemJson"
            FROM
              purchasing_order_items poi
            WHERE
              page_id = :pageID
              AND purchase_order_id = :orderID
              AND sku = :sku
              AND order_channel = :orderChannel
            LIMIT 1;
    `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, orderID, sku, orderChannel });
  const result = (await PostgresHelper.execQuery<IPurchaseOrderItemsMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return !isEmpty(result) && result?.length ? result[0] : null;
};

export const getMarketPlaceOrderItemByMarketPlaceVariantID = async (
  pageID: number,
  orderID: number,
  marketplaceVariantID: string,
  orderChannel: OrderChannelTypes,
  client: Pool,
): Promise<IPurchaseOrderItemsMarketPlace> => {
  const SQL = `
            SELECT
              id,
              page_id AS "pageID",
              purchase_order_id AS "purchaseOrderID",
              status ,
              order_channel AS "orderChannel",
              order_item_json AS "orderItemJson"
            FROM
              purchasing_order_items poi
            WHERE
              page_id = :pageID
              AND purchase_order_id = :orderID
              AND marketplace_variant_id = :marketplaceVariantID
              AND order_channel = :orderChannel
            LIMIT 1;
    `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, orderID, marketplaceVariantID, orderChannel });
  const result = (await PostgresHelper.execQuery<IPurchaseOrderItemsMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings)) || [];
  return !isEmpty(result) && result?.length ? result[0] : null;
};
