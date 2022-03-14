import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICount, IHTTPResult } from '@reactor-room/model-lib';
import type { IGQLContext, IProductAttributeDB, IProductAttributeList, IProductSubAttributeDB } from '@reactor-room/itopplus-model-lib';
import { PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';
export function getProductAttributeList(client: Pool, pageID: number): Promise<IProductAttributeList[]> {
  return new Promise<IProductAttributeList[]>((resolve, reject) => {
    const bindings = {
      pageID,
    };
    const SQL = `
                SELECT DISTINCT( pat.id )          AS "attributeID",
                pat.name            "attributeName",
                JSONB_AGG(JSONB_BUILD_OBJECT('subAttributeID', pa.id,
                          'subAttributeName',
                          pa.name)) AS "subAttributes"
                FROM   product_attribute_types pat
                LEFT JOIN product_attributes pa
                  ON ( pat.id = pa.type_id )
                WHERE  pat.page_id = :pageID
                AND pat.id <> -1
                AND pat.active = TRUE
                GROUP  BY pat.id 
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery<IProductAttributeList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export function getProductAttributeManagement(
  client: Pool,
  pageID: number,
  searchQuery: string,
  orderQuery: string,
  page: number,
  pageSize: number,
): Promise<IProductAttributeList[]> {
  return new Promise<IProductAttributeList[]>((resolve, reject) => {
    const bindings = {
      pageID,
      searchQuery,
      page,
      pageSize,
    };
    const SQL = `
                WITH Data_CTE AS
                (
                                SELECT DISTINCT(pat.id) AS "attributeID",
                                                pat.name "attributeName",
                                                pat.updated_at as "updated_at",
                                                JSONB_AGG(JSONB_BUILD_OBJECT('subAttributeID', pa.id, 'subAttributeName', pa.name)) AS "subAttributes"
                                FROM            product_attribute_types pat
                                LEFT JOIN       product_attributes pa
                                ON              (
                                                  pat.id = pa.type_id
                                                )
                                WHERE           pat.page_id = :pageID ${searchQuery}
                                AND             pat.id <> -1
                                AND             pat.active = TRUE
                                AND 		      	pa.active = TRUE
                                GROUP BY        pat.id ), Count_CTE AS
                (
                      SELECT CAST(COUNT(*) AS INT) AS TotalRows
                      FROM   Data_CTE 
                )
                SELECT     *
                FROM       Data_CTE
                CROSS JOIN Count_CTE
                ORDER BY ${orderQuery}
                OFFSET :page ROWS
                FETCH NEXT :pageSize ROWS ONLY;
    `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery<[IProductAttributeList]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
    data
      .then((result: IProductAttributeList[]) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export function addProductAttribute(client: Pool, context: IGQLContext, name: string): Promise<IHTTPResult> {
  return new Promise<IHTTPResult>((resolve) => {
    const { pageID } = context.payload;
    const bindings = {
      pageID,
      name,
    };
    const SQL = `
                  INSERT INTO product_attribute_types
                          (
                            page_id ,
                            name
                          )
                          VALUES
                          (
                            :pageID,
                            :name
                          )
                  ON CONFLICT (page_id , name ) DO UPDATE SET active = TRUE
                  RETURNING *
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result) => {
        const response: IHTTPResult = {
          status: 200,
          value: JSON.stringify(result[0]),
        };
        resolve(response);
      })
      .catch((err) => {
        console.log('err', err);
        let errMessage = err.message;
        if (errMessage.indexOf('product_attribute_types_unique_constraint"') >= 0) {
          errMessage = PRODUCT_TRANSLATE_MSG.attr_already_exists;
        } else {
          errMessage = PRODUCT_TRANSLATE_MSG.attr_save_error;
        }
        const response: IHTTPResult = {
          status: 403,
          value: errMessage,
        };
        resolve(response);
      });
  });
}

export function addProductSubAttribute(client: Pool, pageID: number, attributeID: number, subAttributeName: string): Promise<IHTTPResult> {
  // TODO: Fix this
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IHTTPResult>(async (resolve, reject) => {
    const bindings = { pageID, attributeID, subAttributeName };
    const isAttrSubAttrSameName = await executeIsAttribSubAttribSameName(pageID, attributeID, subAttributeName, client);
    if (isAttrSubAttrSameName) {
      const subAttrResponse = `'${subAttributeName}' ${PRODUCT_TRANSLATE_MSG.attr_subattr_same_name}`;
      reject(subAttrResponse);
      throw new Error(subAttrResponse);
    } else {
      const SQL = `
                  INSERT INTO product_attributes
                          (
                            page_id,
                            type_id,
                            name 
                          )
                  VALUES
                          (
                            :pageID,
                            :attributeID,
                            :subAttributeName
                            )
                  ON CONFLICT (page_id , type_id, name ) DO UPDATE SET active = TRUE
                  RETURNING   id,
                              type_id,
                              name
      `;
      const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
      const data = PostgresHelper.execQuery<[IProductAttributeList]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

      data
        .then((result) => {
          const response: IHTTPResult = {
            status: 200,
            value: JSON.stringify(result[0]),
          };
          resolve(response);
        })
        .catch((err) => {
          err = err.message.indexOf('product_attributes_un') >= 0 ? PRODUCT_TRANSLATE_MSG.sub_attr_same_name : PRODUCT_TRANSLATE_MSG.sub_attr_save_error;
          const response: IHTTPResult = {
            status: 403,
            value: err,
          };
          resolve(response);
        });
    }
  });
}

export function searchProductSKU(client: Pool, context: IGQLContext, sku: string): Promise<IHTTPResult> {
  return new Promise<IHTTPResult>((resolve) => {
    const { pageID } = context.payload;
    const bindings = { pageID, sku };
    const SQL = `
                  SELECT COUNT(1)
                  FROM   product_variants
                  WHERE  page_id = :pageID
                    AND sku = :sku 
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);

    const data = PostgresHelper.execQuery<[ICount]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result) => {
        const response: IHTTPResult = {
          status: 200,
          value: result[0].count,
        };
        resolve(response);
      })
      .catch((err) => {
        const errMessage = err.message;
        err = PRODUCT_TRANSLATE_MSG.sku_search_err + errMessage;
        const response: IHTTPResult = {
          status: 403,
          value: err,
        };
        resolve(response);
      });
  });
}
export const executeSubAttributeMappingExists = async (pageID: number, subAttrIDs: number[], client: Pool): Promise<number[]> => {
  const SQL = `
              SELECT   attribute_id AS "id" 
              FROM     product_attribute_list_mapping palm 
              WHERE    attribute_id = ANY($1 :: int[]) 
              AND      page_id =$2 
              AND      active = true 
              GROUP BY attribute_id 
            `;
  const bindings = [subAttrIDs, pageID];
  const result = await PostgresHelper.execQuery(client, SQL, bindings);
  return Array.isArray(result) ? result.map(({ id }) => +id) : [];
};

export const executeAttributeMappingExists = async (pageID: number, attr: number[], client: Pool): Promise<number[]> => {
  const SQL = `
                SELECT pa.type_id AS "id" 
                FROM   product_attributes pa 
                      INNER JOIN product_attribute_list_mapping palm 
                              ON ( pa.id = palm.attribute_id ) 
                WHERE  pa.active = true 
                      AND palm.active = true 
                      AND pa.page_id = $1 
                      AND palm.page_id = $2
                      AND pa.type_id IN (SELECT id 
                                          FROM   product_attribute_types pat 
                                          WHERE  id = ANY($3 :: int[])  
                                                AND page_id = $4
                                                AND active = true) 
                GROUP  BY pa.type_id  
            `;
  const bindings = [pageID, pageID, attr, pageID];
  const result = await PostgresHelper.execQuery(client, SQL, bindings);
  return Array.isArray(result) ? result.map(({ id }) => +id) : [];
};

export const executeRemoveProductSubAttrib = async (pageID: number, subAttributeIds: number[], client: Pool): Promise<void> => {
  try {
    const SQL = ' UPDATE product_attributes SET active = false WHERE id = ANY($1 :: int[]) AND page_id = $2 ';
    if (subAttributeIds?.length) {
      await PostgresHelper.execQuery(client, SQL, [subAttributeIds, pageID]);
    }
  } catch (err) {
    console.log('Error removing product attribute executeRemoveProductSubAttrib ! ', err);
    throw new Error(err);
  }
};

export const executeRemoveProductAttrib = async (pageID: number, attributeIds: number[], client: Pool): Promise<void> => {
  try {
    const SQL = ' UPDATE product_attribute_types SET active = false where id = ANY($1 :: int[]) AND page_id = $2 ';
    if (attributeIds?.length) {
      await PostgresHelper.execQuery(client, SQL, [attributeIds, pageID]);
    }
  } catch (err) {
    console.log('Error removing product attribute executeRemoveProductSubAttrib ! ', err);
    throw new Error(err);
  }
};

export const executeUpdateProductAttribName = async (pageID: number, attribID: number, attribName: string, client: Pool): Promise<IHTTPResult> => {
  try {
    const SQL = ` UPDATE product_attribute_types 
                  SET    NAME = :attribName 
                  WHERE  id = :attribID 
                  AND    page_id = :pageID`;
    const bindings = { attribName, attribID, pageID };
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return { status: 200, value: PRODUCT_TRANSLATE_MSG.pro_attr_update_success };
  } catch (err) {
    console.log('Error removing product attribute executeUpdateProductAttrib ! ', err);
    return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_attr_update_error };
  }
};

export const executeUpdateProductSubAttribName = async (attrID: number, subAttrID: number, name: string, pageID: number, client: Pool): Promise<void> => {
  try {
    const isAttrSubAttrSameName = await executeIsAttribSubAttribSameName(pageID, attrID, name, client);
    if (isAttrSubAttrSameName) {
      throw new Error(PRODUCT_TRANSLATE_MSG.attr_subattr_same_name_error);
    }
    const SQL = ` UPDATE product_attributes 
                  SET    name = :name 
                  WHERE  id = :subAttrID 
                  AND    page_id = :pageID`;
    const bindings = { name, subAttrID, pageID };
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('executeUpdateProductSubAttribName -> err', err);
    if (err.message === PRODUCT_TRANSLATE_MSG.attr_subattr_same_name_error) {
      throw new Error(PRODUCT_TRANSLATE_MSG.attr_subattr_same_name_error);
    } else if (err.constraint === 'product_attributes_un') {
      throw new Error(PRODUCT_TRANSLATE_MSG.sub_attr_same_name);
    } else {
      throw new Error(PRODUCT_TRANSLATE_MSG.pro_sub_attr_error);
    }
  }
};

export const executeInsertSubAttribute = async (pageID: number, attrID: number, subAttrName: string, client: Pool): Promise<void> => {
  try {
    const isAttrSubAttrSameName = await executeIsAttribSubAttribSameName(pageID, attrID, subAttrName, client);
    if (isAttrSubAttrSameName) {
      throw new Error(PRODUCT_TRANSLATE_MSG.attr_subattr_same_name_error);
    }
    const bindings = {
      pageID,
      subAttrName,
      attrID,
    };
    const SQL = ` INSERT INTO product_attributes(page_id, name, type_id) 
                  VALUES      (:pageID,:subAttrName,:attrID) 
                  ON CONFLICT (page_id , type_id, name ) DO UPDATE SET active =TRUE
                  RETURNING *`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    console.log('executeInsertSubAttribute -> ', error);
    const errMessage = error.constraint === 'product_attributes_un' ? PRODUCT_TRANSLATE_MSG.pro_sub_cat_exists_another_name : PRODUCT_TRANSLATE_MSG.pro_sub_attr_error;
    throw new Error(errMessage);
  }
};

export const executeIsAttribSubAttribSameName = async (pageID: number, attribId: number, subAttrName: string, client: Pool): Promise<boolean> => {
  const bindings = {
    attribId,
    subAttrName,
    pageID,
  };
  const SQL = ' select count(1) :: int from product_attribute_types pat where id = :attribId and name = :subAttrName and page_id = :pageID';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return data[0]?.count > 0 ? true : false;
};

export const getAttributeByName = async (pageID: number, client: Pool, name: string): Promise<IProductAttributeDB> => {
  const bindings = { pageID, name };
  const SQL = 'SELECT id, page_id, name, active FROM product_attribute_types WHERE name=:name AND page_id = :pageID ; ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const attrData = await PostgresHelper.execQuery<IProductAttributeDB[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(attrData) ? attrData[0] : null;
};

export const getSubAttributeByName = async (pageID: number, client: Pool, name: string, attrID: number): Promise<IProductSubAttributeDB> => {
  const bindings = { pageID, name, attrID };
  const SQL = 'SELECT id, page_id, type_id, name, active FROM product_attributes WHERE name=:name AND page_id = :pageID AND type_id = :attrID ';
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const subAttrData = await PostgresHelper.execQuery<IProductSubAttributeDB[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(subAttrData) ? subAttrData[0] : null;
};

export const getAttributesByProductID = async (pageID: number, productID: number, client: Pool): Promise<IProductAttributeList[]> => {
  const SQL = `
        SELECT
          pat.id "attributeID",
          pat.name "attributeName",
        jsonb_agg(DISTINCT jsonb_build_object('subAttributeID', pa.id, 'subAttributeName', pa.name)) "subAttributes"
        FROM
              product_attribute_list_mapping palm
        INNER JOIN product_attributes pa ON
              (
                  pa.id = palm.attribute_id
        )
        INNER JOIN product_attribute_types pat ON
              (
                  pa.type_id = pat.id
        )
        INNER JOIN product_variants pv ON 
              pv.mapping_id = palm.mapping_id
        WHERE
        pv.status = 1
        AND pv.active = TRUE
        AND pv.product_id = :productID
        AND pv.page_id = :pageID
        GROUP BY
        pat.id
`;

  const bindings = { pageID, productID };
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductAttributeList[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : [];
};
