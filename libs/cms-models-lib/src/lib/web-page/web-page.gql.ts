import gql from 'graphql-tag';

export const WebPageTypeDefs = gql`
  "Web Page Schema"
  input WebPageInput {
    _id: String
    pageID: Int
    level: Int
    pages: [PageInput]
  }

  input PageInput {
    _id: String
    parentID: String
    orderNumber: Int
    masterPageID: String
    name: String
    isHide: Boolean
    isHomepage: Boolean
    isChildSelected: Boolean
    setting: PageSettingInput
    permission: PagePermissionInput
    configs: [WebsiteConfigurationInput]
    themeLayoutMode: PageThemeLayoutModeInput
  }
  input PageThemeLayoutModeInput {
    useThemeLayoutMode: Boolean
    themeLayoutIndex: Int
  }

  input PageDetailsInput {
    setting: PageSettingInput
    permission: PagePermissionInput
    configs: [WebsiteConfigurationInput]
  }

  input PageSettingInput {
    isOpenNewTab: Boolean
    isMaintenancePage: Boolean
    isIcon: Boolean
    pageIcon: String
    isMega: Boolean
    mega: PageSettingMegaInput
    socialShare: String
  }

  input PageSettingMegaInput {
    primaryType: String
    footerType: String
    primaryOption: String
    footerOption: String
  }

  input PagePermissionInput {
    type: String
    option: PagePermissionOptionInput
  }

  input PagePermissionOptionInput {
    password: String
    onlyPaidMember: Boolean
  }

  input WebsiteConfigurationInput {
    cultureUI: String
    displayName: String
    seo: WebsiteConfigurationSeoInput
    primaryMega: String
    footerMega: String
    mode: String
  }

  input WebsiteConfigurationMegaInput {
    topTitle: String
    description: String
    block: String
    footer: String
  }

  input WebsiteConfigurationSeoInput {
    title: String
    shortUrl: String
    description: String
    keyword: String
  }

  input WebPageOrderNumberInput {
    level: Int
    _id: String
    orderNumber: Int
  }

  input WebPageFromToContainerInput {
    _id: String
    parentID: String
    level: Int
  }

  input UpdateWebPageHomePageInput {
    previousLevel: Int
    previousId: String
    currentLevel: Int
    currentId: String
  }

  input UpdateWebPagesHideInput {
    _id: String
    level: Int
  }

  input MenuHTMLInput {
    sourceType: String
    parentMenuId: String
    cultureUI: String
    menuGroupId: String
  }

  type MenuStyleModel {
    css: String
    js: String
  }

  type WebPageModel {
    _id: String
    level: Int
    pages: [PageModel]
  }

  type PageModel {
    _id: String
    parentID: String
    orderNumber: Int
    masterPageID: String
    themeLayoutMode: PageThemeLayoutMode
    name: String
    isHide: Boolean
    isHomepage: Boolean
    isChildSelected: Boolean
    setting: PageSettingModel
    permission: PagePermissionModel
    configs: [WebsiteConfigurationModel]
  }
  type PageThemeLayoutMode {
    useThemeLayoutMode: Boolean
    themeLayoutIndex: Int
  }

  type PageSettingModel {
    isOpenNewTab: Boolean
    isMaintenancePage: Boolean
    isIcon: Boolean
    pageIcon: String
    isMega: Boolean
    mega: PageSettingMegaModel
    socialShare: String
  }

  type PageSettingMegaModel {
    primaryType: String
    footerType: String
    primaryOption: MegaOptionModel
    footerOption: MegaOptionFooterModel
  }

  union MegaOptionModel = MegaOptionTextImageModel | MegaOptionCustomModel
  union MegaOptionFooterModel = MegaOptionFooterTextImageModel | MegaOptionFooterCustomModel

  type MegaOptionTextImageModel {
    image: String
    imagePosition: String
    linkType: String
    linkParent: String
    linkUrl: String
    isTopTitle: Boolean
    isHTML: Boolean
    textImage: String
  }

  type MegaOptionCustomModel {
    isHTML: Boolean
    custom: String
  }

  type MegaOptionFooterTextImageModel {
    isFooterHTML: Boolean
    textImage: String
  }

  type MegaOptionFooterCustomModel {
    isFooterHTML: Boolean
    custom: String
  }

  type PagePermissionModel {
    type: String
    option: PagePermissionOptionModel
  }

  type PagePermissionOptionModel {
    password: String
    onlyPaidMember: Boolean
  }

  type WebsiteConfigurationModel {
    cultureUI: String
    displayName: String
    seo: WebsiteConfigurationSeoModel
    primaryMega: MegaConfigModel
    footerMega: MegaFooterConfigModel
  }

  union MegaConfigModel = MegaConfigTextImageModel | MegaConfigCustomModel
  union MegaFooterConfigModel = MegaFooterConfigTextImageModel | MegaFooterConfigCustomModel

  type MegaConfigTextImageModel {
    topTitle: String
    description: String
    html: String
    textImage: String
  }

  type MegaConfigCustomModel {
    html: String
    custom: String
  }

  type MegaFooterConfigTextImageModel {
    html: String
    textImage: String
  }

  type MegaFooterConfigCustomModel {
    html: String
    custom: String
  }

  type WebsiteConfigurationSeoModel {
    title: String
    shortUrl: String
    description: String
    keyword: String
  }
  input InputWebPageDelta {
    componentsDelta: InputDeltaPageComponent
    themeComponentsDelta: InputDeltaPageComponent
  }

  extend type Query {
    getWebPagesByPageID: [WebPageModel]
    getWebPageByWebPageID(_id: String): PageModel
    getMenuHTML(menuHTML: MenuHTMLInput): String
    getMenuCssJs(webPageID: String, _id: String, isFromTheme: Boolean): MenuStyleModel
    getHomePageId: HTTPResult
    getLandingWebPageByName(previousWebPageID: String, componentId: String): PageModel
  }

  extend type Mutation {
    createWebPage(level: Int, page: PageInput): PageModel
    updateWebPageDetails(_id: String, pageDetails: PageDetailsInput): HTTPResult
    updateWebPageHomepage(updateWebPageHomePage: UpdateWebPageHomePageInput): HTTPResult
    updateWebPageName(name: String, level: Int, _id: String): HTTPResult
    updateWebPagesHide(updateWebPagesHide: [UpdateWebPagesHideInput], isHide: Boolean): HTTPResult
    updateWebPageOrderNumbers(webPageOrderNumbers: [WebPageOrderNumberInput]): HTTPResult
    updateWebPageFromToContainer(
      previousWebPagePositions: [WebPageFromToContainerInput]
      nextWebPagePositions: [WebPageFromToContainerInput]
      oldWebPageOrderNumbers: [WebPageOrderNumberInput]
      newWebPageOrderNumbers: [WebPageOrderNumberInput]
    ): HTTPResult
    removeWebPageFromContainer(webPagePositions: [WebPageFromToContainerInput], webPageOrderNumbers: [WebPageOrderNumberInput]): HTTPResult
    updatePageChildSelected(_id: String, level: Int, isChildSelected: Boolean): HTTPResult
    updateWebPageAllComponents(webPageDelta: InputWebPageDelta): HTTPResult
  }
`;
