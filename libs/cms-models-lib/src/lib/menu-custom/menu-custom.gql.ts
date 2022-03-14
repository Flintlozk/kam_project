import gql from 'graphql-tag';

export const MenuCustomTypeDefs = gql`
  "Menu Custom Schema"
  input MenuPageMenuInput {
    _id: String
    pageID: Int
    level: Int
    menuGroupId: String
    pages: [PageMenuInput]
  }

  input PageMenuInput {
    _id: String
    parentID: String
    orderNumber: Int
    masterPageID: String
    name: String
    isHide: Boolean
    isHomepage: Boolean
    setting: PageSettingMenuInput
    permission: PagePermissionMenuInput
    configs: [WebsiteConfigurationMenuInput]
  }

  input PageDetailsMenuInput {
    setting: PageSettingMenuInput
    permission: PagePermissionMenuInput
    configs: [WebsiteConfigurationMenuInput]
  }

  input PageSettingMenuInput {
    isOpenNewTab: Boolean
    isMaintenancePage: Boolean
    isIcon: Boolean
    pageIcon: String
    isMega: Boolean
    mega: PageSettingMegaMenuInput
    socialShare: String
  }

  input PageSettingMegaMenuInput {
    primaryType: String
    footerType: String
    primaryOption: String
    footerOption: String
  }

  input PagePermissionMenuInput {
    type: String
    option: PagePermissionOptionMenuInput
  }

  input PagePermissionOptionMenuInput {
    password: String
    onlyPaidMember: Boolean
  }

  input WebsiteConfigurationMenuInput {
    cultureUI: String
    displayName: String
    seo: WebsiteConfigurationSeoMenuInput
    primaryMega: String
    footerMega: String
    mode: String
  }

  input WebsiteConfigurationMegaMenuInput {
    topTitle: String
    description: String
    block: String
    footer: String
  }

  input WebsiteConfigurationSeoMenuInput {
    title: String
    shortUrl: String
    description: String
    keyword: String
  }

  input MenuPageOrderNumberMenuInput {
    level: Int
    _id: String
    orderNumber: Int
  }

  input MenuPageFromToContainerMenuInput {
    _id: String
    parentID: String
    level: Int
  }

  input UpdateMenuPageHomePageMenuInput {
    previousLevel: Int
    previousId: String
    currentLevel: Int
    currentId: String
  }

  input UpdateMenuPagesHideMenuInput {
    _id: String
    level: Int
  }

  type MenuGroupModel {
    _id: String
    name: String
    html: String
  }

  type MenuPageMenuModel {
    _id: String
    level: Int
    menuGroupId: String
    pages: [PageMenuModel]
  }

  type PageMenuModel {
    _id: String
    parentID: String
    orderNumber: Int
    masterPageID: String
    name: String
    isHide: Boolean
    isHomepage: Boolean
    setting: PageSettingMenuModel
    permission: PagePermissionMenuModel
    configs: [WebsiteConfigurationMenuModel]
  }

  type PageSettingMenuModel {
    isOpenNewTab: Boolean
    isMaintenancePage: Boolean
    isIcon: Boolean
    pageIcon: String
    isMega: Boolean
    mega: PageSettingMegaMenuModel
    socialShare: String
  }

  type PageSettingMegaMenuModel {
    primaryType: String
    footerType: String
    primaryOption: MegaOptionMenuModel
    footerOption: MegaOptionFooterMenuModel
  }

  union MegaOptionMenuModel = MegaOptionTextImageMenuModel | MegaOptionCustomMenuModel
  union MegaOptionFooterMenuModel = MegaOptionFooterTextImageMenuModel | MegaOptionFooterCustomMenuModel

  type MegaOptionTextImageMenuModel {
    image: String
    imagePosition: String
    linkType: String
    linkParent: String
    linkUrl: String
    isTopTitle: Boolean
    isHTML: Boolean
    textImage: String
  }

  type MegaOptionCustomMenuModel {
    isHTML: Boolean
    custom: String
  }

  type MegaOptionFooterTextImageMenuModel {
    isFooterHTML: Boolean
    textImage: String
  }

  type MegaOptionFooterCustomMenuModel {
    isFooterHTML: Boolean
    custom: String
  }

  type PagePermissionMenuModel {
    type: String
    option: PagePermissionOptionMenuModel
  }

  type PagePermissionOptionMenuModel {
    password: String
    onlyPaidMember: Boolean
  }

  type WebsiteConfigurationMenuModel {
    cultureUI: String
    displayName: String
    seo: WebsiteConfigurationSeoMenuModel
    primaryMega: MegaConfigMenuModel
    footerMega: MegaFooterConfigMenuModel
  }

  union MegaConfigMenuModel = MegaConfigTextImageMenuModel | MegaConfigCustomMenuModel
  union MegaFooterConfigMenuModel = MegaFooterConfigTextImageMenuModel | MegaFooterConfigCustomMenuModel

  type MegaConfigTextImageMenuModel {
    topTitle: String
    description: String
    html: String
    textImage: String
  }

  type MegaConfigCustomMenuModel {
    html: String
    custom: String
  }

  type MegaFooterConfigTextImageMenuModel {
    html: String
    textImage: String
  }

  type MegaFooterConfigCustomMenuModel {
    html: String
    custom: String
  }

  type WebsiteConfigurationSeoMenuModel {
    title: String
    shortUrl: String
    description: String
    keyword: String
  }

  extend type Query {
    getMenuGroup: [MenuGroupModel]
    getMenuPagesByPageID(menuGroupId: String): [MenuPageMenuModel]
    getMenuPageByMenuPageID(_id: String, menuGroupId: String): PageMenuModel
  }

  extend type Mutation {
    createMenuPage(level: Int, page: PageMenuInput, menuGroupId: String): PageMenuModel
    updateMenuPageDetails(_id: String, pageDetails: PageDetailsMenuInput, menuGroupId: String): HTTPResult
    updateMenuPageHomepage(updateMenuPageHomePage: UpdateMenuPageHomePageMenuInput, menuGroupId: String): HTTPResult
    updateMenuPageName(name: String, level: Int, _id: String, menuGroupId: String): HTTPResult
    updateMenuPagesHide(updateMenuPagesHide: [UpdateMenuPagesHideMenuInput], isHide: Boolean, menuGroupId: String): HTTPResult
    updateMenuPageOrderNumbers(menuPageOrderNumbers: [MenuPageOrderNumberMenuInput], menuGroupId: String): HTTPResult
    updateMenuPageFromToContainer(
      previousMenuPagePositions: [MenuPageFromToContainerMenuInput]
      nextMenuPagePositions: [MenuPageFromToContainerMenuInput]
      oldMenuPageOrderNumbers: [MenuPageOrderNumberMenuInput]
      newMenuPageOrderNumbers: [MenuPageOrderNumberMenuInput]
      menuGroupId: String
    ): HTTPResult
    removeMenuPageFromContainer(menuPagePositions: [MenuPageFromToContainerMenuInput], menuPageOrderNumbers: [MenuPageOrderNumberMenuInput], menuGroupId: String): HTTPResult
  }
`;
