import gql from 'graphql-tag';

export const FacebookMessageTypeDefs = gql`
  type FacebookAttachmentTemplateModel {
    templateType: String
  }

  type FacebookAttachmentButtonModel {
    buttonType: String
    title: String
    payload: String
  }

  type FacebookAttachmentPayload {
    url: String
  }
  input FacebookAttachmentPayloadInput {
    url: String
  }

  type FacebookAttachmentModel {
    type: String
    payload: FacebookAttachmentPayload
    buttons: [FacebookAttachmentButtonModel]
    template: FacebookAttachmentTemplateModel
  }

  type FacebookMessageSender {
    user_id: Int
    user_name: String
    user_alias: String
    line_user_id: String
    group_id: String
    room_id: String
    picture_url: String
  }

  enum MessageSource {
    FACEBOOK
    LINE
  }

  type FacebookMessageModel {
    _id: ID
    mid: String
    text: String
    attachments: String
    object: String
    pageID: Int
    audienceID: Int
    createdAt: String
    sentBy: String
    payload: String
    sender: FacebookMessageSender
    messagetype: String
    messageWatermark: MessageWatermark
    source: MessageSource
  }

  type FacebookDeliveryModel {
    object: String
    pageID: Int
    audienceID: Int
    createdAt: String
    mids: [String]
    watermark: String
    payload: String
  }

  enum MessageReferralSource {
    SHORTLINK
    ADS
    CUSTOMER_CHAT_PLUGIN
    UNKNOWN
  }

  enum MessageReferralType {
    OPEN_THREAD
  }

  type FacebookReferralAdsContext {
    ad_title: String
    photo_url: String
    video_url: String
    post_id: String
  }

  type FacebookReferral {
    source: MessageReferralSource
    type: MessageReferralType
    ref: String
    ad_id: String
    ads_context_data: FacebookReferralAdsContext
    referer_uri: String
    timestamp: Date
  }

  type FacebookReadModel {
    object: String
    pageID: Int
    audienceID: Int
    createdAt: String
    watermark: String
    payload: String
  }

  type FacebookMessageResponse {
    message_id: String
    recipient_id: String
  }

  type FacebookUploadAttachmentResponse {
    attachmentID: String
  }

  type FacebookMessageReply {
    success: Boolean
    message: String
  }

  input FacebookMessageSenderInput {
    user_id: Int
    user_name: String
    user_alias: String
  }

  input FacebookMessageModelInput {
    _id: ID
    mid: String
    text: String
    object: String
    pageID: Int
    audienceID: Int
    createdAt: String
    typename: String
    sentBy: String
    payload: String
    sender: FacebookMessageSenderInput
    messagetype: String
  }

  input FacebookMessageReplyInput {
    recipientId: String
    senderId: String
    text: String
  }

  input ImageSetInput {
    url: String
    attachment_id: String
    extension: String
    filename: String
  }

  type FormData {
    source: Upload!
  }

  type CheckMessageActivityByType {
    allowOn: Int
    reason: String
  }
  type CheckMessageActivity {
    inbox: CheckMessageActivityByType
    comment: CheckMessageActivityByType
  }

  type MessageWatermark {
    read: String
    delivered: String
    deliveryID: String
  }

  extend type Query {
    getMessageWatermark(PSID: String): MessageWatermark
    getAttachmentUrlExpired(mid: String, attachments: [FacebookAttachmentPayloadInput]): FacebookMessageModel
    getLatestMessage(audienceID: Int): FacebookMessageModel
    checkMessageActivity(audienceID: Int): CheckMessageActivity
    getLatestMessageExceptSentByPage(audienceID: Int): FacebookMessageModel
    getLatestMessageIncludePageTemplate(audienceID: Int): FacebookMessageModel
    getMessages(audienceID: Int): [FacebookMessageModel]
    getMessagesOnScroll(audienceID: Int, index: Int, limit: Int): [FacebookMessageModel]
    getMessageAttachments(audienceID: Int, limit: Int): [FacebookMessageModel]
  }

  extend type Mutation {
    updateMessage(message: FacebookMessageModelInput): FacebookMessageModel
    addMessage(message: FacebookMessageModelInput, messageType: String): FacebookMessageModel
    sendPrivateMessage(message: FacebookMessageModelInput, commentID: String): FacebookMessageModel
    sendAttachment(attachmentID: String, audienceID: Int, type: String): FacebookMessageResponse
    uploadAttachment(file: Upload, audienceID: Int): FacebookUploadAttachmentResponse
    sendImageSet(image: ImageSetInput, psid: String): HTTPResult
  }

  extend type Subscription {
    messageReceived(audienceID: Int): FacebookMessageModel
  }
`;
