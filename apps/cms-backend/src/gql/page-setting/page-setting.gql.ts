import gql from 'graphql-tag';

export const PageSettingsTypeDefs = gql`
  enum LogisticSystemType {
    PRICING_TABLE
    FLAT_RATE
    FIXED_RATE
  }
  enum PageSettingType {
    CUSTOMER_CLOSED_REASON
    CUSTOMER_SLA_TIME
    PRIVACY_POLICY
    DATA_USE
    TERMS_AND_CONDITION
    WORKING_HOURS
    MESSAGE_TRACK
    QUICKPAY_WEBHOOK
    LOGISTIC_SYSTEM
  }

  type PageCloseCustomerOptions {
    url: String
  }
  type PageCustomerSlaTimeOptions {
    alertHour: Int
    alertMinute: Int
    hour: Int
    minute: Int
  }
  type PageTermsAndConditionOptions {
    textTH: String
    textENG: String
  }

  type PageWorkingHoursOptionAdditional {
    isActive: Boolean
    time: Int
  }
  type PageWorkingHoursOptionOffTime {
    isActive: Boolean
    message: String
    attachment: String
  }

  type PageWorkingHoursOptionNotifyListEmail {
    email: String
  }
  type PageWorkingHoursOptionNotifyList {
    isActive: Boolean
    emails: [PageWorkingHoursOptionNotifyListEmail]
  }
  type PageWorkingHoursOptionTimes {
    openTime: Date
    closeTime: Date
  }
  type PageMessageTrackOption {
    trackMode: String
  }

  type PageLogisticSystemOptionFixedPrice {
    type: LogisticSystemType
    isActive: Boolean
    useMin: Boolean # If set true Any order's price lower than amount will not charge Else use fallbackType method
    amount: Int
    fallbackType: LogisticSystemType # on MIN_PRICE allow to choose PRICING_TABLE | FLAT_RATE
  }

  type PageLogisticSystemOptionPricingTable {
    type: LogisticSystemType
    isActive: Boolean
    provider: EnumLogisticDeliveryProviderType
  }
  type PageLogisticSystemOptionFlatRate {
    type: LogisticSystemType
    isActive: Boolean
    deliveryFee: Int
  }

  type PageLogisticSystemOption {
    pricingTable: PageLogisticSystemOptionPricingTable
    flatRate: PageLogisticSystemOptionFlatRate
    fixedRate: PageLogisticSystemOptionFixedPrice
  }

  type PageWorkingHoursOptionDates {
    isActive: Boolean
    allTimes: Boolean
    times: [PageWorkingHoursOptionTimes]
  }

  type PageWorkingHoursOptions {
    offTime: PageWorkingHoursOptionOffTime
    notifyList: PageWorkingHoursOptionNotifyList
    additional: PageWorkingHoursOptionAdditional
    sunday: PageWorkingHoursOptionDates
    monday: PageWorkingHoursOptionDates
    tuesday: PageWorkingHoursOptionDates
    wednesday: PageWorkingHoursOptionDates
    thursday: PageWorkingHoursOptionDates
    friday: PageWorkingHoursOptionDates
    saturday: PageWorkingHoursOptionDates
  }

  input PageWorkingHoursOptionOffTimeInput {
    isActive: Boolean
    message: String
    attachment: String
  }

  input PageWorkingHoursOptionNotifyListEmailInput {
    email: String
  }
  input PageWorkingHoursOptionNotifyListInput {
    isActive: Boolean
    emails: [PageWorkingHoursOptionNotifyListEmailInput]
  }

  input PageWorkingHoursOptionTimesInput {
    openTime: Date
    openTimeString: String
    closeTime: Date
    closeTimeString: String
  }
  input PageWorkingHoursOptionAdditionalInput {
    isActive: Boolean
    time: Int
  }
  input PageWorkingHoursOptionDatesInput {
    isActive: Boolean
    allTimes: Boolean
    times: [PageWorkingHoursOptionTimesInput]
  }

  input PageWorkingHoursOptionsInput {
    offTime: PageWorkingHoursOptionOffTimeInput
    notifyList: PageWorkingHoursOptionNotifyListInput
    additional: PageWorkingHoursOptionAdditionalInput
    sunday: PageWorkingHoursOptionDatesInput
    monday: PageWorkingHoursOptionDatesInput
    tuesday: PageWorkingHoursOptionDatesInput
    wednesday: PageWorkingHoursOptionDatesInput
    thursday: PageWorkingHoursOptionDatesInput
    friday: PageWorkingHoursOptionDatesInput
    saturday: PageWorkingHoursOptionDatesInput
  }
  input PageMessageTrackModeOptionsInput {
    trackMode: String
  }

  type PageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
  }

  interface IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    # options: IPageSettingOptions
  }

  type PageCloseCustomerSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageCloseCustomerOptions
  }
  type PageQuickpayWebhook implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageCloseCustomerOptions
  }
  type PageCustomerSlaTimeSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageCustomerSlaTimeOptions
  }
  type PageTermsAndConditionSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageTermsAndConditionOptions
  }

  type PageWorkingHoursSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageWorkingHoursOptions
  }
  type PageMessageTrackSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageMessageTrackOption
  }
  type PageLogisticSystemSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: PageLogisticSystemOption
  }
  type PageDefaultSetting implements IPageSettings {
    id: Int
    page_id: Int
    setting_type: PageSettingType
    status: Boolean
    created_at: Date
    updated_at: Date
    options: String
  }

  type ResponseAddWebhookPattern {
    status: Int
    value: String
  }

  type ResponseWebhookPatternList {
    id: Int
    name: String
    url: String
    regex_pattern: String
    status: Boolean
  }

  input WebhookPatternInput {
    id: Int
    name: String
    url: String
    regex_pattern: String
    status: Boolean
  }

  input PageLogisticSystemOptionFixedPriceInput {
    type: LogisticSystemType
    isActive: Boolean
    useMin: Boolean # If set true Any order's price lower than amount will not charge Else use fallbackType method
    amount: Int
    fallbackType: LogisticSystemType # on MIN_PRICE allow to choose PRICING_TABLE | FLAT_RATE
  }

  input PageLogisticSystemOptionPricingTableInput {
    type: LogisticSystemType
    isActive: Boolean
    provider: EnumLogisticDeliveryProviderType
  }
  input PageLogisticSystemOptionFlatRateInput {
    type: LogisticSystemType
    isActive: Boolean
    deliveryFee: Int
  }

  input PageLogisticSystemOptionInput {
    pricingTable: PageLogisticSystemOptionPricingTableInput
    flatRate: PageLogisticSystemOptionFlatRateInput
    fixedRate: PageLogisticSystemOptionFixedPriceInput
  }

  extend type Query {
    getPageSetting(type: PageSettingType): IPageSettings
    getWebhookPatternList: [ResponseWebhookPatternList]
  }
  extend type Mutation {
    addWebhookPattern(webhookPattern: WebhookPatternInput): ResponseAddWebhookPattern
    updateWebhookPattern(webhookPattern: WebhookPatternInput): ResponseAddWebhookPattern
    removeWebhookPattern(webhookId: Int): ResponseAddWebhookPattern
    toggleWebhookPatternStatus(webhookId: Int): ResponseAddWebhookPattern
  }
`;
