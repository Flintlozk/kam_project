import gql from 'graphql-tag';
import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';

Joi.extend(JoiDate);
export interface ISubscriptionBudget {
  currentBudget: number;
  updatedAt: Date;
  storageAccount: string;
}
export interface ISubscriptionArg {
  token: string;
  subscriptionIndex: number;
  subscriptionPlanID: number;
  ref: string;
  packageType: EnumSubscriptionPackageType;
}

export interface ISubscriptionUserDetail {
  name: string;
  email: string;
  tel: string;
  created_at: Date;
  expired_at: Date;
  plan_id: number;
  sub_id: string;
}
export interface ISubscription {
  id: string;
  planId?: number;
  planName?: string;
  packageType?: EnumSubscriptionPackageType;
  status: boolean;
  role: EnumUserSubscriptionType;
  createdAt?: Date;
  expiredAt?: Date;
  daysRemaining?: number;
  storageAccount?: string;
}

export interface ISubscriptionContext extends ISubscription {
  subscriptionIndex: number;
  isExpired?: boolean;
}

export interface IUserSubscriptionMappingModel {
  id: number;
  user_id: number;
  subscription_id: string;
  created_at: Date;
  updated_at: Date;
  role: EnumUserSubscriptionType;
}

export interface IPlanLimitAndDetails {
  planName: string;
  maximumPages: number;
  maximumLeads: number;
  maximumMembers: number;
  maximumOrders: number;
  maximumProducts: number;
  maximumPromotions: number;
  price?: number;
  dailyPrice?: number;
  featureType?: EnumSubscriptionFeatureType;
  packageType?: EnumSubscriptionPackageType;
}

export interface ISubscriptionLimitAndDetails extends IPlanLimitAndDetails {
  id: string;
  planId: number;
}

export interface ISubscriptionPlan extends IPlanLimitAndDetails {
  id: number;
}
export interface ISubscriptionIDObject {
  id: string;
}

export interface ISubscriptionMappingIDObject {
  id: number;
}

export interface IUserSubscriptionsContext {
  id: number;
  name: string;
  profileImage: string;
  subscription?: ISubscriptionContext;
  subscriptions: ISubscriptionContext[];
}

export interface IUserSubscriptionModel {
  userId: number;
  name: string;
  id: string;
  profileImg: string;
  planId: number;
  planName: string;
  packageType?: EnumSubscriptionPackageType;
  role: EnumUserSubscriptionType;
  status: boolean;
  expiredAt?: Date;
  storageAccount?: string;
}

export enum EnumSubscriptionFeatureType {
  FREE = 'FREE',
  BUSINESS = 'BUSINESS',
  COMMERCE = 'COMMERCE',
}
export enum EnumSubscriptionPackageType {
  FREE = 'FREE',
  SME_BUSINESS = 'SME_BUSINESS',
  BUSINESS = 'BUSINESS',
  ENTERPRISE_BUSINESS = 'ENTERPRISE_BUSINESS',
  STARTER_COMMERCE = 'STARTER_COMMERCE',
  PRO_PLUS_COMMERCE = 'PRO_PLUS_COMMERCE',
  COMMERCE = 'COMMERCE',
}
export enum EnumSubscriptionPackageTypeID {
  FREE,
  SME_BUSINESS,
  BUSINESS,
  ENTERPRISE_BUSINESS,
  STARTER_COMMERCE,
  PRO_PLUS_COMMERCE,
  COMMERCE,
}

export enum EnumUserSubscriptionType {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

export const SubscriptionTypeDefs = gql`
  "Subscription Schema"
  type SubscriptionModel {
    id: String
    planId: Int
    planName: String
    status: Boolean
    role: EnumUserSubscriptionType
    expiredAt: Date
    isExpired: Boolean
  }

  type SubscriptionPlan {
    id: Int
    planName: String
    maximumPages: Int
    maximumLeads: Int
    maximumMembers: Int
    maximumOrders: Int
    maximumProducts: Int
    maximumPromotions: Int
    price: Int
    dailyPrice: Int
    featureType: EnumSubscriptionFeatureType
    packageType: EnumUserSubscriptionPackageType
  }

  type SubscriptionContext {
    subscriptionIndex: Int
    id: String
    planId: Int
    planName: String
    packageType: EnumUserSubscriptionPackageType
    role: EnumUserSubscriptionType
    daysRemaining: Int
    isExpired: Boolean
  }

  type UserSubscriptionContextWithExpiredStatus {
    id: String
    planId: Int
    planName: String
    status: Boolean
    expiredAt: Date
    isExpired: Boolean
    subscriptionIndex: Int
    role: EnumUserSubscriptionType
  }

  type UserSubscriptionMappingModel {
    id: Int
    user_id: Int
    subscription_id: String
    created_at: Date
    updated_at: Date
    role: EnumUserSubscriptionType
  }
  type UserSubscriptionsContext {
    id: Int
    name: String
    profileImage: String
    subscription: SubscriptionContext
    subscriptions: [SubscriptionContext]
  }

  type SubscriptionLimitAndDetails {
    price: Float
    planName: String
    maximumPages: Int
    maximumMembers: Int
    maximumLeads: Int
    maximumOrders: Int
    maximumProducts: Int
    maximumPromotions: Int
    featureType: EnumSubscriptionFeatureType
    packageType: EnumUserSubscriptionPackageType
  }

  enum EnumSubscriptionFeatureType {
    FREE
    BUSINESS
    COMMERCE
  }

  enum EnumUserSubscriptionPackageType {
    FREE
    SME_BUSINESS
    BUSINESS
    ENTERPRISE_BUSINESS
    STARTER_COMMERCE
    PRO_PLUS_COMMERCE
    COMMERCE
  }

  enum EnumUserSubscriptionType {
    OWNER
    MEMBER
  }

  type SubscriptionBudget {
    currentBudget: Int
    updatedAt: Date
  }

  extend type Query {
    getAndUpdateSubscriptionContext(subscriptionIndex: Int): UserSubscriptionsContext
    getSubscriptionBudget: SubscriptionBudget
    changingSubscription(subscriptionIndex: Int): SubscriptionModel
    getSubscriptionLimitAndDetails: SubscriptionLimitAndDetails
    getUserSubscription: UserSubscriptionMappingModel
    getSubscriptionPlanDetails(subscriptionPlanID: Int): SubscriptionPlan
    getSubscriptionPlanDetailsByPackageType(packageType: EnumUserSubscriptionPackageType): SubscriptionPlan
  }

  extend type Mutation {
    updateInvitedMemberSubscriptionMapping(token: String): SubscriptionModel
    createUserSubscription(subscriptionPlanID: Int, ref: String): UserSubscriptionMappingModel
  }

  extend type Subscription {
    onSubscriptionChangingSubscription: HTTPResult
  }
`;

export const SubscriptionObjectValidate = {
  id: Joi.string().required(),
  planId: Joi.number().required(),
  planName: Joi.string().required(),
  role: Joi.string().required(),
  status: Joi.boolean().required(),
  expiredAt: Joi.string().required().allow(null),
};

export const SubscriptionWithExpiredStatusObjectValidate = {
  id: Joi.string().required(),
  planId: Joi.number().required(),
  planName: Joi.string().required(),
  status: Joi.boolean().required(),
  role: Joi.string().required(),
  expiredAt: Joi.string().required().allow(null),
  isExpired: Joi.boolean().required().allow(null),
};

export const ResponseSubscriptionContext = {
  id: Joi.string().required(),
  planId: Joi.number().required(),
  planName: Joi.string().required(),
  status: Joi.boolean().required(),
  role: Joi.string().required(),
  expiredAt: Joi.string().required(),
  isExpired: Joi.boolean().required(),
  subscriptionIndex: Joi.number().required(),
};

export const SubscriptionIndexValidate = {
  subscriptionIndex: Joi.number().required(),
};

export const CreateSubscriptionInputValidate = {
  subscriptionPlanID: Joi.number().required(),
  ref: Joi.string().allow(''),
};

export const SubscriptionPlanFeatureTypeValidate = {
  packageType: Joi.string().required(),
};

export const UserSubscriptionMappingModelResponseValidate = {
  id: Joi.number().required(),
  user_id: Joi.number().required(),
  subscription_id: Joi.string().required(),
  role: Joi.string().required(),
};

export const subscriptionLimitResponseValidate = {
  price: Joi.number().required(),
  planName: Joi.string().required(),
  maximumPages: Joi.number().required(),
  maximumMembers: Joi.number().required(),
  maximumLeads: Joi.number().required(),
  maximumOrders: Joi.number().required(),
  maximumProducts: Joi.number().required(),
  maximumPromotions: Joi.number().required(),
  featureType: Joi.string().required(),
  packageType: Joi.string().required(),
};

export const subsciptionPlanValidate = {
  id: Joi.number().required(),
  price: Joi.number().required(),
  planName: Joi.string().required(),
  maximumPages: Joi.number().required(),
  maximumMembers: Joi.number().required(),
  maximumLeads: Joi.number().required(),
  maximumOrders: Joi.number().required(),
  maximumProducts: Joi.number().required(),
  maximumPromotions: Joi.number().required(),
  featureType: Joi.string().required(),
  packageType: Joi.string().required(),
  dailyPrice: Joi.number().required(),
};

export const userSubscriptionContextResponseValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  profileImage: Joi.string(),
  subscription: Joi.object().keys({
    subscriptionIndex: Joi.number().required(),
    id: Joi.string().required(),
    planName: Joi.string().required(),
    packageType: Joi.string().required(),
    planId: Joi.number().required(),
    role: Joi.string().required(),
    daysRemaining: Joi.number().required(),
    isExpired: Joi.boolean(),
  }),
  subscriptions: Joi.array().items({
    subscriptionIndex: Joi.number().required(),
    id: Joi.string().required(),
    planName: Joi.string().required(),
    packageType: Joi.string().required(),
    planId: Joi.number().required(),
    role: Joi.string().required(),
    daysRemaining: Joi.number().required(),
  }),
};

export const getSubscriptionBudgetResponseValidate = {
  currentBudget: Joi.number().required(),
  updatedAt: Joi.string().required(),
};
