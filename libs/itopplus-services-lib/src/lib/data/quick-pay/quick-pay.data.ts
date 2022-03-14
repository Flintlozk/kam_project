import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IQuickPayCancelDetails, IQuickPayList, IQuickPayOrderItems, IQuickPayPaymentDetails } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export const getQuickPayList = async (
  client: Pool,
  pageID: number,
  customerID: number,
  searchQuery: string,
  orderQuery: string,
  page: number,
  pageSize: number,
): Promise<IQuickPayList[]> => {
  const SQL = `
            WITH Data_CTE 
                AS
                (
                    SELECT
                        DISTINCT po.id,
                        po.total_price "totalPrice",
                        po.tax,
                        po.status,
                        po.audience_id as "audienceID",
                        po.discount,
                        NULL as "paymentMode",
                        po.created_at "createdAt",
                        po.is_paid,
                        po.is_cancel,
                        po.expired_at "expiredAt",
                        now() > po.expired_at  AS "isExpired",
                        po.created_at,
                        po.updated_at,
                        (SELECT  pi.description FROM purchasing_order_items pi WHERE pi.purchase_order_id = po.id LIMIT 1) as description
                    FROM
                        purchasing_orders po
                    INNER JOIN purchasing_order_items poi ON po.id = poi.purchase_order_id
                    WHERE
                        po.page_id = $1
                        AND po.is_quickpay = TRUE
                        AND po.audience_id IN (SELECT id FROM audience WHERE customer_id = $4 and page_id = $1 )
                        ${searchQuery}
                    ORDER BY
                    po.id, po.updated_at, "isExpired" DESC
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
                OFFSET $2 ROWS
                FETCH NEXT $3 ROWS ONLY;
            `;
  const data = await PostgresHelper.execQuery<IQuickPayList[]>(client, sanitizeSQL(SQL), [pageID, page, pageSize, customerID]);
  return Array.isArray(data) ? data : [];
};

export const getQuickPayOrderItemsByOrderID = async (client: Pool, pageID: number, orderID: number): Promise<IQuickPayOrderItems[]> => {
  const SQL = `
            SELECT
                id,
                description AS "name" ,
                purchase_order_id AS "purchaseOrderID",
                audience_id AS "audienceID",
                CAST(item_price as decimal) AS "itemPrice",
                CAST(discount as decimal),
                is_vat AS "isVat"
            FROM
                purchasing_order_items poi
            WHERE
                purchase_order_id = :orderID
                AND page_id = :pageID
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { orderID, pageID });

  const data = await PostgresHelper.execQuery<IQuickPayOrderItems[]>(client, sql, bindings);
  return Array.isArray(data) ? data : [];
};

export const getQuickPayOrderByID = async (client: Pool, pageID: number, quickPayID: number, audienceID: number): Promise<IQuickPayList> => {
  const SQL = `
                SELECT
                    id,
                    total_price "totalPrice",
                    tax,
                    status,
                    audience_id as "audienceID",
                    discount,
                    is_paid,
                    NULL as "paymentMode",
                    is_withholding_tax as "isWithHoldingTax",
                    withholding_tax as "withHoldingTax",
                    to_char( created_at, 'DD/MM/YYYY HH:MM') "createdAt",
                    to_char( expired_at, 'DD/MM/YYYY HH:MM') "expiredAt",
                    expired_at,
                    now() > expired_at  AS "isExpired",
                    updated_at
                FROM
                    purchasing_orders
                WHERE
                    page_id = $1
                    AND id = $2
                    AND audience_id = $3
                    AND is_quickpay = TRUE
              `;
  const data = await PostgresHelper.execQuery<IQuickPayList[]>(client, SQL, [pageID, quickPayID, audienceID]);
  return Array.isArray(data) ? data[0] : ({} as IQuickPayList);
};

export const getQuickPayCancelDetails = async (client: Pool, pageID: number, quickPayID: number): Promise<IQuickPayCancelDetails> => {
  const SQL = `
        SELECT
            id,
            is_cancel "isCancel",
            description "cancelReason" ,
            (
                SELECT
                    name
                FROM
                    users u
                WHERE
                    id = po.user_id
            ) "userName",
            updated_at "updatedAt"
        FROM
            purchasing_orders po
        WHERE
            page_id = $1
            AND id = $2
  `;
  const data = await PostgresHelper.execQuery<IQuickPayCancelDetails[]>(client, SQL, [pageID, quickPayID]);
  return Array.isArray(data) ? data[0] : ({} as IQuickPayCancelDetails);
};

export const getQuickPayPaymentDetails = async (client: Pool, pageID: number, quickPayID: number): Promise<IQuickPayPaymentDetails> => {
  const SQL = `
                    SELECT
                        id,
                        is_paid "isPaid",
                        description "paymentMethod",
                        paid_amount "paidAmount" ,
                        to_char(paid_date, 'DD/MM/YYYY') "paidDate",
                        is_withholding_tax as "isWithHoldingTax",
                        withholding_tax as "withHoldingTax",
                        paid_time "paidTime",
                        paid_proof "paidProof"
                    FROM
                        purchasing_orders po
                    WHERE
                        page_id = $1
                        AND id = $2
    `;
  const data = await PostgresHelper.execQuery<IQuickPayPaymentDetails[]>(client, SQL, [pageID, quickPayID]);
  return Array.isArray(data) ? data[0] : ({} as IQuickPayPaymentDetails);
};

export const getQuickPayIsPaid = async (client: Pool, pageID: number, quickPayID: number): Promise<boolean> => {
  const SQL = `
                      SELECT
                          is_paid
                      FROM
                          purchasing_orders po
                      WHERE
                          page_id = $1
                          AND id = $2
      `;
  const data = await PostgresHelper.execQuery<[{ is_paid: boolean }]>(client, SQL, [pageID, quickPayID]);
  return Array.isArray(data) ? data[0].is_paid : false;
};

export const getQuickPayIsPaidByInvoiceNumber = async (client: Pool, pageID: number, invoiceNumber: string): Promise<IQuickPayPaymentDetails[]> => {
  const SQL = `
                      SELECT
                          po.is_paid,
                          po.id
                      FROM
                          purchasing_orders po
                      INNER JOIN purchasing_order_items poi ON po.id = poi.purchase_order_id
                      WHERE
                          po.page_id = $1 AND 
                          poi.description LIKE $2
      `;
  const data = await PostgresHelper.execQuery<IQuickPayPaymentDetails[]>(client, SQL, [pageID, `%${invoiceNumber}%`]);
  return Array.isArray(data) ? (data as IQuickPayPaymentDetails[]) : [];
};

export const getQuickPayIsCancel = async (client: Pool, pageID: number, quickPayID: number): Promise<boolean> => {
  const SQL = `
                        SELECT
                            is_cancel
                        FROM
                            purchasing_orders po
                        WHERE
                            page_id = $1
                            AND id = $2
        `;
  const data = await PostgresHelper.execQuery<[{ is_cancel: boolean }]>(client, SQL, [pageID, quickPayID]);
  return Array.isArray(data) ? data[0].is_cancel : false;
};
