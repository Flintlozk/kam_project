import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { INameIDObject } from '@reactor-room/model-lib';
import { IProductTag } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export function getProductTag(client: Pool, pageID: number): Promise<IProductTag[]> {
  return new Promise<IProductTag[]>((resolve, reject) => {
    const bindings = {
      pageID,
    };
    const SQL = `SELECT id,
                page_id,
                name,
                active,
                created_at,
                updated_at,
                deleted_at
              FROM product_tags
              WHERE page_id=:pageID
              AND active = true
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);

    const data = PostgresHelper.execQuery<IProductTag[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export function getProductTagManagement(client: Pool, pageID: number, searchQuery: string, orderQuery: string, page: number, pageSize: number): Promise<IProductTag[]> {
  return new Promise<IProductTag[]>((resolve, reject) => {
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
      SELECT id,
        name,
        page_id,
        updated_at,
        active
      FROM product_tags p
      WHERE p.page_id = :pageID AND p.active = true ${searchQuery}
      ORDER BY p.id
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
    const data = PostgresHelper.execQuery<[IProductTag]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);

    data
      .then((result: IProductTag[]) => {
        resolve(Array.isArray(result) ? result : []);
      })
      .catch((err) => reject(err));
  });
}

export async function getProductTagSearch(client: Pool, pageID: number, searchString: string): Promise<IProductTag[]> {
  const bindings = {
    pageID,
    searchString,
  };
  const SQL = `
              SELECT id,
                      name
              FROM product_tags pt
              WHERE page_id = :pageID
              AND lower(name) LIKE '%:searchString%'
    `;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<IProductTag[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return data;
}

export function addProductTag(pageID: number, name: string, client: Pool): Promise<IProductTag> {
  return new Promise<IProductTag>((resolve, reject) => {
    const bindings = {
      pageID,
      name,
      updatedAt: getUTCDayjs(),
    };
    const SQL = ` INSERT INTO  product_tags(page_id, name) values(:pageID, :name) 
                  ON CONFLICT (page_id , name ) DO UPDATE SET active = TRUE,updated_at = :updatedAt
                  RETURNING *`;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result: IProductTag) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

export const executeTagMappingExists = async (pageID: number, tagIds: number[], client: Pool): Promise<INameIDObject[]> => {
  try {
    const SQL = ` 
                  SELECT distinct(tag_id) AS "id", name
                    FROM product_tag_mapping ptm INNER JOIN product_tags pt on
                    pt.id = ptm.tag_id 
                    WHERE tag_id = ANY($1 :: int[])
                      AND pt.page_id = $2
                      AND ptm.active = TRUE;
    `;
    const result = await PostgresHelper.execQuery<INameIDObject[]>(client, SQL, [tagIds, pageID]);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.log('Error executing product tag mapping query! ', err);
  }
};

//not using this function as we need to deactive tags not hard delete
export const executeDeleteInactiveTagMapping = async (pageID: number, tagIDs: number[], client: Pool): Promise<void> => {
  try {
    const SQL = ' DELETE FROM product_tag_mapping WHERE page_id = $1 AND tag_id = ANY($2 :: int[]) AND active = false RETURNING *; ';
    await PostgresHelper.execBatchTransaction(client, SQL, [pageID, tagIDs]);
  } catch (err) {
    console.log('Error deleting Product tag inactive mapping! ', err);
  }
};

export const executeRemoveProductTags = async (pageID: number, tagID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { pageID, tagID };
    const SQL = ` 
                  UPDATE
                        product_tags
                  SET
                        active = FALSE
                  WHERE
                        page_id = :pageID
                  AND   id = :tagID
                `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    console.log('Error deleting Product tags! ', err);
  }
};

export const executeEditProductTag = async (id: number, name: string, pageID: number, client: Pool): Promise<void> => {
  try {
    const bindings = { id, name, pageID, updatedAt: getUTCDayjs() };
    const SQL = ' UPDATE product_tags SET name=:name, updated_at = :updatedAt WHERE id = :id AND page_id = :pageID ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (err) {
    throw new Error(err);
  }
};

export const getTagByName = async (name: string, pageID: number, client: Pool): Promise<IProductTag> => {
  const bindings = { name, pageID };
  const SQL = ` 
        SELECT id, page_id ,name, active  FROM product_tags WHERE name = :name AND page_id = :pageID   ;
  `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const tagData = await PostgresHelper.execQuery<IProductTag>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(tagData) ? tagData[0] : null;
};
