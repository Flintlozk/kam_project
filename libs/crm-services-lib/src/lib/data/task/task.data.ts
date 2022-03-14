import { getUTCTimestamps, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  ITaskDetail,
  ITaskUpdate,
  ITagInsert,
  IAppointmentInsert,
  INoteTask,
  INoteTaskInsert,
  IContactTask,
  IAppointmentTask,
  ITagTask,
  IInsertTaskAssign,
  ITaskDealList,
  ITaskDealInsert,
  IInsertTaskCross,
  ICompanyAddress,
  IUpdateTaskTitle,
  IUserRoleFlowDetail,
  ICountDetail,
  ITaskAssignDetail,
  ITaskLeadInsert,
  IStateConfigDetail,
  INextStateTask,
  IVerifyRequiredField,
  INoteId,
  IAttachment,
  ICompanyContactUpdate,
  IInsertCompanyContactTask,
  IUpdateActiveTask,
  IConditionCross,
  IInsertAssign,
  IUserDetail,
  IPriorityState,
  IGoogleCalendar,
  IAppointmentEdit,
  ICalendarDetail,
  ITaskId,
  INoteTaskUpdate,
  IUuidAttachment,
  IInternalNote,
  IUuidAppointment,
  IGoogleCalendarResponse,
  IDealDate,
  IProductAmount,
  IMediaAmount,
} from '@reactor-room/crm-models-lib';
import { Pool } from 'pg';
import { IHTTPResult } from '@reactor-room/model-lib';
import dayjs from 'dayjs';

export async function getTaskByFlow(client: Pool, flowId: string, ownerId: number, userId: number): Promise<ITaskDetail[]> {
  const active = true;
  const now = getUTCTimestamps();
  const ago = dayjs().add(-15, 'day').utc().format();
  const query = `
  SELECT 
    task.title,
    wf.flow_name as team,
    task.due_date as "dueDate",
    task.uuid_task as "uuidTask",
    lc.uuid_company as "uuidCompany",
    sc.priority,
    sc.state_name as "statusType",
    sc.uuid_state as "uuidState",
    sc.color,
    lc.company_name as companyname,
    task.last_update 
  FROM 
    task
  LEFT JOIN
    workflow_state sc on sc.state_id = task.state_id
  LEFT JOIN
    workflow wf on sc.flow_id = wf.flow_id
  LEFT JOIN
    lead_company lc on lc.company_id = task.company_id
  LEFT JOIN
    task_assign ta on ta.task_id = task.task_id       
  WHERE sc.flow_id = $1 AND task.owner_id = $2 AND sc.state_type != 'CLOSE' AND task.active = $3 AND ta.user_id = $4 
  UNION
  SELECT 
    task.title,
    wf1.flow_name as team,
    task.due_date as "dueDate",
    task.uuid_task as "uuidTask",
    lc1.uuid_company as "uuidCompany",
    sc1.priority,
    sc1.state_name as "statusType",
    sc1.uuid_state as "uuidState",
    sc1.color,
    lc1.company_name as companyname,
    task.last_update 
  FROM 
    task
  LEFT JOIN
    workflow_state sc1 on sc1.state_id = task.state_id
  LEFT JOIN
    workflow wf1 on sc1.flow_id = wf1.flow_id
  LEFT JOIN
    lead_company lc1 on lc1.company_id = task.company_id
  LEFT JOIN
    task_assign ta1 on ta1.task_id = task.task_id       
  WHERE sc1.flow_id = $1 AND task.owner_id = $2 AND sc1.state_type = 'CLOSE' AND task.active = $3 AND ta1.user_id = $4 AND task.last_update BETWEEN $5 AND $6  
    `;

  const taskList = await PostgresHelper.execQuery<ITaskDetail[]>(client, query, [flowId, ownerId, active, userId, ago, now]);
  if (taskList?.length > 0) return taskList;
  return [];
}

export async function getTaskDealListByTask(client: Pool, uuidTask: string, ownerId: number): Promise<ITaskDealList[]> {
  const query = `
  SELECT 
    d.deal_title as dealtitle,
    d.start_date as "startDate",
    d.end_date as "endDate", 
    d.objective,
    usr.username as "name",
    usr.profile_pic as "profilePic",
    d.uuid_deal as "uuidDeal"
  FROM 
    deal_task_mapping td 
  LEFT JOIN 
    deal d ON d.deal_id  = td.deal_id
  LEFT JOIN
    usr ON usr.user_id = d.create_by
  WHERE 
    td.task_id = (SELECT task_id from task where uuid_task = $1) AND td.owner_id = $2  AND d.active = true
  ORDER BY 
    create_date DESC   
    `;
  const taskDealListByTask = await PostgresHelper.execQuery<ITaskDealList[]>(client, query, [uuidTask, ownerId]);
  if (taskDealListByTask.length > 0) return taskDealListByTask;
  return [];
}

export async function getTaskDetailById(client: Pool, uuidTask: string, ownerId: number): Promise<ITaskDetail> {
  const query = `
  SELECT 
    lc.company_name as companyname,
    lc.district,
    lc.province,
    lc.city,
    lc.postal_code as postalcode,
    lc.address,
    task.title,
    task.create_date as "createDate",
    lc.uuid_company as "uuidCompany",
    task.uuid_task as "uuidTask",
    task.company_id as "companyId",
    ws.uuid_state as "uuidState",
    task.start_date as "startDate",
    task.end_date as "endDate",
    task.product_amount as "productAmount",
    task.media_amount as "mediaAmount"
  FROM 
    task 
  LEFT JOIN 
    lead_company lc ON task.company_id = lc.company_id 
  LEFT JOIN
    workflow_state ws on ws.state_id = task.state_id
  WHERE task.uuid_task = $1 and task.owner_id = $2
    `;
  const taskDetailByTaskId = await PostgresHelper.execQuery<ITaskDetail>(client, query, [uuidTask, ownerId]);
  return taskDetailByTaskId[0];
}

export async function getTaskAssignByTeam(client: Pool, uuidTask: string, ownerId: number): Promise<ITaskAssignDetail[]> {
  const query = `
  SELECT 
    u.email,
    u.username AS name,
    u.profile_pic as "profilePic" 
  FROM 
    task_assign ta 
  LEFT JOIN 
    usr u  ON ta.user_id  = u.user_id 
  WHERE 
    ta.task_id = (SELECT task_id FROM task WHERE uuid_task = $1) and ta.owner_id = $2
    `;
  const taskAssignByTeam = await PostgresHelper.execQuery<ITaskAssignDetail[]>(client, query, [uuidTask, ownerId]);
  if (taskAssignByTeam.length > 0) return taskAssignByTeam;
  return [];
}

export async function getContactTask(client: Pool, companyId: string, ownerId: number): Promise<IContactTask[]> {
  const query = `
  SELECT 
    name,
    email,
    phone_number as "phoneNumber",
    name_id as "contactCompanyId",
    primary_contact as "primaryContact",
    company_id as "companyId",
    position,
    line_id as "lineId"
  FROM 
    lead_company_contact 
  WHERE 
    company_id = (SELECT company_id FROM lead_company WHERE uuid_company = $1) AND lead_company_contact.owner_id = $2
  ORDER BY 
    primary_contact desc 
    `;
  const contactTask = await PostgresHelper.execQuery<IContactTask[]>(client, query, [companyId, ownerId]);
  if (contactTask.length > 0) return contactTask;
  return [];
}

export async function getAllUser(client: Pool, ownerId: number): Promise<IContactTask[]> {
  const query = `
  SELECT 
    username as name,
    email,
    profile_pic as "profilePic" 
  FROM 
    usr
  WHERE
    owner_id = $1
    `;
  const allUserByOwnerId = await PostgresHelper.execQuery<IContactTask[]>(client, query, [ownerId]);
  if (allUserByOwnerId.length > 0) return allUserByOwnerId;
  return [];
}

export async function updateTaskById(client: Pool, updateTaskField: ITaskUpdate, ownerId: number, statusCreate = 'None'): Promise<IHTTPResult> {
  const taskId = updateTaskField.uuidTask;
  const previousUuidState = updateTaskField.previousStatusType;
  const uuidState = updateTaskField.uuidState;
  const now = getUTCTimestamps();
  const query = `
  UPDATE 
    task 
  SET 
    state_id =(SELECT state_id FROM workflow_state WHERE uuid_state = $1),
    previous_state_id = (select state_id FROM workflow_state WHERE uuid_state =$2),
    status_create = $3,
    last_update =$6
  WHERE
    uuid_task = $4 AND owner_id = $5
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [uuidState, previousUuidState, statusCreate, taskId, ownerId, now]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function updateActiveTask(client: Pool, updateActiveTaskInput: IUpdateActiveTask, ownerId: number): Promise<IHTTPResult> {
  const { uuidTask, activeTask } = updateActiveTaskInput;
  const query = `
  UPDATE 
    task
  SET 
    active = $1
  WHERE
    uuid_task = $2 AND owner_id =$3
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [activeTask, uuidTask, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function updateCompanyContact(client: Pool, updateCompanyContactDetail: ICompanyContactUpdate, ownerId: number): Promise<IHTTPResult> {
  const { name, email, phoneNumber, contactCompanyId, companyId, primaryContact, lineId, position } = updateCompanyContactDetail;
  const query = `
  UPDATE 
    lead_company_contact
  SET 
    name = $1,
    email = $2,
    phone_number = $3,
    primary_contact = $4,
    line_id = $8,
    position = $9
  WHERE
    name_id = $5 AND company_id = $6 AND owner_id = $7
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [name, email, phoneNumber, primaryContact, contactCompanyId, companyId, ownerId, lineId, position]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertCompanyContactTask(client: Pool, insertCompanyContact: IInsertCompanyContactTask, ownerId: number): Promise<IHTTPResult> {
  const primaryContact = false;
  const { name, phoneNumber, email, companyId, lineId, position } = insertCompanyContact;
  const query = `
  INSERT INTO lead_company_contact
    (primary_contact,
    company_id,
    name,
    email,
    phone_number,
    line_id,
    position,
    owner_id)
  VALUES
    ($1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8)
  RETURNING
    name_id as "nameId"
    `;
  try {
    const insertContact = await PostgresHelper.execQuery<IHTTPResult>(client, query, [primaryContact, companyId, name, email, phoneNumber, lineId, position, ownerId]);
    return { status: 200, value: insertContact[0].nameId } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}

export async function getNoteByTask(client: Pool, uuidTask: string, ownerId: number): Promise<INoteTask[]> {
  const query = `
    SELECT 
      note_detail as "noteDetail",
      favourite,
      tn.create_date as "createDate",
      tn.last_update as "lastUpdate",
      username as "createBy",
      profile_pic as "profilePic",
      note_id as "noteId",
      is_internal_note as "isInternalNote",
      uuid_note as "uuidNote",
      uuid_task as "uuidTask"
    FROM 
      "task_note" tn
    LEFT JOIN
      usr aa on aa.user_id = tn.user_id  
    LEFT JOIN
      task tt on tt.task_id = tn.task_id
    WHERE 
    (tn.task_id = (SELECT task_id FROM task WHERE uuid_task = $1) AND tn.owner_id = $2 )  
    OR (tn.task_id = (SELECT parent_task_id FROM task WHERE uuid_task = $1 AND is_internal_note = false) AND tn.owner_id= $2 ) 
    ORDER BY
    tn.create_date;
    `;
  const noteByTask = await PostgresHelper.execQuery<INoteTask[]>(client, query, [uuidTask, ownerId]);
  if (noteByTask.length > 0) return noteByTask;
  return [];
}

export async function getAppointmentTask(client: Pool, uuidTask: string, ownerId: number): Promise<IAppointmentTask[]> {
  const query = `
    SELECT 
      appointment_start_date as "appointmentStartDate",
      appointment_end_date as "appointmentEndDate",
      note,
      appointment_id as "appointmentId",
      username as "createBy",
      profile_pic as "profilePic",
      html_link as "htmlLink",
      uuid_appointment_task as "uuidAppointment"
    FROM 
      "task_appointment" ss
    LEFT JOIN
      usr aa on aa.user_id = ss.user_id  
    WHERE 
      ss.task_id = (SELECT task_id FROM task where uuid_task = $1) AND ss.owner_id = $2
      AND ss.active = 'true'
    ORDER BY
      ss.appointment_start_date asc;
    `;
  const appointmentDetailByTask = await PostgresHelper.execQuery<IAppointmentTask[]>(client, query, [uuidTask, ownerId]);
  if (appointmentDetailByTask.length > 0) return appointmentDetailByTask;
  return [];
}

export async function getConditionInsertCross(client: Pool, ownerId: number): Promise<IConditionCross[]> {
  const actionType = 'CREATE_AUTOMATE';
  const query = `
    SELECT 
      wsc.state_id as "stateId",
      ws.uuid_state as "uuidState",
      ws.state_name as "stateName",
      wf.flow_name as team,
      json_extract_path(wsc."options" ::json,'conditions') as conditions ,
      json_extract_path(wsc."options" ::json,'new_state') as "newState"
    FROM 
      workflow_state_create_conditions wsc   
    LEFT JOIN
      workflow_state ws ON ws.state_id = (wsc."options"->>'new_state')::int
    LEFT JOIN
      workflow wf on ws.flow_id = wf.flow_id
    WHERE 
      wsc.action_type = $1 AND  wsc.owner_id = $2
    `;
  const conditionCross = await PostgresHelper.execQuery<IConditionCross[]>(client, query, [actionType, ownerId]);
  if (conditionCross.length > 0) return conditionCross;
  return [];
}

export async function getTagByTask(client: Pool, taskId: string, ownerId: number): Promise<ITagTask[]> {
  const query = `
    SELECT 
      tag_name as tagname,
      color,
      tag_id as "tagId"
    FROM 
      task_tag 
    WHERE 
      task_id=(SELECT task_id from task where uuid_task =$1) AND owner_id = $2
    `;
  const tagDetailByTask = await PostgresHelper.execQuery<ITagTask[]>(client, query, [taskId, ownerId]);
  if (tagDetailByTask.length > 0) return tagDetailByTask;
  return [];
}

export async function insertTagById(client: Pool, insertTagField: ITagInsert, ownerId: number): Promise<IHTTPResult> {
  const tagName = insertTagField.tagName;
  const taskId = insertTagField.uuidTask;
  const query = `
    INSERT INTO task_tag(
      tag_name,
      task_id,
      owner_id) 
    VALUES (
      $1,
      (SELECT task_id from task where uuid_task = $2),
      $3)
    RETURNING tag_id as "tagId";
    `;
  try {
    const insertTagTaskId = await PostgresHelper.execQuery<IHTTPResult>(client, query, [tagName, taskId, ownerId]);
    return { status: 200, value: insertTagTaskId[0].tagId } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}

export async function insertNoteTask(client: Pool, insertNoteField: INoteTaskInsert, ownerId: number, userId: number): Promise<INoteId> {
  const taskId = insertNoteField.uuidTask;
  const noteDetail = insertNoteField.noteDetail;
  const isInternalNote = insertNoteField.isInternalNote;
  const flowId = insertNoteField.flowId;
  const query = `
    INSERT INTO "task_note"(
      note_detail,
      task_id,
      is_internal_note,
      user_id,
      owner_id,
      flow_id) 
    VALUES (
      $1,
      (SELECT task_id from task where uuid_task = $2),
      $3,
      $4,
      $5,
      $6)
    RETURNING 
      note_id as "noteId",
      uuid_note as "uuidNote"
    `;
  const noteIdList = await PostgresHelper.execQuery<INoteId[]>(client, query, [noteDetail, taskId, isInternalNote, userId, ownerId, flowId]);
  if (noteIdList.length > 0) return noteIdList[0];
  return null;
}
export async function updateNoteTask(client: Pool, updateNoteField: INoteTaskUpdate, ownerId: number): Promise<IHTTPResult> {
  const updateDate = getUTCTimestamps();
  const query = `
  UPDATE 
    task_note
  SET  
    note_detail = $1,
    last_update = $2
  WHERE 
    uuid_note= $3 AND owner_id = $4;
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [updateNoteField.noteDetail, updateDate, updateNoteField.uuidNote, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getflowIdFromUuidNote(client: Pool, uuidNote: string, ownerId: number): Promise<{ flowId: number }> {
  const query = `
  SELECT 
    flow_id::Integer AS "flowId"
  FROM  
    task_note 
  WHERE 
    uuid_note= $1 AND owner_id = $2;
    `;

  const flowId = await PostgresHelper.execQuery<[{ flowId: number }]>(client, query, [uuidNote, ownerId]);
  return flowId[0];
}
export async function deleteAttachment(client: Pool, uuidAttachment: string, ownerId: number): Promise<void> {
  const query = `
  DELETE FROM 
    task_note_attachment
  WHERE 
    uuid_attachment = $1
    AND owner_id = $2;
    `;
  await PostgresHelper.execQuery<IHTTPResult>(client, query, [uuidAttachment, ownerId]);
}
export async function getNoteIdByUuidNote(client: Pool, uuidNote: string, ownerId: number): Promise<{ noteId: number; flowId: number }> {
  const query = `
  SELECT 
    note_id AS "noteId",
    flow_id::Integer AS "flowId"
  FROM  
    task_note 
  WHERE 
    uuid_note= $1 AND owner_id = $2;
    `;

  const noteId = await PostgresHelper.execQuery<[{ noteId: number; flowId: number }]>(client, query, [uuidNote, ownerId]);
  return noteId[0];
}
export async function insertNoteTaskByTaskId(client: Pool, insertNoteField: INoteTask, ownerId: number, userId: number, taskId: { taskId: number }): Promise<INoteId> {
  const noteDetail = insertNoteField.noteDetail;
  const query = `
    INSERT INTO "task_note"(
      note_detail,
      task_id,
      user_id,
      owner_id) 
    VALUES (
      $1,
      $2,
      $3,
      $4)
    RETURNING 
      note_id as "noteId",
      uuidNote as "uuidNote"
    `;
  const noteIdList = await PostgresHelper.execQuery<INoteId[]>(client, query, [noteDetail, taskId.taskId, userId, ownerId]);
  if (noteIdList.length > 0) return noteIdList[0];
  return null;
}
export async function insertAssigneByTask(client: Pool, insertAssignField: IInsertTaskAssign, ownerId: number): Promise<IHTTPResult> {
  const taskId = insertAssignField.uuidTask;
  const value = insertAssignField.value;
  const query = `
    INSERT INTO "task_assign" (
      user_id,
      task_id,
      owner_id) 
    VALUES (
      (SELECT user_id FROM usr u WHERE username  =$1  AND owner_id = $3),
      (SELECT task_id FROM "task" WHERE uuid_task  =$2),
      $3);
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [value, taskId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertAssigneByTaskId(client: Pool, insertAssignField: IInsertAssign, taskId: { taskId: number }, ownerId: number): Promise<IHTTPResult> {
  const name = insertAssignField.name;
  const query = `
    INSERT INTO "task_assign" (
      user_id,
      task_id,
      owner_id) 
    VALUES (
      (SELECT user_id FROM usr u WHERE username  =$1  AND owner_id = $3),
      $2,
      $3);
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [name, taskId.taskId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertUserAsAssigneeByTaskId(client: Pool, userId: number, taskId: { taskId: number }, ownerId: number): Promise<IHTTPResult> {
  const query = `
    INSERT INTO "task_assign" (
      user_id,
      task_id,
      owner_id) 
    VALUES (
      $1,
      $2,
      $3);
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [userId, taskId.taskId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertAppointmentTask(
  client: Pool,
  insertAppointmentField: IAppointmentInsert,
  ownerId: number,
  userId: number,
  googleData: IGoogleCalendar,
): Promise<IHTTPResult> {
  const appointmentStartDate = insertAppointmentField.appointmentStartDate;
  const appointmentNote = insertAppointmentField.appointmentNote;
  const taskId = insertAppointmentField.uuidTask;
  const appointmentEndDate = insertAppointmentField.appointmentEndDate;
  const href = insertAppointmentField.href;
  const query = `
    INSERT INTO "task_appointment"(
      note,
      appointment_start_date,
      task_id,
      owner_id,
      user_id,
      html_link,
      google_calendar_id,
      appointment_end_date,
      href) 
    VALUES (
      $1,
      $2,
      (SELECT task_id from task where uuid_task = $3),
      $4,
      $5,
      $6,
      $7,
      $8,
      $9)
    RETURNING
      uuid_appointment_task as "uuidAppointment";
    `;
  try {
    const insertResult = await PostgresHelper.execQuery<IHTTPResult>(client, query, [
      appointmentNote,
      appointmentStartDate,
      taskId,
      ownerId,
      userId,
      googleData.htmlLink,
      googleData.calendarId,
      appointmentEndDate,
      href,
    ]);
    return { status: 200, value: googleData.htmlLink + ' ' + insertResult[0].uuidAppointment } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function editAppointmentTask(client: Pool, editAppointmentField: IAppointmentEdit, ownerId: number, userId: number): Promise<IHTTPResult> {
  const query = `
  UPDATE 
    task_appointment
  SET  
    appointment_start_date = $3,
    appointment_end_date = $4,
    note = $5
  WHERE 
    uuid_appointment_task = $1 AND owner_id = $2;
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [
      editAppointmentField.uuidAppointment,
      ownerId,
      editAppointmentField.appointmentStartDate,
      editAppointmentField.appointmentEndDate,
      editAppointmentField.appointmentNote,
    ]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getCalendarDetailByAppointmentUuid(client: Pool, uuidAppointment: string, ownerId: number): Promise<ICalendarDetail> {
  const query = `
  SELECT 
    google_calendar_id AS "calendarId",
    note AS "description",
    href
  FROM
    task_appointment  
  WHERE 
    uuid_appointment_task = $1 AND owner_id = $2;
    `;
  const calendarId = await PostgresHelper.execQuery<[ICalendarDetail]>(client, query, [uuidAppointment, ownerId]);
  if (isEmpty(calendarId)) {
    return null;
  }
  return calendarId[0];
}
export async function deleteAppointmentTask(client: Pool, uuidAppointment: string, ownerId: number): Promise<IHTTPResult> {
  const activeApointment = false;
  const query = `
  UPDATE task_appointment
  SET  
    active = $3
  WHERE 
    uuid_appointment_task = $1 AND owner_id = $2;
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [uuidAppointment, ownerId, activeApointment]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertAppointmentTaskById(
  client: Pool,
  insertAppointmentField: IAppointmentInsert,
  ownerId: number,
  userId: number,
  taskId: { taskId: number },
): Promise<IHTTPResult> {
  const appointmentDate = insertAppointmentField.appointmentStartDate;
  const appointmentNote = insertAppointmentField.appointmentNote;
  const query = `
    INSERT INTO "task_appointment"(
      note,
      appointment_date,
      task_id,
      owner_id,
      user_id) 
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5)
    `;
  try {
    const insertResult = await PostgresHelper.execQuery<IHTTPResult>(client, query, [appointmentNote, appointmentDate, taskId.taskId, ownerId, userId]);
    return { status: 200, value: insertResult[0].appointmentDate } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertTaskDealByTask(client: Pool, insertTaskDealField: ITaskDealInsert, ownerId: number): Promise<IHTTPResult> {
  const queryDeal = `
    INSERT INTO deal (
      deal_value,
      start_date,
      end_date,
      deal_title,
      owner_id) 
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5) 
    RETURNING deal_id as dealId;
    `;
  const newDealData = await PostgresHelper.execQuery<{ dealId: number }>(client, queryDeal, [
    insertTaskDealField.dealvalue,
    insertTaskDealField.startDate,
    insertTaskDealField.endDate,
    insertTaskDealField.dealtitle,
    ownerId,
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
    await PostgresHelper.execQuery<IHTTPResult>(client, queryTaskDeal, [insertTaskDealField.uuidTask, newDealData[0].dealid, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}

export async function insertTaskCrossTeam(client: Pool, insertTaskCrossField: IInsertTaskCross, ownerId: number): Promise<ITaskId> {
  const { title, team, uuidState, uuidCompany, dueDate, parentTaskUUID } = insertTaskCrossField;
  const dueDateTemp = new Date();
  const active = true;
  const autoCreate = true;
  const query = `
    INSERT INTO task (
      title,
      state_id,
      company_id,
      owner_id,
      due_date,
      active,
      parent_task_id,
      is_auto_create) 
    VALUES (
      $1,
      (SELECT state_id FROM workflow_state WHERE uuid_state = $2),
      (SELECT company_id FROM lead_company WHERE uuid_company = $3),
      $4,
      $5,
      $6,
      (SELECT task_id FROM task WHERE uuid_task = $7),
      $8)
    RETURNING 
      task_id AS "taskId"
    `;
  const taskId = await PostgresHelper.execQuery<[ITaskId]>(client, query, [title, uuidState, uuidCompany, ownerId, dueDateTemp, active, parentTaskUUID, autoCreate]);
  return taskId[0];
}

export async function updateTaskTitle(client: Pool, updateTaskTitleField: IUpdateTaskTitle, ownerId: number): Promise<IHTTPResult> {
  const taskTitle = updateTaskTitleField.title;
  const taskId = updateTaskTitleField.uuidTask;
  const query = `
  UPDATE task 
  SET  
    title = $1 
  WHERE 
    uuid_task = $2 AND owner_id = $3;
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [taskTitle, taskId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}

export async function getCompanyAddress(client: Pool, uuidCompany: string, ownerId: number): Promise<ICompanyAddress[]> {
  const query = `
  SELECT 
    company_name as companyname,
    district,
    address,
    postal_code as postalcode,
    province,
    city 
  FROM 
    lead_company 
  WHERE 
    uuid_company = $1  AND owner_id = $2
    `;

  const companyAddressDetail = await PostgresHelper.execQuery<ICompanyAddress[]>(client, query, [uuidCompany, ownerId]);
  if (companyAddressDetail.length > 0) return companyAddressDetail;
  return [];
}

export async function getMemberFlow(client: Pool, flowName: string, ownerId: number): Promise<IUserRoleFlowDetail[]> {
  const query = `
  SELECT 
    u.username,
    u.profile_pic as "profilePic"
  FROM 
    usr u 
  LEFT JOIN 
   user_department_mapping uudm ON u.user_id=  uudm.user_id
  LEFT JOIN
    department_workflow_mapping dwm ON dwm.department_id = uudm.department_id
  WHERE 
    dwm.flow_id = (SELECT flow_id from workflow WHERE flow_name = $1 ) AND u.owner_id = $2
    `;
  const memberByFlow = await PostgresHelper.execQuery<IUserRoleFlowDetail[]>(client, query, [flowName, ownerId]);
  if (memberByFlow.length > 0) return memberByFlow;
  return [];
}
export async function getCountVerifyTaskDetail(client: Pool, uuidTask: string, ownerId: number): Promise<IVerifyRequiredField> {
  const queryAssign = `
  SELECT 
    count(*) 
  FROM 
    task_assign 
  WHERE
    task_id = (SELECT task_id FROM task WHERE uuid_task = $1) AND owner_id = $2
    `;
  const queryDeal = `
  SELECT 
    count(*)
  FROM 
    deal_task_mapping 
  WHERE 
    task_id = (SELECT task_id from task where uuid_task = $1) AND owner_id = $2
    `;
  const countAssign = await PostgresHelper.execQuery<number>(client, queryAssign, [uuidTask, ownerId]);
  const countDeal = await PostgresHelper.execQuery<number>(client, queryDeal, [uuidTask, ownerId]);
  const countVerify = { assignee: Number(countAssign[0].count), deal: Number(countDeal[0].count) };
  return countVerify;
}
export async function getUserDepartmentByUserId(client: Pool, userId: number, ownerId: number): Promise<[{ departmentId: string }]> {
  const query = `
  SELECT  
    department_id AS "departmentId"
  FROM 
    user_department_mapping 
  where user_id = $1
    `;

  const departmentId = await PostgresHelper.execQuery<[{ departmentId: string }]>(client, query, [userId]);
  return departmentId;
}
export async function getCountDetail(client: Pool, uuidTask: string, ownerId: number): Promise<ICountDetail[]> {
  const query = `
  SELECT 
    count(*),
    'note' AS countTable 
  FROM 
    "task_note" 
  WHERE 
    task_id  = (SELECT task_id from task where uuid_task = $1) AND owner_id = $2
  UNION 
  SELECT 
    count(*),
    'appointment' AS countTable
  FROM 
    "task_appointment"  
  WHERE 
    task_id = (SELECT task_id from task where uuid_task = $1) AND owner_id =$2
  `;
  const countNoteAppointByTask = await PostgresHelper.execQuery<ICountDetail[]>(client, query, [uuidTask, ownerId]);
  if (countNoteAppointByTask.length > 0) return countNoteAppointByTask;
  return [];
}

export async function getNextStateTask(client: Pool, uuidTask: string, ownerId: number): Promise<INextStateTask> {
  const queryConfigState = `
  SELECT 
    flow_id,
    priority 
  FROM 
    workflow_state sc
  WHERE 
    state_id = (SELECT state_id FROM task WHERE uuid_task =$1) AND owner_id =$2
  `;
  const taskConfigState = await PostgresHelper.execQuery<IStateConfigDetail>(client, queryConfigState, [uuidTask, ownerId]);
  const priorityState = taskConfigState[0].priority;
  const flowId = taskConfigState[0].flow_id;
  const queryNextState = `
  SELECT 
    state_name as statename,
    state_id as stateid,
    uuid_state as "uuidState" 
  FROM 
    workflow_state 
  WHERE 
     flow_id = $1 AND priority > $2 AND owner_id = $3
  ORDER BY 
    priority 
  LIMIT 1
  `;
  const nextStateTask = await PostgresHelper.execQuery<INextStateTask[]>(client, queryNextState, [flowId, priorityState, ownerId]);
  if (nextStateTask.length > 0) {
    return nextStateTask[0];
  } else {
    return { statename: 'end', stateid: 99 };
  }
}

export async function insertTaskByLead(client: Pool, insertTaskField: ITaskLeadInsert, ownerId: number, userId: number): Promise<{ taskId: number }> {
  const stateid = insertTaskField.stateId;
  const active = true;
  const dueDate = new Date();
  const updateDate = getUTCTimestamps();
  const query = `
  INSERT INTO task (
    title,
    company_id,
    state_id,
    due_date,
    owner_id,
    active,
    user_id,
    last_update) 
  VALUES 
    ($1,
    (SELECT company_id FROM lead_company WHERE uuid_company = $2),
    $3,
    $4,
    $5,
    $6,
    $7,
    $8)
  RETURNING 
    task_id AS "taskId";
  `;
  const taskIdList = await PostgresHelper.execQuery<[{ taskId: number }]>(client, query, [
    insertTaskField.title,
    insertTaskField.uuidCompany,
    stateid,
    dueDate,
    ownerId,
    active,
    userId,
    updateDate,
  ]);
  if (taskIdList.length > 0) return taskIdList[0];
  return null;
}
export async function deleteTagTask(client: Pool, tagId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
    DELETE FROM task_tag WHERE  tag_id = $1 AND owner_id = $2
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [tagId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function insertAttachementByNoteId(client: Pool, fileName: string, link: string, noteId: number, ownerId: number, filePath: string): Promise<string> {
  const query = `
  INSERT INTO task_note_attachment (
    attachment_name,
    attachment_link,
    attachment_path,
    note_id,
    owner_id) 
  VALUES 
    ($1,
    $2,
    $3,
    $4,
    $5)
  RETURNING
    uuid_attachment as "uuidAttachment";
  `;

  const uuidAttachment = await PostgresHelper.execQuery<[IUuidAttachment]>(client, query, [fileName, link, filePath, noteId, ownerId]);
  return uuidAttachment[0].uuidAttachment;
}
export async function getAttachmentByNoteId(client: Pool, noteId: number, ownerId: number): Promise<IAttachment[]> {
  const query = `
  SELECT 
    attachment_name as "attachmentName",
    attachment_link as "attachmentLink",
    attachment_path as "attachementPath",
    uuid_attachment as "uuidAttachment"
  FROM
    task_note_attachment 
  WHERE
    note_id =$1 AND owner_id =$2 
  `;
  const attachmentList = await PostgresHelper.execQuery<IAttachment[]>(client, query, [noteId, ownerId]);
  if (isEmpty(attachmentList)) {
    return [];
  }
  return attachmentList;
}
export async function getAttachmentByUuidAttachemnt(client: Pool, uuidAttachment: string, ownerId: number): Promise<IAttachment> {
  const query = `
  SELECT 
    attachment_name as "attachmentName",
    attachment_link as "attachmentLink",
    attachment_path as "attachementPath",
    uuid_attachment as "uuidAttachment"
  FROM
    task_note_attachment 
  WHERE
    uuid_attachment =$1 AND owner_id =$2 
  `;
  const attachmentList = await PostgresHelper.execQuery<IAttachment[]>(client, query, [uuidAttachment, ownerId]);
  if (isEmpty(attachmentList)) {
    return null;
  }
  return attachmentList[0];
}

export async function getWorkflowSetting(client: Pool, uuidState: number, ownerId: number): Promise<{ allow_to_delete_auto_card: boolean }> {
  const query = `
    SELECT 
      allow_to_delete_auto_card
    FROM
      workflow
    WHERE
      flow_id = (SELECT flow_id FROM workflow_state WHERE uuid_state = $1 ) 
      AND owner_id =$2 
    `;
  const allowToDeleteAutoCard = await PostgresHelper.execQuery<[{ allow_to_delete_auto_card: boolean }]>(client, query, [uuidState, ownerId]);
  if (isEmpty(allowToDeleteAutoCard)) {
    return null;
  }
  return allowToDeleteAutoCard[0];
}

export async function getAutoCreateByTaskUUID(client: Pool, uuidTask: string, ownerId: number): Promise<{ is_auto_create: boolean }> {
  const query = `
    SELECT 
      is_auto_create
    FROM
      task
    WHERE
      uuid_task = $1
      AND owner_id =$2 
    `;
  const isAutoCreate = await PostgresHelper.execQuery<[{ is_auto_create: boolean }]>(client, query, [uuidTask, ownerId]);
  if (isEmpty(isAutoCreate)) {
    return null;
  }
  return isAutoCreate[0];
}
export async function deleteAutoCreateByParentId(client: Pool, updateActiveTaskInput: ITaskUpdate, ownerId: number): Promise<IHTTPResult> {
  const { uuidTask } = updateActiveTaskInput;
  const activeTask = false;
  const query = `
  UPDATE 
    task
  SET 
    active = $1
  WHERE
    parent_task_id = (SELECT task_id FROM task WHERE uuid_task = $2) 
    AND owner_id =$3
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [activeTask, uuidTask, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function activeAutoCreateByParentId(client: Pool, childTask: number, ownerId: number): Promise<IHTTPResult> {
  const taks_id = childTask;
  const activeTask = true;
  const query = `
  UPDATE 
    task
  SET 
    active = $1
  WHERE
    task_id = $2
    AND owner_id =$3
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [activeTask, taks_id, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getChildTaskByparentId(client: Pool, insertTaskCross: IInsertTaskCross, ownerId: number): Promise<{ task_id: number }> {
  const { parentTaskUUID } = insertTaskCross;
  const query = `
  SELECT 
    task_id
  FROM
    task
  WHERE
    parent_task_id = (SELECT task_id FROM task WHERE uuid_task = $1) 
    AND owner_id =$2
    `;
  const taskId = await PostgresHelper.execQuery<[{ task_id: number }]>(client, query, [parentTaskUUID, ownerId]);
  if (isEmpty(taskId[0])) {
    return null;
  }
  return taskId[0];
}
export async function getAllUserInNewState(client: Pool, newState: number, ownerId: number): Promise<IUserDetail[]> {
  const query = `
  SELECT 
    username AS name ,
    profile_pic AS "profilePic"
  FROM
    usr us
  LEFT JOIN
    user_department_mapping uudm ON uudm.user_id = us.user_id
  LEFT JOIN
    department_workflow_mapping dwm ON dwm.department_id = uudm.department_id
  LEFT JOIN
    workflow_state ws on ws.flow_id = dwm.flow_id
  WHERE
    state_id = $1 
    AND us.owner_id =$2
    `;
  const allUserInWorkFlow = await PostgresHelper.execQuery<[IUserDetail]>(client, query, [newState, ownerId]);
  if (isEmpty(allUserInWorkFlow)) {
    return [];
  }
  return allUserInWorkFlow;
}
export async function insertAssigneeCrossTeam(client: Pool, assignee: string, taskId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
    INSERT INTO task_assign (
      user_id,
      task_id,
      owner_id) 
    VALUES (
      (SELECT user_id FROM usr WHERE username = $1),
      $2,
      $3);
      `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [assignee, taskId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getMoveToNextState(client: Pool, uuidState: string, ownerId: number): Promise<{ allowNextStateOnly: boolean }> {
  const query = `
  SELECT 
    allow_next_state_only as "allowNextStateOnly"
  FROM
    workflow wf
  LEFT JOIN
    workflow_state ws on ws.flow_id = wf.flow_id
  WHERE
    ws.uuid_state = $1
    AND ws.owner_id = $2
      `;

  const conditionAllowNextStateOnly = await PostgresHelper.execQuery<[{ allowNextStateOnly: boolean }]>(client, query, [uuidState, ownerId]);
  if (isEmpty(conditionAllowNextStateOnly)) {
    return null;
  }
  return conditionAllowNextStateOnly[0];
}

export async function getPriorityofStateByUuidState(client: Pool, uuidState: string, previousState: string, ownerId: number): Promise<IPriorityState[]> {
  const query = `
  SELECT 
    priority 
  FROM
    workflow_state 
  WHERE
    (uuid_state = $1 AND owner_id = $3)
    or (uuid_state= $2 AND owner_id = $3)
      `;
  const priorityOfState = await PostgresHelper.execQuery<[IPriorityState]>(client, query, [uuidState, previousState, ownerId]);
  return priorityOfState;
}

export async function getFirstStateIdFromWorkflow(client: Pool, flowname: string, ownerId: number): Promise<{ stateId: number }> {
  const query = `
  SELECT 
    state_id as "stateId"
  FROM
    workflow_state ws
  LEFT JOIN
    workflow wf ON wf.flow_id = ws.flow_id
  WHERE
    priority = 1  
    AND wf.owner_id = $2
    AND flow_name = $1
      `;
  const priorityOfState = await PostgresHelper.execQuery<[{ stateId: number }]>(client, query, [flowname, ownerId]);
  return priorityOfState[0];
}

export async function deleteAttachmentByNoteId(client: Pool, noteId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
  DELETE FROM
    task_note_attachment 
  WHERE
    note_id = $1  
    AND owner_id = $2
      `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [noteId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function deleteNoteTaskByNoteId(client: Pool, noteId: number, ownerId: number): Promise<IHTTPResult> {
  const query = `
  DELETE FROM
    task_note
  WHERE
    note_id = $1  
    AND owner_id = $2
      `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [noteId, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}

export async function updateNoteType(client: Pool, internalNote: IInternalNote, ownerId: number): Promise<IHTTPResult> {
  const isInternalNote = internalNote.isInternalNote;
  const uuidNote = internalNote.uuidNote;
  const query = `
  UPDATE 
    task_note
  SET 
    is_internal_note = $1
  WHERE
    uuid_note = $2
    AND owner_id =$3
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [isInternalNote, uuidNote, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function getUuidAppointmentByTask(client: Pool, uuidTask: string, ownerId: number): Promise<IUuidAppointment[]> {
  const query = `
  SELECT 
    uuid_appointment_task as "uuidAppointment"
  FROM
    task_appointment ta
  WHERE
    task_id = (SELECT task_id FROM task WHERE uuid_task = $1)
    AND owner_id = $2
      `;
  const uuidAppointmentList = await PostgresHelper.execQuery<[IUuidAppointment]>(client, query, [uuidTask, ownerId]);
  if (isEmpty(uuidAppointmentList)) {
    return [];
  }
  return uuidAppointmentList;
}
export async function updateAppointmentTaskFromGoogleCalendar(
  client: Pool,
  uuidAppointment: string,
  googleCalendar: IGoogleCalendarResponse,
  ownerId: number,
): Promise<IUuidAppointment[]> {
  const query = `
  UPDATE 
    task_appointment
  SET  
    appointment_start_date = $3,
    appointment_end_date = $4,
    note = $5
  WHERE 
    uuid_appointment_task = $1 AND owner_id = $2;
  `;
  const uuidAppointmentList = await PostgresHelper.execQuery<[IUuidAppointment]>(client, query, [
    uuidAppointment,
    ownerId,
    googleCalendar.startDate,
    googleCalendar.endDate,
    googleCalendar.noteDetail,
  ]);
  if (isEmpty(uuidAppointmentList)) {
    return [];
  }
  return uuidAppointmentList;
}
export async function updateDealDateForTask(client: Pool, dealDate: IDealDate, ownerId: number): Promise<IHTTPResult> {
  const startDate = dealDate.startDate;
  const endDate = dealDate.endDate;
  const uuidTask = dealDate.uuidTask;
  const query = `
  UPDATE 
    task
  SET 
    start_date = $1,
    end_date = $2
  WHERE
    uuid_task = $3
    AND owner_id =$4
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [startDate, endDate, uuidTask, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function updateProductAmountForTask(client: Pool, productAmount: IProductAmount, ownerId: number): Promise<IHTTPResult> {
  const product = productAmount.productAmount;
  const uuidTask = productAmount.uuidTask;
  const query = `
  UPDATE 
    task
  SET 
    product_amount = $1
  WHERE
    uuid_task = $2
    AND owner_id =$3
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [product, uuidTask, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
export async function updateMediaAmountForTask(client: Pool, mediaAmount: IMediaAmount, ownerId: number): Promise<IHTTPResult> {
  const media = mediaAmount.mediaAmount;
  const uuidTask = mediaAmount.uuidTask;
  const query = `
  UPDATE 
    task
  SET 
    media_amount = $1
  WHERE
    uuid_task = $2
    AND owner_id =$3
    `;
  try {
    await PostgresHelper.execQuery<IHTTPResult>(client, query, [media, uuidTask, ownerId]);
    return { status: 200, value: '' } as IHTTPResult;
  } catch (ex) {
    return { status: 403, value: ex } as IHTTPResult;
  }
}
