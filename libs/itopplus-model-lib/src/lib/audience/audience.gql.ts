import gql from 'graphql-tag';

export const AudienceListTypeDefs = gql`
  "Audience Schema"
  type AudienceModel {
    id: Int
    customer_id: Int
    page_id: String
    domain: String
    status: String
    created_at: Date
    can_reply: Boolean
  }

  type AudienceWithInteractableStatus {
    id: Int
    customer_id: Int
    page_id: String
    domain: String
    status: String
    created_at: Date
    isInteractable: Boolean
  }

  type AudiencePurchasingOrder {
    id: Int
    customer_id: Int
    psid: String
    page_id: String
    domain: String
    status: String
    created_at: Date
    updated_at: Date
    first_name: String
    last_name: String
    profile_pic: String
    name: String
    interested_product: String
    total_price: Float
    flat_rate: Boolean
    is_paid: Boolean
    is_confirm: Boolean
    payment_name: String
    payment_type: String
    logistic_name: String
    logistic_type: String
    delivery_fee: Int
    shipping_fee: Int
    tracking_no: String
    product_amount: Int
    bank_account_id: String
    bank_account_name: String
    bank_type: String
    orderno: Int
    aliasOrderId: String
    totalrows: Int
    totalpaidrows: Int
    totalunpaidrows: Int
    platform: String
    aliases: String
    uuid: String
  }

  type AudienceWithLeads {
    id: Int
    customer_id: Int
    parent_id: Int
    psid: String
    page_id: String
    domain: String
    status: String
    created_at: Date
    updated_at: Date
    first_name: String
    last_name: String
    profile_pic: String
    name: String
    form_id: Int
    ref: String
    submission_id: Int
    form_name: String
    submit_name: String
    submit_mobile: String
    submit_email: String
    submit_status: String
    totalrows: Int
    platform: String
    aliases: String
  }

  type LeadsOptions {
    id: Int
    form_id: Int
    type: String
    index: Int
    options: Options
    value: String
  }

  type Options {
    label: String
    required: String
    controlName: String
  }

  type AudienceCustomerJoin {
    id: Int
    parent_id: Int
    customer_id: Int
    psid: String
    page_id: String
    domain: String
    status: String
    created_at: Date
    updated_at: Date
    last_platform_activity_date: Date
    first_name: String
    last_name: String
    profile_pic: String
    can_reply: Boolean
    name: String
    totalrows: Int
    options: [LeadsOptions]
    score: Int
    notify_status: String
    platform: String
    aliases: String
    agentList(pageID: Int): [AgentModel]
    latest_sent_by: String
    referral: FacebookReferral
    assigneeID: Int
  }

  type AudienceCustomerJoinLastActivity {
    id: Int
    parent_id: Int
    customer_id: Int
    psid: String
    page_id: String
    domain: String
    status: String
    created_at: Date
    updated_at: Date
    last_platform_activity_date: Date
    first_name: String
    last_name: String
    profile_pic: String
    can_reply: Boolean
    name: String
    totalrows: Int
    offtimes: Int
    options: [LeadsOptions]
    score: Int
    is_notify: Boolean
    is_offtime: Boolean
    last_send_offtime: Date
    notify_status: String
    platform: String
    aliases: String
    latest_sent_by: String
    latestMessage(audienceID: Int): FacebookMessageModel
    latestComment(audienceID: Int): CommentModel
    agentList(pageID: Int): [AgentModel]
    tags: [CustomerTagModel]
  }

  type AgentModel {
    user_id: String
    name: String
    alias: String
    picture: String
    audience_id: String
    token: String
  }

  type AudienceCounter {
    total: Int
    step1: Int
    step2: Int
    step3: Int
    step4: Int
    step5: Int
  }

  type AudienceLeadStats {
    follow: Int
    finished: Int
  }
  type ReportType {
    thaipost_maunal: [String]
    thaipost_dropOff: [String]
    thaipost_book: [String]
    jandt_maunal: [String]
    jandt_dropOff: [String]
    jandt_cod: [String]
    flash: [String]
  }
  type AudienceRejectedResponse {
    status: Int
    message: String
  }

  type deletedAudience {
    status: Int
    value: String
    id: Int
  }

  type movedAudience {
    status: Int
    value: String
    id: Int
  }

  type AudienceStats {
    inbox_audience: Int
    comment_audience: Int
    live_audience: Int
    order_audience: Int
    lead_audience: Int
    follow_audience: Int
    unread_audience: Int
  }

  type AudienceListTotal {
    audience_total: Int
  }

  type MessageTemplates {
    id: Int
    messages: Messages
    totalrows: Int
  }

  type Messages {
    text: String
    shortcut: String
  }

  type URLobj {
    url: String
  }

  type Suggestions {
    text: String
    images: [Attachments]
    shortcut: String
  }

  type AttachmentsTemplates {
    id: Int
    images: [Attachments]
    shortcut: String
    totalrows: Int
  }

  type Attachments {
    url: String
    attachment_id: String
    extension: String
    filename: String
  }

  type FormTemplates {
    id: Int
    name: String
    totalrows: Int
  }

  type UserMadeLastChangesToStatus {
    id: Int
    name: String
    created_at: String
  }

  type Socials {
    social_facebook: String
    social_line: String
    social_shopee: String
    social_lazada: String
  }

  type AudienceAllModel {
    id: Int
    customer_id: Int
    page_id: Int
    user_id: Int
    reason: String
    domain: String
    status: String
    created_at: Date
    score: Int
    parent_id: Int
    updated_at: Date
    is_notify: Boolean
    last_platform_activity_date: Date
    totalrows: Int
    platform: String
    aliases: String
  }

  input AudienceInput {
    customer_id: Int
    page_id: String
    domain: String
    status: String
    created_at: Date
  }

  input AudienceSlaConfigInput {
    all: Boolean
    almost: Boolean
    over: Boolean
  }

  input AudienceListInput {
    startDate: String
    endDate: String
    search: String
    pageSize: Int
    currentPage: Int
    orderBy: [String]
    orderMethod: String
    domain: [String]
    status: String
    # page_id: Int
    exportAllRows: Boolean
    isNotify: Boolean
    tags: [AudienceTagsFilter]
    noTag: Boolean
    exceedSla: Boolean
    slaConfig: AudienceSlaConfigInput
  }

  input LeadStatsFilter {
    start: String
    end: String
  }

  input MessageInput {
    id: Int
    text: String
    shortcut: String
  }

  input ImagesSetInput {
    id: Int
    shortcut: String
    images: [ImageFilesSetInput]
  }

  input ImageFilesSetInput {
    attachment_id: String
    extension: String
    filename: String
    url: String
    file: Upload
  }

  input AudienceStatsInput {
    startDate: String
    endDate: String
    page_id: Int
  }

  input MessageTemplatesFiltersInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: String
    orderMethod: String
  }

  input FormTemplatesFiltersInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: String
    orderMethod: String
  }

  input SocialsInput {
    social_facebook: String
    social_line: String
    social_shopee: String
    social_lazada: String
  }

  type AudienceLeadContext {
    audienceID: Int
    parentID: Int
    formID: Int
    submissionID: Int
    refID: String
  }

  type UploadImageSetResult {
    failedList: [String]
    value: String
    status: Int
  }

  type AudienceHistoryTags {
    name: String
    color: String
  }

  type AudienceHistories {
    customer_id: Int
    profile_pic: String
    audience_id: Int
    first_name: String
    aliases: String
    last_name: String
    open_by: String
    close_by: String
    domain: String
    status: String
    platform: String
    created_at: Date
    closed_at: Date
    reason: String
    close_detail: String
    tags: [AudienceHistoryTags]
    notes: [String]
    totalrows: Int
    assignee: String
  }
  type AudienceHistory {
    audience_id: Int
    open_by: String
    close_by: String
    assignee: String
    created_at: Date
    closed_at: Date
    reason: String
    close_detail: String
  }
  type AudienceHistoryPagination {
    pagination: Int
  }

  input AudienceHistoriesDateFilterInput {
    start: String
    end: String
  }
  extend type Query {
    getAudienceHistories(filters: TableFilterInput, dateFilter: AudienceHistoriesDateFilterInput): [AudienceHistories]
    getAudienceHistoryByID(audienceID: Int): AudienceHistory
    getAudienceLeadContext(audienceID: Int): AudienceLeadContext
    getAudienceByID(ID: ID, token: String): AudienceCustomerJoin
    getCustomerByAudienceID(audienceID: ID): CustomerModel
    deleteAudienceById(ID: [ID]): [deletedAudience]
    moveToLeads(ID: [ID]): [movedAudience]
    moveToCustomers(ID: [ID]): [movedAudience]
    getAudienceList(filters: AudienceListInput): [AudienceCustomerJoinLastActivity]
    getAudienceSLAList(filters: AudienceListInput, type: String): [AudienceCustomerJoinLastActivity]
    getAudienceListWithPurchaseOrder(filters: AudienceListInput, paidType: String): [AudiencePurchasingOrder]
    getAudienceListWithLeads(query: AudienceListInput): [AudienceWithLeads]
    getAudienceStats: AudienceStats
    getAudienceAllStats(filter: AudienceMessageFilter): AudienceStats
    getAudienceTotal: AudienceListTotal
    getAudiencesByPageIDWithInteractiveStatus: [AudienceWithInteractableStatus]
    getLeadsListTotal(filter: LeadStatsFilter): AudienceLeadStats
    getAudienceListCounter(query: AudienceListInput): AudienceCounter
    getOrderDetail(ID: ID): Boolean
    getMessageTemplates(filters: MessageTemplatesFiltersInput): [MessageTemplates]
    getImageSets(filters: MessageTemplatesFiltersInput): [AttachmentsTemplates]
    getFormsTemplates(filters: FormTemplatesFiltersInput): [FormTemplates]
    getSocials: Socials
    getLastAudienceByCustomerID(id: Int): [AudienceAllModel]
    getTemplatesByShortcut(shortcut: String, type: String): [Suggestions]
    getAllAudienceByCustomerID(id: Int, filters: TableFilterInput): [AudienceAllModel]
    getPaginationNumberByAudienceID(id: Int, paginator: Int, audienceID: Int): AudienceHistoryPagination
    getUserMadeLastChangesToStatus(audienceID: ID): UserMadeLastChangesToStatus
    getChildAudienceByAudienceId(id: Int): AudienceAllModel
    getAudienceByCustomerIDIncludeChild(customerID: Int, isChild: Boolean): [AudienceAllModel]
  }

  extend type Mutation {
    moveAudienceDomain(audienceID: Int, domain: String): AudienceModel
    updateAudienceStatus(audienceID: Int, domain: String, status: String): AudienceModel
    updateFollowAudienceStatus(status: String, domain: String, update: Boolean, orderId: Int): AudienceModel
    updateCustomerStatus(customerId: Int): AudienceModel
    rejectAudience(audienceID: Int, route: String): AudienceRejectedResponse
    closeAudience(audienceID: Int): AudienceRejectedResponse
    addMessageTemplate(message: MessageInput): HTTPResult
    addImageSets(images_set: ImagesSetInput): UploadImageSetResult
    deleteImageSets(messageID: ID): HTTPResult
    deleteImageFromSet(set_id: ID, image_index: ID): HTTPResult
    deleteMessageTemplate(id: ID): HTTPResult
    updateSocials(socials: SocialsInput): HTTPResult
    createNewAudience(customerID: Int, domain: String, status: String): AudienceCustomerJoin
    triggerAgentChanging: HTTPResult
  }
`;
