import gql from 'graphql-tag';

export const OrganizationTypeDefs = gql`
  type AllSubscriptionSLAStatisiticWaitForOpen {
    onProcess: Int
    almostSLA: Int
    overSLA: Int
  }
  type AllSubscriptionSLAStatisitic {
    totalCase: Int
    todayCase: Int
    waitForOpen: AllSubscriptionSLAStatisiticWaitForOpen
    closedCaseToday: Int
    onProcessSla: Int
    onProcessOverSla: Int
    onProcessSlaTier2: Int
    onProcessOverSlaTier2: Int
  }
  type AllSubscriptionClosedReason {
    reasonID: Int
    pageID: Int
    total: Int
    pageName: String
    reason: String
  }

  type AllSubscriptionSLAAllSatffUser {
    userID: Int
    name: String
    picture: String
  }
  type AllSubscriptionSLAAllSatff {
    tagID: Int
    pageID: Int
    totalOnProcess: Int
    todayClosed: Int
    almostSLA: Int
    overSLA: Int
    tagName: String
    users: [AllSubscriptionSLAAllSatffUser]
  }

  input getAllSubscriptionFilter {
    pageID: Int
  }

  type PageListOnMessageTrackMode {
    pageID: Int
    pageImgUrl: String
    pageTitle: String
    pageMessageMode: String
  }

  extend type Query {
    getPageListOnMessageTrackMode: [PageListOnMessageTrackMode]
    getAllSubscriptionSLAStatisitic(filters: getAllSubscriptionFilter): AllSubscriptionSLAStatisitic
    getAllSubscriptionSLAStatisiticByAssignee(filters: getAllSubscriptionFilter): AllSubscriptionSLAStatisitic
    getAllSubscriptionSLAAllStaff(filters: getAllSubscriptionFilter, isDigest: Boolean): [AllSubscriptionSLAAllSatff]
    getAllSubscriptionSLAAllStaffByAssignee(filters: getAllSubscriptionFilter, isDigest: Boolean): [AllSubscriptionSLAAllSatff]
    getAllSubscriptionClosedReason(filters: getAllSubscriptionFilter): [AllSubscriptionClosedReason]
    getAllSubscriptionClosedReasonByAssignee(filters: getAllSubscriptionFilter): [AllSubscriptionClosedReason]
  }
`;
