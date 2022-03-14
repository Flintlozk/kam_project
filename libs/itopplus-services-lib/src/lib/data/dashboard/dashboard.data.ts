import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { CustomerOrders, IAliases, IAudienceChartsArray, IDashboardAudience, IDashboardCustomers } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

export function getDashboardTotalRevenueByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT SUM(net_price) AS total 
    FROM purchasing_orders po 
    WHERE 
    (po.status IN ('WAITING_FOR_SHIPMENT', 'CLOSE_SALE') OR po.status  IN ('CONFIRM_PAYMENT') AND is_quickpay ) AND 
    po.paid_date::date BETWEEN (:startDate) AND (:endDate) AND 
    page_id = :pageID
  `;
  // const query = `
  // with
  // SumWithVat_CTE AS (
  //   SELECT coalesce(sum(((tax/100)*total_price)+total_price+delivery_fee),0) total_with_vat
  //     FROM purchasing_orders po
  //     WHERE
  //     po.status IN ('WAITING_FOR_SHIPMENT', 'CLOSE_SALE') AND
  //     po.is_paid = true AND
  //     po.tax_included = true  AND
  //     po.tax != 0 AND
  //     po.paid_date::date BETWEEN (:startDate) AND (:endDate) AND
  //     page_id = :pageID
  //   ),
  // SumWithVatZero_CTE AS (
  //   SELECT coalesce(sum(total_price+delivery_fee),0) total_with_vat_zero
  //     FROM purchasing_orders po
  //     WHERE
  //     po.status IN ('WAITING_FOR_SHIPMENT', 'CLOSE_SALE') AND
  //     po.is_paid = true AND
  //     po.tax_included = true  AND
  //     po.tax = 0 AND
  //     po.paid_date::date BETWEEN (:startDate) AND (:endDate) AND
  //     page_id = :pageID
  //   ),
  // SumWithOutVat_CTE AS (
  //   select coalesce(sum(total_price+delivery_fee),0) total_without_vat
  //     FROM purchasing_orders po
  //     WHERE
  //     po.status IN ('WAITING_FOR_SHIPMENT', 'CLOSE_SALE') AND
  //     po.is_paid = true AND
  //     po.tax_included = false AND
  //       po.paid_date::date BETWEEN (:startDate) AND (:endDate) AND
  //     page_id = :pageID
  //   )
  // SELECT SUM(total_with_vat+total_with_vat_zero+total_without_vat) total
  // FROM SumWithVat_CTE
  // CROSS JOIN SumWithVatZero_CTE
  // CROSS JOIN SumWithOutVat_CTE
  // `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalUnpaidByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT sum(total_price) total 
    FROM purchasing_orders po 
    WHERE 
    po.status IN ('REJECT', 'EXPIRED') AND
    po.is_paid = false AND
    po.paid_date::date BETWEEN (:startDate) AND (:endDate) AND
    page_id = :pageID;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalAllCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(id) total 
    FROM temp_customers 
    WHERE 
    active = TRUE AND
    created_at::date BETWEEN (:startDate) AND (:endDate) AND
    page_id = :pageID;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalNewCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    select count(id) total 
    from temp_customers tc 
    where 
    created_at::date BETWEEN (:startDate) AND (:endDate) AND 
    page_id = :pageID;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalOldCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    select count(id) total 
    from temp_customers tc 
    where 
    created_at::date < (:startDate) AND 
    page_id = :pageID;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalInboxAudienceByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a
    LEFT JOIN temp_customers ON a.customer_id = temp_customers.id 
    WHERE 
    a.status IN ('INBOX') AND 
    a.created_at::date BETWEEN (:startDate) AND (:endDate) AND
    a.page_id = :pageID AND 
    temp_customers.active IS NOT FALSE;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalCommentAudienceByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    LEFT JOIN temp_customers ON a.customer_id = temp_customers.id 
    WHERE 
    a.status IN ('COMMENT') AND 
    a.created_at::date BETWEEN (:startDate) AND (:endDate) AND
    a.page_id = :pageID AND 
    temp_customers.active IS NOT FALSE;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalLiveAudienceByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    LEFT JOIN temp_customers ON a.customer_id = temp_customers.id 
    WHERE 
    a.status IN ('LIVE') AND 
    a.created_at::date BETWEEN (:startDate) AND (:endDate) AND
    a.page_id = :pageID AND 
    temp_customers.active IS NOT FALSE;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalLeadFollowByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    INNER JOIN lead_form_referrals lfr ON a.id = lfr.audience_id
    WHERE 
    a.domain = 'LEADS' and 
    a.status = 'FOLLOW' AND 
    a.created_at::date BETWEEN (:startDate) AND (:endDate) AND 
    a.page_id = :pageID;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalLeadFinishedByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    INNER JOIN temp_customers tc ON a.customer_id = tc.id
    INNER JOIN lead_form_submissions lfs ON a.id = lfs.audience_id 
    WHERE 
      a.domain = 'LEADS' AND 
      a.status = 'FINISHED' AND 
      a.created_at::date BETWEEN (:startDate) AND (:endDate) AND 
      tc.active = TRUE AND
      a.page_id = :pageID;
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalFollowCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total
    FROM audience a 
    INNER JOIN purchasing_orders po ON a.id = po.audience_id
    INNER JOIN temp_customers tc ON a.customer_id = tc.id
    WHERE
      a.status = 'FOLLOW' AND 
      a.domain = 'CUSTOMER' AND
      po.is_quickpay IS FALSE AND
      tc.active IS TRUE AND
      a.page_id = :pageID;
    `;
  // a.updated_at::date BETWEEN (:startDate) AND (:endDate) AND
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalWaitingForPaymentCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    INNER JOIN purchasing_orders po ON a.id = po.audience_id
    INNER JOIN temp_customers tc ON a.customer_id = tc.id
    WHERE
      a.status = 'WAITING_FOR_PAYMENT' AND 
      a.domain = 'CUSTOMER' AND 
      po.is_quickpay IS FALSE AND
      tc.active IS TRUE AND
      a.page_id = :pageID;
    `;
  // a.updated_at::date BETWEEN (:startDate) AND (:endDate) AND
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalConfirmPaymentCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    INNER JOIN purchasing_orders po ON a.id = po.audience_id
    INNER JOIN temp_customers tc ON a.customer_id = tc.id
    WHERE 
      a.status = 'CONFIRM_PAYMENT' AND 
      a.domain = 'CUSTOMER' AND 
      po.is_quickpay IS FALSE AND
      tc.active IS TRUE AND
      a.page_id = :pageID;
    `;
  // a.updated_at::date BETWEEN (:startDate) AND (:endDate) AND
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalWaitingForShipmentCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT count(a.id) total 
    FROM audience a 
    INNER JOIN purchasing_orders po ON a.id = po.audience_id
    INNER JOIN temp_customers tc ON a.customer_id = tc.id
    WHERE 
      a.status = 'WAITING_FOR_SHIPMENT' AND 
      a.domain = 'CUSTOMER' AND
      po.is_quickpay IS FALSE AND
      tc.active IS TRUE AND
      a.page_id = :pageID;
    `;
  // a.updated_at::date BETWEEN (:startDate) AND (:endDate) AND
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardTotalClosedCustomerByFilter(client: Pool, aliases: IAliases, subscription): Promise<number> {
  const { planId } = subscription;
  const allowedPlans = [1, 5, 6, 7];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = `
    SELECT SUM(total) as "total" FROM (  
      SELECT count(a.id) as "total"
      FROM audience a
      INNER JOIN purchasing_orders po ON a.id = po.audience_id
      INNER JOIN temp_customers tc ON a.customer_id = tc.id
      WHERE 
        a.status = 'CLOSED' AND 
        a.domain = 'CUSTOMER' AND 
        tc.active IS TRUE AND
        po.is_quickpay IS FALSE AND
        a.page_id = :pageID
      UNION
      SELECT count(po.id) AS "total"
      FROM purchasing_orders po
      WHERE po.page_id = :pageID AND
       status =  'CLOSE_SALE' AND
       order_channel IN ('LAZADA', 'SHOPEE') AND
       status NOT IN ('REJECT', 'EXPIRED' , 'MARKET_PLACE_RETURNED' , 'MARKET_PLACE_IN_CANCEL', 'MARKET_PLACE_FAILED') AND
       po.is_quickpay IS FALSE
    ) total
    `;

  // a.updated_at::date BETWEEN (:startDate) AND (:endDate) AND
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(sanitizeSQL(query), aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then(([result]: any) => {
        return isResponseAllowed ? resolve(Number(result.total)) : resolve(0);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardCustomers(client: Pool, aliases: IAliases, timezone: string, dateGap: { gap; unit }): Promise<IDashboardCustomers[]> {
  const query = `WITH counts(date, count) AS (
    SELECT created_at AT TIME ZONE '${timezone}',count(date_trunc('day',created_at))  FROM temp_customers tc 
      WHERE tc.page_id = :pageID AND tc.created_at 
      BETWEEN :startDate AND :endDate
      GROUP BY 1
      ORDER BY 1
    ),
    ranges (until_date) AS (
      SELECT date_trunc(${dateGap.unit === 'hour' ? "'hour'" : "'day'"}, dd)::${dateGap.unit === 'hour' ? 'timestamp' : 'date'}
              FROM generate_series(
                :startDate ::timestamptz
               ,:endDate ::timestamptz
               , '${dateGap.gap} ${dateGap.unit}' ) dd UNION SELECT :endDate ::timestamp 
               )
    SELECT tstzrange AS date, coalesce(sum(count) , 0)::Integer AS customers_per_day
    FROM (
        SELECT tstzrange(LAG(until_date) OVER (ORDER BY until_date), until_date)
        FROM ranges
        ) s
    LEFT JOIN counts on date <@ tstzrange
    WHERE NOT lower_inf(tstzrange)
    GROUP BY 1
    ORDER BY 1`;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  return new Promise<IDashboardCustomers[]>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then((result: IDashboardCustomers[]) => {
        return resolve(result);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardAudience(client: Pool, aliases: IAliases): Promise<IDashboardAudience[]> {
  const query = `SELECT date_trunc('day', created_at)::text AS date, count(id)::integer AS audience_per_day
  FROM   audience
  WHERE  date(to_char(created_at,'YYYY-MM-DD')) >= date (:startDate)
  AND    date(to_char(created_at,'YYYY-MM-DD')) <= date (:endDate)
  AND page_id = :pageID
  GROUP  BY 1
  ORDER BY date`;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  return new Promise<IAudienceChartsArray[]>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then((result: IAudienceChartsArray[]) => {
        return resolve(result);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}

export function getDashboardLeads(client: Pool, aliases: IAliases, subscription): Promise<CustomerOrders[]> {
  // prepare query
  const { planId } = subscription;
  const allowedPlans = [2, 3, 4];
  const isResponseAllowed = allowedPlans.includes(planId);
  const query = ` SELECT date, COALESCE(leads_by_day, 0) AS leads_by_day FROM (
    SELECT date::text
    FROM   generate_series(date (:startDate)
                         , date (:endDate)
                         , interval  '1 day') date
    ) d
 LEFT JOIN (
    SELECT date_trunc('day', created_at)::text AS date
         , count(id)::integer AS leads_by_day
    FROM   audience a
    WHERE  created_at >= date (:startDate)
    AND    created_at <= date (:endDate)
    AND a.domain = 'LEADS' 
    AND page_id = :pageID
    GROUP  BY 1
    ) t USING (date)
   ORDER  BY date;`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, aliases);
  return new Promise<any>((resolve, reject) => {
    PostgresHelper.execQuery(client, sql, bindings)
      .then((result: any) => {
        return isResponseAllowed ? resolve(result) : resolve([]);
      })
      .catch((err) => {
        console.log({ err });
        reject(err);
      });
  });
}
