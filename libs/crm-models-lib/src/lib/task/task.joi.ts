import * as Joi from 'joi';

export const TaskResultObjectValidate = {
  title: Joi.string().allow(''),
  team: Joi.string(),
  statusType: Joi.string().required(),
  dueDate: Joi.date(),
  uuidTask: Joi.string().required(),
  uuidCompany: Joi.string(),
  uuidState: Joi.string(),
  color: Joi.string(),
  companyname: Joi.string(),
};
export const TaskDetailResultArrayValidate = {
  companyname: Joi.string().required(),
  title: Joi.string().allow(''),
  createDate: Joi.date(),
  companyId: Joi.string().required(),
  uuidCompany: Joi.string().required(),
  uuidTask: Joi.string().required(),
  uuidState: Joi.string().required(),
  myProfilePic: Joi.string(),
  myName: Joi.string(),
  startDate: Joi.string().allow('').allow(null),
  endDate: Joi.string().allow('').allow(null),
  productAmount: Joi.string().allow('').allow(null),
  mediaAmount: Joi.string().allow('').allow(null),
};

export const ResponseConditionInsertCross = {
  conditions: Joi.string(),
  newState: Joi.number(),
  stateId: Joi.number(),
  uuidState: Joi.number(),
};
export const GetTaskByFlowValidateRequest = {
  flowId: Joi.string().required(),
};

export const UuidTaskValidateRequest = {
  uuidTask: Joi.string().required(),
};
export const CompanyValidateRequest = {
  companyId: Joi.string().required(),
};
export const UpdateCompanyContactTask = {
  name: Joi.string(),
  email: Joi.string().allow(''),
  phoneNumber: Joi.string().allow(''),
  companyId: Joi.number(),
  contactCompanyId: Joi.number(),
  primaryContact: Joi.boolean(),
  lineId: Joi.string().allow(''),
  position: Joi.string().allow(''),
};
export const RequestTagId = {
  tagId: Joi.number(),
};
export const RequestNoteId = {
  noteId: Joi.number(),
};

export const InsertCompanyContactTask = {
  name: Joi.string(),
  email: Joi.string().allow(''),
  phoneNumber: Joi.string().allow(''),
  companyId: Joi.number(),
  lineId: Joi.string().allow(''),
  position: Joi.string().allow(''),
};
export const updateActiveTaskRequest = {
  uuidTask: Joi.string(),
  activeTask: Joi.boolean(),
};
export const GetTeamConfigRequest = {
  uuidState: Joi.string().required(),
};
export const WorkFlowDetailResponse = {
  flowId: Joi.number().required(),
  workflowNameGroup: Joi.string().required(),
  name: Joi.string().required(),
};
export const TeamConfigResponse = {
  source: Joi.string(),
  destination: Joi.string(),
  required: Joi.string(),
  teamname: Joi.string(),
};
export const GroupStateRespone = {
  fullName: Joi.string(),
  allowToEdit: Joi.boolean(),
  flowId: Joi.string(),
};
export const ConfigFlowRequest = {
  flowId: Joi.string(),
};
export const UpdateTaskStateValidateRequest = {
  uuidTask: Joi.string().required(),
  uuidState: Joi.string().required(),
  statusCreate: Joi.string(),
  previousStatusType: Joi.string(),
  updateCross: Joi.boolean(),
};

export const InsertTagValidateRequest = {
  tagName: Joi.string().required(),
  uuidTask: Joi.string().required(),
};

export const InsertNoteTaskValidateRequest = {
  uuidTask: Joi.string().required(),
  noteDetail: Joi.string().required(),
  isInternalNote: Joi.boolean().required(),
  flowId: Joi.number().required(),
};
export const UpdateNoteTaskValidateRequest = {
  uuidNote: Joi.string().required(),
  noteDetail: Joi.string().required(),
  flowId: Joi.number().required(),
};
export const DeleteNoteTaskValidateRequest = {
  uuidNote: Joi.string().required(),
  flowId: Joi.number().required(),
};
export const InsertAppointMentValidateRequest = {
  appointmentStartDate: Joi.string().required(),
  appointmentEndDate: Joi.string().required(),
  appointmentNote: Joi.string().required(),
  uuidTask: Joi.string().required(),
  companyName: Joi.string().required(),
  href: Joi.string().required(),
};
export const EditAppointMentValidateRequest = {
  appointmentStartDate: Joi.string().required(),
  appointmentEndDate: Joi.string().required(),
  appointmentNote: Joi.string().required(),
  uuidTask: Joi.string().required(),
  companyName: Joi.string().required(),
  href: Joi.string().required(),
  uuidAppointment: Joi.string().required(),
};
export const DeleteAppointMentValidateRequest = {
  uuidAppointment: Joi.string(),
};

export const StateByGroupResponse = {
  uuidState: Joi.string(),
  statename: Joi.string(),
  priority: Joi.string(),
  team: Joi.string(),
  color: Joi.string(),
  text: Joi.string(),
};
export const InsertAssignTaskValidateRequest = {
  value: Joi.string().required(),
  uuidTask: Joi.string().required(),
};
export const InsertTaskDealValidateRequest = {
  uuidTask: Joi.string().required(),
  dealtitle: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
};
export const InsertTaskCrossValidateRequest = {
  title: Joi.string().required(),
  team: Joi.string().required(),
  uuidState: Joi.string().required(),
  uuidCompany: Joi.string().required(),
  dueDate: Joi.date().required(),
  parentTaskUUID: Joi.string().required(),
  assignee: Joi.array().required(),
};

export const FileRequest = {
  dataAttach: {
    uuidTask: Joi.string().required(),
    uuidCompany: Joi.string().required(),
  },
};

export const UpdateTaskTitleRequest = {
  title: Joi.string().required(),
  uuidTask: Joi.string().required(),
};
export const UuidAttachmentRequest = {
  uuidAttachment: Joi.string().required(),
};
export const FlowNameRequest = {
  flowName: Joi.string().required(),
};
export const DealDateRequest = {
  startDate: Joi.string(),
  endDate: Joi.string(),
  uuidTask: Joi.string(),
};
export const ProductAmountRequest = {
  productAmount: Joi.string(),
  uuidTask: Joi.string(),
};
export const MediaAmountRequest = {
  mediaAmount: Joi.string(),
  uuidTask: Joi.string(),
};
export const UpdateNoteTypeRequest = {
  isInternalNote: Joi.boolean(),
  uuidNote: Joi.string(),
};

export const ResponseTaskAssign = {
  email: Joi.string(),
  name: Joi.string(),
  profilePic: Joi.string(),
};

export const GetUserDataGoogleValidate = {
  status: Joi.number(),
  value: Joi.string(),
  token: Joi.string(),
  profilePictureUrl: Joi.string(),
  name: Joi.string(),
  defaultWorkflow: Joi.string().required(),
  ownerPicLink: Joi.string().required(),
};

export const ResponseNoteTask = {
  noteDetail: Joi.string(),
  favourite: Joi.boolean(),
  createBy: Joi.string(),
  profilePic: Joi.string(),
  createDate: Joi.string(),
  lastUpdate: Joi.date(),
  noteId: Joi.number(),
  isInternalNote: Joi.boolean(),
  uuidNote: Joi.string(),
  uuidTask: Joi.string(),
};
export const ResponseContactTask = {
  email: Joi.string().allow('').allow(null),
  name: Joi.string().allow('').allow(null),
  phoneNumber: Joi.string().allow('').allow(null),
  contactCompanyId: Joi.string(),
  primaryContact: Joi.boolean(),
  companyId: Joi.number(),
  position: Joi.string().allow(''),
  lineId: Joi.string().allow(''),
};
export const ResponseAppointmentTask = {
  appointmentStartDate: Joi.string(),
  appointmentEndDate: Joi.string(),
  note: Joi.string(),
  appointmentId: Joi.number(),
  createBy: Joi.string(),
  profilePic: Joi.string(),
  htmlLink: Joi.string(),
  uuidAppointment: Joi.string(),
};
export const ResponseTagTask = {
  tagname: Joi.string(),
  color: Joi.string(),
  tagId: Joi.number(),
};
export const ResponseTaskDeal = {
  dealtitle: Joi.string(),
  startDate: Joi.date(),
  objective: Joi.string(),
  name: Joi.string(),
  profilePic: Joi.string(),
  endDate: Joi.date(),
  uuidDeal: Joi.string(),
};

export const ResponseAllUser = {
  name: Joi.string(),
  email: Joi.string(),
  profilePic: Joi.string(),
};

export const ResponseCompanyAddress = {
  companyname: Joi.string(),
};

export const ResponseMemberFlow = {
  username: Joi.string(),
  profilePic: Joi.string(),
  rolename: Joi.string(),
};

export const ResponseCountDetail = {
  count: Joi.string(),
  counttable: Joi.string(),
};

export const ResponseNextStateTask = {
  statename: Joi.string(),
  stateid: Joi.number(),
  uuidState: Joi.string(),
};
export const ResponAttachementNote = {
  attachmentName: Joi.string(),
  attachmentLink: Joi.string(),
  uuidAttachment: Joi.string(),
};
