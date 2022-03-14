import { IContact, IDealDate, IDealDetail, IDealId, IInsertDeal, IProjectCode, ITagDeal, ITagDealId, ITaskDeal, IUuidDeal } from '@reactor-room/crm-models-lib';
import { getUTCTimestamps, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';

export async function insertDealDetailByTask(client: Pool, dealDetail: IDealDetail, userId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
      INSERT INTO deal
        (deal_title,
        project_number,
        start_date,
        end_date,
        advertise_before,
        payment_detail,
        product_service,
        objective,
        target,
        ads_optimize_fee,
        ads_spend,
        note_detail,
        owner_id,
        account_executive,
        project_manager,
        head_of_client,
        create_by,
        create_date,
        company_id)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
        (SELECT user_id FROM usr WHERE username = $14),
        (SELECT user_id FROM usr WHERE username = $15),
        (SELECT user_id FROM usr WHERE username = $16),
        $17,
        $18,
        (SELECT company_id FROM task WHERE uuid_task = $19))  
      RETURNING 
        deal_id as "dealId",
        uuid_deal as "uuidDeal"  
      `;
  const newDealData = await PostgresHelper.execQuery<[{ dealId: number; uuidDeal: string }]>(client, query, [
    dealDetail.dealtitle,
    dealDetail.projectNumber,
    dealDetail.startDate,
    dealDetail.endDate,
    dealDetail.advertiseBefore,
    dealDetail.paymentDetail,
    dealDetail.productService,
    dealDetail.objective,
    dealDetail.target,
    dealDetail.adsOptimizeFee,
    dealDetail.adsSpend,
    dealDetail.noteDetail,
    ownerId,
    dealDetail.accountExecutive,
    dealDetail.projectManager,
    dealDetail.headOfClient,
    userId,
    getUTCTimestamps(),
    dealDetail.uuidTask,
  ]);
  const queryTaskDeal = `
    INSERT INTO deal_task_mapping (
      task_id,
      deal_id,
      owner_id) 
    VALUES (
      (SELECT task_id FROM task WHERE uuid_task = $1),
      $2,
      $3);
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, queryTaskDeal, [dealDetail.uuidTask, newDealData[0].dealId, ownerId]);
    return { status: 200, value: newDealData[0].dealId + ' ' + newDealData[0].uuidDeal } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function updateDealDetailByUuidDeal(client: Pool, dealDetail: IDealDetail, userId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
      UPDATE 
        deal
      SET
        deal_title = $1,
        project_number = $2,
        start_date = $3,
        end_date = $4,
        advertise_before = $5,
        payment_detail = $6,
        product_service = $7,
        objective = $8,
        target = $9,
        ads_optimize_fee = $10,
        ads_spend = $11,
        note_detail = $12,
        account_executive = (SELECT user_id FROM usr WHERE username = $14),
        project_manager = (SELECT user_id FROM usr WHERE username = $15),
        head_of_client = (SELECT user_id FROM usr WHERE username = $16),
        create_by = $17
      WHERE
        uuid_deal = $18
        AND owner_id =$13
      `;
  try {
    await PostgresHelper.execQuery<[{ dealId: number }]>(client, query, [
      dealDetail.dealtitle,
      dealDetail.projectNumber,
      dealDetail.startDate,
      dealDetail.endDate,
      dealDetail.advertiseBefore,
      dealDetail.paymentDetail,
      dealDetail.productService,
      dealDetail.objective,
      dealDetail.target,
      dealDetail.adsOptimizeFee,
      dealDetail.adsSpend,
      dealDetail.noteDetail,
      ownerId,
      dealDetail.accountExecutive,
      dealDetail.projectManager,
      dealDetail.headOfClient,
      userId,
      dealDetail.uuidDeal,
    ]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getDealDetailByUuidDeal(client: Pool, uuidDeal: IUuidDeal, userId: number, ownerId: number): Promise<IDealDetail> {
  const query = `
      SELECT 
      deal_title as "dealtitle",
      project_number as "projectNumber",
      start_date as "startDate",
      end_date as "endDate",
      advertise_before as "advertiseBefore",
      payment_detail as "paymentDetail",
      product_service as "productService",
      objective,
      target,
      ads_optimize_fee as "adsOptimizeFee",
      ads_spend as "adsSpend",
      note_detail as "noteDetail",
      owner_id as "ownerId",
      account_executive as "accountExecutive",
      project_manager as "projectManager",
      head_of_client as "headOfClient",
      create_by as "createBy",
      deal_id as "dealId"
      FROM
        deal
      WHERE 
        uuid_deal = $1 
        AND owner_id =$2
      `;
  const queryAE = `
      SELECT
      usr.username as "accountExecutive"
      FROM
      deal d
      LEFT JOIN
       usr on (user_id = account_executive)
      WHERE
      uuid_deal = $1
      and d.owner_id  = $2
      `;
  const queryPM = `
      SELECT
      usr.username as "projectManager"
      FROM
      deal d
      LEFT JOIN
       usr on (user_id = project_manager)
      WHERE
      uuid_deal = $1
      and d.owner_id  = $2
      `;
  const queryHC = `
      SELECT
      usr.username as "headOfClient"
      FROM
      deal d
      LEFT JOIN
       usr on (user_id = head_of_client)
      WHERE
      uuid_deal = $1
      and d.owner_id  = $2
      `;
  const ae = await PostgresHelper.execQuery<{ accountExecutive: string }[]>(client, queryAE, [uuidDeal.uuidDeal, ownerId]);
  const pm = await PostgresHelper.execQuery<{ projectManager: string }[]>(client, queryPM, [uuidDeal.uuidDeal, ownerId]);
  const ch = await PostgresHelper.execQuery<{ headOfClient: string }[]>(client, queryHC, [uuidDeal.uuidDeal, ownerId]);
  const dealDetailList = await PostgresHelper.execQuery<IDealDetail[]>(client, query, [uuidDeal.uuidDeal, ownerId]);
  dealDetailList[0]['accountExecutive'] = ae[0].accountExecutive;
  dealDetailList[0]['projectManager'] = pm[0].projectManager;
  dealDetailList[0]['headOfClient'] = ch[0].headOfClient;
  return dealDetailList[0];
}
export async function getTagDealByOwner(client: Pool, ownerId: number): Promise<ITagDeal[]> {
  const query = `
  SELECT  
    tag_name as "tagName",
    tag_color as "tagColor",
    tag_deal_id as "tagDealId"
  FROM
    deal_tag_owner
  WHERE
    owner_id =$1
    `;
  return await PostgresHelper.execQuery<ITagDeal[]>(client, query, [ownerId]);
}

export async function insertTagDealByDealId(client: Pool, dealId: number, tagDealId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
  INSERT INTO deal_tag
    (deal_id,
    owner_id,
    tag_deal_id)
  VALUES
    ($1,
    $2,
    $3)
  `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [dealId, ownerId, tagDealId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertTagDealByDealUuidId(client: Pool, uuidDeal: string, tagDealId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
  INSERT INTO deal_tag
    (deal_id,
    owner_id,
    tag_deal_id)
  VALUES
    ((SELECT deal_id FROM deal WHERE uuid_deal= $1),
    $2,
    $3)
  `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [uuidDeal, ownerId, tagDealId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function deleteTagDealByDealUuidId(client: Pool, uuidDeal: string, ownerId: number): Promise<IHTTPResult> {
  const query = `
  DELETE FROM deal_tag
  WHERE
    deal_id = (SELECT deal_id FROM deal WHERE uuid_deal= $1)
    AND owner_id =$2
  `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [uuidDeal, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}

export async function getTagDealByDealId(client: Pool, dealId: IDealId, ownerId: number): Promise<ITagDealId[]> {
  const query = `
  SELECT 
    tag_deal_id as "tagDealId"
  FROM
    deal_tag
  WHERE
    deal_id= $1
    AND owner_id = $2
  ORDER BY
    tag_deal_id
  `;

  const tagDealList = await PostgresHelper.execQuery<ITagDealId[]>(client, query, [dealId.dealId, ownerId]);
  if (isEmpty(tagDealList)) {
    return [];
  }
  return tagDealList;
}
export async function deleteDealDetailByUuidDeal(client: Pool, dealDetail: IInsertDeal, ownerId: number): Promise<IHTTPResult> {
  const query = `
  DELETE FROM deal_task_mapping
  WHERE
    task_id = (SELECT task_id FROM task WHERE uuid_task = $1)
    AND deal_id = (SELECT deal_id FROM deal WHERE uuid_deal =$2)
    AND owner_id = $3
  `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [dealDetail.uuidTask, dealDetail.uuidDeal, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getProjectCodeOfDeal(client: Pool, search: string, uuidTask: string, ownerId: number): Promise<IProjectCode[]> {
  const searchQuery = search + '%';
  const query = `
  SELECT 
    deal.project_number as "projectCode",
    uuid_deal as "uuidDeal",
    deal_title as "dealTitle",
    company_name as "companyName"
  FROM
    deal
  LEFT JOIN
    lead_company lc ON lc.company_id = deal.company_id
  WHERE
    deal.owner_id = $1
    AND deal.project_number LIKE '${searchQuery}'
    AND active = true
    AND deal.company_id = (SELECT company_id FROM task WHERE uuid_task = $2)  
  ORDER BY
    deal.create_date DESC
  LIMIT 10
  `;
  const projectCodeList = await PostgresHelper.execQuery<IProjectCode[]>(client, query, [ownerId, uuidTask]);
  if (isEmpty(projectCodeList)) {
    return [];
  }
  return projectCodeList;
}
export async function insertDealToTask(client: Pool, insertDeal: IInsertDeal, ownerId: number): Promise<IHTTPResult> {
  const queryTaskDeal = `
  INSERT INTO deal_task_mapping (
    task_id,
    deal_id,
    owner_id) 
  VALUES (
    (SELECT task_id FROM task WHERE uuid_task = $1),
    (SELECT deal_id FROM deal WHERE uuid_deal =$2),
    $3);
  `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, queryTaskDeal, [insertDeal.uuidTask, insertDeal.uuidDeal, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getDealFromTask(client: Pool, insertDeal: IInsertDeal, ownerId: number): Promise<ITaskDeal> {
  const queryTaskDeal = `
   SELECT
    task_id,
    deal_id
   FROM 
    deal_task_mapping 
   WHERE
    task_id = (SELECT task_id FROM task WHERE uuid_task = $1)
    AND deal_id = (SELECT deal_id FROM deal WHERE uuid_deal =$2)
    AND owner_id = $3;
  `;
  const projectList = await PostgresHelper.execQuery<ITaskDeal[]>(client, queryTaskDeal, [insertDeal.uuidTask, insertDeal.uuidDeal, ownerId]);
  if (isEmpty(projectList)) {
    return null;
  }
  return projectList[0];
}
