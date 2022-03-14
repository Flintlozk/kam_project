import { getUTCDayjs, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICount, IMoreImageUrlResponse, IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumProductStatus,
  ICatSubCatHolder,
  IGQLContext,
  INameIDPair,
  IProduct,
  IProductAllList,
  IProductAttributeListMappingDB,
  IProductAttributeMappingDB,
  IProductByID,
  IProductCatalogSale,
  IProductCategoryList,
  IProductCategoryMappingDB,
  IProductList,
  IProductRichMenu,
  IProductTag,
  IProductTotalWeight,
  IProductVariant,
  IProductVariantByID,
  IProductVariantBySku,
  IProductVariantDB,
  IProductVariantImages,
  IProductVariantPipeline,
  IProductVariantRichMenu,
  ISalePageProducts,
  IVariantsOfProduct,
  PRODUCT_TRANSLATE_MSG,
  VariantDetail,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function estimateProductsQuantity(
  client: Pool,
  pageID: number,
  productID: number,
): Promise<{ productID: number; productStatus: EnumProductStatus; estimated: number }> {
  const bindings = {
    pageID,
    productID,
  };
  const SQL = `
  SELECT 
    p.id as "productID",
    p.status as "productStatus",
    sum(pv.inventory)::integer as "estimated"
  FROM products p 
  INNER JOIN product_variants pv ON p.id = pv.product_id 
  WHERE 
  p.page_id = :pageID
  AND p.id = :productID 
  GROUP BY p.id;`;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
  const result = await PostgresHelper.execQuery<{ productID: number; productStatus: EnumProductStatus; estimated: number }[]>(
    client,
    returnSQLBindings.sql,
    returnSQLBindings.bindings,
  );
  return !isEmpty(result) ? result[0] : null;
}
export async function getProductAllList(
  client: Pool,
  pageID: number,
  productSearchQuery: string,
  productMarketPlaceSearchQuery: string,
  whereType: string,
  orderQuery: string,
  page: number,
  pageSize: number,
): Promise<IProductAllList[]> {
  const bindings = {
    pageID,
    page,
    pageSize,
  };
  try {
    ////:: marketplace functionality commenting now
    // const SQL = `
    // WITH Data_CTE AS (
    //   ${getProductAllListProductMarketPlace(productMarketPlaceSearchQuery)}
    //   UNION
    //   ${getProductAllListProduct(whereType, productSearchQuery)}
    //   Count_CTE AS (
    //     SELECT
    //     CAST(COUNT(*) AS INT) AS TotalRows
    //     FROM
    //     Data_CTE )
    //     SELECT
    //     *
    //     FROM
    //     Data_CTE
    //     CROSS JOIN Count_CTE
    //     ORDER BY ${orderQuery}
    //     OFFSET :page ROWS
    //     FETCH NEXT :pageSize ROWS ONLY;
    //     `;

    const SQL = `
        WITH Data_CTE AS (
          ${getProductAllListProduct(whereType, productSearchQuery)}
          Count_CTE AS (
            SELECT
            CAST(COUNT(*) AS INT) AS TotalRows
            FROM
            Data_CTE )
            SELECT
            *
            FROM
            Data_CTE
            CROSS JOIN Count_CTE 
            ORDER BY ${orderQuery}
            OFFSET :page ROWS
            FETCH NEXT :pageSize ROWS ONLY;
            `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
    const result = await PostgresHelper.execQuery<IProductAllList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('Error getting product all list', error);
    throw new Error('Error getting product all list');
  }
}

export const getTotalWeightOfEachProductInCart = async (client: Pool, pageID: number, orderID: number): Promise<IProductTotalWeight[]> => {
  const bindings = { orderID, pageID };
  const statement = `
      /* getTotalWeightOfEachProductInCart */
      SELECT 
      poi.product_id as "productID",
      poi.product_variant_id as "productVariantID",
      p.weight, 
      poi.item_quantity as "itemQuantity", 
      p.weight*poi.item_quantity AS "totalWeight"
      FROM purchasing_order_items poi
      INNER JOIN products p ON p.id = poi.product_id
      WHERE purchase_order_id = :orderID AND poi.page_id = :pageID
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(statement, bindings);
  return await PostgresHelper.execQuery<IProductTotalWeight[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export function searchProductCodeExists(client: Pool, context: IGQLContext, code: string): Promise<IHTTPResult> {
  return new Promise<IHTTPResult>((resolve) => {
    const { pageID } = context.payload;
    const bindings = { pageID, code };
    const SQL = `
                  SELECT COUNT(1)
                  FROM   products
                  WHERE  UPPER(code) = UPPER(:code)
                  AND    page_id = :pageID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery<ICount[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    data
      .then((result: ICount[]) => {
        const response: IHTTPResult = {
          status: 200,
          value: result[0].count,
        };
        resolve(response);
      })
      .catch((err) => {
        const errMessage = err.message;
        err = 'Error Searching Product code!' + errMessage;
        const response: IHTTPResult = {
          status: 403,
          value: err,
        };
        resolve(response);
      });
  });
}

export async function getShopProducts(client: Pool, pageID: number, searchQuery: string, orderQuery: string, page: number, pageSize: number): Promise<IProductList[]> {
  const bindings = [pageID, pageID, page, pageSize];
  const SQL = getShopProductsSQL(searchQuery, orderQuery);
  const data = await PostgresHelper.execQuery<IProductList[]>(client, sanitizeSQL(SQL), bindings);
  return data;
}

export async function getProductVariantForRichMenu(client: Pool, pageID: number, ref: string): Promise<IProductVariantRichMenu> {
  const bindings = {
    pageID,
    ref,
  };
  const SQL = `
              SELECT        p.id 
                            AS 
                            "productID", 
                            p.NAME 
                            "name", 
                            pv.id 
                            AS "productVariantID", 
                            unit_price 
                            AS "price", 
                            COALESCE(pv.images -> 0 ->> 'mediaLink', p.images -> 0 ->> 'mediaLink') 
                            AS 
                            "images", 
                            STRING_AGG(pa.NAME, ' , ') "attributes" 
              FROM          product_variants pv 
              INNER JOIN    products p 
                      ON    p.id = pv.product_id 
              INNER JOIN    product_attribute_list_mapping palm ON pv.mapping_id = palm.mapping_id 
              INNER JOIN    product_attributes pa ON palm.attribute_id = pa.id 
              WHERE         pv.page_id = :pageID
              AND           pv.ref = :ref
              AND           pv.active = true 
              AND           p.active = true 
              GROUP BY      p.id, 
                            pv.id 
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<IProductVariantRichMenu[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}

export async function getProductVariantForWebViewByVariantID(client: Pool, pageID: number, variantID: number): Promise<IProductVariantPipeline> {
  const bindings = {
    pageID,
    variantID,
  };
  const SQL = variantWebViewSQL();
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<IProductVariantPipeline[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}

export async function getProductForRichMenu(client: Pool, pageID: number, ref: string): Promise<IProductRichMenu> {
  const bindings = {
    pageID,
    ref,
    subPageID: pageID,
    subRef: ref,
  };
  const SQL = `
                WITH product_cte 
                  AS (SELECT id, 
                              name, 
                              images -> 0 ->> 'mediaLink' :: text AS images 
                      FROM   products 
                      WHERE  ref = :ref
                      AND    page_id = :pageID
                      AND    active = true), 
                  variant_cte 
                  AS (SELECT MAX(unit_price), 
                              MIN(unit_price), 
                              COUNT(id) :: integer
                      FROM   product_variants pv 
                      WHERE  product_id = (SELECT p2.id 
                                            FROM   products p2 
                                            WHERE 
                              p2.ref = :subRef) 
                              AND pv.inventory > 0
                      GROUP  BY pv.product_id) 
              SELECT * 
              FROM   product_cte 
                    cross join variant_cte 
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<IProductRichMenu[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}

export async function isProductVariantExists(client: Pool, pageID: number, ref: string): Promise<number[]> {
  const bindings = {
    ref,
    pageID,
  };
  const SQL = `
                SELECT ARRAY_AGG(attribute_id) 
                FROM   product_attribute_list_mapping palm 
                WHERE  mapping_id IN (SELECT pv.mapping_id 
                                      FROM   product_variants pv 
                                      WHERE  pv.active IS TRUE
                                      AND pv.product_id IN 
                      (SELECT id 
                        FROM   products 
                        WHERE  ref = :ref
                              AND page_id = :pageID
                              AND active = true)); 
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0].array_agg : null;
}
export async function getVariantFromProductRef(pageID: number, productRef: string, client: Pool): Promise<IProductVariantDB> {
  try {
    const bindings = {
      pageID,
      productRef,
    };
    const SQL = `
                  SELECT
                      id,
                      page_id,
                      product_id,
                      mapping_id,
                      sku,
                      unit_price,
                      status,
                      active,
                      images,
                      ref 
                  FROM
                        product_variants pv
                  WHERE
                        product_id = (
                                        SELECT
                                          id
                                        FROM
                                          products
                                        WHERE
                                          ref = :productRef
                                          AND page_id = :pageID
                                      )
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return !isEmpty(data) ? data[0] : null;
  } catch (error) {
    console.log('Error in getting product variant from product ref :>> ', error);
    return null;
  }
}

export async function getProduct(client: Pool, pageID: number, productID: number): Promise<IProductList[]> {
  const SQL = ` 
  SELECT  distinct(p.id) "id",
    p."name" "name",
    ps."name" "status", 
    ps.id "statusValue",
    '0' as "sold",
    sum(pv.inventory) "inventory",
    max(pv.unit_price) "maxUnitPrice",
    min(pv.unit_price) "minUnitPrice",
    p.images :: jsonb "images",
    count(pv.product_id) "variants",
    p.updated_at "updated_at"
  FROM products p
  INNER JOIN product_variants pv ON p.id = pv.product_id
  INNER JOIN product_status ps ON p.status = ps.id
  WHERE p.page_id = $1 
  AND p.active = true  
  AND p.id = $2
  GROUP BY p.id,
  ps.name,
  ps.id 
  ORDER BY p.id`;
  return await PostgresHelper.execQuery(client, SQL, [pageID, productID]);
}

export async function getCountOfProduct(client: Pool, pageID: number): Promise<number> {
  const SQL = ` 
  SELECT
  count(1)
  FROM
    (
        SELECT
            p.id,
            (
                sum(pv.inventory)::int
            ) "variantQuantity"
        FROM
                    products p
        INNER JOIN product_variants pv
                    ON
            p.id = pv.product_id
        WHERE
            p.active = TRUE
            AND p.status = 1
            AND p.page_id = $1
        GROUP BY
            p.id
    ) AS available_products
  WHERE
    "variantQuantity" > 0
`;

  const result = await PostgresHelper.execQuery<[{ count: string }]>(client, SQL, [pageID]);
  return Array.isArray(result) ? +result[0].count : 0;
}

export async function getShopVariants(client: Pool, pageID: number): Promise<IVariantsOfProduct[]> {
  const SQL = `
  SELECT   
    pv.id AS "variantID",
    pv.inventory AS "variantInventory",
    pv.images AS "variantImages",
    pv.sku AS "variantSKU",
    pv.status AS "variantStatusValue",
    string_agg(pa.name,' : ') "variantAttributes",
    pv.unit_price AS "variantUnitPrice",
    p.id AS "productID"
  FROM 
    product_variants pv 
  INNER JOIN 
    products p ON p.id = pv.product_id 
  INNER JOIN 
    product_attribute_list_mapping palm ON pv.mapping_id = palm.mapping_id 
  INNER JOIN 
    product_attributes pa ON palm.attribute_id = pa.id 
  WHERE 
    p.page_id = $1 
  GROUP BY 
    pv.id, p.id
  `;
  return await PostgresHelper.execQuery(client, SQL, [pageID]);
}

export async function getProductFromVariantId(client: Pool, variantID: number): Promise<VariantDetail> {
  const SQL = `
  SELECT 
    p.name,p.id as "productID",pv.id as "variantID",pv.unit_price as "unitPrice" ,string_agg(pa.name,' : ') "attributes"
  FROM 
    product_variants pv 
  INNER JOIN 
    products p ON p.id = pv.product_id 
  INNER JOIN 
    product_attribute_list_mapping palm ON pv.mapping_id = palm.mapping_id 
  INNER JOIN 
    product_attributes pa ON palm.attribute_id = pa.id 
  WHERE pv.id = $1
  GROUP BY pv.id, p.name, p.id
        `;
  const data = await PostgresHelper.execQuery(client, SQL, [variantID]);
  return !isEmpty(data) ? data[0] : null;
}
export function getProductList(client: Pool, pageID: number, searchQuery: string, orderQuery: string, page: number, pageSize: number): Promise<IProductList[]> {
  return new Promise<IProductList[]>((resolve, reject) => {
    const bindings = {
      pageID,
      page,
      pageSize,
    };
    const SQL = ` 
    WITH Data_CTE 
  AS
    (
        SELECT  distinct(p.id) "id",
              p."name" "name",
              ps."name" "status", 
              ps.id "statusValue",
              '0' as "sold",
              sum(pv.inventory) "inventory",
              max(pv.unit_price) "maxUnitPrice",
              min(pv.unit_price) "minUnitPrice",
              p.images :: jsonb "images",
              count(pv.product_id) "variants",
              p.updated_at "updated_at",
              pv.updated_at "pv_updated_at",
              p.ref
      FROM products p
      INNER JOIN product_variants pv ON p.id = pv.product_id
      INNER JOIN product_status ps ON p.status = ps.id
      WHERE p.page_id = :pageID AND p.active = true AND pv.active = true  ${searchQuery}
      GROUP BY p.id,
          ps.name,
          ps.id,
          pv.updated_at
    ), 
    Count_CTE 
    AS 
    (
        SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
    )
        SELECT   *
        FROM Data_CTE
      CROSS JOIN Count_CTE
      ORDER BY ${orderQuery}
      OFFSET :page ROWS
      FETCH NEXT :pageSize ROWS ONLY;
    `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery<[IProductList]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);

    data
      .then((result: IProductList[]) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export async function getVariantsOfProduct(client: Pool, pageID: number, productID: number): Promise<IVariantsOfProduct[]> {
  try {
    const bindings = {
      pageID,
      productID,
    };
    const SQL = variantSQL();
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IVariantsOfProduct[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data?.length ? data : [];
  } catch (error) {
    throw new Error(error);
  }
}
export function getVariantsOfProductByVariantID(client: Pool, pageID: number, productID: number, vairantID: number): Promise<IVariantsOfProduct[]> {
  return new Promise<IVariantsOfProduct[]>((resolve, reject) => {
    const bindings = {
      pageID,
      productID,
      vairantID,
    };
    const SQL = varintSQLByID();
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery<IVariantsOfProduct[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    data
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}
export function getProductByID(client: Pool, pageID: number, productID: number): Promise<IProductByID[]> {
  return new Promise<IProductByID[]>((resolve, reject) => {
    const bindings = {
      pageID,
      productID,
    };
    const SQL = getProductByIDSQL();
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery<IProductByID[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

export async function getVariantBySku(pageID: number, sku: string, client: Pool): Promise<IProductVariantBySku> {
  const bindings = {
    pageID,
    sku,
  };
  const SQL = `
            SELECT
              id AS "productVariantID",
              product_id AS "productID"
            FROM
              product_variants pv
            WHERE
              page_id = :pageID
              AND sku = :sku;  
  `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<[IProductVariantBySku]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : null;
}

export async function getVariantByGroupID(client: Pool, IDs: string, pageID: number): Promise<IVariantsOfProduct[]> {
  const SQL = `
    SELECT 
      id            AS "variantID", 
      inventory :: INTEGER AS "variantInventory", 
      status               AS "variantStatus" 
    FROM
      product_variants
    WHERE
      page_id = $1
    AND
      id IN (${IDs})
  `;
  return await PostgresHelper.execQuery<IVariantsOfProduct[]>(client, sanitizeSQL(SQL), [pageID]);
}

export function commitProductQueries(client: Pool, successMessage: string, errorMessage: string): Promise<IHTTPResult> {
  // TODO: Fix this
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IHTTPResult>(async (resolve) => {
    try {
      const commitTransaction = await PostgresHelper.execBatchCommitTransaction(client);
      if (commitTransaction) {
        const response: IHTTPResult = {
          status: 200,
          value: successMessage,
        };
        resolve(response);
      } else {
        const response: IHTTPResult = {
          status: 403,
          value: errorMessage,
        };
        resolve(response);
      }
    } catch (error) {
      const response: IHTTPResult = {
        status: 403,
        value: errorMessage,
      };
      resolve(response);
    }
  });
}

export async function executeMainProductQuery(pageID: number, product: IProduct, client: Pool): Promise<number> {
  try {
    const { name, code, weight, dimension, dangerous, status } = product;
    const { description } = product.quill;

    const bindings = { pageID, name, code, description, weight, dimesnion: JSON.stringify(dimension), dangerous, status };
    const SQL = ` INSERT INTO products 
                              ( page_id, "name", code, description, weight, dimension, dangerous, status ) 
                  VALUES      ( :pageID, :name, :code, :description, :weight, :dimesnion, :dangerous, :status ) 
                  RETURNING   * ; `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const executeMainQueries = await PostgresHelper.execBatchTransaction<IProduct>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return executeMainQueries.id;
  } catch (error) {
    console.log('Error at executeMainProductQuery', error);
    throw new Error(error);
  }
}

export async function executeTagMappingQueries(pageID: number, tags: INameIDPair[], productID: number, client: Pool): Promise<void> {
  if (tags?.length > 0) {
    for (let idx = 0; idx < tags.length; idx++) {
      try {
        const tag = tags[idx];
        const bindings = { pageID, productID, tagID: tag.id };
        const SQL = ` INSERT INTO product_tag_mapping 
                                  ( page_id, product_id, tag_id ) 
                      VALUES      (:pageID, :productID, :tagID) 
                      RETURNING   * ; `;
        const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
        await PostgresHelper.execBatchTransaction<IProductTag>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}

export async function executeCategoryMappingQueries(pageID: number, categories: ICatSubCatHolder[], productID: number, client: Pool): Promise<void> {
  if (categories?.length) {
    for (let idx = 0; idx < categories.length; idx++) {
      try {
        const category = categories[idx];
        const bindings = { pageID, productID, categoryID: category.id, categorySubID: category.subCatID };
        const SQL = ` INSERT INTO product_category_mapping 
                                  ( page_id, product_id, category_id, sub_category_id ) 
                      VALUES      ( :pageID, :productID, :categoryID, :categorySubID) 
                      RETURNING   *; `;
        const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
        await PostgresHelper.execBatchTransaction<IProductCategoryMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}

export const executeVariantsAttributeQueries = async (pageID: number, productID: number, mappingID: number, variant: IProductVariant, client: Pool): Promise<IProductVariantDB> => {
  try {
    const { sku, unitPrice, inventory, status } = variant;
    const bindings = { pageID, productID, mappingID, sku, unitPrice, inventory, status };
    const SQL = ` INSERT INTO product_variants 
                              ( page_id, product_id, mapping_id, sku, unit_price, inventory, status) 
                  VALUES      ( :pageID, :productID, :mappingID, :sku, :unitPrice, :inventory, :status) 
                  RETURNING   *;`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const variantSaved = await PostgresHelper.execBatchTransaction<IProductVariantDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return variantSaved;
  } catch (error) {
    throw new Error(error);
  }
};

export const executeAttributeListMappingQueries = async (pageID: number, attributeMappingID: number, attributes: INameIDPair[], client: Pool): Promise<void> => {
  if (attributes?.length > 0) {
    for (let idx = 0; idx < attributes.length; idx++) {
      try {
        const attribute = attributes[idx];
        const bindings = { pageID, attributeMappingID, attributeID: attribute.id };
        const SQL = ` INSERT INTO product_attribute_list_mapping 
                                  ( page_id, mapping_id, attribute_id ) 
                      VALUES      ( :pageID, :attributeMappingID, :attributeID ) 
                      RETURNING   *; `;
        const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
        await PostgresHelper.execBatchTransaction<IProductAttributeMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
      } catch (error) {
        console.log('executeAttributeListMappingQueries', error);
        throw new Error(error);
      }
    }
  }
};

export const executeAttributeMappingQueries = async (pageID: number, client: Pool): Promise<IProductAttributeMappingDB> => {
  try {
    const bindings = {
      pageID,
    };
    const SQL = ' INSERT INTO product_attribute_mapping (page_id) VALUES (:pageID) RETURNING id; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const executeAttribute = await PostgresHelper.execBatchTransaction<IProductAttributeMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    return executeAttribute;
  } catch (error) {
    throw new Error(error);
  }
};

export const executeUpdateProductWithImages = async (client: Pool, pageID: number, productID: number, images: IMoreImageUrlResponse[]): Promise<IHTTPResult> => {
  try {
    const clientTransaction = await PostgresHelper.execBeginBatchTransaction(client);
    if (clientTransaction) {
      const bindings = { images: JSON.stringify(images), productID, pageID, updatedAt: getUTCDayjs() };
      const SQL = `
                    UPDATE products 
                    SET    images = :images, updated_at = :updatedAt
                    WHERE  id = :productID 
                    AND    page_id = :pageID 
                    returning *
      `;
      const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
      await PostgresHelper.execBatchTransaction<IProduct>(clientTransaction, returnSQLBindings.sql, returnSQLBindings.bindings);
      const dataCommited = await commitProductQueries(clientTransaction, PRODUCT_TRANSLATE_MSG.pro_image_save_success, PRODUCT_TRANSLATE_MSG.pro_image_save_error);
      return dataCommited;
    }
  } catch (err) {
    console.log('Product image saving err', err);
    return {
      status: 403,
      value: PRODUCT_TRANSLATE_MSG.pro_image_save_error,
    };
  }
};

export const executeUpdateProductVariantWithImages = async (variant: IProductVariantImages, client: Pool): Promise<IHTTPResult> => {
  try {
    const variantID = variant.id;
    const variantImages = JSON.stringify(variant.gcImage) ? JSON.stringify(variant.gcImage) : null;
    const bindings = { variantImages, variantID };
    const SQL = ' UPDATE product_variants SET images = :variantImages WHERE id = :variantID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProduct>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Product variant image saving err', err);
    return {
      status: 403,
      value: PRODUCT_TRANSLATE_MSG.pro_variant_image_save_error,
    };
  }
};

export const executeGetAttributeMappings = async (pageID: number, productID: number, client: Pool): Promise<number[]> => {
  try {
    const bindings = { pageID, productID };
    const SQL = ' SELECT mapping_id FROM product_variants WHERE page_id = :pageID AND product_id = :productID ;';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const mappingData = await PostgresHelper.execQuery<Array<{ mapping_id: number }>>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const mappingIDs = mappingData?.map(({ mapping_id }) => mapping_id);
    return mappingIDs;
  } catch (err) {
    console.log('Error fetching mapping id!', err);
    throw new Error('Error fetching mapping id!');
  }
};

export const executeRemoveVariants = async (pageID: number, productID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, productID };
    const SQL = ' UPDATE product_variants SET active = false WHERE page_id = :pageID AND product_id = :productID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductVariantDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error removing product variants! ', err);
    throw new Error('Error removing product variants! ');
  }
};

export const executeRemoveVariantsByVariantID = async (pageID: number, productID: number, variantIDs: number, client: Pool): Promise<void> => {
  const SQL = ' UPDATE product_variants SET active = false WHERE page_id = $1 AND product_id = $2 AND id = $3 ';
  await PostgresHelper.execBatchTransaction(client, SQL, [pageID, productID, variantIDs]);
};

export const executeRemoveAttributeListMappings = async (pageID: number, mappingID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, mappingID };
    const SQL = ' UPDATE product_attribute_list_mapping SET active = false WHERE page_id = :pageID AND mapping_id = :mappingID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductAttributeListMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error removing product attribute list ! ', err);
    throw new Error('Error removing product attribute list ! ');
  }
};

export const executeRemoveAttributeMappings = async (pageID: number, mappingID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, mappingID };
    const SQL = ' UPDATE product_attribute_mapping SET active = false WHERE page_id = :pageID AND id = :mappingID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductAttributeMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error removing product attribute! ', err);
    throw new Error('Error removing product attribute! ');
  }
};

export const executeRemoveCategoryMappings = async (pageID: number, productID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, productID };
    const SQL = ' UPDATE product_category_mapping SET active = false WHERE page_id = :pageID AND product_id = :productID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductCategoryMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error deactivating product category! ', err);
    throw new Error('Error removing product category! ');
  }
};

export const executeRemoveSingleCategoryMappings = async (pageID: number, productID: number, catMappingID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, productID, catMappingID };
    const SQL = ' DELETE FROM product_category_mapping WHERE page_id = :pageID AND product_id = :productID AND id=:catMappingID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductCategoryMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error deactivating product category! ', err);
    throw new Error('Error removing product category!');
  }
};

export const getProductsForSalePage = async (
  pageID: number,
  page: number,
  pageSize: number,
  search: string,
  category: string,
  tag: string,
  client: Pool,
): Promise<ISalePageProducts[]> => {
  const SQL = `
  SELECT * from (
              SELECT
                p.id,
                name,
                count(pv.id),
                min(pv.unit_price) "minPrice",
                max(pv.unit_price) "maxPrice",
                count(pv.id) "variantCount",
                p.images "images",
                (sum(pv.inventory)::int) "variantQuantity"
              FROM
                products p
                INNER JOIN product_variants pv
                ON p.id = pv.product_id 
              WHERE
                  p.page_id = :pageID
              AND p.status = 1
              AND p.active = TRUE
              ${search}
              ${category}
              ${tag}
              GROUP BY p.id
              ORDER BY p.updated_at 
              OFFSET :page ROWS
              FETCH NEXT :pageSize ROWS ONLY ) AS "productSale" WHERE "variantQuantity" > 0
    `;

  const bindings = { pageID, page, pageSize };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
  const result = await PostgresHelper.execQuery<ISalePageProducts[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : [];
};

export const getProductByIDForSalePage = async (pageID: number, productID: number, client: Pool): Promise<ISalePageProducts[]> => {
  const SQL = `
              SELECT
                p.id,
                name,
                count(pv.id),
                min(pv.unit_price) "minPrice",
                max(pv.unit_price) "maxPrice",
                count(pv.id) "variantCount",
                p.images "images"
              FROM
                products p
                INNER JOIN product_variants pv
                ON p.id = pv.product_id 
              WHERE
                  p.page_id = :pageID
              AND p.active = TRUE
              AND p.id = :productID
              GROUP BY p.id
    `;

  const bindings = { pageID, productID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<ISalePageProducts[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : [];
};

export const getProductTagsForSalePage = async (pageID: number, client: Pool): Promise<IProductCatalogSale[]> => {
  const SQL = `
            SELECT
              DISTINCT pt.id,
              name,
              FALSE "active"
            FROM
              product_tags pt
            INNER JOIN product_tag_mapping ptm
            ON
              (
                  pt.id = ptm.tag_id
              )
            WHERE
              pt.page_id = :pageID
              AND ptm.page_id = :pageID
              AND pt.active = TRUE
              AND ptm.active = TRUE 
`;

  const bindings = { pageID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductCatalogSale[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : [];
};

export const getProductCategoriesForSalePage = async (pageID: number, client: Pool): Promise<IProductCategoryList[]> => {
  const SQL = `
            SELECT
              DISTINCT pc.id AS "categoryID",
              pc."name" AS "category",
              FALSE AS "status",
             (SELECT jsonb_agg(json_build_object('subCategoryID',pcs.id,'subCategory',pcs.name, 'subCategoryActive', false)) 
             FROM product_category pcs WHERE pcs.sub_category_id = pc.id) "subCategory"
            FROM
              product_category pc
            INNER JOIN product_category_mapping pcm 
            ON (pc.id = pcm.category_id)
            WHERE
              pc.active = TRUE
              AND pc.page_id =  :pageID
              AND pcm.page_id = :pageID
              AND pc.sub_category_id = -1
              AND pcm.active = TRUE 
`;

  const bindings = { pageID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductCategoryList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : [];
};

export const executeUpdateVariantQueries = async (pageID: number, productID: number, variantID: number, columns: string, values, client: Pool): Promise<void> => {
  try {
    const bindings = {
      ...values,
      pageID,
      productID,
      variantID,
    };
    const SQL = ` UPDATE product_variants SET ${columns} WHERE page_id = :pageID AND product_id = :productID AND id=:variantID RETURNING *; `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductVariantDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error updating product variants! ', err);
    throw new Error('Error updating product variants!');
  }
};

export const executeRemoveTagMappings = async (pageID: number, productID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, productID };
    const SQL = ' UPDATE product_tag_mapping SET active = false WHERE page_id = :pageID AND product_id = :productID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error deactivating product tags! ', err);
    throw new Error('Error removing product tags');
  }
};

export const executeRemoveSingleTagMappings = async (pageID: number, productID: number, tagMappingID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, productID, tagMappingID };
    const SQL = ' DELETE FROM product_tag_mapping WHERE page_id = :pageID AND product_id = :productID AND id=:tagMappingID RETURNING *; ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error deactivating product tags! ', err);
    throw new Error('Error removing product tags');
  }
};

export const executeRemoveProduct = async (pageID: number, productID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, productID };
    const SQL = ' UPDATE products SET active = false WHERE page_id = :pageID AND id = :productID RETURNING * ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error removing Products! ', err);
    throw new Error('Error removing Products!');
  }
};

export const deleteProductVariant = async (pageID: number, productID: number, variantIDs: number, writer: Pool): Promise<void> => {
  const SQL = ' DELETE FROM product_variants WHERE page_id = $1 AND product_id = $2 AND id = $3 ';
  await PostgresHelper.execBatchTransaction(writer, SQL, [pageID, productID, variantIDs]);
};

export const execUpdateProductMain = async (pageID: number, productID: number, columns: string, client: Pool): Promise<void> => {
  try {
    const bindings = [pageID, productID, getUTCDayjs()];
    const SQL = `UPDATE products SET ${columns} , updated_at = $3 WHERE page_id = $1 AND id = $2 RETURNING *; `;
    await PostgresHelper.execBatchTransaction(client, sanitizeSQL(SQL), bindings);
  } catch (err) {
    console.log('Error updating Products! ', err);
    throw new Error('Error updating Products!');
  }
};

export const getVariantByID = async (pageID: number, variantID: number, client: Pool): Promise<IProductVariantByID> => {
  try {
    const bindings = { pageID, variantID };
    const SQL = `
                  SELECT 			pv.id ,
                              p.name AS "productName",
                              p.id AS "productID",
                              pa.name AS "attributeName",
                                          pv.sku,
                                          pv.unit_price AS "unitPrice",
                                          pv.inventory::Integer
                                        FROM product_variants pv
                                        INNER JOIN products p ON p.id = pv.product_id
                                        INNER JOIN product_attribute_list_mapping palm ON pv.mapping_id = palm.mapping_id
                                        INNER JOIN product_attributes pa ON palm.attribute_id = pa.id
                                        INNER JOIN product_attribute_types pat on pat.id = pa.type_id
                                        WHERE pv.id = :variantID
                                            AND pv.page_id = :pageID
                                            AND p.page_id = :pageID
                                            AND pv.active = TRUE 
                                            AND p.active = TRUE
`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IProductVariantByID[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return !isEmpty(data) ? data[0] : null;
  } catch (error) {
    console.log('Error getting Product variant! ', error);
    throw new Error('Error getting Product variant!');
  }
};

export const updateProductVariantInventory = async (pageID: number, variantID: number, inventory: number, client: Pool): Promise<void> => {
  const bindings = { pageID, variantID, inventory };
  const SQL = 'UPDATE product_variants SET  inventory = :inventory WHERE page_id = :pageID AND id = :variantID RETURNING * ; ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

const variantWebViewSQL = (): string => {
  return `
          SELECT variantid            AS "variantID", 
                sold :: INTEGER      AS "variantSold", 
                inventory :: INTEGER AS "variantInventory", 
                status               AS "variantStatus", 
                ref, 
                statusvalue          AS "variantStatusValue", 
                images               AS "variantImages", 
                attributes           AS "variantAttributes", 
                unit_price           AS "variantUnitPrice", 
                productid            AS "productID", 
                productname          AS "productName" 
          FROM   (SELECT pv.id            AS "sold_id", 
                        COALESCE(SUM, 0) AS sold 
                  FROM   (SELECT product_variant_id, 
                                SUM(item_quantity) 
                          FROM   purchasing_order_items poi 
                                inner join purchasing_orders po 
                                        ON po.id = poi.purchase_order_id 
                          WHERE  po.status = 'CLOSE_SALE' 
                                AND poi.purchase_status = TRUE 
                          GROUP  BY product_variant_id) sold_data 
                        right join product_variants pv 
                                ON pv.id = sold_data.product_variant_id) AS sold_variants 
                inner join (SELECT p.id                       AS "productid", 
                                    p.name                     AS "productname", 
                                    pv.id                      AS "variantid", 
                                    pv.unit_price, 
                                    pv.ref, 
                                    pv.inventory, 
                                    pv.status, 
                                    COALESCE(pv.images -> 0 ->> 'mediaLink', p.images -> 0 ->> 'mediaLink') as images, 
                                    ps."name"                  "statusvalue", 
                                    STRING_AGG(pa.name, ' , ') "attributes" 
                            FROM   product_variants pv 
                                    inner join products p 
                                            ON p.id = pv.product_id 
                                    inner join product_attribute_list_mapping palm 
                                            ON pv.mapping_id = palm.mapping_id 
                                    inner join product_attributes pa 
                                            ON palm.attribute_id = pa.id 
                                    inner join product_status ps 
                                            ON ps.id = pv.status 
                            WHERE  p.page_id = :pageID
                                    AND pv.id = :variantID 
                                    AND pv.active = TRUE 
                            GROUP  BY p.id, 
                                      pv.id, 
                                      p.name, 
                                      ps.name) AS variant_all 
                        ON sold_variants.sold_id = variant_all.variantid; 
`;
};
const varintSQLByID = (): string => {
  const SQL = `
  SELECT variantid as "variantID", sold::INTEGER as "variantSold", inventory::INTEGER  as "variantInventory",
  status as "variantStatus", ref, statusvalue as "variantStatusValue", images as "variantImages", attributes as "variantAttributes", unit_price as "variantUnitPrice"
  , productid as "productID", productname as "productName"
    FROM
      (SELECT pv.id AS "sold_id",
              coalesce(SUM, 0) AS sold
       FROM
         (SELECT product_variant_id,
                 sum(item_quantity)
          FROM purchasing_order_items poi
          INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id
          WHERE po.status ='CLOSE_SALE'
          AND poi.purchase_status = true
          GROUP BY product_variant_id) sold_data
       RIGHT JOIN product_variants pv ON pv.id = sold_data.product_variant_id) AS sold_variants
    INNER JOIN
      (SELECT p.id AS "productid",
              pv.id AS "variantid",
              p.name AS "productname",
              pv.unit_price,
              pv.ref,
              pv.inventory,
              pv.status,
              CASE 
                WHEN pv.images::TEXT = '[]' OR pv.images IS NULL THEN p.images
                ELSE pv.images  END "images",
              ps."name" "statusvalue",
              string_agg(pa.name, ' , ') "attributes"
       FROM product_variants pv
       INNER JOIN products p ON p.id = pv.product_id
       INNER JOIN product_attribute_list_mapping palm ON pv.mapping_id = palm.mapping_id
       INNER JOIN product_attributes pa ON palm.attribute_id = pa.id
       INNER JOIN product_status ps on ps.id = pv.status 
       where p.page_id = :pageID and p.id = :productID and pv.active = true and pv.id = :vairantID
       GROUP BY p.id,
                pv.id,
                p.name,
               ps.name) AS variant_all ON sold_variants.sold_id = variant_all.variantid;
 `;

  return SQL;
};
const variantSQL = (): string => {
  const SQL = `
  SELECT
    variantid AS "variantID",
    sold::INTEGER AS "variantSold",
    inventory::INTEGER AS "variantInventory",
    status AS "variantStatus",
    (images) AS "variantImages",
    ATTRIBUTES AS "variantAttributes",
    unit_price AS "variantUnitPrice" ,
    productid AS "productID",
    NULL AS "productVariantID",
    'more_commerce' AS "variantMarketPlaceType",
    NULL AS "variantMarketPlaceID",
    REF,
    statusvalue AS "variantStatusValue",
    reserved AS "variantReserved",
    attribute_ids AS "variantAttributeIDs",
    ( 
      SELECT
        jsonb_agg(jsonb_build_object('mergedMarketPlaceID', pmv.id, 'mergedMarketPlaceType', pmv.marketplace_type) )
      FROM
        product_marketplace_variants pmv
      WHERE
        pmv.product_variant_id = variantid
      AND pmv.page_id = :pageID 
    ) AS "mergedVariantData"
  FROM
    (
    SELECT
      pv.id AS "sold_id",
      COALESCE(SUM, 0) AS sold
    FROM
      (
      SELECT
        product_variant_id,
        sum(item_quantity)
      FROM
        purchasing_order_items poi
      INNER JOIN purchasing_orders po ON
        po.id = poi.purchase_order_id
      WHERE
        po.status = 'CLOSE_SALE'
        AND poi.purchase_status = TRUE
      GROUP BY
        product_variant_id) sold_data
    RIGHT JOIN product_variants pv ON
      pv.id = sold_data.product_variant_id) AS sold_variants
  INNER JOIN (
    SELECT
      p.id AS "productid",
      pv.id AS "variantid",
      pv.unit_price,
      pv.ref,
      pv.inventory,
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
          AND poi.page_id = $1 ) AS reserved,
      CASE
        WHEN pv.images::TEXT = '[]'
          OR pv.images IS NULL THEN p.images
          ELSE pv.images
        END "images",
        ps."name" "statusvalue",
        string_agg(pa.name, ' , ') "attributes",
        jsonb_agg(pa.id) "attribute_ids" 
      FROM
        product_variants pv
      INNER JOIN products p ON
        p.id = pv.product_id
      INNER JOIN product_attribute_list_mapping palm ON
        pv.mapping_id = palm.mapping_id
      INNER JOIN product_attributes pa ON
        palm.attribute_id = pa.id
      INNER JOIN product_status ps ON
        ps.id = pv.status
      WHERE
        p.page_id = :pageID
        AND p.id = :productID
        AND pv.active = TRUE
      GROUP BY
        p.id,
        pv.id,
        p.name,
        ps.name) AS variant_all ON
    sold_variants.sold_id = variant_all.variantid;
 `;

  return SQL;
};

export function getProductsByPageID(client: Pool, pageID: number): Promise<IProductVariantDB[]> {
  // TODO: Fix this
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IProductVariantDB[]>(async (resolve) => {
    const SQL = `
        SELECT * FROM products 
        WHERE page_id = $1
        AND active = $2
        `;
    const result = await PostgresHelper.execQuery<IProductVariantDB[]>(client, SQL, [pageID, true]);
    if (!isEmpty(result)) resolve(result);
    else resolve([]);
  });
}

const getProductByIDSQL = () => {
  const SQL = `
                WITH Data_CTE AS
                (SELECT p.id,
                        p.name,
                        p.status,
                        p.code,
                        p.description,
                        p.weight,
                        p.dimension,
                        p.dangerous,
                        p.ref "ref",
                        p.images :: JSONB
                FROM products p
                WHERE p.page_id = :pageID
                  AND p.id= :productID
                  AND p.active = TRUE ),
                  variant_CTE AS
                (SELECT data.productid,
                  jsonb_agg(jsonb_build_object( 'variantID', variantid,
                                                'variantImages',variantimages,
                                                        'variantUnitPrice', unit_price, 
                                                        'variantInventory', inventory, 
                                                        'variantReserved', reserved, 
                                                        'variantStatus', status, 
                                                        'variantSKU',sku,
                                                        'variantAttributes', data.attributes,
                                                        'variantMarketPlaceMerged',data.merged_variants
                                                        )) AS "variants"
                FROM
                  (SELECT *
                    FROM
                        (SELECT p.id AS "productid",
                        pv.id AS "variantid",   
                        pv.sku,
                        pv.images "variantimages",
                        pv.unit_price,
                        pv.inventory,
                        pv.status,
                        (
                          SELECT COALESCE(sum(item_quantity)::Integer,0)
                          FROM purchasing_order_items poi 
                          INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id 
                          WHERE poi.product_variant_id = pv.id 
                          AND poi.is_reserve = TRUE 
                          AND po.status != 'REJECT' 
                          AND purchase_status = FALSE
                        ) AS "reserved",
                        jsonb_agg(jsonb_build_object('id', pa.id,'name', pa.name,'attributeID',pat.id, 'attributeType', pat.name)) "attributes",
                        (SELECT jsonb_agg(jsonb_build_object('marketPlaceVariantID', pmv.id, 'marketPlaceVariantType', pmv.marketplace_type, 'marketPlaceVariantSku', pmv.sku) )
                        FROM
                          product_marketplace_variants pmv 
                        WHERE
                          pmv.product_variant_id = pv.id) AS "merged_variants"
                      FROM product_variants pv
                      INNER JOIN products p ON p.id = pv.product_id
                      INNER JOIN product_attribute_list_mapping palm ON pv.mapping_id = palm.mapping_id
                      INNER JOIN product_attributes pa ON palm.attribute_id = pa.id
                      INNER JOIN product_attribute_types pat on pat.id = pa.type_id
                      WHERE p.id = :productID
                      AND pv.active = TRUE
                      GROUP BY p.id,
                                pv.id,
                                p.name) AS variant_all) DATA
                GROUP BY data.productid),
                  tags_CTE AS
                (SELECT ptm.product_id AS "tag_product_id",
                        jsonb_agg(jsonb_build_object('id', pt.id, 'name', name, 'mainID',ptm.id)) AS tags
                FROM product_tags pt
                INNER JOIN product_tag_mapping ptm ON pt.id = ptm.tag_id
                WHERE ptm.product_id = :productID AND ptm.active = true
                GROUP BY ptm.product_id),
                categories_CTE
                AS (SELECT
                  :productID AS cat_product_id,
                  jsonb_agg(json_build_object('mainID',mainid,'id', id, 'name', name, 'subCatID', subcatid)) categories
                FROM (SELECT
                  pc.id,
                  name,
                  pcm.id as "mainid",
                  pcm.sub_category_id AS "subcatid"
                FROM product_category pc
                INNER JOIN product_category_mapping pcm
                  ON pcm.category_id = pc.id
                WHERE pcm.product_id = :productID
                AND pcm.active = true
                AND pcm.sub_category_id IS NULL
                UNION
                SELECT
                  pcm.category_id AS id,
                  name,
                  pcm.id as "mainid",
                  pcm.sub_category_id AS "subCatID"
                FROM product_category pc
                INNER JOIN product_category_mapping pcm
                  ON pcm.sub_category_id = pc.id
                WHERE pcm.product_id = :productID
                AND pcm.active = true
                AND pcm.sub_category_id IS NOT NULL) AS categories)
              SELECT id,
                    name,
                    code,
                    description,
                    weight,
                    dimension,
                    dangerous,
                    status,
                    tags,
                    categories,
                    variants,
                    ref,
                    images,
                    (SELECT
                      jsonb_agg(json_build_object('id', id, 'pageID' , page_id , 
                      'marketPlaceID' , marketplace_id , 'productID', product_id , 
                      'name', name ,'marketPlaceType', marketplace_type, 'active' , active
                     ))
                      FROM
                          product_marketplace pm
                      WHERE
                          product_id = :productID
                      AND 	page_id = :pageID
                      AND     active = TRUE) AS  
                      "marketPlaceProducts"
              FROM Data_CTE
              INNER JOIN variant_CTE ON Data_CTE.id = variant_cte.productid
              INNER JOIN tags_CTE ON Data_CTE.id = tags_CTE.tag_product_id
              INNER JOIN categories_CTE ON Data_CTE.id = categories_CTE.cat_product_id
  `;
  return SQL;
};

const getShopProductsSQL = (searchQuery: string, orderQuery: string): string => {
  const SQL = `
  WITH Data_CTE AS
  (
                  SELECT DISTINCT(p.id) "id",
                                  p."name" "name",
                                  ps."name" "status",
                                  ps.id "statusValue",
                                  '0' AS "sold",
                                  MAX(pv.unit_price) "maxUnitPrice",
                                  MIN(pv.unit_price) "minUnitPrice",
                                  p.images :: jsonb "images",
                                  COUNT(pv.product_id) "variants",
                                  STRING_AGG(pa.name,' : ') "attributes",
                                  p.updated_at "updated_at"
                  FROM            products p
                  INNER JOIN      product_variants pv
                  ON              p.id = pv.product_id
                  INNER JOIN      product_status ps
                  ON              p.status = ps.id
                  INNER JOIN      product_attribute_list_mapping palm
                  ON              pv.mapping_id = palm.mapping_id
                  INNER JOIN      product_attributes pa
                  ON              palm.attribute_id = pa.id
                  WHERE           p.page_id = $1
                  AND             p.active = TRUE ${searchQuery}
                  GROUP BY        p.id,
                                  ps.name,
                                  ps.id
                  ORDER BY        p.id ), Variant_CTE AS
  (
          SELECT   productid,
                    jsonb_agg(jsonb_build_object( 'variantID', variantid, 
                                                  'variantImages',variantimages, 
                                                  'variantUnitPrice', unit_price, 
                                                  'variantInventory', inventory, 
                                                  'variantReserved',reserved,
                                                  'variantStatus', variantstatus,
                                                  'variantStatusValue', variantstatusvalue,
                                                  'variantSKU',sku, 
                                                  'variantAttributes',attributes,
                                                  'ref',variantref,
                                                  'productID', productid 
                                                )) AS "variantData"
          FROM     (
                              SELECT     p.id  AS "productid",
                                          pv.id AS "variantid",
                                          string_agg(COALESCE(NULLIF(pa.name,''),p.name),' : ') "attributes",
                                          pv.sku,
                                          pv.images "variantimages",
                                          pv.unit_price,
                                          pv.inventory,
                                          (
                                            SELECT COALESCE(sum(item_quantity)::Integer,0)
                                            FROM purchasing_order_items poi 
                                            INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id 
                                            WHERE poi.product_variant_id = pv.id 
                                            AND poi.is_reserve = TRUE 
                                            AND po.status != 'REJECT' 
                                            AND purchase_status = FALSE
                                          ) AS "reserved",
                                          pv.status "variantstatus",
                                          ps.name "variantstatusvalue",
                                          pv.ref "variantref"
                              FROM       product_variants pv
                              INNER JOIN products p
                              ON         p.id = pv.product_id
                              INNER JOIN product_attribute_list_mapping palm
                              ON         pv.mapping_id = palm.mapping_id
                              INNER JOIN product_attributes pa
                              ON         palm.attribute_id = pa.id
                              INNER JOIN product_attribute_types pat
                              ON         pat.id = pa.type_id
                              INNER JOIN product_status ps 
                              ON         ps.id = pv.status 
                              WHERE      p.page_id = $2
                                         AND pv.active = TRUE
                              GROUP BY   p.id,
                                          pv.id,
                                          p.name,
                                          ps.name ) AS variant_all
          GROUP BY variant_all.productid ), Count_CTE AS
              (
            SELECT CAST(COUNT(*) AS INT)
            FROM   Data_CTE ),
            Inventory_CTE AS
            (
                SELECT 
                  pv.product_id,
                  sum(inventory) AS "inventory",
                  sum(
                    (
                      SELECT COALESCE(sum(item_quantity)::Integer,0)
                      FROM purchasing_order_items poi 
                      INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id 
                      WHERE poi.product_variant_id = pv.id 
                      AND is_reserve = TRUE 
                      AND po.status != 'REJECT' 
                      AND purchase_status = FALSE
                    )
                  ) AS "reserved"
                FROM  
                  product_variants pv 
                WHERE 
                  page_id =$2 
                GROUP BY product_id  
            )
  SELECT     *
  FROM       Data_CTE
  INNER JOIN variant_CTE
  ON         Data_CTE.id = variant_cte.productid
  INNER JOIN Inventory_CTE 
  ON Data_CTE.id = Inventory_CTE.product_id
  CROSS JOIN Count_CTE
  ORDER BY   ${orderQuery} 
  OFFSET $3 ROWS
  FETCH NEXT $4 ROWS ONLY;
`;

  return SQL;
};

const getProductAllListProductMarketPlace = (searchQuery: string): string => {
  return `
          SELECT
          pm.id AS id,
          pm.name,
          NULL as "desc",
          NULL as "sku",
          'Selling' AS status,
          pm.active AS "active",
          1 AS "statusValue",
          0 AS "sold",
          CAST(0 AS INTEGER) AS "reserved",
          NULL AS "mergedProductData",
          pm.marketplace_id AS "marketPlaceID",
          pm.marketplace_type :: TEXT AS "marketPlaceType",
          CAST(sum(pmv.inventory) AS INTEGER) AS "inventory",
          min(pmv.unit_price) AS "maxUnitPrice",
          max(pmv.unit_price) AS "minUnitPrice",
          NULL AS "images",
          pm.product_id AS "marketPlaceProductID",
          CASE
            WHEN pm.product_id IS NULL THEN FALSE
            ELSE TRUE
          END AS "isMerged",
          CAST(count(pmv.product_marketplace_id) AS INTEGER) AS "variants" ,
          NULL AS "ref",
          pm.updated_at AS "updated_at"
        FROM
          product_marketplace pm
        INNER JOIN product_marketplace_variants pmv ON
          (pm.id = pmv.product_marketplace_id)
        WHERE
          pm.page_id = :pageID
          AND pm.active = TRUE
          AND pm.active = TRUE
          AND pm.imported = TRUE
          AND pm.product_id IS NULL
          ${searchQuery}
        GROUP BY
          pm.id,
          pmv.product_marketplace_id
  `;
};

const getProductAllListProduct = (whereType: string, searchQuery: string): string => {
  return `
  SELECT
    DISTINCT(p.id) "id",
    p."name" "name",
    p.description "desc",
    p.code "sku",
    ps."name" "status",
    p.active "active",
    ps.id "statusValue",
    (
      SELECT 
        COALESCE(sum(item_quantity)::Integer, 0)
      FROM
        purchasing_order_items poi
      INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id
      WHERE 
        poi.product_id = p.id
        AND po.status = 'CLOSE_SALE'
        AND poi.purchase_status = TRUE
    ) AS "sold",
    (
      SELECT 
        COALESCE(sum(item_quantity)::Integer, 0)
      FROM
        purchasing_order_items poi
      INNER JOIN purchasing_orders po ON po.id = poi.purchase_order_id
      WHERE
        poi.product_id = p.id
        AND poi.is_reserve = TRUE
        AND po.status != 'REJECT'
        AND purchase_status = FALSE
        AND poi.page_id = :pageID
    ) AS "reserved",
    (
      SELECT
        jsonb_agg(
          jsonb_build_object(
            'mergedMarketPlaceID', 
            pm.id, 
            'mergedMarketPlaceType', 
            pm.marketplace_type, 
            'mergedVariants', 
            (
              SELECT 
                jsonb_agg(
                  jsonb_build_object(
                    'marketPlaceVariantID', 
                    pmv.id, 
                    'marketPlaceVariantType', 
                    pmv.marketplace_type, 
                    'marketPlaceVariantSku', 
                    pmv.sku
                  ) 
                ) 
              FROM product_marketplace_variants pmv 
              WHERE pmv.product_marketplace_id = pm.id
            )
          ) 
        )
      FROM
        product_marketplace pm
      WHERE
        product_id = p.id
    ) AS "mergedProductData",
    NULL AS "marketPlaceID",
    'more_commerce' AS "marketPlaceType",
    sum(pv.inventory) "inventory",
    max(pv.unit_price) "maxUnitPrice",
    min(pv.unit_price) "minUnitPrice",
    p.images :: jsonb "images",
    -1 AS "marketPlaceProductID",
    TRUE AS "isMerged",
    count(pv.product_id) "variants",
    p.ref,
    (
      SELECT max (updated_at) FROM (
      SELECT up.updated_at FROM products up WHERE up.id = p.id
      UNION 
      SELECT upv.updated_at FROM product_variants upv WHERE upv.product_id = p.id
      UNION 
       SELECT upm.updated_at FROM product_marketplace upm WHERE upm.product_id = p.id
      UNION 
       SELECT upmv.updated_at FROM product_marketplace_variants upmv WHERE upmv.product_variant_id IN (SELECT pvu.id FROM product_variants pvu WHERE pvu.product_id = p.id)) temp
      ) "updated_at"
  FROM
    products p
  INNER JOIN product_variants pv ON
    p.id = pv.product_id
  INNER JOIN product_status ps ON
    p.status = ps.id
  WHERE
    p.page_id = :pageID
    AND p.active = TRUE
    AND pv.active = TRUE ${whereType}
    ${searchQuery}
  GROUP BY
    p.id,
    ps.id ),
`;
};
