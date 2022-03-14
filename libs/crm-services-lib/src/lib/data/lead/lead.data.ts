import { getUTCTimestamps, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  IAddress,
  IBusinessType,
  ICompanyId,
  IContact,
  ILead,
  ILeadSettings,
  INoteLead,
  IPaginationPage,
  ITagLead,
  ITagLeadByCompany,
  ITagOwner,
  ITaskLeadInsert,
  IUpdateActiveTask,
} from '@reactor-room/crm-models-lib';
import { Pool } from 'pg';
import { IHTTPResult } from '@reactor-room/crm-models-lib';

export async function getLeadsContact(client: Pool, pagination: IPaginationPage, ownerId: number): Promise<ILead[]> {
  try {
    const { skip_number, limit_number } = pagination;
    const SQL = `
    SELECT 
      uuid_company AS "uuidCompany",
      company_name AS companyname,
      company_id AS companyid,
      username AS "createBy",
      profile_pic AS "profilePic",
      active_lead as active
    FROM 
      lead_company uu
    LEFT JOIN usr aa on uu.user_id = aa.user_id
    WHERE 
      uu.owner_id = $1
      AND delete_lead = 'false'
      AND active_lead = 'true'
    ORDER BY 
      create_date DESC
    OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY
    `;
    const leadCompany = await PostgresHelper.execQuery<[ILead]>(client, SQL, [ownerId, skip_number, limit_number]);
    if (isEmpty(leadCompany)) {
      return [];
    }
    return leadCompany;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}
export async function getInActiveLeadsContact(client: Pool, pagination: IPaginationPage, ownerId: number): Promise<ILead[]> {
  try {
    const { skip_number, limit_number } = pagination;
    const SQL = `
    SELECT 
      uuid_company AS "uuidCompany",
      company_name AS companyname,
      company_id AS companyid,
      username AS "createBy",
      profile_pic AS "profilePic",
      active_lead as active
    FROM 
      lead_company uu
    LEFT JOIN usr aa on uu.user_id = aa.user_id
    WHERE 
      uu.owner_id = $1
      AND delete_lead = 'false'
      AND active_lead = 'false'
    ORDER BY 
      create_date DESC
    OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY
    `;
    const leadCompany = await PostgresHelper.execQuery<[ILead]>(client, SQL, [ownerId, skip_number, limit_number]);
    if (isEmpty(leadCompany)) {
      return [];
    }
    return leadCompany;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}
export async function countActiveLead(client: Pool, ownerId: number): Promise<{ activeLead: number }> {
  try {
    const SQL = `
    SELECT 
      COUNT(*) as "activeLead"
    FROM 
      lead_company uu
    WHERE 
      uu.owner_id = $1
      AND delete_lead = 'false'
      and active_lead = 'true'
    `;
    const activeLead = await PostgresHelper.execQuery<[{ activeLead: number }]>(client, SQL, [ownerId]);
    if (isEmpty(activeLead)) {
      return { activeLead: 0 };
    }
    return activeLead[0];
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function countInActiveLead(client: Pool, ownerId: number): Promise<{ inActiveLead: number }> {
  try {
    const SQL = `
    SELECT 
      COUNT(*) as "inActiveLead"
    FROM 
      lead_company uu
    WHERE 
      uu.owner_id = $1
      AND delete_lead = 'false'
      and active_lead = 'false'
    `;
    const inActiveLead = await PostgresHelper.execQuery<[{ inActiveLead: number }]>(client, SQL, [ownerId]);
    if (isEmpty(inActiveLead)) {
      return { inActiveLead: 0 };
    }
    return inActiveLead[0];
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}
export async function getLeadsContactByUUIDCompany(client: Pool, uuidCompany: string, ownerId: number): Promise<ILead[]> {
  try {
    const SQL = `
    SELECT 
      uuid_company AS "uuidCompany",
      company_name AS companyname,
      business_type AS businesstype,
      tax_id_no AS "taxIdNo",
      project_number As "projectNumber",
      website
    FROM 
      lead_company c
    WHERE 
      c.uuid_company = $1 
      AND c.owner_id = $2
    `;
    const leadCompany = await PostgresHelper.execQuery<[ILead]>(client, SQL, [uuidCompany, ownerId]);
    if (isEmpty(leadCompany)) {
      return [];
    }
    return leadCompany;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function getPrimaryContactByLead(client: Pool, uuidCompany: string, ownerId: number): Promise<IContact[]> {
  try {
    const SQL = `
      SELECT 
        name,
        email,
        phone_number AS "phoneNumber"
      FROM 
        lead_company_contact c
      WHERE 
        company_id = (SELECT company_id FROM lead_company WHERE lead_company.uuid_company = $1) 
        AND c.owner_id = $2
        AND c.primary_contact = true 
      `;
    const primaryContact = await PostgresHelper.execQuery<[IContact]>(client, SQL, [uuidCompany, ownerId]);
    if (isEmpty(primaryContact)) {
      return [];
    }
    return primaryContact;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function getCompanyIdByUUIDCompany(client: Pool, uuidCompany: string, ownerId: number): Promise<[{ companyid: number }]> {
  const SQL = `
    SELECT 
      company_id AS companyid 
    FROM 
      lead_company c
    WHERE c.uuid_company IN ${uuidCompany} 
    AND c.owner_id =  $1
    `;
  return await PostgresHelper.execQuery<[{ companyid: number }]>(client, SQL, [ownerId]);
}

export async function getContactByLead(client: Pool, uuidCompany: string, ownerId: number): Promise<IContact[]> {
  try {
    const SQL = `
    SELECT 
      name,
      email,
      phone_number AS "phoneNumber",
      primary_contact AS primarycontact,
      uuid_name as uuidname,
      position,
      line_id AS "lineId"
    FROM
      lead_company_contact c
    WHERE 
      c.company_id = (SELECT company_id FROM "lead_company" WHERE lead_company.uuid_company = $1)
      AND c.owner_id = $2
    `;
    const leadContact = await PostgresHelper.execQuery<[IContact]>(client, SQL, [uuidCompany, ownerId]);
    if (isEmpty(leadContact)) {
      return [];
    }
    return leadContact;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}
export async function getAdressByLead(client: Pool, uuidCompany: string, ownerId: number): Promise<IAddress[]> {
  try {
    const SQL = `
    SELECT 
      address,
      postal_code AS postalcode,
      district,
      city,
      province,
      uuid_address AS "uuidAddress"
    FROM
      lead_company_address c
    WHERE 
      c.company_id = (SELECT company_id FROM "lead_company" WHERE lead_company.uuid_company = $1)
      AND c.owner_id = $2
    `;
    const address = await PostgresHelper.execQuery<[IAddress]>(client, SQL, [uuidCompany, ownerId]);
    if (isEmpty(address)) {
      return [];
    }
    return address;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}
export async function insertCompanyContactbyId(client: Pool, arg: ILead, ownerId: number, userId: number): Promise<ICompanyId> {
  try {
    const companyname = arg.companyname;
    const businesstype = arg.businesstype;
    const projectNumber = arg.projectNumber;
    const taxIdNo = arg.taxIdNo;
    const website = arg.website;
    const createDate = getUTCTimestamps();
    const active = true;
    const delete_lead = false;
    const query = `
    INSERT INTO lead_company   
      (company_name,
      business_type,
      owner_id,
      user_id,
      create_date,
      active_lead,
      delete_lead,
      project_number,
      tax_id_no,
      website)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING 
      company_id AS "companyId",
      uuid_company AS "uuidCompany",
      active_lead AS active
    `;
    const companyIdList = await PostgresHelper.execQuery<ICompanyId[]>(client, query, [
      companyname,
      businesstype,
      ownerId,
      userId,
      createDate,
      active,
      delete_lead,
      projectNumber,
      taxIdNo,
      website,
    ]);
    const companyId = companyIdList[0];
    if (isEmpty(companyIdList)) {
      return { companyId: null, uuidCompany: null };
    }
    return companyId;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function updataeCompanyContactbyId(client: Pool, arg: ILead, ownerId: number): Promise<ICompanyId[]> {
  const uuidCompany = arg.uuidCompany;
  const companyname = arg.companyname;
  const businesstype = arg.businesstype;
  const projectNumber = arg.projectNumber;
  const taxIdNo = arg.taxIdNo;
  const website = arg.website;
  const query = `
    UPDATE 
      lead_company 
    SET  
      company_name = $1,
      business_type = $3,
      project_number =$5,
      tax_id_no = $6,
      website =$7
    WHERE 
      uuid_company = $2 
      AND owner_id = $4
    RETURNING 
      company_id AS "companyId"
    `;
  return await PostgresHelper.execQuery<ICompanyId[]>(client, query, [companyname, uuidCompany, businesstype, ownerId, projectNumber, taxIdNo, website]);
}

export async function updataeContactbyId(client: Pool, contact: IContact, ownerId: number): Promise<void> {
  const uuidname = contact.uuidname;
  const name = contact.name;
  const email = contact.email;
  const phoneNumber = contact.phoneNumber;
  const lineId = contact.lineId;
  const postion = contact.position;
  const query = `
    UPDATE 
      lead_company_contact 
    SET  
      name = $1,
      email = $3,
      phone_number = $4,
      line_id = $6,
      position = $7
    WHERE 
      uuid_name = $2 
      AND owner_id = $5
    `;
  await PostgresHelper.execQuery<ILead[]>(client, query, [name, uuidname, email, phoneNumber, ownerId, lineId, postion]);
}
export async function updataeAddressbyId(client: Pool, address: IAddress, ownerId: number): Promise<void> {
  const uuidAddress = address.uuidAddress;
  const addressInput = address.address;
  const postalcode = address.postalcode;
  const province = address.province;
  const city = address.city;
  const district = address.district;
  const query = `
    UPDATE 
      lead_company_address 
    SET  
      address = $1,
      postal_code = $2,
      province = $3,
      city = $4,
      district = $5
    WHERE 
      uuid_address= $6
      AND owner_id = $7
    `;
  await PostgresHelper.execQuery<ILead[]>(client, query, [addressInput, postalcode, province, city, district, uuidAddress, ownerId]);
}
export async function insertContactbyId(client: Pool, arg: IContact, companyid: number, ownerId: number): Promise<void> {
  const name = arg.name;
  const email = arg.email;
  const phoneNumber = arg.phoneNumber;
  const primarycontact = arg.primarycontact;
  const lineId = arg.lineId;
  const position = arg.position;
  const query = `
    INSERT INTO lead_company_contact
      (name,
      email,
      phone_number,
      primary_contact,
      company_id,
      owner_id,
      line_id,
      position)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
    `;
  await PostgresHelper.execQuery<ILead[]>(client, query, [name, email, phoneNumber, primarycontact, companyid, ownerId, lineId, position]);
}
export async function insertAddressById(client: Pool, arg: IAddress, companyid: number, ownerId: number, index: string): Promise<void> {
  const address = arg.address;
  const postalcode = arg.postalcode;
  const district = arg.district;
  const city = arg.city;
  const province = arg.province;
  let invoice = false;
  if (parseInt(index, 10) === 0) {
    invoice = true;
  }
  const query = `
    INSERT INTO lead_company_address
      (address,
      postal_code,
      district,
      city,
      province,
      invoicing_address,
      company_id,
      owner_id)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
    `;
  await PostgresHelper.execQuery<ILead[]>(client, query, [address, postalcode, district, city, province, invoice, companyid, ownerId]);
}

export async function deleteTagLeadbyTagOwnerId(client: Pool, tagownerid: number, companyid: number, ownerId: number): Promise<void> {
  const bindings = { tagownerid, ownerId };
  const SQL = `
    DELETE FROM lead_ownertag_mapping
    WHERE tag_owner_id = :tagownerid 
    AND company_id = '${companyid}'
    AND owner_id = :ownerId
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<ILead[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function getBusinessTypeByOwnerId(client: Pool, ownerId: number): Promise<IBusinessType[]> {
  try {
    const SQL = `
    SELECT 
      business_type AS businesstype 
    FROM 
      lead_owner_businesstype c
    WHERE 
      owner_id = $1
    `;
    const businessType = await PostgresHelper.execQuery<[IBusinessType]>(client, SQL, [ownerId]);
    if (isEmpty(businessType)) {
      return [];
    }
    return businessType;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function deleteContactByNameId(client: Pool, contact: IContact, ownerId: number): Promise<void> {
  const uuidname = contact.uuidname;
  const bindings = { uuidname, ownerId };
  const SQL = `
    DELETE FROM lead_company_contact
    WHERE uuid_name = :uuidname 
    AND owner_id = :ownerId
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<ILead[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}

export async function getTagLeadByCompanyId(client: Pool, uuidCompany: string, ownerId: number): Promise<ITagLeadByCompany[]> {
  try {
    const SQL = `
    SELECT 
      tag_owner_id as tagownerid
    FROM 
      lead_ownertag_mapping c
    WHERE 
      company_id = (SELECT company_id FROM lead_company WHERE uuid_company = $1) 
      AND owner_id = $2
    ORDER BY 
      tag_owner_id ASC
    `;
    const tagLead = await PostgresHelper.execQuery<[ITagLeadByCompany]>(client, SQL, [uuidCompany, ownerId]);
    if (isEmpty(tagLead)) {
      return [];
    }
    return tagLead;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function insertTagLeadbyCompanyId(client: Pool, tagownerid: number, companyId: number, ownerId: number): Promise<void> {
  const SQL = `
    INSERT INTO lead_ownertag_mapping 
    ( tag_owner_id,
      company_id,
      owner_id)
    VALUES 
      ($1 ,$2, $3);
    `;
  await PostgresHelper.execQuery<[IBusinessType]>(client, SQL, [tagownerid, companyId, ownerId]);
}

export async function getTagLeadByOwner(client: Pool, ownerid: number): Promise<ITagLead[]> {
  try {
    const SQL = `
    SELECT 
      tag_owner_id AS tagownerid,
      tag_name AS tagname,
      tag_color AS tagcolor,
      owner_id AS ownerid 
    FROM 
      lead_ownertag c 
    WHERE 
      owner_id = $1
    `;
    const tagOwner = await PostgresHelper.execQuery<[ITagLead]>(client, SQL, [ownerid]);
    if (isEmpty(tagOwner)) {
      return [];
    }
    return tagOwner;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}
export async function getNoteLeadByCompanyId(client: Pool, uuidCompany: string, ownerId: number): Promise<INoteLead[]> {
  try {
    const SQL = `
    SELECT 
      note_detail AS notedetail,
      uuid_note AS uuidnote,
      create_date AS createdate,
      read_only AS readonly 
    FROM 
      lead_company_note c
    WHERE 
      company_id = (select company_id from lead_company where uuid_company = $1)
      AND owner_id = $2
    `;
    const noteLead = await PostgresHelper.execQuery<[INoteLead]>(client, SQL, [uuidCompany, ownerId]);
    if (isEmpty(noteLead)) {
      return [];
    }
    return noteLead;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function insertNoteLeadbyCompanyId(client: Pool, noteLead: INoteLead, companyId: number, ownerId: number): Promise<void> {
  const createby = noteLead.createby;
  const notedetail = noteLead.notedetail;
  const readonly = noteLead.readonly;
  const SQL = `
    INSERT INTO lead_company_note 
      (company_id,
      create_by,
      note_detail,
      read_only,
      owner_id
      )
    VALUES 
      ($1,$2,$3,$4,$5)
    `;
  await PostgresHelper.execQuery<[IBusinessType]>(client, SQL, [companyId, createby, notedetail, readonly, ownerId]);
}
export async function updateNoteLeadbyUuidNote(client: Pool, noteLead: INoteLead, ownerId: number): Promise<IHTTPResult> {
  try {
    const uuidnote = noteLead.uuidnote;
    const notedetail = noteLead.notedetail;
    const SQL = `
    UPDATE 
      lead_company_note 
    SET  
      note_detail = $1
    WHERE 
      uuid_note = $2
      AND owner_id =$3
    `;
    await PostgresHelper.execQuery<[IBusinessType]>(client, SQL, [notedetail, uuidnote, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (error) {
    throw { status: 403, value: error } as IHTTPResult;
  }
}

export async function changeStatusInActiveLeadByCompanyId(client: Pool, insertTaskField: ITaskLeadInsert, ownerId: number): Promise<void> {
  const uuidCompany = insertTaskField.uuidCompany;
  const active = false;
  const SQL = `
  UPDATE 
    lead_company
  SET  
    active_lead = $2
  WHERE 
    company_id =  (SELECT company_id FROM lead_company WHERE uuid_company = $1)
    AND owner_id =$3
  `;
  await PostgresHelper.execQuery<[IBusinessType]>(client, SQL, [uuidCompany, active, ownerId]);
}
export async function changeStatusActiveLeadByCompanyId(client: Pool, updateActiveTaskInput: IUpdateActiveTask, ownerId: number): Promise<void> {
  const { uuidTask } = updateActiveTaskInput;
  const active = true;
  const SQL = `
  UPDATE 
    lead_company
  SET  
    active_lead = $2
  WHERE 
    company_id =  (SELECT company_id FROM task WHERE uuid_task = $1)
    AND owner_id =$3
  `;
  await PostgresHelper.execQuery<[IBusinessType]>(client, SQL, [uuidTask, active, ownerId]);
}
export async function deleteCompanybyCompanyId(client: Pool, companyid: string, ownerId: number): Promise<void> {
  const delete_lead = true;
  const bindings = { ownerId, delete_lead };
  const SQL = `
    UPDATE 
      lead_company
    SET
      delete_lead = :delete_lead 
    WHERE company_id IN ${companyid}
    AND owner_id = :ownerId
    `;
  const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
  await PostgresHelper.execQuery<ILead[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
}
export async function insertTagOnwer(client: Pool, tagname: string, ownerId: number): Promise<ITagOwner> {
  const tagcolor = '#808080';
  const SQL = `
  INSERT INTO lead_ownertag 
    (tag_name,
    tag_color,
    owner_id
    )
  VALUES 
    ($1,$3,$2)
  RETURNING
    tag_owner_id as "tagOwnerId"
    `;
  const tagOwnerId = await PostgresHelper.execQuery<[ITagOwner]>(client, SQL, [tagname, ownerId, tagcolor]);
  return tagOwnerId[0];
}
export async function getLeadSettingsByOwner(client: Pool, ownerId: number): Promise<ILeadSettings> {
  const SQL = `
  SELECT  
    has_project_code AS "hasProjectCode",
    has_website AS "hasWebsite",
    project_prefix AS "projectPrefix"
  FROM
    lead_settings
  WHERE
    owner_id= $1
    `;
  const leadSettings = await PostgresHelper.execQuery<[ILeadSettings]>(client, SQL, [ownerId]);
  if (isEmpty(leadSettings)) {
    return null;
  }
  return leadSettings[0];
}

export async function selectCompanyDetailByProjectNumber(client: Pool, projectNumber: string, ownerId: number): Promise<{ projectNumber: string }> {
  const SQL = `
  SELECT  
    project_number AS "projectNumber"
  FROM
    lead_company
  WHERE
    project_number = $1
    And owner_id = $2
    `;
  const leadSettings = await PostgresHelper.execQuery<[{ projectNumber: string }]>(client, SQL, [projectNumber, ownerId]);
  if (isEmpty(leadSettings)) {
    return null;
  }
  return leadSettings[0];
}
