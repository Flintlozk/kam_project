import gql from 'graphql-tag';

export const GET_NOTIFICATION_INBOX = gql`
  query getNotificationInbox($filters: AudienceListInput) {
    getNotificationInbox(filters: $filters) {
      id
      pagename
      domain
      status
      first_name
      last_name
      pageID
      latestMessage {
        ... on FacebookMessageModel {
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
      latestComment {
        ... on CommentModel {
          _id
          text
          pageID
          audienceID
          postID
          commentID
          payload
          createdAt
          sentBy
          isReply
          hidden
        }
      }
      latestOrderPipeline {
        ... on FacebookPipelineModel {
          order_id
          pipeline
          createdAt
          updatedAt
        }
      }
      profile_pic
      last_platform_activity_date
      is_notify
      notify_status
      platform
    }
  }
`;

export const SUBSCRIPTION_COUNT_NOTIFICATION_INBOX = gql`
  subscription countNotificationSubscription {
    countNotificationSubscription {
      total
    }
  }
`;

export const GET_COUNT_NOTIFICATION_INBOX = gql`
  query getCountNotificationInbox($filters: AudienceListInput) {
    getCountNotificationInbox(filters: $filters) {
      total
    }
  }
`;
export const GET_ALL_PAGE_COUNT_NOTIFICATION_INBOX = gql`
  query getAllPageCountNotificationInbox {
    getAllPageCountNotificationInbox {
      total
      pageID
    }
  }
`;

export const SET_NOTIFICATION_INBOX_STATUS = gql`
  mutation setStatusNotifyByStatus($audienceID: Int, $statusNotify: String, $platform: String) {
    setStatusNotifyByStatus(audienceID: $audienceID, statusNotify: $statusNotify, platform: $platform) {
      id
    }
  }
`;
export const MARK_ALL_NOTIFICATION_AS_READ = gql`
  mutation markAllNotificationAsRead {
    markAllNotificationAsRead {
      status
      value
      expiresAt
    }
  }
`;
