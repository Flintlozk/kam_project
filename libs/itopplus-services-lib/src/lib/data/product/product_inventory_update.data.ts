import { getUTCDayjs, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumProductStatus,
  IProductMarketPlace,
  IProductMarketPlaceVariantUpdateInventory,
  IProductUpdateInventoryProcessQueue,
  IProductUpdateInventoryQueue,
  IProductUpdateInventoryQueueItemsPayload,
  IProductUpdateInventoryQueueItemStatus,
  IProductUpdateInventoryQueuePayload,
  IProductUpdateInventoryQueueResponse,
  IProductVariantCurrentInventory,
  IPurchaseOrderItemByOrderVariantID,
  IVariantConnectedMarketPlaces,
  OrderChannelTypes,
  PRODUCT_UPDATE_INVENTORY_QUEUE_MAX_RETRY,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export const productUpdateInventoryQueueInsert = async (
  { pageID, toUpdate, maxRetry, orderID, orderChannelType }: IProductUpdateInventoryQueuePayload,
  client: Pool,
): Promise<IProductUpdateInventoryQueue> => {
  maxRetry = maxRetry ? maxRetry : PRODUCT_UPDATE_INVENTORY_QUEUE_MAX_RETRY;
  const SQL = `
                INSERT INTO product_update_inventory_queue
                (
                    page_id,
                    to_update,
                    max_retry,
                    order_id,
                    order_channel_type
                )
                VALUES
                (
                    :pageID,
                    :toUpdate,
                    :maxRetry,
                    :orderID,
                    :orderChannelType
                )
                RETURNING id, to_update AS "toUpdate"
    `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, toUpdate, maxRetry, orderID, orderChannelType });
  const result = await PostgresHelper.execBatchTransaction<IProductUpdateInventoryQueue>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(result) ? result : ({} as IProductUpdateInventoryQueue);
};

export const productUpdateInventoryItemQueueInsert = async (payload: IProductUpdateInventoryQueueItemsPayload, client: Pool): Promise<void> => {
  const SQL = `INSERT INTO product_update_inventory_items_queue
      (
          queue_id,
          page_id,
          product_id,
          variant_id,
          stock_to_update,
          operation_type,
          market_place_type
      )
      VALUES
      (
          :queueID,
          :pageID,
          :productID,
          :variantID,
          :stockToUpdate,
          :operationType,
          :marketPlaceType
      );
`;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, payload);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const getVariantInventoryByVariantID = async (variantIDs: number[], pageID: number, client: Pool): Promise<IProductVariantCurrentInventory[]> => {
  const SQL = `
                        SELECT
                                id as "variantID",
                                page_id AS "pageID",
                                product_id AS "productID",
                                inventory::INTEGER,
                                sku
                        FROM    product_variants pv
                        WHERE
                                id = ANY($1 :: int[])
                                AND page_id = $2
                                AND active = TRUE ;
    
    `;
  const result = await PostgresHelper.execQuery<IProductVariantCurrentInventory[]>(client, SQL, [variantIDs, pageID]);
  return !isEmpty(result) ? result : [];
};

export const getVariantConnectedMarketPlaces = async (variantIDs: number[], pageID: number, client: Pool): Promise<IVariantConnectedMarketPlaces[]> => {
  const SQL = `
                SELECT
                  product_variant_id::INTEGER AS "variantID",
                  marketplace_type AS "marketPlaceType",
                  (
                    SELECT 
                      product_id 
                    FROM product_variants pv WHERE pmv.product_variant_id = pv.id AND pv.page_ID = $2
                  ) AS "productID"
                FROM
                  product_marketplace_variants pmv
                WHERE
                  product_variant_id = ANY($1 :: int[])
                AND page_id = $2
                AND active = true ;
    
    `;

  const result = await PostgresHelper.execQuery<IVariantConnectedMarketPlaces[]>(client, SQL, [variantIDs, pageID]);
  return !isEmpty(result) ? result : [];
};

export const getProductUpdateInventoryQueue = async ({ queueID, pageID }: IProductUpdateInventoryQueueResponse, client: Pool): Promise<IProductUpdateInventoryProcessQueue[]> => {
  const SQL = `
              SELECT
                pq.id AS "queueID",
                pqi.id AS "queueItemID",
                pqi.stock_to_update AS "stockToUpdate",
                pqi.market_place_type AS "marketPlaceType",
                pqi.operation_type AS "operationType",
                pq.page_id :: INTEGER AS "pageID",
                pqi.variant_id :: INTEGER AS "variantID",
                pqi.product_id :: INTEGER AS "productID",
                pq.order_id AS "orderID",
                pq.order_channel_type AS "orderChannelType",
                pq.max_retry AS "maxRetry",
                pq.retry AS "retry"
              FROM
                product_update_inventory_queue pq
              JOIN product_update_inventory_items_queue pqi ON
                pq.id = pqi.queue_id
              WHERE
                pq.to_update = FALSE
                AND pq.retry < pq.max_retry
                AND pqi.is_success = FALSE
                AND pq.page_id = $1 
                AND pqi.page_id = $1
                AND pq.id = $2 ;
    `;
  const result = await PostgresHelper.execQuery<IProductUpdateInventoryProcessQueue[]>(client, SQL, [pageID, queueID]);
  return result?.length ? result : [];
};

export const updateProductVariantStatus = async (client: Pool, pageID: number, productID: number, variantID: number, status: EnumProductStatus): Promise<void> => {
  const bindings = { pageID, productID, variantID, status, updatedAt: getUTCDayjs() };
  const SQL = `
    UPDATE 
      product_variants 
    SET 
      status = :status ,
      updated_at = :updatedAt
    WHERE 
      page_id = :pageID 
    AND
      product_id = :productID
    AND 
      id = :variantID`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<{ id: number; inventory: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};
export const updateProductStatus = async (client: Pool, pageID: number, productID: number, status: EnumProductStatus): Promise<void> => {
  const bindings = { pageID, productID, status, updatedAt: getUTCDayjs() };
  const SQL = `
    UPDATE 
      products
    SET 
      status = :status ,
      updated_at = :updatedAt
    WHERE 
      page_id = :pageID 
    AND
      id = :productID`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<{ id: number; inventory: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const increaseProductVariantInventory = async (
  client: Pool,
  pageID: number,
  productID: number,
  variantID: number,
  inventory: number,
): Promise<{ id: number; status: EnumProductStatus; inventory: number }> => {
  const bindings = { pageID, productID, variantID, inventory, updatedAt: getUTCDayjs() };
  const SQL = `
    UPDATE 
      product_variants 
    SET 
      inventory = inventory + :inventory ,
      updated_at = :updatedAt
    WHERE 
      page_id = :pageID 
    AND
      product_id = :productID
    AND 
      id = :variantID 
    RETURNING id,status,inventory::integer ; `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<{ id: number; status: EnumProductStatus; inventory: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length > 0 ? result[0] : null;
};

export const decreaseProductVariantInventory = async (
  client: Pool,
  pageID: number,
  productID: number,
  variantID: number,
  inventory: number,
): Promise<{ id: number; status: EnumProductStatus; inventory: number }> => {
  const bindings = { pageID, productID, variantID, inventory, updatedAt: getUTCDayjs() };
  const SQL = `
    UPDATE 
      product_variants 
    SET 
      inventory = inventory - :inventory ,
      updated_at = :updatedAt
    WHERE 
      page_id = :pageID 
    AND
      product_id = :productID
    AND 
      id = :variantID 
      RETURNING id,status,inventory::integer ; `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<{ id: number; status: EnumProductStatus; inventory: number }[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length > 0 ? result[0] : null;
};

export const updateProductVariantInventoryBatch = async (pageID: number, variantID: number, inventory: number, client: Pool): Promise<void> => {
  const bindings = { pageID, variantID, inventory };
  const SQL = 'UPDATE product_variants SET  inventory = :inventory WHERE page_id = :pageID AND id = :variantID ; ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const updateProductInventoryQueueItemStatusBatch = async (statusUpdateParams: IProductUpdateInventoryQueueItemStatus, client: Pool): Promise<void> => {
  const SQL =
    'UPDATE product_update_inventory_items_queue SET is_success = :isSuccess, error_text = :errorText  WHERE page_id = :pageID AND queue_id = :queueID AND id = :queueItemID';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, statusUpdateParams);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const updateProductInventoryAtMarketPlaceBatch = async (pageID: number, variantID: number, inventory: number, marketPlaceType: SocialTypes, client: Pool): Promise<void> => {
  const SQL = 'UPDATE product_marketplace_variants SET inventory = :inventory WHERE page_id = :pageID AND product_variant_id = :variantID AND marketplace_type = :marketPlaceType';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, variantID, inventory, marketPlaceType });
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const getProductMarketPlaceByProductIDAndType = async (pageID: number, productID: number, marketPlaceType: SocialTypes, client: Pool): Promise<IProductMarketPlace> => {
  const bindings = {
    pageID,
    productID,
    marketPlaceType,
  };

  const SQL = `
                        SELECT
                            id,
                            page_id as "pageID",
                            marketplace_id as "marketPlaceID",
                            product_id as "productID",
                            name,
                            marketplace_type as "marketPlaceType",
                            active
                        FROM
                            product_marketplace
                        WHERE
                            page_id = :pageID
                            AND product_id = :productID
                            AND marketplace_type = :marketPlaceType
                            AND active = true
                            ;
        `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : ({} as IProductMarketPlace);
};

export const getProductMarketPlaceVariantByVariantIDAndType = async (
  pageID: number,
  variantID: number,
  marketPlaceType: SocialTypes,
  client: Pool,
): Promise<IProductMarketPlaceVariantUpdateInventory> => {
  const bindings = {
    pageID,
    variantID,
    marketPlaceType,
  };

  const SQL = `
                SELECT
                  id,
                  product_marketplace_id AS "productMarketPlaceID",
                  product_variant_id AS "variantID",
                  sku AS "marketPlaceSKU"
                FROM
                  product_marketplace_variants pmv
                WHERE
                  page_id = :pageID
                  AND product_variant_id = :variantID
                  AND marketplace_type = :marketPlaceType
                  AND active = TRUE;
              `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductMarketPlaceVariantUpdateInventory[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : ({} as IProductMarketPlaceVariantUpdateInventory);
};

export const getProductUpdateInventoryQueueItemByQueueID = async (
  { pageID, queueID }: IProductUpdateInventoryQueueResponse,
  client: Pool,
): Promise<IProductUpdateInventoryQueueItemStatus[]> => {
  const SQL = `
                SELECT
                  id AS "queueItemID",
                  queue_id AS "queueID",
                  page_id AS "pageID",
                  is_success AS "isSuccess",
                  error_text AS "errorText"
                FROM
                  product_update_inventory_items_queue puiiq
                WHERE
                  page_id = :pageID
                  AND queue_id = :queueID ;
  `;

  const bindings = { pageID, queueID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductUpdateInventoryQueueItemStatus[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result : [];
};

export const updateProductUpdateInventoryQueueStatus = async (pageID: number, status: boolean, queueID: number, client: Pool): Promise<void> => {
  const SQL = 'UPDATE product_update_inventory_queue SET to_update = :status WHERE page_id = :pageID AND id = :queueID';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { status, pageID, queueID });
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const updateProductUpdateInventoryQueueRetry = async ({ pageID, queueID }: IProductUpdateInventoryQueueResponse, client: Pool): Promise<void> => {
  const SQL = `
                UPDATE
                  product_update_inventory_queue
                SET
                  retry = (
                  SELECT
                    CASE
                      WHEN ((retry + 1) > max_retry ) THEN max_retry
                      ELSE (retry + 1)
                    END
                  FROM
                    product_update_inventory_queue puiq
                  WHERE
                    id = :pageID AND page_id = :queueID)
                WHERE
                  id = :pageID AND page_id = :queueID ;
 
 `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, queueID });
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const getPurchaseOrderItemByOrderVariantID = async (
  pageID: number,
  orderID: string,
  variantID: number,
  orderChannelType: OrderChannelTypes,
  client: Pool,
): Promise<IPurchaseOrderItemByOrderVariantID> => {
  const SQL = `
              SELECT
                id,  
                item_quantity AS "itemQuantity",
                canceled_quantity AS "canceledQuantity",
                canceled_count AS "canceledCount"
              FROM
                purchasing_order_items poi
              WHERE
                purchase_order_id = :orderID
                AND page_id = :pageID
                AND product_variant_id = :variantID
                AND order_channel = :orderChannelType ;
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { pageID, orderID, variantID, orderChannelType });
  const result = await PostgresHelper.execQuery<IPurchaseOrderItemByOrderVariantID[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : ({} as IPurchaseOrderItemByOrderVariantID);
};
