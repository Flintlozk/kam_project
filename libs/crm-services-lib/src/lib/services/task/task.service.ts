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
  INextStateTask,
  IAttachment,
  ICompanyContactUpdate,
  IInsertCompanyContactTask,
  IUpdateActiveTask,
  IConditionCross,
  ITaskLeadInsertInput,
  IStateCreateCondition,
  IAppointmentEdit,
  ResponseValue,
  INoteTaskUpdate,
  INoteTaskDelete,
  IUuidAttachment,
  IInternalNote,
  IDealDate,
  IProductAmount,
  IMediaAmount,
} from '@reactor-room/crm-models-lib';
import { CrmService } from '../crmservice.class';
import {
  getTaskByFlow,
  updateTaskById,
  getTaskDetailById,
  insertTagById,
  insertAppointmentTask,
  getTaskAssignByTeam,
  getNoteByTask,
  insertNoteTask,
  getContactTask,
  getAppointmentTask,
  getTagByTask,
  insertAssigneByTask,
  getTaskDealListByTask,
  insertTaskDealByTask,
  insertTaskCrossTeam,
  getCompanyAddress,
  updateTaskTitle,
  getMemberFlow,
  getCountDetail,
  getAllUser,
  insertTaskByLead,
  getNextStateTask,
  deleteTagTask,
  getAttachmentByNoteId,
  updateCompanyContact,
  insertCompanyContactTask,
  updateActiveTask,
  getConditionInsertCross,
  insertAssigneByTaskId,
  insertAppointmentTaskById,
  insertNoteTaskByTaskId,
  deleteAutoCreateByParentId,
  activeAutoCreateByParentId,
  getChildTaskByparentId,
  insertAssigneeCrossTeam,
  insertUserAsAssigneeByTaskId,
  deleteAppointmentTask,
  editAppointmentTask,
  updateNoteTask,
  getNoteIdByUuidNote,
  deleteAttachmentByNoteId,
  deleteNoteTaskByNoteId,
  deleteAttachment,
  getAttachmentByUuidAttachemnt,
  insertAttachementByNoteId,
  getflowIdFromUuidNote,
  updateNoteType,
  getUuidAppointmentByTask,
  getCalendarDetailByAppointmentUuid,
  updateAppointmentTaskFromGoogleCalendar,
  updateDealDateForTask,
  updateProductAmountForTask,
  updateMediaAmountForTask,
} from '../../data/task/task.data';
import { IGQLFileSteam } from '@reactor-room/crm-models-lib';
import { IGoogleCredential, IHTTPResult } from '@reactor-room/model-lib';
import { deleteFileOfS3Bucket, getMetaDataFromObject, uploadFileToMinio } from '../../data/files';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { changeStatusActiveLeadByCompanyId, changeStatusInActiveLeadByCompanyId } from '../../data/lead';
import {
  deleteCalendarInGoogleCalendar,
  editCalendarInGoogleCalendar,
  getCalendarInGoogleCalendar,
  insertCalendarInGoogleCalendar,
} from '../../data/googlecalendar/googlecalendar.data';
import { getDeleteAutoCreateTask } from '../../domains';

export class TaskService {
  constructor() {}

  public static getTaskByFlow = async (flowId: string, ownerId: number, userId: number): Promise<ITaskDetail[]> => {
    return await getTaskByFlow(CrmService.readerClient, flowId, ownerId, userId);
  };

  public static updateTaskById = async (updateTaskField: ITaskUpdate, ownerId: number, taskCreateConditions: IStateCreateCondition[], userId: number): Promise<IHTTPResult> => {
    const deleteAutoCreate = getDeleteAutoCreateTask(taskCreateConditions, updateTaskField);
    if (deleteAutoCreate) {
      await deleteAutoCreateByParentId(CrmService.writerClient, updateTaskField, ownerId);
    }
    // const appprove = conditionsTaskByPreviousState.filter((ApproveCondition) => ApproveCondition.actionType === StateActionType.APPROVE);
    // if (appprove.length > 0) {
    //   const userDepartment = await getUserDepartmentByUserId(CrmService.readerClient, userId, ownerId);
    //   const deparmentId = userDepartment.map((element) => parseInt(element.departmentId, 10));
    //   if (!deparmentId.includes(appprove[0]?.value)) {
    //     throw Error(ResponseValue.DEPARTMENT_HAVE_NO_PERMISSION);
    //   }
    // }
    return await updateTaskById(CrmService.writerClient, updateTaskField, ownerId, updateTaskField.statusCreate);
  };

  public static insertTagById = async (insertTagField: ITagInsert, ownerId: number): Promise<IHTTPResult> => {
    return await insertTagById(CrmService.writerClient, insertTagField, ownerId);
  };

  public static insertAppointmentTask = async (
    insertAppointmentField: IAppointmentInsert,
    ownerId: number,
    userId: number,
    credential: IGoogleCredential,
    url: string,
    client_id: string,
    client_secret: string,
  ): Promise<IHTTPResult> => {
    const googleData = await insertCalendarInGoogleCalendar(credential, insertAppointmentField, url, client_id, client_secret);
    return await insertAppointmentTask(CrmService.writerClient, insertAppointmentField, ownerId, userId, googleData);
  };
  public static deleteAppointmentTask = async (
    uuidAppointment: string,
    ownerId: number,
    credential: IGoogleCredential,
    client_id: string,
    client_secret: string,
  ): Promise<IHTTPResult> => {
    const calendarId = await getCalendarDetailByAppointmentUuid(CrmService.readerClient, uuidAppointment, ownerId);
    const httpResult = await deleteAppointmentTask(CrmService.writerClient, uuidAppointment, ownerId);
    await deleteCalendarInGoogleCalendar(credential, calendarId.calendarId, client_id, client_secret);
    return httpResult;
  };
  public static editAppointmentTask = async (
    editAppointmentField: IAppointmentEdit,
    ownerId: number,
    userId: number,
    credential: IGoogleCredential,
    url: string,
    client_id: string,
    client_secret: string,
  ): Promise<IHTTPResult> => {
    const calendarDetail = await getCalendarDetailByAppointmentUuid(CrmService.readerClient, editAppointmentField.uuidAppointment, ownerId);
    await editCalendarInGoogleCalendar(credential, editAppointmentField, calendarDetail, url, client_id, client_secret);
    return await editAppointmentTask(CrmService.writerClient, editAppointmentField, ownerId, userId);
  };

  public static getTaskDetailById = async (uuidTask: string, ownerId: number): Promise<ITaskDetail> => {
    return await getTaskDetailById(CrmService.readerClient, uuidTask, ownerId);
  };

  public static getNoteByTask = async (uuidTask: string, ownerId: number): Promise<INoteTask[]> => {
    return await getNoteByTask(CrmService.readerClient, uuidTask, ownerId);
  };

  public static getTagTask = async (taskId: string, ownerId: number): Promise<ITagTask[]> => {
    return await getTagByTask(CrmService.readerClient, taskId, ownerId);
  };

  public static insertAssignTask = async (insertAssignField: IInsertTaskAssign, ownerId: number): Promise<IHTTPResult> => {
    return await insertAssigneByTask(CrmService.writerClient, insertAssignField, ownerId);
  };

  public static getTaskAssignByTeam = async (uuidTask: string, ownerId: number): Promise<ITaskAssignDetail[]> => {
    return await getTaskAssignByTeam(CrmService.readerClient, uuidTask, ownerId);
  };

  public static insertNoteTask = async (
    insertNoteField: INoteTaskInsert,
    ownerId: number,
    userId: number,
    files: IGQLFileSteam[],
    production: boolean,
    minioStorage: string,
  ): Promise<IHTTPResult[]> => {
    const httpReusltList = [];
    const noteId = await insertNoteTask(CrmService.writerClient, insertNoteField, ownerId, userId);
    for (const file of files) {
      const uploadResponse = await uploadFileToMinio(file.file, noteId.noteId, noteId.uuidNote, production, ownerId, userId, minioStorage);
      if (uploadResponse.status === 200) {
        const uuidAttachment = await insertAttachementByNoteId(
          CrmService.readerClient,
          uploadResponse.values.fileName,
          uploadResponse.values.fileUrl,
          noteId.noteId,
          ownerId,
          uploadResponse.values.filePath,
        );
        const httpResult = { status: 200, value: uploadResponse.values.fileUrl + ' ' + uuidAttachment };
        httpReusltList.push(httpResult);
      }
    }
    const uuidNoteHttpResult = { status: 200, value: noteId.uuidNote } as IHTTPResult;
    httpReusltList.push(uuidNoteHttpResult);
    return httpReusltList;
  };
  public static updateNoteTask = async (updateNoteField: INoteTaskUpdate, ownerId: number): Promise<IHTTPResult> => {
    const flowObject = await getflowIdFromUuidNote(CrmService.writerClient, updateNoteField.uuidNote, ownerId);
    if (flowObject.flowId !== updateNoteField.flowId) {
      throw Error(ResponseValue.CANNOT_EDIT_SHARING_NOTE);
    }
    return await updateNoteTask(CrmService.writerClient, updateNoteField, ownerId);
  };
  public static deleteAttachment = async (uuidAttachment: IUuidAttachment, ownerId: number, userId: number): Promise<IHTTPResult> => {
    const attachfiles = await getAttachmentByUuidAttachemnt(CrmService.readerClient, uuidAttachment.uuidAttachment, ownerId);
    const metaData = await getMetaDataFromObject(CrmService.s3Bucket, 'linestorage-staging', attachfiles.attachementPath);
    if (metaData.userid === userId) {
      await deleteFileOfS3Bucket(CrmService.s3Bucket, 'linestorage-staging', attachfiles.attachementPath);
      await deleteAttachment(CrmService.writerClient, uuidAttachment.uuidAttachment, ownerId);
    } else {
      throw Error(ResponseValue.CANNOT_DELETE_ATTACHMENT);
    }
    return { status: 200, value: '' } as IHTTPResult;
  };
  public static deleteNoteTask = async (deleteNoteTask: INoteTaskDelete, ownerId: number, userId: number): Promise<IHTTPResult> => {
    const noteId = await getNoteIdByUuidNote(CrmService.readerClient, deleteNoteTask.uuidNote, ownerId);
    if (noteId.flowId !== deleteNoteTask.flowId) {
      throw new Error(ResponseValue.CANNOT_DELETE_SHARING_NOTE);
    }
    const attachfiles = await getAttachmentByNoteId(CrmService.readerClient, noteId.noteId, ownerId);
    const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
    if (attachfiles.length > 0) {
      const metaData = await getMetaDataFromObject(CrmService.s3Bucket, 'linestorage-staging', attachfiles[0].attachementPath);
      const allowToDelete = metaData.userid === userId;
      if (allowToDelete) {
        attachfiles.forEach(async (attatchment) => {
          await deleteFileOfS3Bucket(CrmService.s3Bucket, 'linestorage-staging', attatchment.attachementPath);
          await deleteAttachmentByNoteId(client, noteId.noteId, ownerId);
        });
      } else {
        throw Error(ResponseValue.CANNOT_DELETE_ATTACHMENT);
      }
    }
    await deleteNoteTaskByNoteId(client, noteId.noteId, ownerId);
    await PostgresHelper.execBatchCommitTransaction(client);
    return { status: 200, value: '' } as IHTTPResult;
  };
  public static getContactTask = async (companyId: string, ownerId: number): Promise<IContactTask[]> => {
    return await getContactTask(CrmService.readerClient, companyId, ownerId);
  };

  public static getAppointmentTask = async (
    uuidTask: string,
    ownerId: number,
    credential: IGoogleCredential,
    url: string,
    client_id: string,
    client_secret: string,
  ): Promise<IAppointmentTask[]> => {
    const uuidAppointmentList = await getUuidAppointmentByTask(CrmService.writerClient, uuidTask, ownerId);
    for (const uuidAppointmentObject of uuidAppointmentList) {
      const calendarDetail = await getCalendarDetailByAppointmentUuid(CrmService.readerClient, uuidAppointmentObject.uuidAppointment, ownerId);
      const googleCalendarResponse = await getCalendarInGoogleCalendar(credential, calendarDetail, url, client_id, client_secret);
      await updateAppointmentTaskFromGoogleCalendar(CrmService.writerClient, uuidAppointmentObject.uuidAppointment, googleCalendarResponse, ownerId);
    }
    return await getAppointmentTask(CrmService.readerClient, uuidTask, ownerId);
  };

  public static getTaskDealListByTask = async (uuidTask: string, ownerId: number): Promise<ITaskDealList[]> => {
    return await getTaskDealListByTask(CrmService.readerClient, uuidTask, ownerId);
  };
  public static insertTaskDealByTask = async (insertTaskDealField: ITaskDealInsert, ownerId: number): Promise<IHTTPResult> => {
    return await insertTaskDealByTask(CrmService.writerClient, insertTaskDealField, ownerId);
  };

  public static insertTaskCrossTeam = async (insertTaskCrossField: IInsertTaskCross, ownerId: number): Promise<IHTTPResult> => {
    const childTask = await getChildTaskByparentId(CrmService.readerClient, insertTaskCrossField, ownerId);
    if (childTask) {
      return await activeAutoCreateByParentId(CrmService.writerClient, childTask.task_id, ownerId);
    }
    const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
    const taskId = await insertTaskCrossTeam(client, insertTaskCrossField, ownerId);
    const { assignee } = insertTaskCrossField;
    assignee.forEach(async (user) => {
      await insertAssigneeCrossTeam(client, user, taskId.taskId, ownerId);
    });
    await PostgresHelper.execBatchCommitTransaction(client);
    return { status: 200, value: '' } as IHTTPResult;
  };

  public static getAllUser = async (ownerId: number): Promise<IContactTask[]> => {
    return await getAllUser(CrmService.readerClient, ownerId);
  };

  public static getCompanyAddress = async (uuidCompany: string, ownerId: number): Promise<ICompanyAddress[]> => {
    return await getCompanyAddress(CrmService.readerClient, uuidCompany, ownerId);
  };

  public static updateTaskTitle = async (updateTaskTitleField: IUpdateTaskTitle, ownerId: number): Promise<IHTTPResult> => {
    return await updateTaskTitle(CrmService.writerClient, updateTaskTitleField, ownerId);
  };

  public static getMemberFlow = async (flowName: string, ownerId: number): Promise<IUserRoleFlowDetail[]> => {
    return await getMemberFlow(CrmService.readerClient, flowName, ownerId);
  };

  public static getCountDetail = async (uuidTask: string, ownerId: number): Promise<ICountDetail[]> => {
    return await getCountDetail(CrmService.readerClient, uuidTask, ownerId);
  };
  public static insertTaskByLead = async (
    aliases: ITaskLeadInsertInput,
    ownerId: number,
    user: number,
    userId: number,
    production: boolean,
    minioStorage: string,
  ): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
    const taskId = await insertTaskByLead(client, aliases.message, ownerId, userId);
    await changeStatusInActiveLeadByCompanyId(client, aliases.message, ownerId);
    const files = aliases.files;
    await insertUserAsAssigneeByTaskId(client, user, taskId, ownerId);
    for (const assignee of aliases.message.allAssignee) {
      await insertAssigneByTaskId(client, assignee, taskId, ownerId);
    }
    for (const appointment of aliases.message.appointmentTask) {
      await insertAppointmentTaskById(client, appointment, ownerId, userId, taskId);
    }
    for (const note of aliases.message.noteTask) {
      const noteId = await insertNoteTaskByTaskId(client, note, ownerId, userId, taskId);
      for (const index of note.attachmentsIndex) {
        const httpResult = await uploadFileToMinio(files[index], noteId.noteId, noteId.uuidNote, production, ownerId, userId, minioStorage);
        if (httpResult.status === 200) {
          await insertAttachementByNoteId(CrmService.readerClient, httpResult.values.fileName, httpResult.values.fileUrl, noteId.noteId, ownerId, httpResult.values.filePath);
        }
      }
    }
    await PostgresHelper.execBatchCommitTransaction(client);
    return { status: 200, value: '' } as IHTTPResult;
  };
  public static getNextStateTask = async (uuidTask: string, ownerId: number): Promise<INextStateTask> => {
    return await getNextStateTask(CrmService.readerClient, uuidTask, ownerId);
  };
  public static deleteTagTask = async (tagId: number, ownerId: number): Promise<IHTTPResult> => {
    return await deleteTagTask(CrmService.writerClient, tagId, ownerId);
  };
  public static getAttachmentByNoteId = async (noteId: number, ownerId: number): Promise<IAttachment[]> => {
    return await getAttachmentByNoteId(CrmService.readerClient, noteId, ownerId);
  };
  public static updateCompanyContact = async (updateCompanyContactDetail: ICompanyContactUpdate, ownerId: number): Promise<IHTTPResult> => {
    return await updateCompanyContact(CrmService.writerClient, updateCompanyContactDetail, ownerId);
  };
  public static insertCompanyContactTask = async (insertCompanyContact: IInsertCompanyContactTask, ownerId: number): Promise<IHTTPResult> => {
    return await insertCompanyContactTask(CrmService.writerClient, insertCompanyContact, ownerId);
  };
  public static updateActiveTask = async (updateActiveTaskInput: IUpdateActiveTask, ownerId: number): Promise<IHTTPResult> => {
    await changeStatusActiveLeadByCompanyId(CrmService.writerClient, updateActiveTaskInput, ownerId);
    return await updateActiveTask(CrmService.writerClient, updateActiveTaskInput, ownerId);
  };
  public static getConditionInsertCross = async (ownerId: number): Promise<IConditionCross[]> => {
    return await getConditionInsertCross(CrmService.readerClient, ownerId);
  };
  public static updateNoteType = async (internalNote: IInternalNote, ownerId: number): Promise<IHTTPResult> => {
    return await updateNoteType(CrmService.readerClient, internalNote, ownerId);
  };
  public static updateDealDateForTask = async (dealDate: IDealDate, ownerId: number): Promise<IHTTPResult> => {
    return await updateDealDateForTask(CrmService.readerClient, dealDate, ownerId);
  };
  public static updateProductAmountForTask = async (productAmount: IProductAmount, ownerId: number): Promise<IHTTPResult> => {
    return await updateProductAmountForTask(CrmService.readerClient, productAmount, ownerId);
  };
  public static updateMediaAmountForTask = async (mediaAmount: IMediaAmount, ownerId: number): Promise<IHTTPResult> => {
    return await updateMediaAmountForTask(CrmService.readerClient, mediaAmount, ownerId);
  };
}
