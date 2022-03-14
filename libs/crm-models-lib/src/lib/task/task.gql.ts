import gql from 'graphql-tag';

export const TaskTypeDefs = gql`
  scalar Date
  scalar Upload
  type getTaskByFlow {
    id: Int
    title: String
    owner: String
    detail: String
    tagname: [String]
    email: String
    name: String
    phoneNumber: String
    statusType: String
    companyId: Int
    uuidCompany: String
    uuidTask: String
    uuidState: String
    dueDate: Date
    color: String
    tagTask: [getTagTask]
    assignee: [getTaskAssignByTeam]
    noteTask: [getNoteByTask]
    appointmentTask: [getAppointmentTask]
    countDetail: [getCountDetail]
    companyname: String
  }

  type getTaskDetailById {
    companyId: Int
    companyname: String
    note: String
    district: String
    postalcode: String
    city: String
    province: String
    address: String
    tagname: [String]
    phoneNumber: String
    title: String
    email: String
    name: String
    createDate: String
    taskId: Int
    tagTask: [String]
    uuidTask: String
    uuidCompany: String
    uuidState: String
    assignee: [getTaskAssignByTeam]
    noteTask: [getNoteByTask]
    contactTask: [getContactTask]
    appointmentTask: [getAppointmentTask]
    taskDeal: [getTaskDealListByTask]
    getFile: [getFileListFromTask]
    getAllUser: [getAllUser]
    companyAddress: [getCompanyAddress]
    nextStateTask: getNextStateTask
    myProfilePic: String
    myName: String
    mediaAmount: String
    productAmount: String
    startDate: String
    endDate: String
  }

  type getUserAssign {
    name: String
    email: String
  }

  type getTaskDealListByTask {
    dealtitle: String
    objective: String
    name: String
    profilePic: String
    startDate: Date
    endDate: Date
    uuidDeal: String
  }

  type getCompanyAddress {
    companyname: String
    district: String
    address: String
    note: String
    postalcode: String
    province: String
    city: String
  }

  type getTaskAssignByTeam {
    email: String
    name: String
    profilePic: String
  }

  type getAllUser {
    name: String
    email: String
    profilePic: String
    lineId: String
    position: String
  }
  type getTagTask {
    tagname: String
    color: String
    tagId: Int
  }

  type getAppointmentTask {
    appointmentStartDate: String
    appointmentEndDate: String
    note: String
    appointmenttime: String
    appointmentId: Int
    createBy: String
    profilePic: String
    htmlLink: String
    uuidAppointment: String
  }

  type getContactTask {
    email: String
    name: String
    phoneNumber: String
    contactCompanyId: Int
    primaryContact: Boolean
    companyId: Int
    lineId: String
    position: String
  }
  type getNoteByTask {
    noteDetail: String
    favourite: Boolean
    createBy: String
    createDate: String
    profilePic: String
    lastUpdate: String
    attachments: [getAttachments]
    isInternalNote: Boolean
    uuidNote: String
    uuidTask: String
  }
  type getAttachments {
    attachmentLink: String
    attachmentName: String
    uuidAttachment: String
  }
  type HTTPResult {
    status: Int
    value: String!
    expiresAt: String
  }

  type valueUpdateTaskResult {
    conditions: String
    newState: Int
    uuidState: String
    team: String
    stateName: String
    allUserInWorkFlow: [UserDetail]
  }
  type UserDetail {
    name: String
    profilePic: String
  }
  type UpdateTaskResult {
    status: Int
    value: valueUpdateTaskResult
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type getMemberFlow {
    username: String
    profilePic: String
    rolename: String
  }
  type downloadFile {
    encoding: String
  }
  type getCountDetail {
    count: String
    counttable: String
  }
  type getFileListFromTask {
    fileName: String
  }
  type getNextStateTask {
    statename: String
    stateid: Int
    uuidState: String
  }
  type getConditionInsertCross {
    conditions: String
    newState: Int
    uuidState: String
    stateId: Int
  }
  input UpdateTaskInput {
    statusType: String
    uuidTask: String
    previousStatusType: String
    uuidState: String
    team: String
    updateCross: Boolean
  }
  input UpdateTaskTitleInput {
    uuidTask: String
    title: String
  }
  input InsertTagInput {
    tagName: String
    uuidTask: String
  }
  input InsertNoteTaskInput {
    noteDetail: String
    uuidTask: String
    isInternalNote: Boolean
    flowId: Int
  }
  input InsertTaskCrossInput {
    title: String
    team: String
    uuidState: String
    uuidOwner: String
    uuidCompany: String
    dueDate: Date
    parentTaskUUID: String
    assignee: [String]
  }
  input GetTaskFiltersInput {
    team: String
  }
  input GetTaskDetailFiltersInput {
    uuidCompany: String
    uuidTask: String
  }
  input GetDataFiltersByIdInput {
    uuidTask: String
  }
  input GetContactTaskFiltersInput {
    companyId: Int
  }

  input GetAppointmentTaskFiltersInput {
    taskId: Int
  }
  input GetTagTaskFiltersInput {
    team: String
  }
  input InsertAssignTaskInput {
    value: String
    uuidTask: String
  }
  input InsertTaskDealByTaskInput {
    dealvalue: String
    startDate: Date
    endDate: Date
    dealtitle: String
    uuidTask: String
  }
  input UploadParamsInput {
    pageId: String
  }

  input InsertAppointInput {
    appointmentStartDate: String
    appointmentEndDate: String
    appointmentNote: String
    uuidTask: String
    companyName: String
    href: String
  }
  input EditAppointInput {
    appointmentStartDate: String
    appointmentEndDate: String
    appointmentNote: String
    uuidTask: String
    companyName: String
    href: String
    uuidAppointment: String
  }
  input AttachFileDataInput {
    uuidTask: String
    uuidCompany: String
  }
  input GetMemberFlowInput {
    flowName: String
  }
  input GetAttachmentIdInput {
    uuidTask: String
    uuidCompany: String
  }
  input InsertTaskByLead {
    title: String
    uuidCompany: String
    allAssignee: [AssigneeInput]
    appointmentTask: [AppointmentInput]
    noteTask: [NoteTaskInput]
    workflow: String
  }
  input AssigneeInput {
    name: String
  }
  input AppointmentInput {
    appointmentDate: String
    appointmentNote: String
  }
  input NoteTaskInput {
    attachmentsIndex: [Int]
    noteDetail: String
  }
  input UpdateCompanyContactDetail {
    name: String
    email: String
    phoneNumber: String
    companyId: Int
    contactCompanyId: Int
    primaryContact: Boolean
    lineId: String
    position: String
  }
  input InsertCompanyContactDetail {
    name: String
    email: String
    phoneNumber: String
    companyId: Int
    lineId: String
    position: String
  }
  input UpdateActiveTaskInput {
    uuidTask: String
    activeTask: Boolean
    uuidState: String
  }
  input UpdateNoteTaskInput {
    uuidNote: String
    noteDetail: String
    flowId: Int
  }
  input DeleteNoteTaskInput {
    uuidNote: String
    flowId: Int
  }
  input InternalNoteInput {
    isInternalNote: Boolean
    uuidNote: String
  }
  input DealDateInput {
    startDate: String
    endDate: String
    uuidTask: String
  }
  input productAmountInput {
    productAmount: String
    uuidTask: String
  }
  input mediaAmountInput {
    mediaAmount: String
    uuidTask: String
  }
  type Query {
    getTaskByFlow(flowId: String): [getTaskByFlow]
    getTaskDetailById(uuidTask: String): getTaskDetailById
    getTaskAssignByTeam(uuidTask: String): [getTaskAssignByTeam]
    getNoteByTask(uuidTask: String): [getNoteByTask]
    getContactTask(filters: GetContactTaskFiltersInput): [getContactTask]
    getAppointmentTask(uuidTask: String): [getAppointmentTask]
    getTagTask(uuidTask: String): [getTagTask]
    getTaskDealListByTask(uuidTask: String): [getTaskDealListByTask]
    downloadFile(file: String, dataAttach: AttachFileDataInput): downloadFile
    getFileListFromTask(filters: GetAttachmentIdInput): [getFileListFromTask]
    getAllUser(companyId: String): [getAllUser]
    getCompanyAddress(filters: GetTaskDetailFiltersInput): [getCompanyAddress]
    getMemberFlow(flowName: String): [getMemberFlow]
    getCountDetail(filters: GetTaskDetailFiltersInput): [getCountDetail]
    getNextStateTask(uuidTask: String): getNextStateTask
    getUserAssign: [getUserAssign]
    getAttachmentByNoteId(noteId: Int): [getAttachments]
    getConditionInsertCross: [getConditionInsertCross]
  }
  type Mutation {
    updateTaskById(message: UpdateTaskInput): UpdateTaskResult
    insertTag(message: InsertTagInput): HTTPResult
    insertAppointmentTask(message: InsertAppointInput): HTTPResult
    editAppointmentTask(message: EditAppointInput): HTTPResult
    deleteAppointmentTask(uuidAppointment: String): HTTPResult
    insertNoteTask(files: [Upload!]!, message: InsertNoteTaskInput): [HTTPResult!]!
    updateNoteTask(message: UpdateNoteTaskInput): HTTPResult
    deleteNoteTask(message: DeleteNoteTaskInput): HTTPResult
    insertAssignTask(message: InsertAssignTaskInput): HTTPResult
    insertTaskDealByTask(message: InsertTaskDealByTaskInput): HTTPResult
    insertTaskCrossTeam(message: InsertTaskCrossInput): HTTPResult
    uploadFileSaveTask(file: Upload!, dataAttach: AttachFileDataInput): HTTPResult
    removeAttachmentFile(file: Int, dataAttach: GetAttachmentIdInput): HTTPResult
    updateTaskTitle(message: UpdateTaskTitleInput): HTTPResult
    insertTaskByLead(files: [Upload!]!, message: InsertTaskByLead): HTTPResult
    deleteTagTask(tagId: Int): HTTPResult
    updateCompanyContactFromTask(message: UpdateCompanyContactDetail): HTTPResult
    insertCompanyContactTask(message: InsertCompanyContactDetail): HTTPResult
    updateActiveTask(message: UpdateActiveTaskInput): HTTPResult
    deleteAttachment(uuidAttachment: String): HTTPResult
    updateNoteType(message: InternalNoteInput): HTTPResult
    updateDealDateForTask(message: DealDateInput): HTTPResult
    updateProductAmountForTask(message: productAmountInput): HTTPResult
    updateMediaAmountForTask(message: mediaAmountInput): HTTPResult
  }
`;
