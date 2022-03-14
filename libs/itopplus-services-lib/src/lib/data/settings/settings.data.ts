import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICount } from '@reactor-room/model-lib';
import {
  IAddNewShopProfile,
  ICompanyInfo,
  IGetShopDetail,
  IGetUserPhone,
  IPages,
  IPageSubscriptionMapping,
  IPlanName,
  ISubscriptionPeriod,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export async function addPageMessagingTemplates(client: Pool, pageID: number): Promise<void> {
  try {
    const SQL = `INSERT INTO chat_templates (
      messages,
      page_id
    ) VALUES (
      '{
      	"text": "Greetings, @first_name. Welcome to our store. Is you full name @full_name?",
      	"shortcut": ":hello"
      }'::jsonb,
      $1
    ),
    (
      '{
      	"text": "Hello, @full_name. How would you like to pay?",
      	"shortcut": ":hellopay"
      }'::jsonb,
      $1
    )`;

    await PostgresHelper.execBatchTransaction(client, SQL, [pageID]);
  } catch (err) {
    console.log('err', err);
  }
}

export async function addShopFanPageByUserID(client: Pool, pageInput: IAddNewShopProfile): Promise<IPages> {
  // Old create page -- not use any more
  const queryPage = `
        INSERT INTO pages
        (   page_name, 
            email,
            tel, 
            address, 
            fb_page_id, 
            language, 
            currency, 
            firstname, 
            lastname,
            district,
            amphoe,
            province,
            post_code,
            country,
            shop_picture,
            option,
            social_facebook,
            social_line,
            social_shopee,
            social_lazada
        ) 
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *
    `;
  const createObj = {
    access_token: pageInput.access_token,
  };
  const paramPage = [
    pageInput.shopName,
    pageInput.email,
    pageInput.phoneNo,
    pageInput.address,
    pageInput.facebookid,
    pageInput.language.languageTitle,
    pageInput.currency.currencyTitle,
    pageInput.firstName,
    pageInput.lastName,
    pageInput.location.district,
    pageInput.location.city,
    pageInput.location.province,
    pageInput.location.post_code,
    pageInput.country,
    pageInput.facebookpic,
    createObj,
    pageInput.socialFacebook,
    pageInput.socialLine,
    pageInput.socialShopee,
    pageInput.socialLazada,
  ];
  const data = await PostgresHelper.execQuery<IPages[]>(client, queryPage, paramPage);
  return data[0];
}

export function addPageSubscriptionsMappings(client: Pool, subscriptionID: string, pageID: number): Promise<IPageSubscriptionMapping> {
  try {
    const SQL = `
        INSERT INTO 
            page_subscriptions_mappings(page_id, subscription_id) 
        VALUES
            ($1,$2)`;
    const paramPage = [pageID, subscriptionID];
    const data = PostgresHelper.execBatchTransaction<IPageSubscriptionMapping>(client, SQL, paramPage);
    return data;
  } catch (err) {
    console.log('err', err);
    throw err;
  }
}

export function getSubscriptionPeriodDetail(client: Pool, subscriptionID: string): Promise<[ISubscriptionPeriod]> {
  try {
    const SQL = `
    SELECT  
         expired_at, plan_name, s.maximum_pages
    FROM 
      page_subscriptions_mappings psm
    INNER JOIN 
        subscriptions s ON (s.id = psm.subscription_id)
    INNER JOIN 
        subscription_plans sp ON (sp.id = s.plan_id)
    WHERE 
        psm.subscription_id = $1 
    `;
    const data = PostgresHelper.execQuery<[ISubscriptionPeriod]>(client, SQL, [subscriptionID]);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export function getPageMemberDetail(client: Pool, pageID: number): Promise<IPlanName> {
  const SQL = `
    SELECT  
        expired_at, plan_name, s.maximum_pages, s.maximum_members, upm.user_id 
    FROM 
        user_page_mapping upm
    INNER JOIN 
        pages p ON (p.id = upm.page_id)
    INNER JOIN 
        page_subscriptions_mappings psm ON (psm.page_id = p.id)
    INNER JOIN
        subscriptions s ON (s.id = psm.subscription_id)
    INNER JOIN 
        subscription_plans sp ON (sp.id = s.plan_id)
    WHERE 
      upm.page_id = $1
    `;
  const data = PostgresHelper.execQuery<IPlanName>(client, SQL, [pageID]);
  return data;
}

export async function getUserPageMapping(client: Pool, userID: number, subscriptionID: string): Promise<ICount> {
  const SQL = `
        SELECT 
            count(user_id) 
        FROM 
            user_page_mapping 
        INNER JOIN page_subscriptions_mappings psm on (psm.subscription_id  = $2 )
        WHERE 
            user_id = $1
        GROUP BY
            user_id
        `;
  const data = await PostgresHelper.execQuery<ICount[]>(client, SQL, [userID, subscriptionID]);
  if (data?.length) {
    return data[0];
  }
  return null;
}

export async function getUserPageMappingCountByUserID(client: Pool, userID: number): Promise<ICount> {
  const SQL = `
        SELECT 
            count(user_id) 
        FROM 
            user_page_mapping 
        WHERE 
            user_id = $1
        GROUP BY
            user_id
        `;
  const data = await PostgresHelper.execQuery<ICount[]>(client, SQL, [userID]);
  if (data?.length) {
    return data[0];
  }
  return null;
}

export async function getUserPageMemberCountByUserID(client: Pool, userID: number): Promise<ICount> {
  const SQL = `
        SELECT 
            count(user_id) 
        FROM 
            user_page_mapping 
        WHERE 
            user_id = $1
        AND    
            is_active = $2
        AND
            role NOT IN ('OWNER') 
        GROUP BY
            user_id
        `;
  const data = await PostgresHelper.execQuery<ICount[]>(client, SQL, [userID, true]);
  if (data?.length) {
    return data[0];
  }
  return null;
}

export async function getPageMembermapping(client: Pool, pageID: number): Promise<ICount> {
  const SQL = `
        SELECT 
            count(id) 
        FROM 
            user_page_mapping 
        WHERE 
            page_id = $1
        GROUP BY
            id
        `;
  const data = await PostgresHelper.execQuery<ICount[]>(client, SQL, [pageID]);
  if (data?.length) {
    return data[0];
  }
  return null;
}
export function setShopFanPageByUserID(client: Pool, pageID: number, pageInput: IAddNewShopProfile): Promise<IPages> {
  try {
    const SQL = `
            UPDATE pages 
            SET 
                page_name = $1,
                tel = $2,
                email = $3,
                address = $4,
                fb_page_id = $5,
                language = $6,
                currency = $7,
                firstname = $8,
                lastname = $9,
                district = $10,
                amphoe = $11,
                province = $12,
                post_code = $13,
                country = $14,
                shop_picture = $15,
                option = $16,
                social_facebook = $17,
                social_line = $18,
                social_shopee = $19,
                social_lazada = $20
            WHERE id = $21 RETURNING *
        `;

    const paramPage = [
      pageInput.shopName,
      pageInput.phoneNo,
      pageInput.email,
      pageInput.address,
      pageInput.facebookid,
      pageInput.language.languageTitle,
      pageInput.currency.currencyTitle,
      pageInput.firstName,
      pageInput.lastName,
      pageInput.location.district,
      pageInput.location.city,
      pageInput.location.province,
      pageInput.location.post_code,
      pageInput.country,
      pageInput.facebookpic,
      {
        access_token: pageInput.access_token,
      },
      pageInput.socialFacebook,
      pageInput.socialLine,
      pageInput.socialShopee || null,
      pageInput.socialLazada || null,
      pageID,
    ];

    const data = PostgresHelper.execBatchTransaction<IPages>(client, SQL, paramPage);
    return data;
  } catch (err) {
    console.log('err : ', err);
    throw err;
  }
}

export function setShopFanPageAccessTokenByPageID(client: Pool, pageID: number, accessToken: string): Promise<IAddNewShopProfile> {
  const SQL = `
            UPDATE pages 
            SET 
                option = $1
            WHERE id = $2 RETURNING *
        `;

  const paramPage = [
    {
      access_token: accessToken,
    },
    pageID,
  ];

  const data = PostgresHelper.execQuery<IAddNewShopProfile>(client, SQL, paramPage);
  return data;
}

export async function getCompanyInfo(client: Pool, pageID: number): Promise<ICompanyInfo[]> {
  const SQL = `
    SELECT
      ci.company_name,
      ci.branch_id,
      ci.branch_name,
      ci.phone_number,
      ci.email,
      ci.fax,
      ci.address,
      ci.post_code,
      ci.sub_district,
      ci.district,
      ci.province,
      ci.country,
      ci.company_logo,
      taxs.tax_id AS tax_identification_number,
      taxs.id AS tax_id
    FROM
      company_info ci
    JOIN taxs ON
      ci.tax_id = taxs.id
    WHERE
      ci.page_id = $1`;
  const data = await PostgresHelper.execQuery<ICompanyInfo[]>(client, SQL, [pageID]);
  return data;
}

export async function saveCompanyInfo(client: Pool, companyInfo: ICompanyInfo, pageID: number): Promise<void> {
  const SQL = `
            INSERT INTO company_info (
              company_name,
              company_logo,
              branch_name,
              branch_id,
              tax_id,
              phone_number,
              email,
              fax,
              address,
              post_code,
              sub_district,
              district,
              province,
              country,
              page_id
            ) VALUES (
              :company_name,
              :company_logo,
              :branch_name,
              :branch_id,
              :tax_id,
              :phone_number,
              :email,
              :fax,
              :address,
              :post_code,
              :sub_district,
              :district,
              :province,
              :country,
              :pageID
            )
            Returning id
        `;

  const { company_name, company_logo, branch_name, branch_id, tax_id, phone_number, email, fax, address, post_code, sub_district, district, province, country } = companyInfo;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, {
    company_name,
    ...{ company_logo: company_logo ?? null },
    branch_name,
    branch_id,
    tax_id,
    phone_number,
    email,
    fax,
    address,
    post_code,
    sub_district,
    district,
    province,
    country,
    pageID,
  });
  const data = await PostgresHelper.execQuery<void>(client, sql, bindings);
  return data;
}
export async function updateCompanyInfo(client: Pool, companyInfo: ICompanyInfo, pageID: number): Promise<void> {
  const SQL = `
          UPDATE
            company_info
          SET
            company_name = :company_name,
            company_logo = :company_logo,
            branch_name = :branch_name,
            branch_id = :branch_id,
            phone_number = :phone_number,
            email = :email,
            fax = :fax,
            tax_id = :tax_id,
            address = :address,
            post_code = :post_code,
            sub_district = :sub_district,
            district = :district,
            province = :province,
            country = :country
          WHERE
            page_id = :pageID ;
        `;
  const { company_name, company_logo, branch_name, branch_id, tax_id, phone_number, email, fax, address, post_code, sub_district, district, province, country } = companyInfo;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, {
    company_name,
    ...{ company_logo: company_logo ?? null },
    branch_name,
    branch_id,
    tax_id,
    phone_number,
    email,
    fax,
    address,
    post_code,
    sub_district,
    district,
    province,
    country,
    pageID,
  });
  const data = await PostgresHelper.execQuery<void>(client, sql, bindings);
  return data;
}

export async function getShopFanPageByUserID(client: Pool, pageID: number): Promise<IGetShopDetail> {
  const SQL = 'SELECT * FROM pages WHERE id = $1';
  const data = await PostgresHelper.execQuery<IGetShopDetail[]>(client, SQL, [pageID]);
  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

export function getShopFanPageByFbPageID(client: Pool, fbPageID: string): Promise<IGetShopDetail> {
  // TODO: Fix this1
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<IGetShopDetail>(async (resolve, reject) => {
    try {
      const SQL = 'SELECT * FROM pages WHERE fb_page_id = $1';
      const result = await PostgresHelper.execQuery<IGetShopDetail[]>(client, SQL, [fbPageID]);
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function getUserPhone(client: Pool, userID: number): Promise<IGetUserPhone> {
  const SQL = 'SELECT tel FROM users WHERE id = $1';
  const data = PostgresHelper.execQuery<IGetUserPhone>(client, SQL, [userID]);
  return data;
}
