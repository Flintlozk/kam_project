import {
  CategoryTypeDefs,
  ComponentGQL,
  ComponentOptionsGQL,
  ConfigTypeDefs,
  ContentsTypeDefs,
  ContentPatternsTypeDefs,
  DefaultTypeDefs,
  FilesTypeDefs,
  LanguageTypeDefs,
  MenuCustomTypeDefs,
  MenuPageTypeDefs,
  PublishTypeDefs,
  TagsTypeDefs,
  ThemeTypeDefs,
  UserManagementTypeDef,
  WebPageTypeDefs,
  ContentPatternsLandingTypeDefs,
} from '@reactor-room/cms-models-lib';
import { CommonTypeDefs, LoginTypeDefs } from '@reactor-room/model-lib';
import {
  LogisticTypeDefs,
  LotNumberTypeDefs,
  PageMemberTypeDefs,
  PagesThirdPartyTypeDefs,
  PagesTypeDefs,
  PaymentTypeDefs,
  PlusmarCommonTypeDefs,
  ProductAttributeListTypeDefs,
  ProductCategoryListTypeDefs,
  ProductListTypeDefs,
  ProductMarketPlaceTypeDefs,
  ProductStatusTypeDefs,
  ProductTagTypeDefs,
  ResourceLimitValidationTypeDefs,
  SubscriptionTypeDefs,
  TopupHistoriesTypeDefs,
  UserTypeDefs,
  //ProductLowInventoryTypeDefs
} from '@reactor-room/itopplus-model-lib';
import { merge } from 'lodash';
import address from '../assets/static/address-database.json';
import { getUserManagement } from '../controllers/admin/';
import { loginFacebookResolver } from '../controllers/auth';
import { componentResolver } from '../controllers/component';
import { configResolver } from '../controllers/config/config.controller';
import { contentsResolver } from '../controllers/contents/contents.controller';
import { autodigiLinkResolver, autodigiSubscriptionResolver } from '../controllers/autodigi';
import { AutodigiWebstatTypeDefs, AutodigiLinkTypeDefs, AutodigiSubscriptionTypeDefs } from '@reactor-room/autodigi-models-lib';
import { apolloDefaultResolver } from '../controllers/default/apollo-default.controller';
import { filesResolver } from '../controllers/files/files.controller';
import { languageResolver } from '../controllers/language/language.controller';
import { menuPageResolver } from '../controllers/menu-custom';
import { pagesResolver } from '../controllers/pages';
import { pagesThirdPartyResolver } from '../controllers/pages/pages-third-party.controller';
import { productMarketPlaceResolver, productResolver } from '../controllers/products';
import { publishResolver } from '../controllers/publish//publish.controller';
import { resourceValidationResolver } from '../controllers/resource-validation';
import { settingResolver } from '../controllers/setting';
import { subscriptionResolver } from '../controllers/subscription';
import { tagsResolver } from '../controllers/tags/tags.controller';
import { themeResolver } from '../controllers/theme/theme.controller';
import { userResolver } from '../controllers/user';
import { webPageResolver } from '../controllers/web-page';
import { autodigiWebstatResolver } from '../controllers/autodigi/autodigi-webstat.controller';
import { ecoSystemResolver } from '../controllers/ecosystem';
import { dashboardMessageController } from '../controllers/dashboard/dashboard-message.controller';
import { dashboardOrderController } from '../controllers/dashboard/dashboard-order.controller';
import { DashboardMessageTypeDefs } from '@reactor-room/cms-models-lib';
import { OrderListTypeDefs } from '@reactor-room/cms-models-lib';
import { LogTypeDefs } from '../gql/log/log.model.gql';
import { settingLogResolver } from '../controllers/setting/log.controller';
import { pageCreatedResolver } from '../controllers/setting/page-created.controller';
import { PagesCreatedTypeDefs } from '../gql/page-created/page-created.model.gql';
import { paymentResolver } from '../controllers/setting/payment.controller';
import { logisticsResolver } from '../controllers/logistics/logistics.controllers';
import { lotNumberResolver } from '../controllers/lot-number/lot-number.controller';
import { LogisticsSystemTypeDefs } from '../gql/logistics/logistics-system.gql';
import { logisticSystemResolver } from '../controllers/logistics/logistic-system.controller';
import { pageSettingsResolver } from '../controllers/setting/page-setting.controller';
import { PageSettingsTypeDefs } from '../gql/page-setting/page-setting.gql';
import { taxResolver } from '../controllers/tax/tax.controller';
import { TaxTypeDefs } from '../gql/tax/tax.model.gql';
import { topUpHistoriesResolver } from '../controllers/topup';
import { pageMemberResolver } from '../controllers/page-member/page-member.controller';
import { categoryResolver } from '../controllers/category/category.controller';
import { productLowInventoryResolver } from '../controllers/products/product-low-inventory.controller';
import { ProductLowInventoryTypeDefs } from 'libs/itopplus-model-lib/src/lib/product/product-low-inventory.gql';
import { contentCategoryResolver } from '../controllers/contents/category.controller';
import { contentPatternsResolver } from '../controllers/content-patterns/content-patterns.controller';
import { contentPatternsLandingResolver } from '../controllers/content-patterns-landing/content-patterns-landing.controller';
import { AddressData, addressDataResolverInit, AddressDataTypeDefs } from '@reactor-room/itopplus-back-end-helpers';
const addressData: AddressData[] = JSON.parse(JSON.stringify(address));

export const resolvers = merge(
  apolloDefaultResolver,
  themeResolver,
  loginFacebookResolver,
  subscriptionResolver,
  pagesResolver,
  componentResolver,
  webPageResolver,
  userResolver,
  contentsResolver,
  contentPatternsResolver,
  contentPatternsLandingResolver,
  categoryResolver,
  filesResolver,
  tagsResolver,
  menuPageResolver,
  languageResolver,
  configResolver,
  getUserManagement,
  autodigiLinkResolver,
  autodigiSubscriptionResolver,
  productResolver,
  resourceValidationResolver,
  settingResolver,
  pagesThirdPartyResolver,
  productMarketPlaceResolver,
  publishResolver,
  autodigiWebstatResolver,
  ecoSystemResolver,
  dashboardMessageController,
  dashboardOrderController,
  productLowInventoryResolver,
  settingLogResolver,
  paymentResolver,
  logisticsResolver,
  lotNumberResolver,
  logisticSystemResolver,
  pageSettingsResolver,
  taxResolver,
  topUpHistoriesResolver,
  pageMemberResolver,
  pageCreatedResolver,
  contentCategoryResolver,
  addressDataResolverInit(addressData),
);
export const typeDefs = [
  DefaultTypeDefs,
  ThemeTypeDefs,
  LoginTypeDefs,
  SubscriptionTypeDefs,
  PagesTypeDefs,
  PageMemberTypeDefs,
  PagesThirdPartyTypeDefs,
  CommonTypeDefs,
  ComponentGQL.ComponentTypeDefs,
  ComponentOptionsGQL.ComponentOptionsTypeDefs,
  UserManagementTypeDef,
  WebPageTypeDefs,
  UserTypeDefs,
  PlusmarCommonTypeDefs,
  ProductStatusTypeDefs,
  ProductTagTypeDefs,
  ProductMarketPlaceTypeDefs,
  ProductAttributeListTypeDefs,
  ProductCategoryListTypeDefs,
  MenuCustomTypeDefs,
  MenuPageTypeDefs,
  LanguageTypeDefs,
  ConfigTypeDefs,
  ProductListTypeDefs,
  ResourceLimitValidationTypeDefs,
  ContentsTypeDefs,
  ContentPatternsTypeDefs,
  ContentPatternsLandingTypeDefs,
  CategoryTypeDefs,
  AutodigiLinkTypeDefs,
  AutodigiSubscriptionTypeDefs,
  FilesTypeDefs,
  TagsTypeDefs,
  PublishTypeDefs,
  DashboardMessageTypeDefs,
  CategoryTypeDefs,
  LogTypeDefs,
  PagesCreatedTypeDefs,
  PaymentTypeDefs,
  LogisticTypeDefs,
  LotNumberTypeDefs,
  LogisticsSystemTypeDefs,
  PageSettingsTypeDefs,
  TopupHistoriesTypeDefs,
  AddressDataTypeDefs,
  AutodigiWebstatTypeDefs,
  OrderListTypeDefs,
  ProductLowInventoryTypeDefs,
  TaxTypeDefs,
];
