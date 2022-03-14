import gql from 'graphql-tag';

export const GET_AUDIENCE_HISTORIES = gql`
  query getAudienceHistories($filters: TableFilterInput, $dateFilter: AudienceHistoriesDateFilterInput) {
    getAudienceHistories(filters: $filters, dateFilter: $dateFilter) {
      audience_id
      customer_id
      profile_pic
      first_name
      aliases
      last_name
      open_by
      close_by
      assignee
      domain
      status
      platform
      created_at
      closed_at
      reason
      close_detail
      tags {
        name
        color
      }
      notes
      totalrows
      assignee
    }
  }
`;
export const GET_AUDIENCE_HISTORY_BY_ID = gql`
  query getAudienceHistoryByID($audienceID: Int) {
    getAudienceHistoryByID(audienceID: $audienceID) {
      audience_id
      open_by
      close_by
      created_at
      closed_at
      reason
      close_detail
    }
  }
`;
export const GET_CURRENT_STEP = gql`
  query getSteps($audienceID: Int) {
    getSteps(audienceID: $audienceID) {
      id
      customer_id
      domain
      status
      can_reply
      created_at
    }
  }
`;

export const GET_USER_MADE_LAST_CHANGES_TO_STATUS = gql`
  query getUserMadeLastChangesToStatus($audienceID: ID) {
    getUserMadeLastChangesToStatus(audienceID: $audienceID) {
      id
      name
      created_at
    }
  }
`;
export const GET_CUSTOMER_BY_AUDIENCE_ID = gql`
  query getCustomerByAudienceID($audienceID: ID) {
    getCustomerByAudienceID(audienceID: $audienceID) {
      first_name
      last_name
    }
  }
`;
export const UPDATE_FOLLOW_AUDIENCE_STATUS = gql`
  mutation updateFollowAudienceStatus($status: String, $domain: String, $update: Boolean, $orderId: Int) {
    updateFollowAudienceStatus(status: $status, domain: $domain, update: $update, orderId: $orderId) {
      id
      page_id
      created_at
      domain
      status
      customer_id
    }
  }
`;
export const CREATE_OR_UPDATE_STEP = gql`
  mutation createOrUpdate($audienceID: Int) {
    createOrUpdate(audienceID: $audienceID) {
      id
      customer_id
      page_id
      domain
      status
      created_at
    }
  }
`;
export const BACK_TO_PREVIOUS_STEP = gql`
  mutation backToPreviousStep($audienceID: Int) {
    backToPreviousStep(audienceID: $audienceID) {
      id
      customer_id
      page_id
      domain
      status
      created_at
    }
  }
`;

export const GET_AUDIENCE_BY_ID = gql`
  query getAudienceByID($ID: ID, $token: String) {
    getAudienceByID(ID: $ID, token: $token) {
      id
      page_id
      psid
      first_name
      last_name
      profile_pic
      customer_id
      can_reply
      name
      parent_id
      domain
      status
      platform
      aliases
      notify_status
      latest_sent_by
      assigneeID
      agentList {
        user_id
        name
        picture
        audience_id
        token
      }
      referral {
        source
        type
        ref
        ad_id
        ads_context_data {
          ad_title
          photo_url
          video_url
          post_id
        }
        referer_uri
        timestamp
      }
    }
  }
`;

export const GET_CHILD_AUDIENCE_BY_AUDIENCE_ID = gql`
  query getChildAudienceByAudienceId($id: Int) {
    getChildAudienceByAudienceId(id: $id) {
      id
      page_id
      parent_id
      domain
      status
      platform
    }
  }
`;

export const DELETE_AUDIENCE_BY_ID = gql`
  query deleteAudienceById($ID: [ID]) {
    deleteAudienceById(ID: $ID) {
      id
    }
  }
`;

export const MOVE_TO_LEADS_AUDIENCE_BY_ID = gql`
  query moveToLeads($ID: [ID]) {
    moveToLeads(ID: $ID) {
      id
    }
  }
`;

export const MOVE_TO_CUSTOMERS_AUDIENCE_BY_ID = gql`
  query moveToCustomers($ID: [ID]) {
    moveToCustomers(ID: $ID) {
      id
    }
  }
`;

export const UPDATE_AUDIENCE_STATUS = gql`
  mutation updateAudienceStatus($audienceID: Int, $domain: String, $status: String) {
    updateAudienceStatus(audienceID: $audienceID, domain: $domain, status: $status) {
      id
      page_id
      created_at
      customer_id
    }
  }
`;
export const MOVE_AUDIENCE_DOMAIN = gql`
  mutation moveAudienceDomain($audienceID: Int, $domain: String) {
    moveAudienceDomain(audienceID: $audienceID, domain: $domain) {
      id
      page_id
      created_at
      customer_id
    }
  }
`;

export const REJECT_AUDIENCE = gql`
  mutation rejectAudience($audienceID: Int, $route: String) {
    rejectAudience(audienceID: $audienceID, route: $route) {
      status
      message
    }
  }
`;
export const CLOSE_AUDIENCE = gql`
  mutation closeAudience($audienceID: Int) {
    closeAudience(audienceID: $audienceID) {
      status
      message
    }
  }
`;

export const RESOLVE_PURCHASE_ORDER_PAID_TRANSACTION = gql`
  mutation resolvePurchaseOrderPaidTransaction($orderId: Int) {
    resolvePurchaseOrderPaidTransaction(orderId: $orderId) {
      status
      message
    }
  }
`;

export const GET_AUDIENCE_LIST = gql`
  query getAudienceList($filters: AudienceListInput) {
    getAudienceList(filters: $filters) {
      id
      page_id
      domain
      status
      first_name
      last_name
      profile_pic
      created_at
      last_platform_activity_date
      platform
      aliases
      is_notify
      is_offtime
      notify_status
      latest_sent_by
      options {
        id
        form_id
        type
        index
        options {
          label
          required
          controlName
        }
        value
      }
      totalrows
      offtimes
      score
      tags {
        ... on CustomerTagModel {
          id
          name
          color
          tagMappingID
        }
      }
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
          object
          messagetype
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
        }
      }
    }
  }
`;

export const GET_AUDIENCE_SLA_LIST = gql`
  query getAudienceSLAList($filters: AudienceListInput, $type: String) {
    getAudienceSLAList(filters: $filters, type: $type) {
      id
      page_id
      domain
      status
      first_name
      last_name
      profile_pic
      created_at
      last_platform_activity_date
      platform
      aliases
      is_notify
      notify_status
      options {
        id
        form_id
        type
        index
        options {
          label
          required
          controlName
        }
        value
      }
      totalrows
      score
      tags {
        ... on CustomerTagModel {
          id
          name
          color
          tagMappingID
        }
      }
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
        }
      }
    }
  }
`;
export const GET_AUDIENCE_STATS = gql`
  query getAudienceStats {
    getAudienceStats {
      inbox_audience
      comment_audience
      live_audience
      order_audience
      lead_audience
      follow_audience
    }
  }
`;
export const GET_AUDIENCE_ALL_STATS = gql`
  query getAudienceAllStats($filter: AudienceMessageFilter) {
    getAudienceAllStats(filter: $filter) {
      inbox_audience
      comment_audience
      live_audience
      order_audience
      lead_audience
      follow_audience
      unread_audience
    }
  }
`;

export const GET_AUDIENCES_BY_PAGE_ID_WITH_INTERACTIVE_STATUS = gql`
  query getAudiencesByPageIDWithInteractiveStatus {
    getAudiencesByPageIDWithInteractiveStatus {
      id
      customer_id
      page_id
      domain
      status
      isInteractable
    }
  }
`;

export const GET_AUDIENCE_TOTAL = gql`
  query getAudienceTotal {
    getAudienceTotal {
      audience_total
    }
  }
`;

export const GET_LEADS_LIST_TOTAL = gql`
  query getLeadsListTotal($filter: LeadStatsFilter) {
    getLeadsListTotal(filter: $filter) {
      follow
      finished
    }
  }
`;

export const GET_AUDIENCE_LIST_WITH_PURCHASE = gql`
  query getAudienceListWithPurchaseOrder($filters: AudienceListInput, $paidType: String) {
    getAudienceListWithPurchaseOrder(filters: $filters, paidType: $paidType) {
      id
      page_id
      domain
      psid
      status
      first_name
      last_name
      profile_pic
      created_at
      updated_at
      interested_product
      total_price
      flat_rate
      is_paid
      is_confirm
      payment_name
      payment_type
      logistic_name
      logistic_type
      tracking_no
      product_amount
      bank_account_id
      bank_account_name
      bank_type
      delivery_fee
      totalrows
      totalpaidrows
      totalunpaidrows
      orderno
      platform
      aliases
      uuid
      aliasOrderId
    }
  }
`;
export const GET_AUDIENCE_LIST_WITH_LEADS = gql`
  query getAudienceListWithLeads($query: AudienceListInput) {
    getAudienceListWithLeads(query: $query) {
      id
      parent_id
      customer_id
      psid
      page_id
      domain
      status
      created_at
      updated_at
      first_name
      last_name
      profile_pic
      name
      form_id
      ref
      submission_id
      form_name
      submit_name
      submit_mobile
      submit_email
      submit_status
      totalrows
      platform
      aliases
    }
  }
`;

export const GET_AUDIENCE_LIST_COUNT_WATCH_QUERY = gql`
  query getAudienceListCounter($query: AudienceListInput) {
    getAudienceListCounter(query: $query) {
      total
      step1
      step2
      step3
      step4
      step5
    }
  }
`;

export const GET_ALL_AUDIENCE_BY_CUSTOMER_ID = gql`
  query getAllAudienceByCustomerID($id: Int, $filters: TableFilterInput) {
    getAllAudienceByCustomerID(id: $id, filters: $filters) {
      id
      domain
      status
      reason
      parent_id
      updated_at
      last_platform_activity_date
      totalrows
    }
  }
`;
export const GET_PAGE_NUMBER_BY_AUDIENCE_ID = gql`
  query getPaginationNumberByAudienceID($id: Int, $paginator: Int, $audienceID: Int) {
    getPaginationNumberByAudienceID(id: $id, paginator: $paginator, audienceID: $audienceID) {
      pagination
    }
  }
`;

export const GET_LAST_AUDIENCE_BY_CUSTOMER_ID = gql`
  query getLastAudienceByCustomerID($id: Int) {
    getLastAudienceByCustomerID(id: $id) {
      id
      status
      platform
      aliases
    }
  }
`;

export const GET_AUDIENCE_BY_CUSTOMER_ID_INCLUDE_CHILD = gql`
  query getAudienceByCustomerIDIncludeChild($customerID: Int, $isChild: Boolean) {
    getAudienceByCustomerIDIncludeChild(customerID: $customerID, isChild: $isChild) {
      id
    }
  }
`;

export const GET_AUDIENCE_HISTORY_BY_AUDIENCE_ID = gql`
  query getAudienceHistoryByAudienceID($id: Int) {
    getAudienceHistoryByAudienceID(id: $id) {
      id
      audience_id
      reason
      closeDescription
      page_id
      previous_domain
      previous_status
      domain
      status
      user_id
      user_type
      created_at
      action_by
    }
  }
`;

export const CREATE_NEW_AUDIENCE = gql`
  mutation createNewAudience($customerID: Int, $domain: String, $status: String) {
    createNewAudience(customerID: $customerID, domain: $domain, status: $status) {
      id
    }
  }
`;
