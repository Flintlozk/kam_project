import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult, INameIDObject } from '@reactor-room/model-lib';
// import { generateResponseMessage } from '@reactor-room/itopplus-back-end-helpers';
import { IGQLContext, IProductCategoryList, IProductCategoryMappingDB, PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export function getProductCategoryList(client: Pool, context: IGQLContext): Promise<IProductCategoryList[]> {
  return new Promise<IProductCategoryList[]>((resolve, reject) => {
    const { pageID } = context.payload;
    const bindings = {
      pageID,
    };
    const SQL = ` 
            SELECT distinct(pc.id) AS "categoryID",
                    pc.name AS "category",
                    jsonb_agg(jsonb_build_object('subCategoryID', p_sc.id, 'subCategory', p_sc."name")) AS "subCategories"
            FROM product_category pc
            INNER JOIN product_category p_sc ON pc.id = p_sc.sub_category_id
            WHERE pc.active = TRUE
            AND pc.page_id = :pageID
            GROUP BY pc.id
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);

    const data = PostgresHelper.execQuery<IProductCategoryList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    data
      .then((result) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export function getProductCategoryManagement(
  client: Pool,
  pageID: number,
  searchQuery: string,
  orderQuery: string,
  page: number,
  pageSize: number,
): Promise<IProductCategoryList[]> {
  return new Promise<IProductCategoryList[]>((resolve, reject) => {
    const bindings = {
      pageID,
      searchQuery,
      page,
      pageSize,
    };
    const SQL = `
    WITH Data_CTE 
    AS
    (
      SELECT distinct(pc.id) AS "categoryID",
        pc.name AS "category",
        pc.updated_at,
        jsonb_agg(jsonb_build_object('subCategoryID', p_sc.id, 'subCategory', p_sc."name", 'subCategoryActive', p_sc.active)) AS "subCategories"
      FROM product_category pc
      LEFT JOIN product_category p_sc ON pc.id = p_sc.sub_category_id
      WHERE pc.page_id = :pageID AND pc.active = true AND pc.sub_category_id = -1 ${searchQuery} 
      GROUP BY pc.id
      ORDER BY pc.id
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
    const data = PostgresHelper.execQuery<[IProductCategoryList]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
    data
      .then((result: IProductCategoryList[]) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export const executeCategoryQuery = async <T>(
  pageID: number,
  category: string,
  msgCatAlreadyExit: string,
  msgCatSaveError: string,
  client: Pool,
): Promise<IProductCategoryMappingDB> => {
  try {
    const bindings = {
      pageID,
      category,
    };
    const SQL = ` INSERT INTO product_category(page_id, name, sub_category_id) 
                  VALUES      (:pageID ,:category, -1) 
                  ON CONFLICT (page_id , name, sub_category_id ) DO UPDATE SET active =TRUE
                  RETURNING * ;`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const executeAttribute = await PostgresHelper.execBatchTransaction<IProductCategoryMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return executeAttribute;
  } catch (error) {
    console.log('error', error);
    let message = '';
    if (error.message.toString().indexOf('product_category_un') >= 0) {
      message = msgCatAlreadyExit;
    } else {
      message = msgCatSaveError;
    }
    throw new Error(message);
  }
};

export const executeSubCategoryQuery = async <T>(pageID: number, categoryID, subCategory: string, client: Pool) => {
  try {
    const bindings = {
      pageID,
      subCategory,
      categoryID,
    };
    const SQL = ` INSERT INTO product_category (page_id, name, sub_category_id) 
                  VALUES      (:pageID , :subCategory, :categoryID) 
                  ON CONFLICT (page_id , name, sub_category_id ) DO UPDATE SET active =TRUE
                  RETURNING *`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction<IProductCategoryMappingDB>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    let message = error.message;
    message.toString().indexOf('product_category_un')
      ? (message = `'${subCategory}' ${PRODUCT_TRANSLATE_MSG.sub_cat_already_exists}`)
      : (message = PRODUCT_TRANSLATE_MSG.sub_cat_save_error);
    throw new Error(message);
  }
};

export const executeCategoryMappingExists = async <T>(pageID: number, catIDs: number[], type: string, client: Pool): Promise<INameIDObject[]> => {
  try {
    const selectID = type === 'CATEGORY' ? 'pcm.category_id AS "id"' : 'pcm.sub_category_id AS "id"';
    const condition = type === 'CATEGORY' ? 'category_id = ANY($1 :: int[])' : 'pcm.sub_category_id  = ANY($1 :: int[])';
    const group = type === 'CATEGORY' ? 'pcm.category_id,pc.NAME' : 'pcm.sub_category_id,pc.NAME';
    const onCondition = type === 'CATEGORY' ? 'pc.id = pcm.category_id' : ' pc.id = pcm.sub_category_id ';
    const SQL = ` 
              SELECT      ${selectID},
                          pc."name" AS "name"
              FROM        product_category_mapping pcm
              INNER JOIN  product_category pc 
              ON          ${onCondition}
              WHERE       ${condition}
              AND         pc.page_id = $2 
              AND         pcm.active = TRUE
              GROUP BY    ${group}
    `;
    const result = await PostgresHelper.execQuery<INameIDObject[]>(client, sanitizeSQL(SQL), [catIDs, pageID]);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.log('Error executing product cateogry mapping query! ', err);
    throw new Error(err);
  }
};

export const executeSubCategoryMappingExists = async <T>(pageID: number, subCatID: number, client: Pool): Promise<boolean> => {
  const bindings = { subCatID, pageID };
  const SQL = ` 
            SELECT  count(1)
            FROM    product_category_mapping pcm
            WHERE   sub_category_id = :subCatID
              AND   page_id = :pageID
              AND   active = TRUE
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return +data[0].count > 0 ? true : false;
};

export const executeRemoveProductCategory = async (pageID: number, subCatIDs: number[], catIDs: number[], client: Pool) => {
  try {
    const SQL = `
                  UPDATE  product_category
                  SET     active = FALSE
                  WHERE   id = ANY($1 :: int[])
                          AND page_id = $2

    `;
    if (subCatIDs?.length) await PostgresHelper.execQuery<INameIDObject[]>(client, SQL, [subCatIDs, pageID]);
    if (catIDs?.length) await PostgresHelper.execQuery<INameIDObject[]>(client, SQL, [catIDs, pageID]);
  } catch (err) {
    console.log('Error removing product categories executeRemoveProductCategory ! ', err);
    throw new Error(err);
  }
};

export const getCategoryByName = async (pageID: number, client: Pool, id: number, name: string, subCatID: number): Promise<IProductCategoryMappingDB> => {
  const bindings = { pageID, name, subCatID };
  const SQL = 'SELECT id, page_id, name, sub_category_id, active FROM product_category WHERE name=:name AND page_id = :pageID AND sub_category_id = :subCatID ; ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const catData = await PostgresHelper.execQuery<IProductCategoryMappingDB[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(catData) ? catData[0] : null;
};

export const executeUpdateCatSubCatName = async <T>(id: number, name: string, subCatID: number, pageID: number, client: Pool): Promise<IHTTPResult> => {
  try {
    const bindings = { id, name, pageID, subCatID };
    const SQL = ' UPDATE product_category SET name=:name, sub_category_id = :subCatID WHERE id = :id AND page_id = :pageID ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const result: IHTTPResult = {
      status: 200,
      value: PRODUCT_TRANSLATE_MSG.cat_update_success,
    };
    return result;
  } catch (err) {
    console.log('Error updating category or sub category', err);
    throw new Error(`'${name}' ` + err);
  }
};

export const executeDeleteSubCategory = async <T>(id: number, pageID: number, client: Pool): Promise<IHTTPResult> => {
  try {
    const bindings = { id, pageID };
    const SQL = ' UPDATE product_category SET active = false WHERE id = :id AND page_id = :pageID ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const result: IHTTPResult = {
      status: 200,
      value: PRODUCT_TRANSLATE_MSG.sub_cat_delete_success,
    };
    return result;
  } catch (err) {
    console.log('Error deleteting Sub-category! ', err);
    return { status: 403, value: 'Error deleteting Sub-category!' };
  }
};
