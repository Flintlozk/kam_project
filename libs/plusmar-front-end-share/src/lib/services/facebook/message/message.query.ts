import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
  query getMessages($audienceID: Int) {
    getMessages(audienceID: $audienceID) {
      _id
      mid
      text
      attachments
      audienceID
      pageID
      createdAt
      sentBy
      object
      payload
      messagetype
      sender {
        user_id
        user_name
      }
    }
  }
`;

export const GET_MESSAGE_ATTACHEMENTS = gql`
  query getMessageAttachments($audienceID: Int, $limit: Int) {
    getMessageAttachments(audienceID: $audienceID, limit: $limit) {
      _id
      mid
      text
      attachments
      audienceID
      pageID
      createdAt
      sentBy
      object
      payload
      messagetype
      sender {
        user_id
        user_name
      }
    }
  }
`;
export const GET_MESSAGES_ON_SCROLL = gql`
  query getMessagesOnScroll($audienceID: Int, $index: Int, $limit: Int) {
    getMessagesOnScroll(audienceID: $audienceID, index: $index, limit: $limit) {
      _id
      mid
      text
      attachments
      audienceID
      pageID
      createdAt
      sentBy
      object
      payload
      messagetype
      source
      sender {
        user_id
        user_name
        line_user_id
        group_id
        room_id
        picture_url
      }
    }
  }
`;

export const GET_MESSAGES_WATERMARK = gql`
  query getMessageWatermark($PSID: String) {
    getMessageWatermark(PSID: $PSID) {
      read
      delivered
      deliveryID
    }
  }
`;
export const CHECK_MESSAGE_ACTIVITY = gql`
  query checkMessageActivity($audienceID: Int) {
    checkMessageActivity(audienceID: $audienceID) {
      inbox {
        allowOn
        reason
      }
      comment {
        allowOn
        reason
      }
    }
  }
`;

export const GET_LATEST_MESSAGE = gql`
  query getLatestMessage($audienceID: Int) {
    getLatestMessage(audienceID: $audienceID) {
      _id
      mid
      text
      attachments
      audienceID
      pageID
      createdAt
      sentBy
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation updateMessage($message: FacebookMessageModelInput) {
    updateMessage(message: $message) {
      mid
      text
      senderId
      recipientId
      metadata
      createdAt
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation addMessage($message: FacebookMessageModelInput, $messageType: String) {
    addMessage(message: $message, messageType: $messageType) {
      _id
      mid
      text
      audienceID
      pageID
      createdAt
      sentBy
      sender {
        user_id
        user_name
        user_alias
      }
    }
  }
`;

export const ADD_LINE_MESSAGE = gql`
  mutation sendLineMessage($message: LineMessageModelInput) {
    sendLineMessage(message: $message) {
      _id
      mid
      text
      audienceID
      pageID
      attachments
      createdAt
      sentBy
      sender {
        user_id
        user_name
        user_alias
      }
      messagetype
    }
  }
`;

export const SEND_PRIVATE_MESSAGE = gql`
  mutation sendPrivateMessage($message: FacebookMessageModelInput, $commentID: String) {
    sendPrivateMessage(message: $message, commentID: $commentID) {
      _id
      mid
      text
      attachments
      object
      pageID
      audienceID
      createdAt
      sentBy
      payload
      sender {
        user_id
        user_name
        user_alias
      }
    }
  }
`;

export const UPLOAD_ATTACHMENT = gql`
  mutation uploadAttachment($file: Upload, $audienceID: Int) {
    uploadAttachment(file: $file, audienceID: $audienceID) {
      attachmentID
    }
  }
`;
export const SEND_ATTACHMENT = gql`
  mutation sendAttachment($attachmentID: String, $audienceID: Int, $type: String) {
    sendAttachment(attachmentID: $attachmentID, audienceID: $audienceID, type: $type) {
      message_id
      recipient_id
    }
  }
`;

export const SEND_IMAGE_SET = gql`
  mutation sendImageSet($image: ImageSetInput, $psid: String) {
    sendImageSet(image: $image, psid: $psid) {
      status
      value
    }
  }
`;

export const LINE_UPLOAD = gql`
  mutation lineUpload($lineUploadInput: LineUploadInput) {
    lineUpload(lineUploadInput: $lineUploadInput) {
      status
      value {
        filename
        url
      }
    }
  }
`;
export const GET_ATTACHMENTS_URL_EXPIRED = gql`
  query getAttachmentUrlExpired($mid: String, $attachments: [FacebookAttachmentPayloadInput]) {
    getAttachmentUrlExpired(mid: $mid, attachments: $attachments) {
      _id
      mid
      text
      attachments
      audienceID
      pageID
      createdAt
      sentBy
      object
      payload
      messagetype
      source
      sender {
        user_id
        user_name
        line_user_id
        group_id
        room_id
        picture_url
      }
    }
  }
`;

export const MESSAGE_RECEIVED = gql`
  subscription messageReceived($audienceID: Int) {
    messageReceived(audienceID: $audienceID) {
      _id
      mid
      text
      attachments
      object
      pageID
      audienceID
      createdAt
      sentBy
      payload
      source
      sender {
        user_id
        user_name
        line_user_id
        group_id
        room_id
        picture_url
      }
      messageWatermark {
        read
        delivered
        deliveryID
      }
    }
  }
`;
