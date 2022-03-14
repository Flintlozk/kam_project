import { getUTCDayjs, isEmpty, parseTimestampToDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumSubscriptionPackageType,
  EnumUserSubscriptionType,
  ISubscription,
  ISubscriptionBudget,
  ISubscriptionIDObject,
  ISubscriptionLimitAndDetails,
  ISubscriptionMappingIDObject,
  ISubscriptionPlan,
  ISubscriptionUserDetail,
  IUserSubscriptionMappingModel,
  IUserSubscriptionModel,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export const updateNewBalance = async (client: Pool, subscriptionID: string, newBalance: number): Promise<void> => {
  const statement = `
  UPDATE subscriptions 
  SET
    updated_at =  :updatedAt, 
    current_balance = (
      SELECT current_balance 
      FROM subscriptions s 
      WHERE id = :subscriptionID
    ) + :newBalance 
  WHERE id = :subscriptionID 
`;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, { subscriptionID, newBalance, updatedAt: getUTCDayjs() });
  await PostgresHelper.execQuery(client, sql, bindings);
};

export const getSubscriptionCurrentBudget = async (client: Pool, subscriptionID: string): Promise<ISubscriptionBudget> => {
  const bindings = { subscriptionID };
  const SQL = `
    SELECT 
      current_balance "currentBudget",
      updated_at "updatedAt",
      storage_account "storageAccount"
    FROM subscriptions
    WHERE id = :subscriptionID
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<ISubscriptionBudget[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  if (data.length > 0) {
    return data[0];
  }
};

export async function getUserSubscriptionMappingByUserID(client: Pool, userID: number): Promise<IUserSubscriptionMappingModel> {
  try {
    const bindings = { userID };
    const SQL = `
      SELECT *   
      FROM user_subscriptions_mapping usm
      WHERE usm.user_id = :userID
      AND usm.role = 'OWNER'
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserSubscriptionMappingModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionByUserID(client: Pool, userID: number): Promise<ISubscription[]> {
  try {
    const bindings = { userID };
    const SQL = `
    SELECT 
      s.id,
      s.plan_id as "planId",
      s.status,
      s.expired_at as "expiredAt",
      sp.plan_name as "planName",
      usm.role  
    FROM subscriptions s 
    INNER JOIN subscription_plans sp ON (s.plan_id = sp.id)
    INNER JOIN user_subscriptions_mapping usm on (usm.subscription_id = s.id )
    INNER JOIN users u on (usm.user_id = u.id )
    WHERE u.id = :userID
    order by usm.role ASC
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscription[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionBySubscriptionID(client: Pool, subscriptionID: string): Promise<ISubscription> {
  try {
    const bindings = { subscriptionID };
    const SQL = `
        SELECT s.*, 
        s.plan_id as "planId",
        s.expired_at as "expiredAt"
        from subscriptions s
        WHERE id = :subscriptionID
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscription[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionByIDAndUserID(client: Pool, subscriptionID: string, userID: number): Promise<ISubscription> {
  try {
    const bindings = { userID, subscriptionID };
    const SQL = `
    SELECT 
      s.id,
      s.plan_id as "planId",
      s.status,
      s.expired_at as "expiredAt",
      sp.plan_name as "planName",
      usm.role  
    FROM subscriptions s 
    INNER JOIN subscription_plans sp ON (s.plan_id = sp.id)
    INNER JOIN user_subscriptions_mapping usm on (usm.subscription_id = s.id )
    INNER JOIN users u on (usm.user_id = u.id )
    WHERE u.id = :userID
    AND s.id = :subscriptionID
    order by usm.role ASC
      `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscription[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionByPageID(client: Pool, pageID: number): Promise<ISubscription> {
  try {
    const bindings = { pageID };
    const SQL = `
            SELECT s.*, s.plan_id as "planId"
            FROM subscriptions s
            INNER JOIN page_subscriptions_mappings psm on (psm.page_id = :pageID) 
            WHERE s.id = psm.subscription_id 
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscription[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionIDByPageIDAndUserID(client: Pool, pageID: number, userID: number): Promise<ISubscriptionIDObject> {
  try {
    const bindings = { userID, pageID };
    const SQL = `
            SELECT s.id
            FROM subscriptions s
            INNER JOIN page_subscriptions_mappings psm on (psm.page_id = :pageID)
            INNER JOIN user_subscriptions_mapping usm on (usm.user_id = :userID)
            INNER JOIN subscription_plans sp ON (s.plan_id = sp.id)
            WHERE s.id = psm.subscription_id 
            LIMIT 1;
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionIDObject[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionPlan(client: Pool, subscriptionPlanID: number): Promise<ISubscriptionPlan> {
  try {
    const bindings = { subscriptionPlanID };
    const SQL = `
        SELECT 
        id,
        price,
        maximum_pages::Integer as "maximumPages",
        maximum_members::Integer as "maximumMembers",
        maximum_leads_per_month::Integer as "maximumLeads",
        maximum_orders_per_month::Integer as "maximumOrders",
        maximum_products::Integer as "maximumProducts",
        maximum_promotions::Integer as "maximumPromotions",
        plan_name as "planName",
        feature_type as "featureType",
        package_type as "packageType",
        daily_price::Integer as "dailyPrice"
        FROM subscription_plans WHERE id = :subscriptionPlanID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionPlan[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionPlanByPackageType(client: Pool, packageType: EnumSubscriptionPackageType): Promise<ISubscriptionPlan> {
  try {
    const bindings = { packageType };
    const SQL = `
        SELECT 
        id,
        price,
        maximum_pages::Integer as "maximumPages",
        maximum_members::Integer as "maximumMembers",
        maximum_leads_per_month::Integer as "maximumLeads",
        maximum_orders_per_month::Integer as "maximumOrders",
        maximum_products::Integer as "maximumProducts",
        maximum_promotions::Integer as "maximumPromotions",
        plan_name as "planName",
        feature_type as "featureType",
        package_type as "packageType",
        daily_price::Integer as "dailyPrice"
        FROM subscription_plans WHERE package_type = :packageType
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionPlan[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createSubscription(client: Pool, status: boolean, ref: string): Promise<ISubscriptionIDObject> {
  try {
    const bindings = { status, ref };
    const SQL = `
        INSERT INTO subscriptions (
        status,
        referral_code
        )
        VALUES (:status, :ref)
        RETURNING id
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionIDObject[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateSubscriptionStorageAccount(client: Pool, storageAccount: string, subscriptionID: string): Promise<IHTTPResult> {
  try {
    const bindings = { subscriptionID, storageAccount };
    const SQL = `
    UPDATE subscriptions 
          SET
          storage_account = :storageAccount
          WHERE id = :subscriptionID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = { value: 'Update subscription date successfully!', status: 200 };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateSubscriptionExpireDate(client: Pool, subscriptionID: string, expireDate: Date): Promise<IHTTPResult> {
  try {
    const bindings = { subscriptionID, expireDate: parseTimestampToDayjs(expireDate).format() };
    const SQL = `
    UPDATE subscriptions 
          SET
            expired_at = :expireDate
          WHERE id = :subscriptionID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = {
      status: 200,
      value: 'Update expired date successfully!',
    };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateSubscriptionStatus(client: Pool, subscriptionID: string, status: boolean): Promise<IHTTPResult> {
  try {
    const bindings = { subscriptionID, status };
    const SQL = `
    UPDATE subscriptions 
          SET
            status = :status
          WHERE id = :subscriptionID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = { value: 'Update subscription date successfully!', status: 200 };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateSubscriptionLimit(client: Pool, subscriptionID: string, subscriptionPlan: ISubscriptionPlan): Promise<IHTTPResult> {
  try {
    const { maximumLeads, maximumOrders, maximumProducts, maximumMembers, maximumPages } = subscriptionPlan;
    const bindings = { subscriptionID, maximumLeads, maximumOrders, maximumProducts, maximumMembers, maximumPages };
    const SQL = `
    UPDATE subscriptions 
          SET
            maximum_leads_per_month = :maximumLeads,
            maximum_orders_per_month = :maximumOrders,
            maximum_products = :maximumProducts,
            maximum_members = :maximumMembers,
            maximum_pages = :maximumPages
          WHERE id = :subscriptionID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = { value: 'Update subscription plan maximum successfully!', status: 200 };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateSubscriptionWithPlan(
  client: Pool,
  subscriptionID: string,
  subscriptionPlan: ISubscriptionPlan,
  price: number,
  daily_price: number,
): Promise<IHTTPResult> {
  try {
    const { id, maximumLeads, maximumOrders, maximumProducts, maximumMembers, maximumPages } = subscriptionPlan;
    const bindings = { subscriptionID, id, maximumLeads, maximumOrders, maximumProducts, maximumMembers, maximumPages, price, daily_price };
    const SQL = `
    UPDATE subscriptions 
          SET
            maximum_leads_per_month = :maximumLeads,
            maximum_orders_per_month = :maximumOrders,
            maximum_products = :maximumProducts,
            maximum_members = :maximumMembers,
            maximum_pages = :maximumPages,
            plan_id = :id,
            price = :price,
            daily_price = :daily_price
          WHERE id = :subscriptionID
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const res: IHTTPResult = { value: 'Update subscription plan maximum successfully!', status: 200 };
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function addSubscriptionMappingToUser(client: Pool, userID: number, subscriptionID: string, role: EnumUserSubscriptionType): Promise<void> {
  try {
    const bindings = { subscriptionID, userID, role };
    const SQL = `
          INSERT INTO user_subscriptions_mapping (
            user_id,
            subscription_id,
            role
          )
          VALUES (
            :userID,
            :subscriptionID,
            :role
          )
       `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserSubscriptionMapping(client: Pool, userID: number, subscriptionID: string): Promise<ISubscriptionMappingIDObject> {
  try {
    const bindings = { subscriptionID, userID };
    const SQL = `
            SELECT user_subscriptions_mapping.id
            FROM user_subscriptions_mapping 
            WHERE user_id = :userID
            AND subscription_id = :subscriptionID
            LIMIT 1;
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionMappingIDObject[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionLimitAndDetails(client: Pool, subscriptionID: string): Promise<ISubscriptionLimitAndDetails> {
  try {
    const bindings = { subscriptionID };
    const SQL = `
            SELECT
            s.price,
            s.maximum_pages::Integer as "maximumPages",
            s.maximum_members::Integer as "maximumMembers",
            s.maximum_leads_per_month::Integer as "maximumLeads",
            s.maximum_orders_per_month::Integer as "maximumOrders",
            s.maximum_products::Integer as "maximumProducts",
            s.maximum_promotions::Integer as "maximumPromotions",
            sp.plan_name as "planName",
            sp.feature_type as "featureType",
            sp.package_type as "packageType"
            FROM subscriptions s 
            INNER JOIN subscription_plans sp ON (s.plan_id = sp.id)
            WHERE s.id = :subscriptionID
            `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscriptionLimitAndDetails[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteUserSubscriptionMapping(client: Pool, id: number): Promise<IHTTPResult> {
  try {
    const bindings = { id };
    const SQL = `
            DELETE FROM user_subscriptions_mapping WHERE id = :id
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete user subscription mapping successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserSubscriptions(client: Pool, userID: number): Promise<IUserSubscriptionModel[]> {
  try {
    const bindings = { userID };
    const SQL = `
          SELECT 
            u.id AS "userId",
            u.name AS "name",
            u.profile_img AS "profileImg",
            s.id, 
            s.plan_id as "planId",
            sp.plan_name as "planName",
            sp.package_type as "packageType",
            usm.role,
            s.status,       
            s.expired_at as "expiredAt",
            s.storage_account as "storageAccount" 
          FROM 
            users u 
          INNER JOIN 
            user_subscriptions_mapping usm ON usm.user_id = u.id 
          INNER JOIN 
            subscriptions s ON s.id  = usm.subscription_id
          INNER JOIN
            subscription_plans sp on sp.id = s.plan_id
          WHERE 
            u.id = :userID
          ORDER BY usm.role ASC

      `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IUserSubscriptionModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export function commitUpdateSubscriptionQueries<T>(client: Pool, successMessage: string, errorMessage: string): Promise<IHTTPResult> {
  // TODO: Fix this
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IHTTPResult>(async (resolve, reject) => {
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
      reject(error);
    }
  });
}

export async function getActiveSubscriptions(client: Pool): Promise<ISubscription[]> {
  try {
    const bindings = { status: true };
    const SQL = `
        SELECT 
        id,
        created_at as "createdAt",
        expired_at as "expiredAt"
        FROM subscriptions 
        WHERE status = :status
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ISubscription[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSubscriptionAndUserDetail(client: Pool, subscriptionID: string): Promise<ISubscriptionUserDetail> {
  const bindings = {
    subscriptionID,
    role: 'OWNER',
  };
  const SQL = `
  SELECT 
    u.name,
    u.email,
    u.tel,
    s.created_at,
    s.expired_at,
    s.plan_id,
    s.id AS "sub_id" 
  FROM users u 
  INNER JOIN user_subscriptions_mapping usm ON usm.user_id = u.id
  INNER JOIN subscriptions s ON s.id = usm.subscription_id 
  WHERE 
    s.id = :subscriptionID AND 
    usm."role" = :role`;

  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const data = await PostgresHelper.execQuery<ISubscriptionUserDetail[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return !isEmpty(data) ? data[0] : null;
}
