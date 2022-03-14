import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult, INameObject, LanguageTypes } from '@reactor-room/model-lib';
import {
  IAddProductMarketPlaceParams,
  IAddProductMarketPlaceVariantParams,
  IMarketPlaceDiffInQuantity,
  IMergeMarketPlaceProductParams,
  IncreaseDecreaseType,
  IProductDetailsFromMarketSkuParams,
  IProductDetailsFromMarketVariantIDParams,
  IProductIDVariantID,
  IProductMarketPlace,
  IProductMarketPlaceCategory,
  IProductMarketPlaceCategoryTree,
  IProductMarketPlaceLatestByType,
  IProductMarketPlaceList,
  IProductMarketPlaceVariant,
  IProductMarketPlaceVariantList,
  IUpdateMarketPlaceProductByMarketPlaceIDParams,
  IUpdateMarketPlaceVariantBySKUParams,
  IVariantsOfProduct,
  ProductMarketPlaceLinkStatus,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export const getProductMarketPlaceList = async (
  client: Pool,
  pageID: number,
  isImported: boolean,
  searchQuery: string,
  orderQuery: string,
  page: number,
  pageSize: number,
  isAllRows = false,
): Promise<IProductMarketPlaceList[]> => {
  try {
    const bindings = {
      pageID,
      isImported,
      page,
      pageSize,
    };
    const SQL = ` 
                  WITH Data_CTE AS (
                    SELECT
                      pm.id AS id,
                      pm.marketplace_id AS "marketPlaceID" ,
                      pm.name,
                      pm.marketplace_type AS "marketPlaceType",
                      CAST(count(pmv.product_marketplace_id) AS INTEGER) AS "variants" ,
                      pm.active AS "active",
	                    CAST(sum(pmv.inventory) AS INTEGER) AS "inventory",
                      concat('฿', min(pmv.unit_price), ' - ', max(pmv.unit_price) ) AS "price",
                      pm.updated_at AS "updated_at"
                    FROM
                      product_marketplace pm
                    INNER JOIN product_marketplace_variants pmv ON
                      (pm.id = pmv.product_marketplace_id)
                    WHERE
                      pm.page_id = :pageID
                      AND pm.active = TRUE
                      AND pm.product_id IS NULL
                      AND pm.imported = :isImported
                      ${searchQuery}
                    GROUP BY
                      pm.id,
                      pmv.product_marketplace_id ),
                    Count_CTE AS (
                    SELECT
                      CAST(COUNT(*) AS INT) AS "totalRows"
                    FROM
                      Data_CTE )
                    SELECT
                      *
                    FROM
                      Data_CTE
                    CROSS JOIN Count_CTE
                    ORDER BY
                    ${orderQuery} 
                    ${isAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'}
                  
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlaceList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('Error getting product marketplace import list', error);
    throw new Error('Error getting product marketplace import list');
  }
};

export const getProductMarketPlaceByTypeProductLink = async (
  client: Pool,
  pageID: number,
  marketPlaceType: SocialTypes,
  productLinkStatus: ProductMarketPlaceLinkStatus,
): Promise<IProductMarketPlace[]> => {
  try {
    const bindings = {
      pageID,
      marketPlaceType,
    };
    const productLinkStatusObj = {
      [ProductMarketPlaceLinkStatus.ALL]: '',
      [ProductMarketPlaceLinkStatus.LINKED]: ' AND product_id is not null',
      [ProductMarketPlaceLinkStatus.NOT_LINKED]: ' AND product_id is null',
    };

    const productLinkSQL = productLinkStatusObj[productLinkStatus];
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
                            AND marketplace_type = :marketPlaceType 
                            ${productLinkSQL}
                            ;
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(result) ? result : ([] as IProductMarketPlace[]);
  } catch (error) {
    console.log('Error getting product marketplace by type', error);
    throw new Error('Error getting product marketplace by type');
  }
};

export const getProductMarketPlaceByProductID = async (client: Pool, pageID: number, productID: number): Promise<IProductMarketPlace[]> => {
  try {
    const bindings = {
      pageID,
      productID,
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
                            AND active = true
                            ;
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(result) ? result : ([] as IProductMarketPlace[]);
  } catch (error) {
    console.log('Error getting product marketplace by type', error);
    throw new Error('Error getting product marketplace by type');
  }
};

export const getLatestMarketPlaceProductByType = async (client: Pool, pageID: number, marketPlaceType: SocialTypes): Promise<IProductMarketPlaceLatestByType> => {
  const bindings = {
    pageID,
    marketPlaceType,
  };

  const SQL = `
                SELECT
                    id,
                    page_id "pageID",
                    created_at "createdAt",
                    updated_at "updatedAt"
                FROM
                    product_marketplace pm
                WHERE
                    page_id = :pageID
                    AND marketplace_type = :marketPlaceType
                    AND active = TRUE
                ORDER BY created_at desc
                LIMIT 1 ;

        `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductMarketPlaceLatestByType[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IProductMarketPlaceLatestByType);
};

export const getProductMarketPlaceVariantByIDAndType = async (
  client: Pool,
  pageID: number,
  variantID: number[],
  marketPlaceType: SocialTypes,
): Promise<IProductMarketPlaceVariant[]> => {
  try {
    const bindings = [pageID, variantID, marketPlaceType];

    const SQL = `
                  SELECT
                    id,
                    product_marketplace_id AS "productMarketPlaceID",
                    name,
                    sku,
                    CAST(unit_price AS DOUBLE PRECISION) AS "unitPrice",
                    CAST(inventory AS INTEGER),
                    marketplace_type AS "marketPlaceType",
                    marketplace_variant_id AS "marketPlaceVariantID",
                    variant_json AS "variantJson",
                    active
                  FROM
                    product_marketplace_variants pmv
                  WHERE
                    pmv.page_id = $1
                    AND pmv.product_variant_id =  ANY($2 :: int[])
                    AND pmv.marketplace_type = $3
                    AND pmv.active = TRUE
                            ;
        `;
    const result = await PostgresHelper.execQuery<IProductMarketPlaceVariant[]>(client, SQL, bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('Error getting product marketplace variant by type and id', error);
    throw new Error('Error getting product marketplace variant by type and id');
  }
};

export const getProductMarketPlaceByIDAndType = async (client: Pool, pageID: number, productID: number, marketPlaceType: SocialTypes): Promise<IProductMarketPlace> => {
  try {
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
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(result) ? result[0] : null;
  } catch (error) {
    console.log('Error getting product marketplace by type and id', error);
    throw new Error('Error getting product marketplace by type and id');
  }
};

export const addProductMarketPlace = async (client: Pool, params: IAddProductMarketPlaceParams): Promise<IProductMarketPlace> => {
  try {
    const SQL = `
                INSERT INTO product_marketplace
                            (page_id,marketplace_id, product_id,name,marketplace_type,product_json, total_products , imported) 
                VALUES      (:pageID,:marketPlaceID,:productID, :name,:marketPlaceType,:productJson, :totalProducts, :imported) 
                ON CONFLICT (marketplace_id,marketplace_type,page_id)
                DO UPDATE 
                SET active = true , name = :name , marketplace_type = :marketPlaceType, 
                product_json = :productJson, total_products = :totalProducts, updated_at = :updatedAt
                RETURNING *
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { updatedAt: getUTCDayjs(), ...params });
    const result = await PostgresHelper.execBatchTransaction<IProductMarketPlace>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return !isEmpty(result) ? result : ({} as IProductMarketPlace);
  } catch (error) {
    console.log('Error adding product marketplace', error);
    throw new Error('Error adding product marketplace');
  }
};

export const importProductFromMarketPlace = async (client: Pool, pageID: number, ids: number[]): Promise<IHTTPResult> => {
  try {
    const SQL = `
                    UPDATE
                            product_marketplace
                    SET
                            imported = TRUE,
                            updated_at = timezone(
                              'UTC'::TEXT,
                              now())
                    WHERE
                            id = ANY($1 :: int[])
                    AND     page_id = $2
      `;
    await PostgresHelper.execQuery(client, SQL, [ids, pageID]);
    return { value: true, status: 200 };
  } catch (error) {
    console.log('Error importing product marketplace variants', error);
    return { value: false, status: 403 };
  }
};

export const deleteProductFromMarketPlace = async (client: Pool, pageID: number, ids: number[]): Promise<IHTTPResult> => {
  try {
    const SQL = `
                    UPDATE
                            product_marketplace
                    SET
                            imported = false,
                            updated_at = timezone(
                              'UTC'::TEXT,
                              now())
                    WHERE
                            id = ANY($1 :: int[])
                    AND     page_id = $2
      `;
    await PostgresHelper.execQuery(client, SQL, [ids, pageID]);
    return { value: true, status: 200 };
  } catch (error) {
    console.log('Error delete product marketplace variants', error);
    return { value: false, status: 403 };
  }
};

export const addProductMarketPlaceVariants = async (client: Pool, params: IAddProductMarketPlaceVariantParams): Promise<IProductMarketPlaceVariant> => {
  try {
    const SQL = `
                  INSERT INTO   product_marketplace_variants 
                                (product_marketplace_id, name, sku, product_variant_id, page_id,marketplace_type,variant_json, inventory, unit_price, marketplace_variant_id) 
                  VALUES        (:productMarketPlaceID, :name, :sku, :productVariantID, :pageID,                    :marketPlaceType,:variantJson, :inventory, :unitPrice, 
                  :marketPlaceVariantID)
                  ON CONFLICT   (product_marketplace_id,sku,page_id)
                  DO UPDATE
                  SET marketplace_type = :marketPlaceType,variant_json = :variantJson,
                  inventory = :inventory, unit_price = :unitPrice, updated_at = :updatedAt        
                  RETURNING *
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, { updatedAt: getUTCDayjs(), ...params });
    const result = await PostgresHelper.execBatchTransaction<IProductMarketPlaceVariant[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(result) ? result[0] : ({} as IProductMarketPlaceVariant);
  } catch (error) {
    console.log('Error adding product marketplace variants', error);
    throw new Error('Error adding product marketplace variants');
  }
};

export const getProductMarketPlaceVariantList = async (pageID: number, id: number[], whereQuery: string, client: Pool): Promise<IProductMarketPlaceVariantList[]> => {
  try {
    const bindings = [pageID, id];
    const SQL = `
                  SELECT
                    id,
                    product_marketplace_id AS "productMarketPlaceID",
                    name,
                    sku,
                    product_variant_id AS "productVariantID",
                    CAST(unit_price AS DOUBLE PRECISION) AS "unitPrice",
                    CAST(inventory AS INTEGER),
                    marketplace_type AS "marketPlaceType",
                    variant_json AS "variantJson",
                    active
                  FROM
                    product_marketplace_variants pmv
                  WHERE
                    pmv.page_id = $1
                    AND pmv.active = TRUE
                    AND pmv.product_marketplace_id = ANY($2 :: int[])
                    ${whereQuery}
                `;
    const result = await PostgresHelper.execQuery<IProductMarketPlaceVariantList[]>(client, SQL, bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('Error get product marketplace variant list', error);
    throw new Error('Error get product marketplace variant list');
  }
};

export const updateMarketPlaceProductByProductID = async (pageID: number, params: IMergeMarketPlaceProductParams, client: Pool): Promise<IHTTPResult> => {
  const { id, marketIDs } = params;
  try {
    const SQL = `
    UPDATE
            product_marketplace
    SET
            product_id = $1,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            id = ANY($2 :: int[])
    AND     page_id = $3
`;
    await PostgresHelper.execQuery(client, SQL, [id, marketIDs, pageID]);
    return { value: true, status: 200 };
  } catch (error) {
    console.log('Error merging product to market place :>> ', error);
    return { value: false, status: 403 };
  }
};

export const updateProductMarketPlaceVariantQuantity = async (pageID: number, marketPlaceVariantID: number, quantity: number, client: Pool): Promise<void> => {
  const SQL = `
    UPDATE
            product_marketplace_variants
    SET
            inventory = $1,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            page_id = $2
    AND     id = $3
`;
  await PostgresHelper.execQuery(client, SQL, [quantity, pageID, marketPlaceVariantID]);
};

export const updateMarketPlaceProductByMarketPlaceID = async (pageID: number, params: IUpdateMarketPlaceProductByMarketPlaceIDParams, client: Pool): Promise<void> => {
  const { id, marketPlaceID, marketPlaceType } = params;
  const SQL = `
    UPDATE
            product_marketplace
    SET
            product_id = $1,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            marketplace_id = $2
    AND     page_id = $3
    AND     marketplace_type = $4
`;
  await PostgresHelper.execQuery(client, SQL, [id, marketPlaceID, pageID, marketPlaceType]);
};

export const updateMarketPlaceVariantByProductVariantID = async (pageID: number, params: IMergeMarketPlaceProductParams, client: Pool): Promise<void> => {
  const { id, marketIDs } = params;
  try {
    const SQL = `
    UPDATE
          product_marketplace_variants
    SET
            product_variant_id = $1,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            id = ANY($2 :: int[])
    AND     page_id = $3
`;
    await PostgresHelper.execQuery(client, SQL, [id, marketIDs, pageID]);
  } catch (error) {
    console.log('Error merging variant to market place :>> ', error);
    throw new Error('ERROR_UPDATING_PRODUCT_VARIANT_AT_MARKETPLACE');
  }
};

export const updateMarketPlaceVariantBySKU = async (pageID: number, params: IUpdateMarketPlaceVariantBySKUParams, client: Pool): Promise<void> => {
  const { id, sku, marketPlaceType } = params;

  const SQL = `
    UPDATE
          product_marketplace_variants
    SET
            product_variant_id = $1,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            sku = $2
    AND     page_id = $3
    AND     marketplace_type = $4
`;
  await PostgresHelper.execQuery(client, SQL, [id, sku, pageID, marketPlaceType]);
};

export const upsertMarketPlaceBrands = async (bulkBrands: string, client: Pool): Promise<void> => {
  try {
    const SQL = `
                  INSERT
                    INTO
                    product_marketplace_brands (marketplace_type ,
                    name ,
                    identifier ,
                    brand_id )
                  VALUES ${sanitizeSQL(bulkBrands)}
                  ON CONFLICT 
                  (marketplace_type ,brand_id) DO NOTHING
`;
    await PostgresHelper.execQuery(client, SQL, []);
  } catch (error) {
    console.log(' upsertMarketPlaceBrands -> ', error);
    throw new Error(error);
  }
};

export const getMarketPlaceVariantForProductList = async (pageID: number, marketPlaceIDs: number[], client: Pool): Promise<IVariantsOfProduct[]> => {
  const SQL = `
                SELECT
                  id AS "variantID",
                  0::INTEGER AS "variantSold",
                  inventory::INTEGER AS "variantInventory",
                  1 AS "variantStatus",
                  NULL AS "variantImages",
                  name AS "variantAttributes",
                  unit_price AS "variantUnitPrice" ,
                  NULL::json AS "productID",
                  product_variant_id AS "productVariantID",
                  marketplace_type AS "variantMarketPlaceType",
                  product_marketplace_id AS "variantMarketPlaceID",
                  NULL AS REF,
                  'Selling' AS "variantStatusValue",
                  NULL as "mergedVariantData"
                FROM
                  product_marketplace_variants
                WHERE
                    product_marketplace_id = ANY($1 :: int[])
                    AND page_id = $2
                    AND product_variant_id IS NULL
                    AND active = TRUE
  `;

  const result = await PostgresHelper.execQuery<IVariantsOfProduct[]>(client, SQL, [marketPlaceIDs, pageID]);
  return isEmpty(result) ? [] : result;
};

export const getProductMarketPlaceVariantByType = async (pageID: number, pageType: string[], client: Pool): Promise<IProductMarketPlaceVariant[]> => {
  const SQL = `
              SELECT
                id,
                product_marketplace_id AS "productMarketPlaceID",
                product_variant_id,
                sku,
                name,
                page_id AS "pageID",
                unit_price AS "unitPrice",
                inventory,
                marketplace_type AS "marketPlaceType",
                variant_json AS "variantJson"
              FROM
                product_marketplace_variants
              WHERE
                page_id = $1
                AND marketplace_type = ANY($2)
`;

  const result = await PostgresHelper.execQuery<IProductMarketPlaceVariant[]>(client, SQL, [pageID, pageType]);
  return isEmpty(result) ? [] : result;
};

export const getMultipleMarketPlaceVariant = async (pageID: number, marketPlaceIDs: number[], client: Pool): Promise<IProductMarketPlaceVariant[]> => {
  const SQL = `
              SELECT
              id,
              product_marketplace_id AS "productMarketPlaceID",
              marketplace_variant_id AS "marketPlaceVariantID",
              product_variant_id as "productVariantID",
              sku,
              name,
              page_id AS "pageID",
              unit_price AS "unitPrice",
              inventory,
              marketplace_type AS "marketPlaceType",
              variant_json AS "variantJson"
            FROM
              product_marketplace_variants
            WHERE
              id = ANY($1 :: int[])
              AND page_id = $2
`;
  return await PostgresHelper.execQuery<IProductMarketPlaceVariant[]>(client, SQL, [marketPlaceIDs, pageID]);
};

export const upsertMarketPlaceCategoryTree = async (
  { marketPlaceType, categoryID, name, parentID, leaf, varType, language }: IProductMarketPlaceCategory,
  client: Pool,
): Promise<IProductMarketPlaceCategory> => {
  const bindings = {
    marketPlaceType,
    categoryID,
    name,
    parentID,
    leaf,
    varType,
    language,
  };
  try {
    const SQL = ` 
    INSERT
      INTO
      product_marketplace_category 
      (
        marketplace_type,
        category_id,
        parent_id,
        name,
        leaf,
        var,
        language
      )
  VALUES(
      :marketPlaceType ,
      :categoryID ,
      :parentID ,
      :name ,
      :leaf ,
      :varType,
      :language
  )
  ON CONFLICT (marketplace_type,category_id,parent_id, language) DO NOTHING
  RETURNING id ;
`;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execBatchTransaction<IProductMarketPlaceCategory>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return !isEmpty(result) ? result : ({} as IProductMarketPlaceCategory);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

export const increaseDecreaseMarketPlaceVariantInventory = async ({ id, quantity, mode }: IMarketPlaceDiffInQuantity, client: Pool): Promise<IProductMarketPlaceVariant> => {
  const operation = mode === IncreaseDecreaseType.INCREASE ? ' + ' : ' - ';
  const bindings = {
    id,
    quantity: Math.abs(quantity),
  };
  const SQL = `
    UPDATE
      product_marketplace_variants
    SET
      inventory = (
      SELECT
        inventory
      FROM
        product_marketplace_variants pmv
      WHERE
        id = :id ) ${operation} :quantity
    WHERE
      id = :id 
    RETURNING id, product_variant_id as "productVariantID", page_id as "pageID", inventory
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductMarketPlaceVariant[]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
  return Array.isArray(result) ? result[0] : ({} as IProductMarketPlaceVariant);
};

export const getMarketPlaceBrandSuggestions = async (keyword: string, socialType: SocialTypes, whereCondition: string, client: Pool): Promise<INameObject[]> => {
  try {
    const bindings = [socialType, keyword];
    const SQL = `
                  SELECT
                    name
                  FROM
                    product_marketplace_brands pmb
                  WHERE
                   marketplace_type = $1
                   AND ${whereCondition}
                  LIMIT 30;
    `;
    const result = await PostgresHelper.execQuery<INameObject[]>(client, sanitizeSQL(SQL), bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('error at data file getMarketPlaceBrandSuggestions  :>> ', error);
    return [] as INameObject[];
  }
};

export const getProductMarketPlaceCategoryTreeByParentID = async (
  client: Pool,
  marketPlaceType: SocialTypes,
  parentID: number,
  language: LanguageTypes,
): Promise<IProductMarketPlaceCategoryTree[]> => {
  try {
    const bindings = {
      marketPlaceType,
      parentID,
      language,
    };
    const SQL = `
                SELECT
                    id,
                    marketplace_type AS "marketplaceType" ,
                    name,
                    category_id AS "categoryID",
                    parent_id AS "parentID",
                    leaf,
                    language
                FROM
                    product_marketplace_category pmc
                WHERE
                    marketplace_type = :marketPlaceType
                AND language = :language
                AND parent_id = :parentID;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlaceCategoryTree[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('Error getting product marketplace cateogory tree', error);
    throw new Error('Error getting product marketplace cateogory tree');
  }
};

export const updateMarketPlaceVariantPriceByID = async (pageID: number, marketPlaceVariantID: number, unitPrice: number, status: boolean, client: Pool): Promise<void> => {
  const bindings = {
    unitPrice,
    pageID,
    status,
    marketPlaceVariantID,
  };
  const SQL = `
    UPDATE
            product_marketplace_variants
    SET
            unit_price = :unitPrice,
            active = :status,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            page_id = :pageID
    AND     id = :marketPlaceVariantID
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const updateMarketPlaceProductNameByID = async (pageID: number, id: number, name: string, client: Pool): Promise<void> => {
  const bindings = {
    pageID,
    name,
    id,
  };
  const SQL = `
    UPDATE
        product_marketplace
    SET
        name = :name,
        updated_at = timezone(
          'UTC'::TEXT,
          now())
    WHERE
        page_id = :pageID
    AND id = :id
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
  await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const updateMarketPlaceProductJSON = async (pageID: number, id: number, productJSON: string, client: Pool): Promise<void> => {
  const bindings = {
    pageID,
    productJSON,
    id,
  };
  const SQL = `
    UPDATE
        product_marketplace
    SET
        product_json = :productJSON,
        updated_at = timezone(
          'UTC'::TEXT,
          now())
    WHERE
        page_id = :pageID
    AND id = :id
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(sanitizeSQL(SQL), bindings);
  await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const getProductDetailsFromMarketPlaceSku = async (params: IProductDetailsFromMarketSkuParams, client: Pool): Promise<IProductIDVariantID> => {
  const SQL = `
             
                SELECT
                            pm.product_id AS "productID",
                            pmv.product_variant_id AS "variantID"
                FROM
                            product_marketplace_variants pmv
                INNER JOIN  product_marketplace pm 
                ON          (pm.id = pmv.product_marketplace_id)
                WHERE
                              pmv.sku = :marketPlaceSKU
                AND           pmv.page_id = :pageID
                AND           pmv.marketplace_type = :marketPlaceType
                AND           pmv.active = TRUE
              `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, params);
  const result = await PostgresHelper.execQuery<[IProductIDVariantID]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : { productID: null, variantID: null };
};

export const getProductDetailsFromMarketPlaceVariantID = async (params: IProductDetailsFromMarketVariantIDParams, client: Pool): Promise<IProductIDVariantID> => {
  const SQL = `
             
                SELECT
                            pm.product_id AS "productID",
                            pmv.product_variant_id AS "variantID"
                FROM
                            product_marketplace_variants pmv
                INNER JOIN  product_marketplace pm 
                ON          (pm.id = pmv.product_marketplace_id)
                WHERE
                              pmv.marketplace_variant_id = :marketPlaceVariantID
                AND           pmv.page_id = :pageID
                AND           pmv.marketplace_type = :marketPlaceType
                AND           pmv.active = TRUE
              `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, params);
  const result = await PostgresHelper.execQuery<[IProductIDVariantID]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return result?.length ? result[0] : { productID: null, variantID: null };
};

export const getProductMarketPlaceCategoryTreeByCategoryID = async (
  client: Pool,
  marketPlaceType: SocialTypes,
  categoryID: number,
  language: LanguageTypes,
): Promise<IProductMarketPlaceCategoryTree[]> => {
  try {
    const bindings = {
      marketPlaceType,
      categoryID,
      language,
    };
    const SQL = `
                  WITH RECURSIVE category_rec AS (
                    SELECT
                      pm.id,
                      pm.name,
                      pm.category_id,
                      pm.parent_id,
                      pm.marketplace_type,
                      pm.leaf,
                      pm.language
                    FROM
                      product_marketplace_category pm
                    WHERE
                      category_id = :categoryID AND marketplace_type = :marketPlaceType AND language = :language
                    UNION ALL
                    SELECT
                      pmc.id,
                      pmc.name,
                      pmc.category_id,
                      pmc.parent_id,
                      pmc.marketplace_type,
                      pmc.leaf,
                      pmc.language
                    FROM
                      product_marketplace_category pmc
                    JOIN category_rec ON
                      pmc.category_id = category_rec.parent_id )
                    SELECT
                      id,
                      marketplace_type AS "marketplaceType" ,
                      name,
                      category_id AS "categoryID",
                      parent_id AS "parentID",
                      leaf,
                      language
                    FROM
                      category_rec
                    ORDER BY
                      id
      
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlaceCategoryTree[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return isEmpty(result) ? [] : result;
  } catch (error) {
    console.log('Error getting product marketplace cateogory tree by category id', error);
    throw new Error('Error getting product marketplace cateogory tree by category id');
  }
};

export const updateProductMarketPlacePriceInventory = async (
  pageID: number,
  marketVariantID: number,
  variantInventory: number,
  variantUnitPrice: number,
  readerClient: Pool,
): Promise<void> => {
  const bindings = {
    pageID,
    marketVariantID,
    variantInventory,
    variantUnitPrice,
  };
  const SQL = `      
          UPDATE
            product_marketplace_variants
          SET
            unit_price = :variantUnitPrice,
            inventory = :variantInventory,
            updated_at = timezone(
                'UTC'::TEXT,
                now()
            )
          WHERE
            id = :marketVariantID
            AND page_id = :pageID
`;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<[IProductIDVariantID]>(readerClient, returnSQLBindings.sql, returnSQLBindings.bindings);
};

export const getProductMarketPlaceByID = async (client: Pool, pageID: number, id: number): Promise<IProductMarketPlace> => {
  try {
    const bindings = {
      pageID,
      id,
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
                            AND id = :id
                            AND active = true
                            ;
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execQuery<IProductMarketPlace[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return Array.isArray(result) ? result[0] : null;
  } catch (error) {
    console.log('Error getting product marketplace by id ', error);
    throw new Error('Error getting product marketplace by id');
  }
};

export const unMergeAndUnImportMarketPlaceByIDBatch = async (pageID: number, ids: number[], client: Pool): Promise<void> => {
  const SQL = `
    UPDATE
            product_marketplace
    SET
            product_id = null,
            imported = false,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            id = ANY($1 :: int[])
    AND     page_id = $2
`;
  await PostgresHelper.execBatchTransaction(client, SQL, [ids, pageID]);
};

export const unMergeProductVariantMarketPlaceByIDBatch = async (pageID: number, ids: number[], client: Pool): Promise<void> => {
  const SQL = `
    UPDATE
          product_marketplace_variants
    SET
            product_variant_id = null,
            updated_at = timezone(
              'UTC'::TEXT,
              now())
    WHERE
            id = ANY($1 :: int[])
    AND     page_id = $2
`;
  await PostgresHelper.execBatchTransaction(client, SQL, [ids, pageID]);
};
