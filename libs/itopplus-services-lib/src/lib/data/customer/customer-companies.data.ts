import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { CustomerCompany, CustomerCompanyFull, CustomerCompanyInputFull, CompanyMemeber, MemebersFiltersInput } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';

/**
 *
 *
 * @param {Pool} client
 * @param {number[]} customer IDs
 * @param {number} pageID
 * @param {number} customer_company_id
 * @return {*}  {Promise<{ id: number }[]>}
 */
export const insertCustomerCompanyMembers = async (client: Pool, customer_ids: number[], pageID: number, customer_company_id: number): Promise<{ id: number }[]> => {
  const statement = customer_ids.map((id) => `(${customer_company_id}, ${id}, ${pageID})`).join(', ');
  const query = `
      INSERT INTO customer_companies_mapping
      (customer_company_id, customer_id, page_id)
      VALUES ${sanitizeSQL(statement)} on conflict(customer_id, customer_company_id, page_id) do nothing RETURNING id;
    `;

  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, sanitizeSQL(query), []);
  return Array.isArray(data) ? data : null;
};

/**
 *
 *
 * @param {Pool} client
 * @param {number[]} customer IDs
 * @param {number} pageID
 * @param {number} customer_company_id
 * @return {*}  {Promise<{ id: number }[]>}
 */
export const deleteCustomerCompanyMembers = async (client: Pool, customer_ids: number[], pageID: number, customer_company_id: number): Promise<{ id: number }[]> => {
  const query = `
      DELETE FROM customer_companies_mapping where customer_id = ANY($1 :: int[]) AND page_id = $2 AND customer_company_id = $3 RETURNING id
    `;

  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, query, [customer_ids, pageID, customer_company_id]);
  return Array.isArray(data) ? data : null;
};

/**
 *
 *
 * @param {Pool} client
 * @param {number} customer ID
 * @param {CustomerCompany[]} array of company ID
 * @param {number} pageID
 * @return {*}  {Promise<{ id: number }[]>}
 */
export const addCompanyByCustomerId = async (client: Pool, customer_id: number, companies_ids: number[], pageID: number): Promise<{ id: number }[]> => {
  const statement = companies_ids.map((company_id) => `(${customer_id}, ${company_id}, ${pageID})`).join(', ');
  const query = `
      INSERT INTO customer_companies_mapping(customer_id, customer_company_id, page_id)
      VALUES ${sanitizeSQL(statement)} on conflict(customer_id, customer_company_id, page_id) do nothing RETURNING *;
    `;
  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, query, []);
  return Array.isArray(data) ? data : null;
};

/**
 *
 *
 * @param {Pool} client
 * @param {number} customer ID
 * @param {CustomerCompany[]} array of company ID
 * @param {number} pageID
 * @return {*}  {Promise<{ id: number }[]>}
 */
export const deleteCompanyByCustomerId = async (client: Pool, customer_id: number, companies_ids: number[], pageID: number): Promise<{ id: number }[]> => {
  const query = `
      DELETE FROM customer_companies_mapping where customer_id = $1 AND page_id = $2 AND customer_company_id = ANY($3 :: int[]) RETURNING *
    `;
  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, query, [customer_id, pageID, companies_ids]);
  return Array.isArray(data) ? data : null;
};

export const getCompanyMembers = async (client: Pool, params: MemebersFiltersInput, { search, socials }: { search: string; socials: string }): Promise<CompanyMemeber[]> => {
  const query = `
      WITH Data_CTE
      AS
      (
          SELECT
            *
          FROM temp_customers
          WHERE active IS TRUE AND page_id = :pageID
          ${search}
          ${socials}
          ORDER BY last_name ${sanitizeSQL(params.orderMethod)} NULLS LAST
      ),
      Count_CTE
      AS
      (
          SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
      )
      SELECT
        id,
        first_name,
        last_name,
        profile_pic,
        totalrows,
        psid,
        line_user_id
      FROM Data_CTE
      CROSS JOIN Count_CTE
      OFFSET :currentPage ROWS FETCH NEXT :pageSize ROWS ONLY;
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const data = await PostgresHelper.execQuery<CompanyMemeber[]>(client, sql, bindings);
  return Array.isArray(data) ? data : [];
};

export const getCompanyMembersByCompanyID = async (
  client: Pool,
  params: MemebersFiltersInput,
  { search, socials }: { search: string; socials: string },
  id: number,
): Promise<CompanyMemeber[]> => {
  const query = `
      WITH Data_CTE
        AS
        (
          SELECT
            tc.id,
            tc.first_name,
            tc.last_name,
            tc.psid,
            tc.line_user_id,
            tc.profile_pic 
          FROM customer_companies_mapping ccm
          INNER JOIN  temp_customers tc ON tc.id = ccm.customer_id 
            WHERE active IS TRUE AND ccm.page_id = :pageID AND ccm.customer_company_id = :id AND tc.page_id = :pageID
            ${search}
            ${socials}
          ORDER BY last_name ${sanitizeSQL(params.orderMethod)} NULLS LAST
        ),
        Count_CTE
        AS
        (
            SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
        )
        SELECT
        
          id,
          first_name,
          last_name,
          profile_pic,
          totalrows,
          psid,
          line_user_id
        FROM Data_CTE
        CROSS JOIN Count_CTE
          OFFSET :currentPage ROWS FETCH NEXT :pageSize ROWS ONLY;
      `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { ...params, id });
  const data = await PostgresHelper.execQuery<CompanyMemeber[]>(client, sql, bindings);
  return Array.isArray(data) ? data : [];
};

export const getCustomerCompanies = async (client: Pool, params: MemebersFiltersInput, { search }: { search: string }): Promise<CustomerCompany[]> => {
  const order = params.orderBy && params.orderMethod ? `ORDER BY ${sanitizeSQL(params.orderBy || '')} ${sanitizeSQL(params.orderMethod || '')} NULLS LAST` : '';
  const query = `
        WITH Data_CTE
        AS
        (
            SELECT
              *
            FROM customer_companies
            WHERE page_id = :pageID
            ${search}
        ),
        Count_CTE
        AS
        (
            SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
        )
        SELECT
          (SELECT count(ccm.customer_id) FROM customer_companies_mapping ccm WHERE ccm.customer_company_id = Data_CTE.id ) customers_amount,
          id,
          company_name,
          company_logo,
          branch_name,
          totalrows
        FROM Data_CTE
        CROSS JOIN Count_CTE
        ${order}
        OFFSET :currentPage ROWS FETCH NEXT :pageSize ROWS ONLY ;
      `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const data = await PostgresHelper.execQuery<CustomerCompany[]>(client, sql, bindings);
  return Array.isArray(data) ? data : [];
};

export const getCustomerCompanyById = async (client: Pool, id: number, pageID: number): Promise<CustomerCompanyFull> => {
  const params = { id: Number(id), pageID };
  const query = `
    SELECT
      cc.id,
      cc.company_name,
      cc.branch_name,
      cc.branch_id,
      cc.tax_id,
      cc.phone_number,
      cc.email,
      cc.fax,
      cc.address,
      cc.district,
      cc.city,
      cc.province,
      cc.post_code,
      cc.country,
      cc.company_logo,
      cc.use_company_address,
      cc.shipping_phone_number,
      cc.shipping_email,
      cc.shipping_fax,
      cc.shipping_address,
      json_build_object('district', cc.shipping_district, city, cc.shipping_sub_district, 'province', cc.shipping_province, 'post_code', cc.shipping_post_code) AS shipping,
      cc.shipping_country,
    (SELECT json_agg(m) FROM (
      SELECT
        tc.id,
          psid,
          first_name,
          last_name,
          profile_pic,
          line_user_id
      FROM
        customer_companies_mapping ccm
      JOIN temp_customers tc ON
        tc.id = ccm.customer_id
      WHERE
        ccm.customer_company_id = cc.id
      ) m) members
    FROM
      customer_companies cc
    WHERE
      cc.id = :id
      AND cc.page_id = :pageID ;
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const data = await PostgresHelper.execQuery<[CustomerCompanyFull]>(client, sql, bindings);
  return Array.isArray(data) ? data[0] : null;
};

export const getCustomerAssignedCompanyById = async (client: Pool, id: number, pageID: number): Promise<CustomerCompany[]> => {
  const params = { id: Number(id), pageID };
  const query = `
    SELECT
      (
        SELECT
          cc.id 
        FROM
          customer_companies cc
        WHERE
          id = ccm.customer_company_id ) AS id ,
        (
        SELECT
          cc.company_name 
        FROM
          customer_companies cc
        WHERE
          id = ccm.customer_company_id ) AS company_name 
      FROM
        customer_companies_mapping ccm
    WHERE
      ccm.customer_id = :id
      AND ccm.page_id = :pageID ;
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const data = await PostgresHelper.execQuery<CustomerCompany[]>(client, sql, bindings);
  return Array.isArray(data) ? data : [];
};

export const saveCustomerCompany = async (client: Pool, input: CustomerCompanyInputFull, pageID: number, link: string): Promise<CustomerCompanyFull> => {
  const params = {
    company_name: input?.info?.company_name,
    branch_name: input?.info?.branch_name,
    branch_id: input?.info?.branch_id,
    tax_id: input?.info?.tax_id,
    phone_number: input?.info?.phone_number,
    email: input?.info?.email,
    fax: input?.info?.fax,
    address: input?.info?.address,
    country: input?.info?.country,
    company_logo: link,

    post_code: input?.info?.location.post_code,
    city: input?.info?.location.city,
    district: input?.info?.location.district,
    province: input?.info?.location.province,

    use_company_address: input?.shipping?.use_company_address,
    shipping_phone_number: input?.shipping?.shipping_phone_number,
    shipping_email: input?.shipping?.shipping_email,
    shipping_fax: input?.shipping?.shipping_fax,
    shipping_country: input?.shipping?.shipping_country,
    shipping_address: input?.shipping?.shipping_address,

    shipping_post_code: input?.shipping?.location?.post_code || null,
    shipping_sub_district: input?.shipping?.location?.city || null,
    shipping_district: input?.shipping?.location?.district || null,
    shipping_province: input?.shipping?.location?.province || null,
    pageID,
  };
  const query = `
    INSERT INTO customer_companies(  
        company_name ,
        branch_name ,
        branch_id ,
        tax_id ,
        phone_number ,
        email ,
        fax ,
        address ,
        post_code ,
        city ,
        district ,
        province ,
        country ,
        company_logo ,
        use_company_address ,
        shipping_phone_number ,
        shipping_email ,
        shipping_fax ,
        shipping_address ,
        shipping_post_code ,
        shipping_sub_district ,
        shipping_district ,
        shipping_province ,
        shipping_country ,
        page_id
      ) VALUES (
        :company_name ,
        :branch_name ,
        :branch_id ,
        :tax_id ,
        :phone_number ,
        :email ,
        :fax ,
        :address ,
        :post_code ,
        :city ,
        :district ,
        :province ,
        :country ,
        :company_logo ,
        :use_company_address ,
        :shipping_phone_number ,
        :shipping_email ,
        :shipping_fax ,
        :shipping_address ,
        :shipping_post_code ,
        :shipping_sub_district ,
        :shipping_district ,
        :shipping_province ,
        :shipping_country ,
        :pageID
      )
      RETURNING * ;
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const data = await PostgresHelper.execQuery<[CustomerCompanyFull]>(client, sql, bindings);
  return Array.isArray(data) ? data[0] : null;
};

export const updateCustomerCompany = async (client: Pool, input: CustomerCompanyInputFull, pageID: number, link: string): Promise<CustomerCompanyFull> => {
  const params = {
    company_name: input?.info?.company_name,
    branch_name: input?.info?.branch_name,
    branch_id: input?.info?.branch_id,
    tax_id: input?.info?.tax_id,
    phone_number: input?.info?.phone_number,
    email: input?.info?.email,
    fax: input?.info?.fax,
    address: input?.info?.address,
    country: input?.info?.country,
    company_logo: link || input?.info?.company_logo,

    post_code: input?.info?.location?.post_code,
    city: input?.info?.location?.city,
    district: input?.info?.location?.district,
    province: input?.info?.location?.province,

    use_company_address: input?.shipping?.use_company_address,
    shipping_phone_number: input?.shipping?.shipping_phone_number,
    shipping_email: input?.shipping?.shipping_email,
    shipping_fax: input?.shipping?.shipping_fax,
    shipping_country: input?.shipping?.shipping_country,
    shipping_address: input?.shipping?.shipping_address,

    shipping_post_code: input?.shipping?.location?.post_code || null,
    shipping_sub_district: input?.shipping?.location?.city || null,
    shipping_district: input?.shipping?.location?.district || null,
    shipping_province: input?.shipping?.location?.province || null,
    pageID,
    id: Number(input?.info?.id),
  };

  const query = `
      UPDATE customer_companies SET 
        company_name = :company_name ,
        branch_name = :branch_name ,
        branch_id = :branch_id ,
        tax_id = :tax_id ,
        phone_number = :phone_number ,
        email = :email ,
        fax = :fax ,
        address = :address ,
        post_code = :post_code ,
        city = :city ,
        district = :district ,
        province = :province ,
        country = :country ,
        company_logo = :company_logo ,
        use_company_address = :use_company_address ,
        shipping_phone_number = :shipping_phone_number ,
        shipping_email = :shipping_email ,
        shipping_fax = :shipping_fax ,
        shipping_address = :shipping_address ,
        shipping_post_code = :shipping_post_code ,
        shipping_sub_district = :shipping_sub_district ,
        shipping_district = :shipping_district ,
        shipping_province = :shipping_province ,
        shipping_country = :shipping_country
      WHERE page_id = :pageID AND id = :id RETURNING * ;
    `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, params);
  const data = await PostgresHelper.execQuery<[CustomerCompanyFull]>(client, sql, bindings);
  return Array.isArray(data) ? data[0] : null;
};

export const removeCustomerCompany = async (client: Pool, id: number[], pageID: number): Promise<{ id: number }[]> => {
  const query = `
      DELETE FROM customer_companies where id = ANY($1 :: int[]) AND page_id = $2 RETURNING id
    `;

  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, query, [id, pageID]);
  return Array.isArray(data) ? data : null;
};

export const updateCompanyByCustomerId = async (client: Pool, id: number, customer_company_id: number, pageID: number): Promise<{ id: number }[]> => {
  const query = `
    UPDATE customer_companies_mapping
      SET customer_company_id = $1
      WHERE page_id = $3 and customer_id = $2 RETURNING *;
    `;

  const data = await PostgresHelper.execQuery<{ id: number }[]>(client, query, [customer_company_id, id, pageID]);

  return Array.isArray(data) ? data : null;
};
