import gql from 'graphql-tag';

export const PagesTypeDefs = gql`
  "Pages Schema"
  type FacebookPageData {
    access_token: String
    category: String
    category_list: [FacebookPageDataCategoryList]
    name: String
    username: String
    id: String
    tasks: [String]
    picture: String
    advanced_settings: PageAdvanceSettings
  }

  type PageAdvanceSettings {
    auto_reply: Boolean
    direct_message: [PageSettingsDirectMessage]
  }
  input QuilDescription {
    description: String
  }
  input PageSettingsInput {
    auto_reply: Boolean
    direct_message: [PageSettingsDirectMessageInput]
  }
  input MessageSettingInput {
    message1: String
    message2: String
    message3: String
    message4: String
    message5: String
    message6: String
    message7: String
    message8: String
    message9: String
    message10: String
    message11: String
    message12: String
    message13: String
    message14: String
    terms_condition: String
    message18: String
    message19: String
    type: String
  }
  input QuilDesctiptionInput {
    quill: QuilDescription
  }
  input PageSettingsDirectMessageInput {
    type: String
    class: String
    label: String
    title: String
    image: String
    defaultLabel: String
    defaultTitle: String
  }

  input PageFlatStatusWithFeeInput {
    flatStatus: Boolean
    fee: Float
  }
  type PageSettingsDirectMessage {
    type: String
    class: String
    label: String
    title: String
    image: String
    defaultLabel: String
    defaultTitle: String
  }

  type PageContextSettings {
    page_id: Int
    status: Boolean
    setting_type: String
    options: String
  }

  type PageContext {
    pageIndex: Int
    pageId: Int
    pageName: String
    pageRole: EnumPageMemberType
    picture: String
    wizardStep: EnumWizardStepType
    pageSettings: [PageContextSettings]
    pageAppScope: [EnumAppScopeType]
  }

  type PageFeeInfo {
    flat_status: Boolean
    delivery_fee: Float
  }

  type FacebookPageDataCategoryList {
    id: String
    name: String
  }

  type PageWithOwnerInfo {
    user_email: String
    page_id: Int
    page_name: String
  }

  input FacebookPageDataCategoryListInput {
    id: String
    name: String
  }

  input FacebookPageDataInput {
    access_token: String
    category: String
    category_list: [FacebookPageDataCategoryListInput]
    name: String
    id: String
    tasks: [String]
    picture: String
    matchOwner: Boolean
  }

  input AddNewPageCurrencyInput {
    currencyImgUrl: String
    currencyTitle: String
  }

  input AddNewPageLanguageInput {
    languageImgUrl: String
    languageTitle: String
  }

  input AddNewPageAddressInput {
    mainAddress: String
    district: String
    province: String
    postCode: String
    country: String
  }

  input AddressLocationInput {
    city: String
    district: String
    post_code: String
    province: String
  }

  input AddNewPageInput {
    shopProfileUrl: String
    firstName: String
    lastName: String
    phoneNo: String
    shopName: String
    email: String
    lineId: String
    facebook: String
    address: AddNewPageAddressInput
    currency: AddNewPageCurrencyInput
    language: AddNewPageLanguageInput
    facebookPage: FacebookPageDataInput
  }

  input AddShopProfile {
    firstName: String
    lastName: String
    phoneNo: String
    shopName: String
    email: String
    facebookid: String
    facebookpic: String
    access_token: String
    address: String
    location: AddressLocationInput
    country: String
    currency: AddNewPageCurrencyInput
    language: AddNewPageLanguageInput
    socialFacebook: String
    socialLine: String
    socialShopee: String
    socialLazada: String
    basicid: String
    channelid: Int
    channelsecret: String
    channeltoken: String
    premiumid: String
    userid: String
    pictureurl: String
    displayname: String
    is_type_edit: Boolean
  }

  type AddressFanPage {
    mainAddress: String
    district: String
    province: String
    postCode: String
    country: String
  }

  type AddressLocation {
    amphoe: String
    district: String
    post_code: String
    province: String
  }

  type LanguageFanPage {
    languageImgUrl: String
    languageTitle: String
  }

  type CurrencyFanPage {
    currencyImgUrl: String
    currencyTitle: String
  }

  type FanPageShopDetail {
    shopProfileUrl: String
    firstName: String
    lastName: String
    shopName: String
    email: String
    lineId: String
    facebook: String
    address: AddressFanPage
    currency: CurrencyFanPage
    language: LanguageFanPage
  }

  type ShopProfileDetail {
    shopProfileUrl: String
    firstName: String
    phoneNo: String
    lastName: String
    shopName: String
    email: String
    lineId: String
    facebookid: String
    facebookpic: String
    accesstoken: String
    address: String
    location: AddressLocation
    country: String
    currency: CurrencyFanPage
    language: LanguageFanPage
    socialFacebook: String
    socialLine: String
    socialShopee: String
    socialLazada: String
  }

  type CompanyInfo {
    company_name: String
    company_logo: String
    branch_name: String
    branch_id: String
    tax_identification_number: String
    tax_id: Int
    phone_number: String
    email: String
    fax: String
    address: String
    post_code: String
    sub_district: String
    district: String
    province: String
    country: String
  }

  type ShopProfile {
    id: Int
    firstname: String
    lastname: String
    tel: String
    page_name: String
    page_role: EnumPageMemberType
    email: String
    address: String
    currency: String
    language: String
    fb_page_id: String
    shop_picture: String
    post_code: String
    amphoe: String
    district: String
    province: String
    country: String
    social_facebook: String
    social_line: String
    social_shopee: String
    social_lazada: String
  }

  input CompanyInfoInput {
    company_name: String
    company_logo: String
    company_logo_file: Upload
    branch_name: String
    branch_id: String
    tax_identification_number: String
    tax_id: Int
    phone_number: String
    email: String
    fax: String
    address: String
    post_code: String
    sub_district: String
    district: String
    province: String
    country: String
  }

  type userPhoneDetail {
    tel: String
  }
  type LogisticTrackingType {
    delivery_type: String
    tracking_type: String
    cod_status: Boolean
  }
  type SubscriptionSettingDetail {
    package: String
    pagelimit: Int
    pageusing: Int
    daysRemaining: Int
    expiredDate: String
  }

  type PageMemberDetail {
    memberlimit: Int
    memberusing: Int
  }

  type FacebookPageWithBindedPageStatus {
    facebook_page: FacebookPageData
    is_binded: Boolean
    email: String
  }

  type messageModel {
    message1: String
    message2: String
    message3: String
    message4: String
    message5: String
    message6: String
    message7: String
    message8: String
    message9: String
    message10: String
    message11: String
    message12: String
    message13: String
    message14: String
    message15: String
    message16: String
    message17: String
    message18: String
    message19: String
    terms_condition: String
  }

  type SocialConnect {
    facebook: FacebookPageData
    line: LineOaData
    shopee: PagesThirdPartyModel
    lazada: PagesThirdPartyModel
  }

  type LineOaData {
    name: String
    picture: String
    id: String
  }

  input LineSetting {
    basicid: String
    channelid: Int
    channelsecret: String
    channeltoken: String
    is_type_edit: Boolean
  }

  type LineSettingModel {
    basicid: String
    channelid: Int
    channelsecret: String
    channeltoken: String
    id: Int
    uuid: String
  }

  type VerifyLineSettingModel {
    displayname: String
    pictureurl: String
    premiumid: String
    userid: String
  }

  type PagesAPISettingModel {
    benabled_api: Boolean
    api_client_id: String
    api_client_secret: String
  }

  enum EnumWizardStepType {
    CMS_DEFAULT
    STEP_CONNECT_FACEBOOK
    STEP_SET_SHOP_INFO
    STEP_SET_LOGISTIC
    STEP_SET_PAYMENT
    SETUP_SUCCESS
  }

  enum EnumAppScopeType {
    MORE_COMMERCE
    AUTO_DIGI
    CRM
    CMS
  }

  type CheckPageFacebookConnectedResponse {
    isConnected: Boolean
  }

  type Mutation {
    updatePageAdvancedSettings(settings: PageSettingsInput): PagesModel
    createPage: HTTPResult
    setShopFanPage(page: AddShopProfile, isFromWizard: Boolean): ShopProfileDetail
    saveCompanyInfo(info: CompanyInfoInput): HTTPResult
    updateCompanyInfo(info: CompanyInfoInput): HTTPResult
    updatePageLogisticFromWizardStep(pageID: Int, flatInput: PageFlatStatusWithFeeInput): HTTPResult
    savePageMessage(message: MessageSettingInput): PagesModel
    saveCartMessage(message: MessageSettingInput): PagesModel
    saveTermsAndCondition(message: QuilDesctiptionInput): PagesModel
    setLineChannelDetail(lineinfor: LineSetting): LineOaData
    createClientAPI(bactive: Boolean): PagesAPISettingModel
    updateFacebookPageFromWizardStep(pageInput: FacebookPageDataInput): HTTPResult
    updatePageWizardStepToSuccess(currentStep: EnumWizardStepType): HTTPResult
    deletePage: HTTPResult
    triggerPageChanging(isToCreatePage: Boolean): HTTPResult
  }

  type Query {
    getPageByID: PagesModel
    getUnfinishPageSetting: PagesModel
    getPages: [PagesModel]
    changingPage(pageIndex: Int): [PagesModel]
    checkPageFacebookConnected(pageIndex: Int): CheckPageFacebookConnectedResponse
    getPagesFromFacebook: [FacebookPageData]
    updateFacebookPageToken: HTTPResult
    getShopProfile: ShopProfile
    getCompanyInfo: CompanyInfo
    getPageFromFacebookByPageId(pageID: Int): FacebookPageData
    getPageFromFacebookByFbPageID(fbPageID: String): FacebookPageData
    checkMaxPages: Boolean
    getSubScriptionDetail: SubscriptionSettingDetail
    getPhoneFromUser: userPhoneDetail
    getLogisticTrackingTypeByUuid(uuid: String): LogisticTrackingType
    getPageMemberDetail: PageMemberDetail
    getPageMessage(type: String): messageModel
    getPictureFromFacebookFanpageByFacebookID: String
    getPageFromFacebookByCurrentPageID: FacebookPageData
    getBindedPages(fbPages: [FacebookPageDataInput]): [FacebookPageWithBindedPageStatus]
    getPageFromFacebookCredentailAndPageID(credential: FacebookCredentialInput, pageID: Int): FacebookPageData
    getSocialConnectStatus: SocialConnect
    getLineChannelSettingByPageID: LineSettingModel
    verifyChannelAccesstoken(channeltoken: String, channelid: Int): VerifyLineSettingModel
    getClientAPIKey: PagesAPISettingModel
  }

  type Subscription {
    onPageChangingSubscription: HTTPResult
  }
`;
