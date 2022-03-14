import gql from 'graphql-tag';

const props = `{
  id
  parent_id
  page_id
  domain
  status
  is_notify
  is_offtime
  last_platform_activity_date
  customer_id
  first_name
  last_name
  name
  profile_pic
  platform
  aliases
  notify_status
  tags {
    ... on CustomerTagModel {
      id
      name
      color
      tagMappingID
    }
  }
}`;

export const GET_CUSTOMER_CONTACT_LIST = gql`
  query getCustomerContactList($listIndex:Int,$skip:Int,$filters:AudienceMessageFilter) {
    getCustomerContactList(listIndex:$listIndex,skip:$skip,filters:$filters) ${props}
  }
`;

export const GET_CUSTOMER_CONTACTS = gql`
  query getCustomerContacts($audienceIDs:[Int],$domain:String,$filters:AudienceMessageFilter) {
    getCustomerContacts(audienceIDs:$audienceIDs,domain:$domain,filters:$filters) ${props}
  }
`;

export const GET_CUSTOMER_CONTACTS_WIHT_OFFTIME = gql`
  query getCustomerContactsWithOfftimes($filters:AudienceMessageFilter) {
    getCustomerContactsWithOfftimes(filters:$filters) ${props}
  }
`;

export const GET_AUDIENCE_CONTACT = gql`
  query getAudienceContact($audienceID:Int,$domain:String,$filters:AudienceMessageFilter) {
    getAudienceContact(audienceID:$audienceID,domain:$domain,filters:$filters) ${props}
  }
`;
export const GET_AUDIENCE_CONTACTS = gql`
  query getAudienceContacts($audienceIDs:[Int],$domain:String,$filters:AudienceMessageFilter) {
    getAudienceContacts(audienceIDs:$audienceIDs,domain:$domain,filters:$filters) ${props}
  }
`;

export const GET_AUDIENCE_CONTACTS_WIHT_OFFTIME = gql`
  query getAudienceContactsWithOfftimes($filters:AudienceMessageFilter) {
    getAudienceContactsWithOfftimes(filters:$filters) ${props}
  }
`;

export const REMOVE_TOKEN_FROM_AUDIENCE_CONTACT_LIST = gql`
  mutation removeTokenFromAudienceContactList($token: String, $pageId: Int, $isAddToRedis: Boolean) {
    removeTokenFromAudienceContactList(token: $token, pageId: $pageId, isAddToRedis: $isAddToRedis) {
      status
    }
  }
`;
export const SET_AUDIENCE_UNREAD = gql`
  mutation setAudienceUnread($audienceID: Int) {
    setAudienceUnread(audienceID: $audienceID) {
      status
    }
  }
`;

export const ON_CONTACT_UPDATE_SUBSCRIPTION = gql`
  subscription onContactUpdateSubscription($route: AudienceViewType) {
    onContactUpdateSubscription(route: $route) {
      isFetch
      action {
        method
        audienceID
        customerID
        userID
        message
        assigneeID
      }
    }
  }
`;
export const ON_AUDIENCE_REDIES_UPDATE_SUBSCRIPTION = gql`
  subscription onAudienceRedisUpdateSubscription {
    onAudienceRedisUpdateSubscription {
      agentList {
        user_id
        name
        picture
        audience_id
        token
      }
    }
  }
`;

export const TRIGGER_AGENT_CHANGING = gql`
  mutation triggerAgentChanging {
    triggerAgentChanging {
      status
    }
  }
`;

export const SET_AUDIENCE_ASSIGNEE = gql`
  mutation setAudienceAssignee($audienceID: Int, $userID: Int) {
    setAudienceAssignee(audienceID: $audienceID, userID: $userID) {
      value
      status
    }
  }
`;
