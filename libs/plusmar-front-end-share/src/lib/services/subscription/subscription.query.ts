import gql from 'graphql-tag';

export const GET_SUBSCRIPTION_BUDGET = gql`
  query getSubscriptionBudget {
    getSubscriptionBudget {
      currentBudget
      updatedAt
    }
  }
`;
export const GET_AND_UPDATE_SUBSCRIPTION_CONTEXT = gql`
  query getAndUpdateSubscriptionContext($subscriptionIndex: Int) {
    getAndUpdateSubscriptionContext(subscriptionIndex: $subscriptionIndex) {
      id
      name
      profileImage
      subscription {
        subscriptionIndex
        id
        planId
        planName
        packageType
        role
        daysRemaining
        isExpired
      }
      subscriptions {
        subscriptionIndex
        id
        planId
        planName
        packageType
        role
        daysRemaining
      }
    }
  }
`;

export const GET_USER_SUBSCRIPTION = gql`
  query getUserSubscription {
    getUserSubscription {
      id
    }
  }
`;

export const ON_SUBSCRIPTION_CHANGING_SUBSCRIPTION = gql`
  subscription onSubscriptionChangingSubscription {
    onSubscriptionChangingSubscription {
      status
    }
  }
`;

export const GET_SUBSCRIPTION_LIMIT_AND_DETAILS = gql`
  query getSubscriptionLimitAndDetails {
    getSubscriptionLimitAndDetails {
      price
      planName
      maximumMembers
      maximumPages
      maximumLeads
      maximumOrders
      maximumProducts
      maximumPromotions
      featureType
      packageType
    }
  }
`;

export const GET_SUBSCRIPTION_PLAN_DETAILS = gql`
  query getSubscriptionPlanDetails($subscriptionPlanID: Int) {
    getSubscriptionPlanDetails(subscriptionPlanID: $subscriptionPlanID) {
      id
      price
      planName
      maximumMembers
      maximumPages
      maximumLeads
      maximumOrders
      maximumProducts
      maximumPromotions
      featureType
      packageType
      dailyPrice
    }
  }
`;

export const GET_SUBSCRIPTION_PLAN_DETAILS_BY_PACKAGE_TYPE = gql`
  query getSubscriptionPlanDetailsByPackageType($packageType: EnumUserSubscriptionPackageType) {
    getSubscriptionPlanDetailsByPackageType(packageType: $packageType) {
      id
      price
      planName
      maximumMembers
      maximumPages
      maximumLeads
      maximumOrders
      maximumProducts
      maximumPromotions
      featureType
      packageType
      dailyPrice
    }
  }
`;

export const CHANGE_SUBSCRIPTION = gql`
  query changingSubscription($subscriptionIndex: Int) {
    changingSubscription(subscriptionIndex: $subscriptionIndex) {
      id
      planId
      planName
      status
      expiredAt
    }
  }
`;

export const CREATE_USER_SUBSCRIPTION = gql`
  mutation createUserSubscription($subscriptionPlanID: Int, $ref: String) {
    createUserSubscription(subscriptionPlanID: $subscriptionPlanID, ref: $ref) {
      id
      user_id
      subscription_id
      role
    }
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation updateInvitedMemberSubscriptionMapping($token: String) {
    updateInvitedMemberSubscriptionMapping(token: $token) {
      id
      planId
      planName
      status
      expiredAt
    }
  }
`;
