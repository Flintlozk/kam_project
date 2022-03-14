import { AddressData, addressDataResolverInit, AddressDataTypeDefs } from '@reactor-room/itopplus-back-end-helpers';
import { CommonTypeDefs, LoginTypeDefs, UserRegistrationTypeDefs } from '@reactor-room/model-lib';
import {
  AdminCustomersTypeDefs,
  AdminLogisticsTypeDefs,
  AudienceContactTypeDefs,
  AudienceListTypeDefs,
  AudienceStepListTypeDefs,
  CustomerCloseReasonTypeDefs,
  CustomerCompaniesTypeDefs,
  CustomerSLATimeTypeDefs,
  CustomerTagTypeDefs,
  CustomerTypeDefs,
  DashboardTypeDefs,
  DevTypeDefs,
  FacebookCommentsTypeDefs,
  FacebookMessageTypeDefs,
  FacebookPipelineStepsTypeDefs,
  FacebookPipelineTypeDefs,
  FacebookPostTypeDefs,
  LeadsTypeDefs,
  LineMessageTypeDefs,
  LogisticTypeDefs,
  LogTypeDefs,
  LotNumberTypeDefs,
  NotificationTypeDefs,
  OrganizationTypeDefs,
  PageMemberTypeDefs,
  PagesCreatedTypeDefs,
  PageSettingsTypeDefs,
  PagesThirdPartyTypeDefs,
  PagesTypeDefs,
  PaperTypeDefs,
  PaymentTypeDefs,
  PDPATypeDefs,
  PlusmarCommonTypeDefs,
  ProductAttributeListTypeDefs,
  ProductCategoryListTypeDefs,
  ProductCatelogTypeDefs,
  ProductListTypeDefs,
  ProductMarketPlaceTypeDefs,
  ProductStatusTypeDefs,
  ProductTagTypeDefs,
  PurchaseOrderTypeDefs,
  QuickPayTypeDefs,
  ResourceLimitValidationTypeDefs,
  SubscriptionOrderTypeDefs,
  SubscriptionTypeDefs,
  TaxTypeDefs,
  TopupHistoriesTypeDefs,
  UserTypeDefs,
  AdminMigrationsTypeDefs,
  ScalarTypeDefs,
  FilesTypeDefs,
} from '@reactor-room/itopplus-model-lib';
import { merge } from 'lodash';
import address from '../assets/static/address-database.json';
import { adminCustomersResolver, adminLogisticResolver } from '../controllers/admin';
import { audienceContactResolver, audienceHistoryResolver, audienceResolver } from '../controllers/audience';
import { loginFacebookResolver, LoginGoogleResolver, LoginTestResolver } from '../controllers/auth';
import { pageCreatedResolver } from '../controllers/common';
import { companyResolver } from '../controllers/company';
import { customerClosedReasonResolver, customerResolver, customerSLAResolver } from '../controllers/customer';
import { dashboardResolver } from '../controllers/dashboard/dashboard.controller';
import { filesResolver } from '../controllers/file/files.controller';
import { devResolver } from '../controllers/dev/dev.controller';
import { facebookCommentResolver } from '../controllers/facebook/comments';
import { facebookMessageResolver } from '../controllers/facebook/message';
import { facebookMessagePipelineResolver } from '../controllers/facebook/pipeline';
import { facebookPostResolver } from '../controllers/facebook/post';
import { leadsResolver } from '../controllers/leads';
import { lineMessageResolver } from '../controllers/line/message';
import { lineMessagePipelineResolver } from '../controllers/line/message/pipeline-message.controller';
import { logisticSystemResolver } from '../controllers/logistic/logistic-system.controller';
import { notificationResolver } from '../controllers/notification';
import { orderHistoryResolver } from '../controllers/order-history';
import { organizationDashboardResolver } from '../controllers/organization';
import { pageSettingsResolver } from '../controllers/page-settings/page-settings.controller';
import { pagesResolver, pagesThirdPartyResolver } from '../controllers/pages';
import { paperResolver } from '../controllers/paper/paper.controller';
import { paymentResolver } from '../controllers/payment';
import { PDPAResolver } from '../controllers/pdpa';
import { productCatalogResolver, productResolver } from '../controllers/product';
import { productMarketPlaceResolver } from '../controllers/product/product-marketplace.controller';
import {
  purchaseOrderFailedHistoryResolver,
  purchaseOrderPipelineResolver,
  purchaseOrderResolver,
  purchaseOrderResolveResolver,
  purchaseOrderUpdateResolver,
} from '../controllers/purchase-order';
import { purchaseMarketPlaceOrderResolver } from '../controllers/purchase-order/purchase-order-marketplace.controller';
import { purchaseOrderRefundResolver } from '../controllers/purchase-order/purchase-order-refund.controller';
import { quickPayResolver } from '../controllers/quick-pay/quick-pay-controller';
import { registerResolver } from '../controllers/register';
import { resourceValidationResolver } from '../controllers/resource-validation';
import { logisticsResolver, lotNumberResolver, pageMemberResolver, settingResolver, taxResolver } from '../controllers/setting';
import { logResolver } from '../controllers/setting/log/log.controllers';
import { subscriptionResolver } from '../controllers/subscription';
import { topUpHistoriesResolver } from '../controllers/topup/topup.controller';
import { userResolver } from '../controllers/user';
import { workingHourResolver } from '../controllers/working-hour/working-hour.controller';
import { adminMigrationsResolver } from '../controllers/admin/migrations';
import { ScalarResolver } from '../controllers/scalar/scalar.controller';
const addressData: AddressData[] = JSON.parse(JSON.stringify(address));

export const resolvers = merge(
  ScalarResolver,
  devResolver, // DEV ONLY
  //
  adminCustomersResolver,
  adminLogisticResolver,
  adminMigrationsResolver,
  //
  LoginTestResolver,
  loginFacebookResolver,
  LoginGoogleResolver,
  userResolver,
  registerResolver,
  customerResolver,
  companyResolver,
  customerClosedReasonResolver,
  productResolver,
  facebookMessageResolver,
  facebookCommentResolver,
  facebookPostResolver,
  facebookMessagePipelineResolver,
  paymentResolver,
  subscriptionResolver,
  orderHistoryResolver,
  pagesResolver,
  audienceResolver,
  audienceContactResolver,
  audienceHistoryResolver,
  settingResolver,
  logisticsResolver,
  logisticSystemResolver,
  lotNumberResolver,
  taxResolver,
  pageMemberResolver,
  purchaseOrderResolver,
  purchaseOrderFailedHistoryResolver,
  purchaseOrderRefundResolver,
  purchaseOrderPipelineResolver,
  purchaseOrderUpdateResolver,
  purchaseOrderResolveResolver,
  purchaseMarketPlaceOrderResolver,
  leadsResolver,
  pageCreatedResolver,
  logResolver,
  dashboardResolver,
  filesResolver,
  resourceValidationResolver,
  notificationResolver,
  pagesThirdPartyResolver,
  productMarketPlaceResolver,
  lineMessageResolver,
  lineMessagePipelineResolver,
  topUpHistoriesResolver,
  paperResolver,
  pageSettingsResolver,
  customerSLAResolver,
  PDPAResolver,
  organizationDashboardResolver,
  workingHourResolver,
  addressDataResolverInit(addressData),
  quickPayResolver,
  productCatalogResolver,
);

export const typeDefs = [
  ScalarTypeDefs,
  DevTypeDefs, // DEV ONLY
  //
  AdminLogisticsTypeDefs,
  AdminCustomersTypeDefs,
  AdminMigrationsTypeDefs,
  //
  AudienceContactTypeDefs,
  LoginTypeDefs,
  CommonTypeDefs,
  PlusmarCommonTypeDefs,
  UserTypeDefs,
  CustomerTypeDefs,
  CustomerCloseReasonTypeDefs,
  ProductStatusTypeDefs,
  ProductTagTypeDefs,
  ProductListTypeDefs,
  ProductCategoryListTypeDefs,
  ProductAttributeListTypeDefs,
  FacebookMessageTypeDefs,
  FacebookCommentsTypeDefs,
  FacebookPostTypeDefs,
  LeadsTypeDefs,
  FacebookPipelineTypeDefs,
  UserRegistrationTypeDefs,
  FacebookPipelineStepsTypeDefs,
  PaymentTypeDefs,
  SubscriptionTypeDefs,
  PagesCreatedTypeDefs,
  SubscriptionOrderTypeDefs,
  PagesTypeDefs,
  PagesThirdPartyTypeDefs,
  AudienceListTypeDefs,
  AudienceStepListTypeDefs,
  LogisticTypeDefs,
  LotNumberTypeDefs,
  TaxTypeDefs,
  PageMemberTypeDefs,
  PurchaseOrderTypeDefs,
  AddressDataTypeDefs,
  LogTypeDefs,
  DashboardTypeDefs,
  FilesTypeDefs,
  CustomerTagTypeDefs,
  ResourceLimitValidationTypeDefs,
  NotificationTypeDefs,
  ProductMarketPlaceTypeDefs,
  CustomerCompaniesTypeDefs,
  LineMessageTypeDefs,
  TopupHistoriesTypeDefs,
  PaperTypeDefs,
  PageSettingsTypeDefs,
  CustomerSLATimeTypeDefs,
  PDPATypeDefs,
  OrganizationTypeDefs,
  QuickPayTypeDefs,
  ProductCatelogTypeDefs,
];
