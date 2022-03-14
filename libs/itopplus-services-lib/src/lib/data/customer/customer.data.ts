import { convertBinaryToBuffer, getUTCDayjs, getUTCTimestamps, isAllowCaptureException, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IDObject, IHTTPResult } from '@reactor-room/model-lib';
import {
  CustomerOrders,
  CustomerShippingAddress,
  EnumAppScopeType,
  IAliases,
  ICustomerNote,
  ICustomerOffTimeDetail,
  ICustomerTagCRUD,
  ICustomerTagDB,
  ICustomerTemp,
  ICustomerUpdateInfoInput,
  IFacebookThreadUserMetadata,
  RemoveUserResponse,
  ShippingAddressLocation,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import axios from 'axios';
import { Pool } from 'pg';
import { sanitizeSQL } from 'pg-sanitize';
import { PlusmarService } from '../../itopplus-services-lib';

export async function createCustomer(client: Pool, PSID: string, pageID: number): Promise<ICustomerTemp> {
  if (!PSID) {
    return null;
  }

  const statement = `
    INSERT INTO temp_customers (
      psid, 
      page_id, 
      location
    ) VALUES (
      :psid, 
      :page_id, 
      :location
    ) 
    ON CONFLICT ON CONSTRAINT temp_customers_un 
    DO UPDATE SET updated_at = :updatedAt
    RETURNING *`;

  const query = PostgresHelper.convertParameterizedQuery(statement, {
    psid: PSID,
    page_id: pageID,
    location: null,
    updatedAt: getUTCDayjs(),
  });

  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, query.sql, query.bindings);

  if (result?.length === 1) {
    return result[0] as ICustomerTemp;
  }

  return null;
}

export async function getCustomerShippingAddressByOrder(client: Pool, customerID: number, pageID: number, orderID: number): Promise<CustomerShippingAddress[]> {
  const SQL = `
    SELECT 
      *
    FROM 
      customer_shipping_address
    WHERE 
      customer_id = $1
    AND 
      page_id = $2
    AND
      purchase_order_id = $3
    `;
  const result = await PostgresHelper.execQuery<CustomerShippingAddress[]>(client, SQL, [customerID, pageID, orderID]);
  return result;
}

export async function getCustomerIDByOrderID(client: Pool, pageID: number, orderID: number): Promise<number> {
  const SQL = `
    SELECT 
      customer_id
    FROM 
      audience a
    INNER JOIN 
      purchasing_orders po
    ON 
      a.id = po.audience_id
    WHERE 
      po.page_id = $1
    AND 
      po.id = $2
    `;
  const result = await PostgresHelper.execQuery<[{ customer_id: number }]>(client, SQL, [pageID, orderID]);
  if (result[0]?.customer_id) {
    return result[0].customer_id;
  } else {
    throw Error('cannot find customer ID');
  }
}

export async function getDestinationAddressByOrderID(client: Pool, pageID: number, orderID: number): Promise<CustomerShippingAddress[]> {
  const SQL = `
    SELECT 
      *
    FROM 
      customer_shipping_address
    WHERE 
      page_id = $1
    AND
      purchase_order_id = $2
    `;
  const result = await PostgresHelper.execQuery<CustomerShippingAddress[]>(client, SQL, [pageID, orderID]);
  return result;
}

export async function getLatestCustomerShippingAddress(client: Pool, customerID: number, pageID: number): Promise<CustomerShippingAddress[]> {
  const SQL = `
    SELECT 
      *
    FROM 
      customer_shipping_address
    WHERE 
      customer_id = $1
    AND 
      page_id = $2
    ORDER BY
      created_at DESC
    LIMIT 1
    `;
  const result = await PostgresHelper.execQuery<CustomerShippingAddress[]>(client, SQL, [customerID, pageID]);
  return result;
}

export async function addCustomerShippingAddress(
  client: Pool,
  { customer_id, purchase_order_id, page_id, name, phone_number, location, is_confirm }: CustomerShippingAddress,
): Promise<void> {
  const SQL = `
  INSERT INTO customer_shipping_address (
    customer_id,
    purchase_order_id,
    page_id,
    name,
    phone_number,
    location,
    is_confirm
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7
  )
  `;

  await PostgresHelper.execQuery(client, SQL, [customer_id, purchase_order_id, page_id, name, phone_number, location, is_confirm]);
}

export async function updateCustomerShippingAddress(
  client: Pool,
  { customer_id, purchase_order_id, page_id, name, phone_number, location }: CustomerShippingAddress,
): Promise<void> {
  const SQL = `
  UPDATE 
    customer_shipping_address 
  SET
    name = $1,
    phone_number = $2,
    location = $3
  WHERE 
    customer_id = $4
  AND 
    page_id = $5
  AND
    purchase_order_id = $6
  `;

  await PostgresHelper.execQuery(client, SQL, [name, phone_number, location, customer_id, page_id, purchase_order_id]);
}

// export async function confirmCustomerShippingAddress(client: Pool, { purchase_order_id, page_id }: CustomerShippingAddress): Promise<void> {
//   const SQL = `
//   UPDATE
//     customer_shipping_address
//   SET
//     is_confirm = $1
//   WHERE
//     page_id = $2
//   AND
//     purchase_order_id = $3
//   `;

//   await PostgresHelper.execQuery(client, SQL, [true, page_id, purchase_order_id]);
// }

export async function getCustomerByPSID(client: Pool, PSID: string, page_id: number): Promise<ICustomerTemp> {
  if (!PSID) {
    return null;
  }
  const SQL = 'SELECT * FROM temp_customers WHERE psid = $1 AND page_id = $2 LIMIT 1;';
  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, SQL, [PSID, page_id]);

  if (isEmpty(result)) {
    return null;
  }

  if (result?.length >= 1) {
    return result[0];
  }
}

export async function getCustomerByaudienceID(client: Pool, audienceID: number, page_id: number): Promise<ICustomerTemp> {
  if (!audienceID) {
    return null;
  }
  const SQL = `SELECT tc.* 
              FROM temp_customers tc
              INNER JOIN audience au ON tc.id = au.customer_id
              WHERE 
              au.id = $1 AND 
              tc.page_id = $2 
              LIMIT 1;`;
  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, SQL, [audienceID, page_id]);

  if (isEmpty(result)) {
    return null;
  }

  if (result?.length >= 1) {
    return result[0];
  }
}

export async function getCustomerByAudienceIDsForOfftimeNotify(client: Pool, audienceIDs: string, pageID: number): Promise<ICustomerOffTimeDetail[]> {
  const params = { pageID };
  const SQL = `
    SELECT 
      tc.id "customerID",
      a.id "audienceID",
      tc.platform,
      tc.profile_pic "profilePic",
      tc."name",
      tc.first_name "firstName",
      tc.last_name "lastName",
      tc.aliases,
      p.page_name "shopName",
      p.shop_picture "shopPicture"
    FROM 
      temp_customers tc 
    INNER JOIN audience a ON tc.id = a.customer_id 
    INNER JOIN pages p ON tc.page_id = p.id 
    WHERE 
      a.id IN ${audienceIDs}
    AND 
      tc.page_id = :pageID
  `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, params);
  const result = await PostgresHelper.execQuery<ICustomerOffTimeDetail[]>(client, sql, bindings);
  return Array.isArray(result) ? result : [];
}

export async function getCustomerByLineUserID(client: Pool, userID: string, page_id: number): Promise<ICustomerTemp> {
  if (!userID) {
    return null;
  }
  const SQL = `SELECT * FROM 
              temp_customers 
              WHERE 
              line_user_id = $1 AND 
              page_id = $2 
              LIMIT 1;`;
  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, SQL, [userID, page_id]);

  if (isEmpty(result)) {
    return null;
  }

  if (result?.length >= 1) {
    return result[0];
  }
}

export async function getCustomers(
  client: Pool,
  aliases: IAliases,
  filters: { searchQuery: string; orderQuery: string; exportAllRows: boolean },
  params: { pageID: number; page: number; pageSize: number; search: string },
  noTag: boolean,
  searchTags: string,
): Promise<ICustomerTemp[]> {
  const { searchQuery, orderQuery, exportAllRows } = filters;
  const SQL = `
    WITH Customer_DATA AS (
      SELECT tc.*
      FROM temp_customers tc
      ${searchTags !== null ? 'INNER JOIN customer_tag_mapping ctm ON ctm.customer_id = tc.id' : ''}
      WHERE 
        tc.active IS TRUE
        AND tc.page_id = :pageID
        ${searchTags !== null ? `AND ctm.tag_id IN ${searchTags}` : ''}
        ${aliases.search ? searchQuery : ''}
        ${
          noTag
            ? `AND ( SELECT COUNT(ctm.id) = 0 FROM customer_tag_mapping ctm INNER JOIN customer_tags ct ON ctm.tag_id = ct.id WHERE customer_id = tc.id AND ctm.active IS TRUE AND ct.active IS TRUE ) IS TRUE`
            : ''
        }
        ORDER BY ${orderQuery}
      ),
      Count_CTE  AS (
        SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Customer_DATA 
      )
      SELECT 
        id,
        first_name,
        last_name,
        phone_number,
        profile_pic,
        email,
        nickname,
        updated_at,
        blocked,
        totalrows,
        psid,
        platform,
        aliases,
        (	
          SELECT Jsonb_agg(
              Jsonb_build_object(
                'tagMappingID',ctm.id,'id',ct.id,'name',ct.NAME,'color',ct.color
                )
            ) 
            FROM customer_tag_mapping ctm 
            INNER JOIN customer_tags ct ON ctm.tag_id = ct.id 
            WHERE ctm.customer_id = Customer_DATA.id
            AND ctm.active = TRUE 
            AND ct.active = TRUE
        ) AS "tags",
          (
            SELECT string_agg(_cn.note,', ')
            FROM customer_notes _cn
            WHERE
              _cn.page_id = :pageID
              AND _cn.customer_id = Customer_DATA.id
        ) AS notes,
        COALESCE (
            (
              SELECT to_jsonb(csa.LOCATION)
              FROM customer_shipping_address csa
              WHERE csa.customer_id = Customer_DATA.id	
              ORDER BY id
              LIMIT 1
            ),
            to_jsonb(
              Customer_DATA.LOCATION
            ),
            NULL
          ) AS "location"
      FROM Customer_DATA
      CROSS JOIN Count_CTE
      ${exportAllRows ? '' : 'OFFSET :page ROWS FETCH NEXT :pageSize ROWS ONLY'};
  `;

  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, params);
  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, sql, bindings);
  return Array.isArray(result) ? result : [];
}

export async function getCustomerOrders(client: Pool, { search, orderBy, orderMethod, pageSize, page }: IAliases): Promise<CustomerOrders[]> {
  const query = `
    WITH Data_CTE 
    AS
    (
      SELECT 
        po.id,
        po.total_price,
        po.created_at,
        po.status as po_status,
        a.status as a_status,
        a.page_id as page_id,
        p.type as payment_type,
        a.id as audience_id
        FROM purchasing_orders as po
        INNER JOIN audience as a ON po.audience_id = a.id
        LEFT JOIN payments as p on p.id = po.payment_id
        ${search}
        ORDER BY ${orderBy.join()} ${orderMethod} NULLS LAST
      ), 
      Count_CTE 
      AS 
      (
        SELECT CAST(COUNT(*) as INT) AS TotalRows FROM Data_CTE
      )
      SELECT
        *
      FROM Data_CTE
      CROSS JOIN Count_CTE
      OFFSET :page ROWS
      FETCH NEXT :pageSize ROWS ONLY;
    `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { page, pageSize, search });
  const result = await PostgresHelper.execQuery<CustomerOrders[]>(client, sql, bindings);
  return result;
}

export async function getCustomerByID(client: Pool, customerID: number, pageID: number): Promise<ICustomerTemp> {
  const SQL = getCustomerByIDSQL();
  const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, sanitizeSQL(SQL), [customerID, pageID]);
  if (result?.length) {
    return result[0] as ICustomerTemp;
  }
  return null;
}

export async function updateCustomer(client: Pool, customerID: number, accessToken: string, pageID: number, fromName: string, isNew: boolean): Promise<ICustomerTemp> {
  const customer = await getCustomerByID(client, customerID, pageID);
  let fields = await findUserProfile(customer.psid, accessToken);

  // ! fields can be null (found on dev.env according to not developer)
  let canReply = false;
  if (!fields) {
    if (fromName !== '') {
      if (fromName === undefined) {
        fields = await findUserProfileWithoutProfilePic(customer.psid, accessToken);
      } else {
        fields = {};
        fields['name'] = fromName;
        fields['first_name'] = fromName;
        fields['last_name'] = ' ';
      }
    } else {
      fields = await findUserProfileWithoutProfilePic(customer.psid, accessToken);
    }
  } else {
    canReply = true;
  }
  if (!fields?.hasOwnProperty('profile_pic')) {
    const picture = fields?.picture?.data?.url;
    if (picture) {
      fields.profile_pic = picture;
      fields['profile_pic_updated_at'] = getUTCTimestamps();
    }
  }

  if (fields === null) {
    fields = {};
    fields['name'] = fromName;
    fields['first_name'] = fromName;
    fields['last_name'] = ' ';
  }

  fields.can_reply = canReply;

  const bindings = {
    id: customerID,
  };

  const values = [':id'];
  const updates = [];
  const updatableFields = [
    'name',
    // 'first_name',
    // 'last_name',
    'email',
    'phone_number',
    'location',
    'active',
    'profile_pic',
    'profile_pic_updated_at',
    'notes',
    'social',
    'nickname',
    'deleted_at',
    'updated_at',
    'can_reply',
  ];

  if (isNew) {
    updatableFields.push('first_name');
    updatableFields.push('last_name');
  }

  updatableFields.map((field) => {
    if (customer.hasOwnProperty(field) && fields[field]) {
      values.push(`:${field}`);
      bindings[field] = fields[field];
      updates.push(`${field} = :${field}`);
    }
  });

  if (updates?.length) {
    const statement = `UPDATE temp_customers SET ${updates.join(', ')} WHERE id = :id RETURNING *`;
    const query = PostgresHelper.convertParameterizedQuery(statement, bindings);
    const result = await PostgresHelper.execQuery<ICustomerTemp[]>(client, sanitizeSQL(query.sql), query.bindings);
    if (result?.length === 1) {
      return result[0] as ICustomerTemp;
    } else {
      return {} as ICustomerTemp;
    }
  } else {
    return customer;
  }
}

export async function updateCustomerProfilePicture(client: Pool, pageID: number, customerID: number, profilePic: string): Promise<IHTTPResult> {
  const queryParams = {
    pageID,
    customerID,
    updatedAt: getUTCTimestamps(),
    profilePic,
  };
  const statement = `
    UPDATE temp_customers SET 
      profile_pic = :profilePic,
      profile_pic_updated_at = :updatedAt,
      updated_at = :updatedAt
    WHERE id = :customerID
    AND page_id = :pageID
  `;
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, queryParams);
  await PostgresHelper.execBatchTransaction<ICustomerTemp>(client, sanitizeSQL(sql), bindings);
  return { status: 200, value: true };
}

export async function updateCustomerByForm(pageID: number, customerInfo: ICustomerUpdateInfoInput, client: Pool): Promise<IHTTPResult> {
  try {
    const query = { ...customerInfo, pageID, updated_at: getUTCTimestamps() };

    const statement = `
    UPDATE temp_customers SET 
      first_name = :first_name , 
      last_name = :last_name , 
      email = :email , 
      phone_number = :phone_number , 
      profile_pic = :profile_pic , 
      location = :location , 
      aliases = :aliases, 
      updated_at = :updated_at 
    WHERE id = :id AND page_id = :pageID`;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, query);
    await PostgresHelper.execBatchTransaction<ICustomerTemp>(client, sanitizeSQL(sql), bindings);
    return { status: 200, value: true };
  } catch (error) {
    return { status: 403, value: false };
  }
}

export async function updateCustomerFromOpenAPI(pageID: number, customerInfo: ICustomerUpdateInfoInput, client: Pool): Promise<IHTTPResult> {
  try {
    const query = { ...customerInfo, pageID, updated_at: getUTCTimestamps() };

    const statement = `
    UPDATE temp_customers SET 
      first_name = :first_name , 
      last_name = :last_name , 
      aliases = :aliases, 
      updated_at = :updated_at 
    WHERE id = :id AND page_id = :pageID`;
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(statement, query);
    await PostgresHelper.execBatchTransaction<ICustomerTemp>(client, sanitizeSQL(sql), bindings);
    return { status: 200, value: true };
  } catch (error) {
    return { status: 403, value: false };
  }
}

export async function updateCustomerAddress(client: Pool, customerID: number, pageID: number, phoneNumber: string, newLocation: ShippingAddressLocation): Promise<void> {
  // eslint-disable-next-line no-useless-catch
  try {
    const SQL = `
    UPDATE temp_customers 
    SET
      phone_number = $1,
      location = $2
    WHERE
      id = $3
    AND
      page_id = $4
  `;
    await PostgresHelper.execQuery(client, SQL, [phoneNumber, newLocation, customerID, pageID]);
  } catch (err) {
    throw err;
  }
}
export async function updatePDPAConsentAcceptance(
  client: Pool,
  customerID: number,
  pageID: number,
  consents: {
    TERMS: boolean;
    PRIVACY: boolean;
    DATA_USE: boolean;
  },
): Promise<void> {
  // eslint-disable-next-line no-useless-catch
  try {
    const SQL = `
    UPDATE temp_customers 
    SET
      terms_consent = $1,
      privacy_consent = $2,
      datause_consent = $3,
      updated_at = $4
    WHERE
      id = $5
    AND
      page_id = $6
  `;
    await PostgresHelper.execQuery(client, SQL, [consents.TERMS, consents.PRIVACY, consents.DATA_USE, getUTCTimestamps(), customerID, pageID]);
  } catch (err) {
    throw err;
  }
}

export async function removeCustomer(client: Pool, id: string, pageID: number): Promise<RemoveUserResponse> {
  const SQL = 'UPDATE temp_customers SET active = false WHERE id = $1 AND page_id = $2';
  await PostgresHelper.execQuery(client, SQL, [id, pageID]);
  return {
    status: 200,
    value: 'Customer removed successfully!',
    id,
  };
}

export async function blockCustomer(client: Pool, id: string, pageID: number): Promise<RemoveUserResponse> {
  const SQL = `
  UPDATE temp_customers 
  SET blocked = true , updated_at = $3
  WHERE id = $1 
  AND page_id = $2`;
  await PostgresHelper.execQuery(client, SQL, [id, pageID, getUTCTimestamps()]);
  return {
    status: 200,
    value: 'Customer blocked successfully!',
    id,
  };
}

export async function unblockCustomer(client: Pool, id: string, pageID: number): Promise<RemoveUserResponse> {
  const SQL = `
  UPDATE temp_customers 
  SET blocked = false , updated_at = $3
  WHERE id = $1 
  AND page_id = $2`;
  await PostgresHelper.execQuery(client, SQL, [id, pageID, getUTCTimestamps()]);
  return {
    status: 200,
    value: 'Customer unblocked successfully!',
    id,
  };
}

export async function createNewCustomerWithForm(client: Pool, data: ICustomerTemp, pageID: number): Promise<void> {
  if (data.profile_pic) {
    await convertBinaryToBuffer(data.profile_pic);
  } else {
    await newCustomerMethod(client, data, pageID);
  }
}

export async function newCustomerMethod(client: Pool, customer: ICustomerTemp, pageID: number): Promise<ICustomerTemp> {
  const SQL = `INSERT INTO temp_customers (
    email,
    first_name,
    last_name,
    phone_number,
    location,
    notes,
    social,
    customer_type,
    page_id,
    line_user_id,
    profile_pic,
    platform)
  VALUES (:email, :first_name, :last_name, :phone_number, :location, :notes, :social, :customer_type, :page_id, :line_user_id, :profile_pic, :platform) 
  ON CONFLICT ON CONSTRAINT temp_customers_un 
  DO UPDATE SET updated_at = :updatedAt
  RETURNING *`;

  customer.page_id = pageID;
  const query = PostgresHelper.convertParameterizedQuery(SQL, { updatedAt: getUTCDayjs(), ...customer });
  const response = await PostgresHelper.execQuery<ICustomerTemp[]>(client, sanitizeSQL(query.sql), query.bindings);
  return response[0] as ICustomerTemp;
}

export async function updateCustomerFromLineOA(client: Pool, customer: ICustomerTemp, pageID: number): Promise<ICustomerTemp> {
  // first_name = $1,
  const SQL = ` UPDATE 
                temp_customers 
                SET
                profile_pic = $1
                WHERE   
                line_user_id = $2 AND
                page_id = $3;
  `;
  try {
    customer.page_id = pageID;
    const response = await PostgresHelper.execQuery<ICustomerTemp>(client, SQL, [customer.profile_pic, customer.line_user_id, pageID]);
    return response[0] as ICustomerTemp;
  } catch (err) {
    console.log('err [LOG]:--> ', err);
    console.log({ err });
    return null;
  }
}

export async function upsertNote(client: Pool, note: ICustomerNote, pageID: number, user_id: number): Promise<ICustomerTemp> {
  const SQL = `
  INSERT INTO 
  customer_notes( 
    ${Number(note.id) !== -1 ? 'id, ' : ''} 
    note, 
    page_id, 
    customer_id, 
    user_id,
    updated_at
  )
  VALUES ( 
    ${Number(note.id) !== -1 ? ':id , ' : ''} 
    :note, 
    :pageID, 
    :customer_id, 
    :user_id,
    :updatedAt ) 
  ON CONFLICT ON CONSTRAINT customer_notes_un
  DO UPDATE SET note =  :note, updated_at = :updatedAt , user_id = :user_id
  WHERE customer_notes.page_id = :pageID AND customer_notes.id = :id ;`;

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { ...note, pageID, user_id, updatedAt: getUTCDayjs() });
    const response = await PostgresHelper.execQuery<ICustomerTemp[]>(client, sanitizeSQL(sql), bindings);
    return response[0] as ICustomerTemp;
  } catch (err) {
    console.log({ err });
    return null;
  }
}

export async function removeNote(client: Pool, note: ICustomerNote, pageID: number): Promise<ICustomerTemp> {
  const SQL = 'DELETE FROM customer_notes WHERE id = :id AND page_id = :pageID ;';

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { ...note, pageID });
    const response = await PostgresHelper.execQuery<ICustomerTemp[]>(client, sanitizeSQL(sql), bindings);
    return response[0] as ICustomerTemp;
  } catch (err) {
    console.log({ err });
    return null;
  }
}

export async function getNotes(client: Pool, pageID: number, user_id: number, customer_id: number): Promise<ICustomerNote[]> {
  const SQL = `
    SELECT 
      id, 
      note, 
      COALESCE
      (
        (
          SELECT 
            alias 
          FROM 
            users u2 
          INNER JOIN 
            user_page_mapping upm ON u2.id = upm.user_id 
          WHERE 
            u2.id = cn.user_id 
          AND 
            upm.page_id = :pageID
        ),
        (
          SELECT 
            name 
          FROM 
            users 
          WHERE 
            id = cn.user_id 
        )
      ) as "name", 
      updated_at
    FROM
      customer_notes cn
    WHERE 
      page_id = :pageID 
    AND customer_id = :customer_id 
    ORDER BY updated_at DESC ;
  `;

  try {
    const { sql, bindings } = PostgresHelper.convertParameterizedQuery(SQL, { pageID, customer_id, user_id });
    const result = await PostgresHelper.execQuery<ICustomerNote[]>(client, sanitizeSQL(sql), bindings);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.log({ err });
    return null;
  }
}

export async function getFacebookUserProfile(PSID: string, accessToken: string, scope: string[]): Promise<IFacebookThreadUserMetadata> {
  try {
    // 'profile_pic' was not submitted due to new privacy rules in Europe
    const fields = scope.join(',');
    const url = `https://graph.facebook.com/v8.0/${PSID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log('getFacebookUserProfile err [LOG]:--> ', PSID, err.message);
    return null;
  }
}
export async function findUserProfile(PSID: string, accessToken: string): Promise<IFacebookThreadUserMetadata> {
  try {
    // 'profile_pic' was not submitted due to new privacy rules in Europe
    const fields = ['first_name', 'last_name', 'name', 'id', 'picture'].join(',');
    const url = `https://graph.facebook.com/v8.0/${PSID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log('findUserProfile err [LOG]:--> ', PSID, err.message);
    return null;
  }
}
export async function findUserProfileWithoutProfilePic(PSID: string, accessToken: string): Promise<IFacebookThreadUserMetadata> {
  try {
    // 'profile_pic' was not submitted due to new privacy rules in Europe
    const fields = ['first_name', 'last_name', 'name', 'id'].join(',');
    const url = `https://graph.facebook.com/v8.0/${PSID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log('findUserProfileWithoutProfilePic err [LOG]:--> ', PSID, err.message);
    return null;
  }
}

export async function findInvitedUserProfile(PSID: string, accessToken: string): Promise<IFacebookThreadUserMetadata> {
  try {
    const fields = ['name', 'id', 'email'].join(',');
    const url = `https://graph.facebook.com/v8.0/${PSID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log('findInvitedUserProfile err [LOG]:--> ', PSID, err.message);
    return null;
  }
}

export const getCustomerTags = async (client: Pool, pageID: number, searchQuery: string, orderQuery: string, page: number, pageSize: number): Promise<ICustomerTagCRUD[]> => {
  try {
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
                      color,
                      updated_at,
                      (
                      	SELECT 
                          JSONB_AGG(
                            JSONB_BUILD_OBJECT(
                              'userID',u.id,
                              'userName',u."name",
                              'profileImg',u.profile_img 
                            )
                          ) AS users
                        FROM user_tag_mapping upm 
                        INNER JOIN users u ON upm.user_id = u.id 
                        WHERE upm.tag_id = ct.id
                        AND upm.active = TRUE
                      )
                    FROM customer_tags ct 
                    WHERE ct.page_id = :pageID AND ct.active = true ${searchQuery}
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
                    FETCH NEXT :pageSize ROWS ONLY;`;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<[ICustomerTagCRUD]>(client, sanitizeSQL(returnSQLBindings.sql), returnSQLBindings.bindings);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error);
  }
};

export const insertCustomerMappingTag = async (pageID: number, tagID: number, customerID: number, client: Pool): Promise<void> => {
  try {
    const bindings = {
      pageID,
      tagID,
      customerID,
    };

    const SQL = `
    INSERT INTO customer_tag_mapping 
                            (
                              page_id, 
                              tag_id, 
                              customer_id
                            ) 
                VALUES      ( 
                              :pageID, 
                              :tagID, 
                              :customerID 
                            ); 
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCustomerTag = async (pageID: number, id: number, client: Pool): Promise<void> => {
  try {
    const bindings = {
      pageID,
      id,
    };
    const SQL = ' UPDATE customer_tags SET active = false WHERE id = :id AND page_id =:pageID ';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    const errMessage = error.message;
    throw new Error(errMessage);
  }
};

export const updateCustomerTag = async (pageID: number, id: number, name: string, color: string, client: Pool): Promise<void> => {
  try {
    const bindings = {
      pageID,
      id,
      name,
      color,
      updatedAt: getUTCDayjs(),
    };

    const SQL = `
                  UPDATE  customer_tags 
                  SET     name = :name, 
                          color = :color,
                          updated_at = :updatedAt
                  WHERE   id = :id 
                    AND   page_id = :pageID ;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    console.log('Error updating tag', error);
    throw new Error(error);
  }
};

export const updateCustomerUpdatedAt = async (pageID: number, customerID: number, client: Pool): Promise<void> => {
  try {
    const SQL = `
                  UPDATE temp_customers 
                  SET updated_at = $3
                  WHERE id = $1 
                  AND page_id = $2`;
    await PostgresHelper.execQuery(client, SQL, [customerID, pageID, getUTCTimestamps()]);
  } catch (error) {
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
  }
};

export const insertCustomerTag = async (pageID: number, tagName: string, tagColor: string, client: Pool): Promise<ICustomerTagCRUD> => {
  try {
    const bindings = {
      pageID,
      tagName,
      tagColor,
      updatedAt: getUTCDayjs(),
    };

    const SQL = `
    INSERT INTO customer_tags 
                            (
                              page_id, 
                              name, 
                              color
                            ) 
                VALUES      ( 
                              :pageID , 
                              :tagName , 
                              :tagColor 
                            )
                ON CONFLICT (page_id , name ) DO UPDATE SET active = TRUE, color = :tagColor, updated_at = :updatedAt
                RETURNING * ;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execBatchTransaction<ICustomerTagCRUD>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const { id, color, name } = data;
    return {
      id,
      name,
      color,
      tagMappingID: -1,
    };
  } catch (error) {
    console.log('Error inserting customer Tag :>> ', error);
    throw new Error(error);
  }
};

export const deleteCustomerTagMapping = async (pageID: number, tagMappingID: number, tagID: number, client: Pool): Promise<void> => {
  try {
    const bindings = {
      pageID,
      tagID,
      tagMappingID,
    };

    const SQL = `
                  DELETE 
                  FROM   customer_tag_mapping 
                  WHERE  id= :tagMappingID
                  AND    page_id = :pageID
                  AND    tag_id = :tagID ;
    `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  } catch (error) {
    throw new Error('Error removing tag from customer');
  }
};

export const insertCustomerDefault = async (pageID: number, name: string, color: string, client: Pool): Promise<void> => {
  try {
    const bindings = [pageID, name, color];

    const SQL = `
                    INSERT 
                    INTO
                                customer_tags ( page_id, name, color )
                    SELECT
                                $1,
                                $2 :: varchar ,
                                $3 :: varchar
                    WHERE
                    NOT EXISTS (
                    SELECT
                                  id
                    FROM
                                  customer_tags
                    WHERE
                                  page_id = $1
                                  AND name = $2 :: varchar
                                  AND color = $3 :: varchar
                                ) ;
    `;
    await PostgresHelper.execBatchTransaction(client, SQL, bindings);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error adding default tags to customer');
  }
};

export const getCustomerTagByPageByID = async (client: Pool, customerID: number, pageID: number): Promise<ICustomerTagCRUD[]> => {
  const bindings = {
    pageID,
    customerID,
  };
  const SQL = getCustomerTagAttachUnAttachSQL();
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  const result = await PostgresHelper.execQuery<ICustomerTagCRUD[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
  return Array.isArray(result) ? result : [];
};

export async function updateCustomerCanReply(client: Pool, canReply: boolean, customerID: number, pageID: number): Promise<void> {
  // eslint-disable-next-line no-useless-catch
  try {
    const SQL = `
    UPDATE temp_customers 
    SET
      can_reply = $1
    WHERE
      id = $2
    AND
      page_id = $3
  `;
    await PostgresHelper.execQuery(client, SQL, [canReply, customerID, pageID]);
  } catch (err) {
    throw err;
  }
}
export async function getPreviousAudienceIDbyCustomerID(client: Pool, customerID: number, index: number, pageID: number): Promise<IDObject[]> {
  // eslint-disable-next-line no-useless-catch
  try {
    const SQL = `
    SELECT DISTINCT id FROM audience WHERE customer_id = $1 and page_id = $2 ORDER BY id DESC LIMIT 1 OFFSET $3
  `;
    const result = await PostgresHelper.execQuery<Promise<IDObject[]>>(client, SQL, [customerID, pageID, index]);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    throw err;
  }
}
export async function getPreviousAudienceOfAudienceID(client: Pool, audienceID: number, pageID: number): Promise<IDObject[]> {
  // eslint-disable-next-line no-useless-catch
  try {
    const SQL = `
    SELECT
      a.id
    FROM
      (
      SELECT
        customer_id
      FROM
        audience
      WHERE
        id = $1
        AND page_id = $2 ) AS c1
    INNER JOIN audience a ON
      a.customer_id = c1.customer_id 
    AND a.page_id = $2
    ORDER BY id DESC
  `;
    const result = await PostgresHelper.execQuery<Promise<IDObject[]>>(client, SQL, [audienceID, pageID]);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    throw err;
  }
}

export const getMappedTags = async (pageID: number, tagIDs: number[], client: Pool): Promise<number[]> => {
  const bindings = [tagIDs, pageID];
  const SQL = ` 
            SELECT  tag_id
            FROM    customer_tag_mapping
            WHERE   tag_id = ANY($1 :: int[])
              AND   page_id = $2
              AND   active = TRUE
    `;
  const data = await PostgresHelper.execQuery(client, SQL, bindings);
  return Array.isArray(data) ? data.map(({ tag_id }) => tag_id) : [];
};
export const getCustomerTagCount = async (pageID: number, client: Pool): Promise<number> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const bindings = [pageID];
    const SQL = ` 
              SELECT  count(1)::int
              FROM    customer_tags
              WHERE   page_id = $1
                AND   active = TRUE
      `;
    const data = await PostgresHelper.execQuery(client, SQL, bindings);
    return data[0]?.count;
  } catch (error) {
    throw error;
  }
};

export const getCustomerAllTags = async (pageID: number, client: Pool): Promise<ICustomerTagCRUD[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const bindings = [pageID];
    const SQL = ` 
              SELECT  id, name, color
              FROM    customer_tags
              WHERE   page_id = $1
                AND   active = TRUE
      `;
    const data = await PostgresHelper.execQuery(client, SQL, bindings);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw error;
  }
};

export const getCustomerTagByName = async (pageID: number, name: string, client: Pool): Promise<ICustomerTagDB> => {
  try {
    const bindings = [pageID, name];
    const SQL = ` 
              SELECT  id, page_id, name, color, active
              FROM    customer_tags
              WHERE   page_id = $1
                AND   name = $2
      `;
    const data = await PostgresHelper.execQuery<ICustomerTagDB[]>(client, SQL, bindings);
    return Array.isArray(data) ? data[0] : null;
  } catch (error) {
    return null;
  }
};

const getCustomerByIDSQL = (): string => {
  return `
  WITH customer_cte 
  AS (SELECT c.id, 
             c.psid, 
             c.page_id, 
             c.nickname, 
             c.email, 
             c.first_name, 
             c.last_name, 
             c.phone_number, 
             c.profile_pic, 
             c.active, 
             c.created_at, 
             c.updated_at, 
             c.customer_type, 
             c.notes, 
             c.social, 
             c."location", 
             c."name", 
             c."blocked", 
             c."platform", 
             c.aliases, 
             c.profile_pic_updated_at,
             c.can_reply 
      FROM   temp_customers c 
      WHERE  c.id = $1 
             AND page_id = $2), 
  tags_cte 
  AS (SELECT customer_id, 
             Jsonb_agg(Jsonb_build_object('tagMappingID', ctm.id, 'name', 
                       ct.NAME, 
                       'color', 
                       ct.color)) "tags" 
      FROM   customer_tag_mapping ctm 
             RIGHT OUTER JOIN customer_tags ct 
                           ON( ct.id = ctm.tag_id ) 
                             AND ctm.page_id = $2 
                             AND ct.page_id = $2 
                             AND ct.active IS TRUE
                             AND ctm.active IS TRUE
                             AND ctm.customer_id = $1 
      GROUP  BY ctm.customer_id) 
SELECT customer_cte.*, 
    tags_cte.tags 
FROM   customer_cte 
    LEFT JOIN tags_cte 
           ON customer_cte.id = tags_cte.customer_id; 
  `;
};

const getCustomerTagAttachUnAttachSQL = (): string => {
  return `
  SELECT
	id,
	tagmappingid "tagMappingID",
	name,
	color
    FROM
      (
      	SELECT id AS "id", name AS "name", color AS "color", -1 AS "tagmappingid"
          FROM
            customer_tags
          WHERE
            page_id = :pageID
            AND active  = TRUE 
            AND id NOT IN (
            SELECT
              tag_id
            FROM
              customer_tag_mapping ctm
            WHERE
              customer_id = :customerID )) AS tag_unmapped
    UNION
    SELECT
      ct.id AS "id",
      ctm.id AS "tagMappingID",
      ct.NAME AS "name",
      ct.color AS "color"
    FROM
      customer_tag_mapping ctm
    INNER JOIN customer_tags ct ON
      ( ct.id = ctm.tag_id )
    WHERE
      ctm.page_id = :pageID
      AND ctm.active = TRUE
      AND ct.active = TRUE
      AND ctm.customer_id = :customerID
  `;
};

export async function deletePageCustomerTags(client: Pool, pageId: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageId };
    const SQL = `
                  DELETE 
                  FROM customer_tags
                  WHERE 
                      page_id = :pageId 
              `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete customer tags successfully',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
