import {
  IFilterByTaskId,
  ITaskDetail,
  ITaskFilter,
  ITaskAssign,
  INoteTask,
  IContactTask,
  IAppointmentTask,
  ITagTask,
  ITaskDealList,
  ICompanyAddress,
  IUserRoleFlowDetail,
  ICountDetail,
  IArgFlowName,
  ITaskAssignDetail,
  INextStateTask,
  EnumAuthScope,
  EnumFeatureScope,
  INoteId,
  IAttachment,
  IArgUpdateCompanyContact,
  IArgCompanyContactInsert,
  IConditionCross,
} from '@reactor-room/crm-models-lib';
import type {
  IGQLContext,
  IArgTaskUpdate,
  IArgAppointmentInsert,
  IArgInsertTaskAssign,
  IArgInsertTaskCross,
  IArgNoteTaskInsert,
  IArgTagInsert,
  IArgTaskDealInsert,
  IArgUpdateTaskTitle,
  IContactTaskFilter,
  ITaskLeadInsertInput,
  IArgUpdateActiveTask,
  ITagFilter,
  IUuidAppointment,
  IArgAppointmentEdit,
  IArgNoteTaskUpdate,
  IArgNoteTaskDelete,
  IUuidAttachment,
  IInternalNoteArg,
  IDealDateArg,
  IMediaAmountArg,
  IProductAmountArg,
} from '@reactor-room/crm-models-lib';
import { TaskService } from '@reactor-room/crm-services-lib';
import { graphQLHandler } from '../graphql-handler';
import {
  validateCompanyIdRequest,
  validateDeleteappointMentRequest,
  validateDeleteAttachmentRequest,
  validateDeleteNoteTaskRequest,
  validateEditappointMentRequest,
  validateFlowNameRequest,
  validateGetTaskByFlowRequest,
  validateInsertappointMentRequest,
  validateInsertAssignTaskRequest,
  validateInsertCompanyContactTask,
  validateInsertNoteTaskRequest,
  validateInsertTagRequest,
  validateInsertTaskCrossRequest,
  validateInsertTaskDealRequest,
  validateRequestNoteId,
  validateRequestTagId,
  validateResponAttachementNote,
  validateResponseAllUserArrayk,
  validateResponseAppointmentArray,
  validateResponseCompanyAddressrArray,
  validateResponseConditionInsertCross,
  validateResponseContactTaskArray,
  validateResponseCountDetailArray,
  validateResponseMemberFlowArray,
  validateResponseNextStateTask,
  validateResponseNoteTaskArray,
  validateResponseTagTaskArray,
  validateResponseTaskArray,
  validateResponseTaskAssign,
  validateResponseTaskDealArray,
  validateResponseTaskDetailArray,
  validateUpdateActiveTask,
  validateUpdateCompanyContactTask,
  validateUpdateDealDateForTaskRequest,
  validateUpdateMediaAmountForTaskRequest,
  validateUpdateNoteTaskRequest,
  validateUpdateNoteTypeRequest,
  validateUpdateProductAmountForTaskRequest,
  validateUpdateTaskStateRequest,
  validateUpdateTaskTitleRequest,
  validateUuidTaskRequest,
} from '../../schema/task/task.schema';
import { IHTTPResult } from '@reactor-room/crm-models-lib';
import { validateResponseHTTPArray, validateResponseHTTPObject } from '../../schema/common';
import { environment } from '../../environments/environment';
import { requireDeleteTaskPermission, requireFeature, requireScope, requireTargetState, requireUpdateTaskPermission } from '../../domains/auth.domain';

@requireScope([EnumAuthScope.MEMBER, EnumAuthScope.ADMIN])
class Task {
  public static instance;
  public static Task: Task;
  public static getInstance() {
    if (!Task.instance) Task.instance = new Task();
    return Task.instance;
  }

  async getTaskByFlowHandler(parent, args: ITaskFilter, context: IGQLContext): Promise<ITaskDetail[]> {
    const { flowId } = validateGetTaskByFlowRequest(args);
    const taskList = await TaskService.getTaskByFlow(flowId, context.payload.userLoginData.ownerId, context.payload.userLoginData.userId);
    return taskList;
  }

  async getTaskDetailByIdHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<ITaskDetail> {
    const { uuidTask } = validateUuidTaskRequest(args);
    const taskDetail = await TaskService.getTaskDetailById(uuidTask, context.payload.userLoginData.ownerId);
    taskDetail.myProfilePic = context.payload.userLoginData.profilePic;
    taskDetail.myName = context.payload.userLoginData.username;
    return taskDetail;
  }

  async getTaskAssignByTeamHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<ITaskAssignDetail[]> {
    const { uuidTask } = validateUuidTaskRequest(args);
    const taskAssignByTeam = await TaskService.getTaskAssignByTeam(uuidTask, context.payload.userLoginData.ownerId);
    return taskAssignByTeam;
  }

  async getNoteByTaskHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<INoteTask[]> {
    const { uuidTask } = validateUuidTaskRequest(args);
    const noteByTask = await TaskService.getNoteByTask(uuidTask, context.payload.userLoginData.ownerId);

    return noteByTask;
  }

  async getContactTaskHandler(parent, args: IContactTaskFilter, context: IGQLContext): Promise<IContactTask[]> {
    const { companyId } = validateCompanyIdRequest(args);
    const companyContact = await TaskService.getContactTask(companyId, context.payload.userLoginData.ownerId);
    return companyContact;
  }

  async getAppointmentTaskHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<IAppointmentTask[]> {
    const { uuidTask } = validateUuidTaskRequest(args);
    return await TaskService.getAppointmentTask(
      uuidTask,
      context.payload.userLoginData.ownerId,
      context.payload.credential,
      environment.url,
      environment.client_id,
      environment.client_secret,
    );
  }

  async getTagTaskHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<ITagTask[]> {
    const { uuidTask } = validateUuidTaskRequest(args);
    return await TaskService.getTagTask(uuidTask, context.payload.userLoginData.ownerId);
  }
  @requireUpdateTaskPermission()
  async updateTaskByIdHandler(parent, args: IArgTaskUpdate, context: IGQLContext): Promise<IHTTPResult> {
    if (!args.message.updateCross) {
      return { status: 100, value: args.message.updateCrossRequired };
    }
    const taskUpdateInput = validateUpdateTaskStateRequest(args.message);
    return await TaskService.updateTaskById(taskUpdateInput, context.payload.userLoginData.ownerId, context.payload.taskCreateCondition, context.payload.userLoginData.userId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async insertTagByIdHandler(parent, args: IArgTagInsert, context: IGQLContext): Promise<IHTTPResult> {
    const tagInsertInput = validateInsertTagRequest(args.message);
    return await TaskService.insertTagById(tagInsertInput, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async insertAppointmentTaskHandler(parent, args: IArgAppointmentInsert, context: IGQLContext): Promise<IHTTPResult> {
    const appointmentInsertInput = validateInsertappointMentRequest(args.message);
    return await TaskService.insertAppointmentTask(
      appointmentInsertInput,
      context.payload.userLoginData.ownerId,
      context.payload.userLoginData.userId,
      context.payload.credential,
      environment.url,
      environment.client_id,
      environment.client_secret,
    );
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async editAppointmentTaskHandler(parent, args: IArgAppointmentEdit, context: IGQLContext): Promise<IHTTPResult> {
    const appointmentEditInput = validateEditappointMentRequest(args.message);
    return await TaskService.editAppointmentTask(
      appointmentEditInput,
      context.payload.userLoginData.ownerId,
      context.payload.userLoginData.userId,
      context.payload.credential,
      environment.url,
      environment.client_id,
      environment.client_secret,
    );
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async deleteAppointmentTaskHandler(parent, args: IUuidAppointment, context: IGQLContext): Promise<IHTTPResult> {
    const { uuidAppointment } = validateDeleteappointMentRequest(args);
    return await TaskService.deleteAppointmentTask(
      uuidAppointment,
      context.payload.userLoginData.ownerId,
      context.payload.credential,
      environment.client_id,
      environment.client_secret,
    );
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async insertNoteTaskHandler(parent, args: IArgNoteTaskInsert, context: IGQLContext): Promise<IHTTPResult[]> {
    const noteTaskInsertInput = validateInsertNoteTaskRequest(args.message);
    return await TaskService.insertNoteTask(
      noteTaskInsertInput,
      context.payload.userLoginData.ownerId,
      context.payload.userLoginData.userId,
      args.files,
      environment.production,
      environment.minioStorage,
    );
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async insertAssignTaskHandler(parent, args: IArgInsertTaskAssign, context: IGQLContext): Promise<IHTTPResult> {
    const taskAssignInsertInput = validateInsertAssignTaskRequest(args.message);
    return await TaskService.insertAssignTask(taskAssignInsertInput, context.payload.userLoginData.ownerId);
  }
  async getTaskDealListByTaskHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<ITaskDealList[]> {
    const { uuidTask } = validateUuidTaskRequest(args);
    return await TaskService.getTaskDealListByTask(uuidTask, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATEDEAL])
  async insertTaskDealByTaskHandler(parent, args: IArgTaskDealInsert, context: IGQLContext): Promise<IHTTPResult> {
    const taskDealInsertInput = validateInsertTaskDealRequest(args.message);
    return await TaskService.insertTaskDealByTask(taskDealInsertInput, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async insertTaskCrossTeamHandler(parent, args: IArgInsertTaskCross, context: IGQLContext): Promise<IHTTPResult> {
    const taskCrossInsertInput = validateInsertTaskCrossRequest(args.message);
    return await TaskService.insertTaskCrossTeam(taskCrossInsertInput, context.payload.userLoginData.ownerId);
  }

  async getAllUserHandler(parent, args: IContactTaskFilter, context: IGQLContext): Promise<IContactTask[]> {
    return await TaskService.getAllUser(context.payload.userLoginData.ownerId);
  }

  async getCompanyAddressHandler(parent, args: IContactTaskFilter, context: IGQLContext): Promise<ICompanyAddress[]> {
    const { companyId } = validateCompanyIdRequest(args);
    return await TaskService.getCompanyAddress(companyId, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async UpdateTaskTitleHandler(parent, args: IArgUpdateTaskTitle, context: IGQLContext): Promise<IHTTPResult> {
    const UpdateTaskTitleInput = validateUpdateTaskTitleRequest(args.message);
    return await TaskService.updateTaskTitle(UpdateTaskTitleInput, context.payload.userLoginData.ownerId);
  }

  async getMemberFlowHandler(parent, args: IArgFlowName, context: IGQLContext): Promise<IUserRoleFlowDetail[]> {
    const { flowName } = validateFlowNameRequest(args);
    return await TaskService.getMemberFlow(flowName, context.payload.userLoginData.ownerId);
  }

  async getCountDetailHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<ICountDetail[]> {
    const { uuidTask } = validateUuidTaskRequest(args);
    return await TaskService.getCountDetail(uuidTask, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  @requireTargetState()
  async insertTaskByLeadHandler(parent, args: ITaskLeadInsertInput, context: IGQLContext): Promise<IHTTPResult> {
    return await TaskService.insertTaskByLead(
      args,
      context.payload.userLoginData.ownerId,
      context.payload.userLoginData.userId,
      context.payload.userLoginData.userId,
      environment.production,
      environment.minioStorage,
    );
  }
  async getNextStateTaskHandler(parent, args: IFilterByTaskId, context: IGQLContext): Promise<INextStateTask> {
    const { uuidTask } = validateUuidTaskRequest(args);
    const nextStatetask = await TaskService.getNextStateTask(uuidTask, context.payload.userLoginData.ownerId);
    return nextStatetask;
  }
  async deleteTagTaskHandler(parent, args: ITagFilter, context: IGQLContext): Promise<IHTTPResult> {
    const { tagId } = validateRequestTagId(args);
    return await TaskService.deleteTagTask(tagId, context.payload.userLoginData.ownerId);
  }
  async getAttachmentByNoteIdHandler(parent, args: INoteId, context: IGQLContext): Promise<IAttachment[]> {
    const { noteId } = validateRequestNoteId(args);
    return await TaskService.getAttachmentByNoteId(noteId, context.payload.userLoginData.ownerId);
  }
  async updateCompanyContactHandler(parent, args: IArgUpdateCompanyContact, context: IGQLContext): Promise<IHTTPResult> {
    const updateCompanyContactInput = validateUpdateCompanyContactTask(args.message);
    return await TaskService.updateCompanyContact(updateCompanyContactInput, context.payload.userLoginData.ownerId);
  }
  async insertCompanyContactTaskHandler(parent, args: IArgCompanyContactInsert, context: IGQLContext): Promise<IHTTPResult> {
    const insertCompanyContactInput = validateInsertCompanyContactTask(args.message);
    return await TaskService.insertCompanyContactTask(insertCompanyContactInput, context.payload.userLoginData.ownerId);
  }
  @requireDeleteTaskPermission()
  async updateActiveTaskHandler(parent, args: IArgUpdateActiveTask, context: IGQLContext): Promise<IHTTPResult> {
    const updateActiveTaskInput = validateUpdateActiveTask(args.message);
    return await TaskService.updateActiveTask(updateActiveTaskInput, context.payload.userLoginData.ownerId);
  }
  async getConditionInsertCrossHandler(parent, args: IArgUpdateActiveTask, context: IGQLContext): Promise<IConditionCross[]> {
    return await TaskService.getConditionInsertCross(context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async updateNoteTaskTaskHandler(parent, args: IArgNoteTaskUpdate, context: IGQLContext): Promise<IHTTPResult> {
    const noteTaskInsertInput = validateUpdateNoteTaskRequest(args.message);
    return await TaskService.updateNoteTask(noteTaskInsertInput, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async deleteNoteTaskHandler(parent, args: IArgNoteTaskDelete, context: IGQLContext): Promise<IHTTPResult> {
    const noteTaskInsertInput = validateDeleteNoteTaskRequest(args.message);
    return await TaskService.deleteNoteTask(noteTaskInsertInput, context.payload.userLoginData.ownerId, context.payload.userLoginData.userId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async deleteAttachmentHandler(parent, args: IUuidAttachment, context: IGQLContext) {
    const uuidAttachment = validateDeleteAttachmentRequest(args);
    return await TaskService.deleteAttachment(uuidAttachment, context.payload.userLoginData.ownerId, context.payload.userLoginData.userId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async updateNoteTypeHandler(parent, args: IInternalNoteArg, context: IGQLContext) {
    const isInternalNote = validateUpdateNoteTypeRequest(args.message);
    return await TaskService.updateNoteType(isInternalNote, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async updateDealDateForTaskHandler(parent, args: IDealDateArg, context: IGQLContext) {
    const dealDate = validateUpdateDealDateForTaskRequest(args.message);
    return await TaskService.updateDealDateForTask(dealDate, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async updateProductAmountForTaskHandler(parent, args: IProductAmountArg, context: IGQLContext) {
    const productAmount = validateUpdateProductAmountForTaskRequest(args.message);
    return await TaskService.updateProductAmountForTask(productAmount, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.CREATETASK])
  async updateMediaAmountForTaskHandler(parent, args: IMediaAmountArg, context: IGQLContext) {
    const mediaAmount = validateUpdateMediaAmountForTaskRequest(args.message);
    return await TaskService.updateMediaAmountForTask(mediaAmount, context.payload.userLoginData.ownerId);
  }
}

const task: Task = Task.getInstance();

export const taskResolver = {
  getTaskDetailById: {
    assignee(parent: ITaskDetail, args, context: IGQLContext): Promise<ITaskAssign[]> {
      return taskResolver.Query.getTaskAssignByTeam(parent, { uuidTask: parent.uuidTask }, context);
    },
    noteTask(parent: ITaskDetail, args, context: IGQLContext): Promise<INoteTask[]> {
      return taskResolver.Query.getNoteByTask(parent, { uuidTask: parent.uuidTask }, context);
    },
    contactTask(parent: ITaskDetail, args, context: IGQLContext): Promise<IContactTask[]> {
      return taskResolver.Query.getContactTask(parent, { companyId: parent.uuidCompany }, context);
    },
    appointmentTask(parent: ITaskDetail, args, context: IGQLContext): Promise<IAppointmentTask[]> {
      return taskResolver.Query.getAppointmentTask(parent, { uuidTask: parent.uuidTask }, context);
    },
    taskDeal(parent: ITaskDetail, args, context: IGQLContext): Promise<ITaskDealList[]> {
      return taskResolver.Query.getTaskDealListByTask(parent, { uuidTask: parent.uuidTask }, context);
    },
    getAllUser(parent: ITaskDetail, args, context: IGQLContext): Promise<ITaskDealList[]> {
      return taskResolver.Query.getAllUser(parent, { companyId: parent.uuidCompany }, context);
    },
    companyAddress(parent: ITaskDetail, args, context: IGQLContext): Promise<ICompanyAddress[]> {
      return taskResolver.Query.getCompanyAddress(parent, { companyId: parent.uuidCompany }, context);
    },
    nextStateTask(parent: ITaskDetail, args, context: IGQLContext): Promise<INextStateTask> {
      return taskResolver.Query.getNextStateTask(parent, { uuidTask: parent.uuidTask }, context);
    },
  },
  getTaskByFlow: {
    tagTask(parent: ITaskDetail, args, context: IGQLContext): Promise<ITagTask[]> {
      return taskResolver.Query.getTagTask(parent, { uuidTask: parent.uuidTask }, context);
    },
    assignee(parent: ITaskDetail, args, context: IGQLContext): Promise<ITaskAssignDetail[]> {
      return taskResolver.Query.getTaskAssignByTeam(parent, { uuidTask: parent.uuidTask }, context);
    },
    noteTask(parent: ITaskDetail, args, context: IGQLContext): Promise<INoteTask[]> {
      return taskResolver.Query.getNoteByTask(parent, { uuidTask: parent.uuidTask }, context);
    },
    appointmentTask(parent: ITaskDetail, args, context: IGQLContext): Promise<IAppointmentTask[]> {
      return taskResolver.Query.getAppointmentTask(parent, { uuidTask: parent.uuidTask }, context);
    },
    countDetail(parent: ITaskDetail, args, context: IGQLContext): Promise<ICountDetail[]> {
      return taskResolver.Query.getCountDetail(parent, { uuidTask: parent.uuidTask }, context);
    },
  },
  getNoteByTask: {
    attachments(parent: INoteTask, args, context: IGQLContext): Promise<ITagTask[]> {
      return taskResolver.Query.getAttachmentByNoteId(parent, { noteId: parent.noteId }, context);
    },
  },
  Query: {
    getTaskByFlow: graphQLHandler({
      handler: task.getTaskByFlowHandler,
      validator: validateResponseTaskArray,
    }),
    getTaskDetailById: graphQLHandler({
      handler: task.getTaskDetailByIdHandler,
      validator: validateResponseTaskDetailArray,
    }),
    getConditionInsertCross: graphQLHandler({
      handler: task.getConditionInsertCrossHandler,
      validator: validateResponseConditionInsertCross,
    }),
    getTaskAssignByTeam: graphQLHandler({
      handler: task.getTaskAssignByTeamHandler,
      validator: validateResponseTaskAssign,
    }),
    getNoteByTask: graphQLHandler({
      handler: task.getNoteByTaskHandler,
      validator: validateResponseNoteTaskArray,
    }),
    getContactTask: graphQLHandler({
      handler: task.getContactTaskHandler,
      validator: validateResponseContactTaskArray,
    }),
    getAppointmentTask: graphQLHandler({
      handler: task.getAppointmentTaskHandler,
      validator: validateResponseAppointmentArray,
    }),
    getTagTask: graphQLHandler({
      handler: task.getTagTaskHandler,
      validator: validateResponseTagTaskArray,
    }),
    getTaskDealListByTask: graphQLHandler({
      handler: task.getTaskDealListByTaskHandler,
      validator: validateResponseTaskDealArray,
    }),
    getAllUser: graphQLHandler({
      handler: task.getAllUserHandler,
      validator: validateResponseAllUserArrayk,
    }),
    getCompanyAddress: graphQLHandler({
      handler: task.getCompanyAddressHandler,
      validator: validateResponseCompanyAddressrArray,
    }),
    getMemberFlow: graphQLHandler({
      handler: task.getMemberFlowHandler,
      validator: validateResponseMemberFlowArray,
    }),
    getCountDetail: graphQLHandler({
      handler: task.getCountDetailHandler,
      validator: validateResponseCountDetailArray,
    }),
    getNextStateTask: graphQLHandler({
      handler: task.getNextStateTaskHandler,
      validator: validateResponseNextStateTask,
    }),
    getAttachmentByNoteId: graphQLHandler({
      handler: task.getAttachmentByNoteIdHandler,
      validator: validateResponAttachementNote,
    }),
  },
  Mutation: {
    updateTaskById: graphQLHandler({
      handler: task.updateTaskByIdHandler,
      validator: validateResponseHTTPObject,
    }),
    updateCompanyContactFromTask: graphQLHandler({
      handler: task.updateCompanyContactHandler,
      validator: validateResponseHTTPObject,
    }),
    insertCompanyContactTask: graphQLHandler({
      handler: task.insertCompanyContactTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    insertTag: graphQLHandler({
      handler: task.insertTagByIdHandler,
      validator: validateResponseHTTPObject,
    }),
    insertAppointmentTask: graphQLHandler({
      handler: task.insertAppointmentTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    editAppointmentTask: graphQLHandler({
      handler: task.editAppointmentTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteAppointmentTask: graphQLHandler({
      handler: task.deleteAppointmentTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    insertNoteTask: graphQLHandler({
      handler: task.insertNoteTaskHandler,
      validator: validateResponseHTTPArray,
    }),
    updateNoteTask: graphQLHandler({
      handler: task.updateNoteTaskTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteNoteTask: graphQLHandler({
      handler: task.deleteNoteTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteAttachment: graphQLHandler({
      handler: task.deleteAttachmentHandler,
      validator: validateResponseHTTPObject,
    }),
    insertAssignTask: graphQLHandler({
      handler: task.insertAssignTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    insertTaskDealByTask: graphQLHandler({
      handler: task.insertTaskDealByTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    insertTaskCrossTeam: graphQLHandler({
      handler: task.insertTaskCrossTeamHandler,
      validator: validateResponseHTTPObject,
    }),
    updateTaskTitle: graphQLHandler({
      handler: task.UpdateTaskTitleHandler,
      validator: validateResponseHTTPObject,
    }),
    insertTaskByLead: graphQLHandler({
      handler: task.insertTaskByLeadHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteTagTask: graphQLHandler({
      handler: task.deleteTagTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    updateActiveTask: graphQLHandler({
      handler: task.updateActiveTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    updateNoteType: graphQLHandler({
      handler: task.updateNoteTypeHandler,
      validator: validateResponseHTTPObject,
    }),
    updateDealDateForTask: graphQLHandler({
      handler: task.updateDealDateForTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductAmountForTask: graphQLHandler({
      handler: task.updateProductAmountForTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    updateMediaAmountForTask: graphQLHandler({
      handler: task.updateMediaAmountForTaskHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
