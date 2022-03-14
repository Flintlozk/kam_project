import { PostgresHelper } from './postgres.helper';

describe('Object Helper ', () => {
  it('countCharector Return result sould be correct with amouth of $', () => {
    expect(PostgresHelper.countParameter('SELECT * from TEST where ID=$1 and TEXT=$2')).toEqual(2);
    expect(PostgresHelper.countParameter('SELECT * from TEST where ID=$1 and TEXT=$2 and TEXT=$3')).toEqual(3);
    expect(PostgresHelper.countParameter('SELECT * from TEST where ID=$1 and TEXT=$2 and TEXT=$3 and TEXT=$4')).toEqual(4);
  });

  it('countCharector Return result sould be correct with amouth of $ big query', () => {
    expect(
      PostgresHelper.countParameter(`WITH Data_CTE 
    AS
    (
        SELECT 
          *
        FROM temp_customers
        WHERE active IS TRUE AND UPPER(first_name) LIKE UPPER($2) OR UPPER(last_name) LIKE UPPER($2) OR UPPER(email) LIKE UPPER($2) OR UPPER(phone_number) LIKE UPPER($2) 
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
      phone_number,
      profile_pic,
      email,
      customer_type,
      updated_at,
      totalrows
    FROM Data_CTE
    CROSS JOIN Count_CTE
    WHERE active IS TRUE AND UPPER(first_name) LIKE UPPER($2) OR UPPER(last_name) LIKE UPPER($2) OR UPPER(email) LIKE UPPER($2) OR UPPER(phone_number) LIKE UPPER($2) 
    ORDER BY updated_at DESC NULLS LAST
    OFFSET $1 ROWS
    FETCH NEXT 10 ROWS ONLY;`),
    ).toEqual(2);
  });

  it('test for sqlStatement generator', () => {
    const sql = 'select * from table where foo = :bar or bar = :foo or bizz = :foo';
    const bindings = {
      foo: '123',
      bar: '456',
    };
    const expectedSQL = {
      sql: 'select * from table where foo = $1 or bar = $2 or bizz = $2',
      bindings: ['456', '123'],
    };

    const SQL = PostgresHelper.convertParameterizedQuery(sql, bindings);
    expect(SQL).toEqual(expectedSQL);
  });

  it('countCharector Return result sould be correct with amouth of $ big query', () => {
    /* eslint-disable max-len */
    const SQL = `WITH Data_CTE 
    AS
    (
        SELECT 
          *
        FROM temp_customers
        WHERE active IS TRUE AND UPPER(first_name) LIKE UPPER(:searchText) OR UPPER(last_name) LIKE UPPER(:searchText) OR UPPER(email) LIKE UPPER(:searchText) OR UPPER(phone_number) LIKE UPPER(:searchText) 
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
      phone_number,
      profile_pic,
      email,
      customer_type,
      updated_at,
      totalrows
    FROM Data_CTE
    CROSS JOIN Count_CTE
    WHERE active IS TRUE AND UPPER(first_name) LIKE UPPER(:searchText) OR UPPER(last_name) LIKE UPPER(:searchText) OR UPPER(email) LIKE UPPER(:searchText) OR UPPER(phone_number) LIKE UPPER(:searchText) 
    ORDER BY updated_at DESC NULLS LAST
    OFFSET :row ROWS
    FETCH NEXT 10 ROWS ONLY;`;
    const bindings = {
      row: 10,
      searchText: 'HELLO',
    };

    const expectedSQL = `WITH Data_CTE 
    AS
    (
        SELECT 
          *
        FROM temp_customers
        WHERE active IS TRUE AND UPPER(first_name) LIKE UPPER($1) OR UPPER(last_name) LIKE UPPER($1) OR UPPER(email) LIKE UPPER($1) OR UPPER(phone_number) LIKE UPPER($1) 
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
      phone_number,
      profile_pic,
      email,
      customer_type,
      updated_at,
      totalrows
    FROM Data_CTE
    CROSS JOIN Count_CTE
    WHERE active IS TRUE AND UPPER(first_name) LIKE UPPER($1) OR UPPER(last_name) LIKE UPPER($1) OR UPPER(email) LIKE UPPER($1) OR UPPER(phone_number) LIKE UPPER($1) 
    ORDER BY updated_at DESC NULLS LAST
    OFFSET $2 ROWS
    FETCH NEXT 10 ROWS ONLY;`;
    const expectedBindings = ['HELLO', 10];

    const returnSQL = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    expect(returnSQL).toEqual({ sql: expectedSQL, bindings: expectedBindings });
  });

  it(':: JSON Case of SQL', () => {
    const SQL = `SELECT  distinct(p.id) "id",
    p."name" "name",
    ps."name" "status", 
    ps.id "statusValue",
    '0' as "sold",
    sum(pv.inventory) "inventory",
    max(pv.unit_price) "maxUnitPrice",
    min(pv.unit_price) "minUnitPrice",
    count(pv.product_id) "variants",
    p.images::jsonb "images"
FROM products p
INNER JOIN product_variants pv ON p.id = pv.product_id
INNER JOIN product_status ps ON p.status = ps.id
WHERE p.page_id = :pageID AND p.active = true
GROUP BY p.id,
ps.name,
ps.id 
ORDER BY p.id`;
    const bindings = {
      pageID: 10,
    };

    const expectedSQL = `SELECT  distinct(p.id) "id",
    p."name" "name",
    ps."name" "status", 
    ps.id "statusValue",
    '0' as "sold",
    sum(pv.inventory) "inventory",
    max(pv.unit_price) "maxUnitPrice",
    min(pv.unit_price) "minUnitPrice",
    count(pv.product_id) "variants",
    p.images::jsonb "images"
FROM products p
INNER JOIN product_variants pv ON p.id = pv.product_id
INNER JOIN product_status ps ON p.status = ps.id
WHERE p.page_id = $1 AND p.active = true
GROUP BY p.id,
ps.name,
ps.id 
ORDER BY p.id`;
    const expectedBindings = [10];

    const returnSQL = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    expect(returnSQL).toEqual({ sql: expectedSQL, bindings: expectedBindings });
  });
});
