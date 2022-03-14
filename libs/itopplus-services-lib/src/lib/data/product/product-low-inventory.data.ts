import { IProductLowInventoryList, IProductLowStockTotal } from '@reactor-room/itopplus-model-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export async function getProductLowInventory(
  client: Pool,
  pageID: number,
  page: number,
  pageSize: number,
  lowInventoryAmount: number,
  orderQuery: string,
): Promise<IProductLowInventoryList[]> {
  const bindings = {
    pageID,
    lowInventoryAmount,
    page,
    pageSize,
  };

  const subProductLowInventoryListSQL = `
  SELECT
  JSONB_AGG(
	  JSONB_BUILD_OBJECT(
	  'subIsLower',(pv.inventory < :lowInventoryAmount),
		'subImages', pv.images::jsonb,
		'subNameProductVariant', (SELECT string_agg(pa.name,' , ')
								from product_attribute_list_mapping palm 
								INNER JOIN product_attributes pa 
								on palm.attribute_id = pa.id 
								where palm.mapping_id = pv.mapping_id 
								GROUP BY palm.mapping_id 
								),
		'subInventory', pv.inventory ,
		'subUnit_price', pv.unit_price,
		'subWithhold',COALESCE(
						(SELECT sum(poi.item_quantity) 
							FROM 
								purchasing_order_items poi 
							WHERE 
								poi.product_variant_id = pv.id 
							AND 
								poi.page_id = pv.page_id 
							AND 
								poi.purchase_status = FALSE 
							AND 
								poi.is_reserve = TRUE
							AND poi.page_id = :pageID
						),
						null 
						),
		'subUnpaid',COALESCE(
						(SELECT sum(poi.item_price * poi.item_quantity) 
							FROM purchasing_order_items poi 
								WHERE 
									poi.product_variant_id  = pv.id  
								AND 
									poi.page_id = pv.page_id  
								AND 
									poi.purchase_status = FALSE
								AND 
										poi.page_id = :pageID
						),
						null 
						),
		'subRevenue',COALESCE(
						(SELECT sum(poi.item_price * poi.item_quantity) 
							FROM purchasing_order_items poi 
								WHERE 
									poi.product_variant_id = pv.id 
								AND 
									poi.page_id = pv.page_id  
								AND 
									poi.is_reserve = TRUE
								AND poi.page_id = :pageID
						),
						null 
						)
	  )
  )AS "subProductLowInventory"
FROM
  product_variants pv
WHERE
  pv.product_id = p.id AND p.active = true`;

  const SQL = `
  WITH Data_CTE 
	AS(
		SELECT
		  p.id "id",
		  p."name",
		  p.created_at  "createdAt",
		  p.images::jsonb "images",
		  FALSE AS "status",
		  ROW_NUMBER() OVER (ORDER BY p.id) "idIndex",
		  (
			${subProductLowInventoryListSQL}
		  ),
		  (
			  SELECT 
				  sum(pv2.inventory) 
			  FROM 
				  product_variants pv2 where p.id = pv2.product_id 
			  AND 
				  pv2.page_id = :pageID
		  ) < :lowInventoryAmount AS "isLower",
		  (
			  SELECT
				  count(pv2.inventory)
			  FROM
				  product_variants pv2
			  WHERE
				  p.id = pv2.product_id
			  AND pv2.page_id = :pageID) AS "variants",
		  (
			  SELECT
				  sum(pv2.inventory)
			  FROM
				  product_variants pv2
			  WHERE
				  p.id = pv2.product_id
			  AND pv2.page_id = :pageID) AS "inventory",
		  (
			SELECT
				sum(poi.item_quantity)
			FROM
				purchasing_order_items poi
			WHERE
				poi.product_id = p.id 
			AND 
				poi.page_id = :pageID
			AND 
				poi.purchase_status = FALSE
			AND 
				poi.is_reserve = TRUE) AS "withhold",
		  (
			  SELECT
				  sum(poi.item_price * poi.item_quantity)
			  FROM
				  purchasing_order_items poi
			  WHERE
				  poi.product_id = p.id 
			  AND poi.page_id = :pageID
			  AND poi.purchase_status = FALSE) AS "unpaid",
		  (
			  SELECT
				  sum(poi.item_price * poi.item_quantity)
			  FROM
				  purchasing_order_items poi
			  WHERE
				  poi.product_id = p.id 
			  AND poi.page_id = :pageID
			  AND poi.is_reserve = TRUE) AS "revenue",
		  (
			  SELECT
				  DATE(poi2.created_at)
			  FROM
				  purchasing_order_items poi2
			  WHERE
				  p.id = poi2.id),
		  (
		      SELECT 
		        count (p.id)
		        	from products p WHERE p.page_id = :pageID  
		        )AS "countID"
		 FROM
				 products p
		 WHERE
			  p.page_id = :pageID AND p.active = true
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
					  OFFSET 
						  :page ROWS
					  FETCH NEXT 
						  :pageSize ROWS ONLY   
            `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<IProductLowInventoryList[]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);

  return Array.isArray(result) ? result : [];
}

export async function getProductLowStock(
	client: Pool,
	pageID: number,
	lowInventoryAmount: number,
  ): Promise<IProductLowStockTotal[]> {
	const bindings = {
	  pageID,
	  lowInventoryAmount,
	};
	const SQL = `
	select
	COUNT(countInventory.id) "sumLowStock"
from
	(
	select
		*,
		(
		select
			SUM(pv2.inventory)
		from
			product_variants pv2
		where
			pv2.product_id = p.id
			and pv2.active is true
        ) inventory
	from
		products p
	where
		p.page_id = :pageID
		and p.active is true
    ) countInventory
where
	countInventory.inventory < :lowInventoryAmount
			  `;
	const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
	const result = await PostgresHelper.execQuery<IProductLowStockTotal[]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
	
	return Array.isArray(result) ? result : [];
  }
