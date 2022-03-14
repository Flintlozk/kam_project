import gql from 'graphql-tag';

export const ConfigTypeDefs = gql`
  "Config Schema"
  type ConfigModel {
    page_id: Int
    theme_id: String
    updatedAt: String
    style: String
    shortcuts: [String]
    general: ConfigGeneralModel
  }

  type ConfigThemeModel {
    theme_id: String
    updatedAt: String
  }
  type TargetRefModelModel {
    selected_target_href: String
    target_href: [String]
  }
  input TargetRefModel {
    selected_target_href: String
    target_href: [String]
  }
  input linkType {
    selected_link_type: String
    link_types: [String]
    target_url: String
    target_href: TargetRefModel
  }
  type linkTypeModel {
    selected_link_type: String
    link_types: [String]
    target_url: String
    target_href: TargetRefModelModel
  }
  # type ConfigGeneralModel {
  #   language: ConfigGeneralLanguageModel

  # }
  type ConfigCSSwithLanguageModel {
    language: String
    stylesheet: String
  }
  type ConfigCSSModel {
    global: String
    css_with_language: [ConfigCSSwithLanguageModel]
  }

  type ConfigGeneralLanguageModel {
    defaultCultureUI: String
    selectedCultureUIs: [String]
  }

  input ConfigInput {
    page_id: Int
    theme_id: String
    updatedAt: String
    shortcuts: [String]
    general: ConfigGeneralInput
  }

  input ConfigThemeInput {
    theme_id: String
    updatedAt: String
  }

  input ConfigMetaInput {
    meta_tag: String
    body_tag: String
    javascript: String
  }
  type ConfigMetaModel {
    meta_tag: String
    body_tag: String
    javascript: String
  }

  type ConfigDataPrivacyModel {
    is_active: Boolean
    data_use: String
    privacy_policy: String
  }

  input ConfigDataPrivacyInput {
    is_active: Boolean
    data_use: String
    privacy_policy: String
  }

  #-------------------------------------SEO GET-------------------------------
  type ConfigSEOModel {
    culture_ui: String
    description: String
    keyword: [String]
    title: String
  }

  #---------------------------------------------------------------------------
  #-----------------------------------------------------------------------------
  #GENERAL_CONFIG
  type ConfigGeneralModel {
    language: ConfigGeneralLanguageModel
    general: ConfigGeneralGeneralModel
    mobile_view: ConfigGeneralMobileViewModel
    email_sender_name: String
    favicon: ConfigGeneralFaviconModel
    temporary_close: Boolean
    notification: ConfigGeneralNotificationModel
    search: ConfigGeneralSearchModel
  }

  #SEARCH_SECTION
  type ConfigGeneralSearchModel {
    maximun_search_results: ConfigGeneralSearchMaximunSearchResultsModel
    define_search_score: Int
    search_pattern: ConfigGeneralSearchSearchPatternModel
    search_pattern_setting: ConfigGeneralSearchSearchPatternSettingModel
    search_landing_page: ConfigGeneralSearchSearchLandingPageModel
    search_type: ConfigGeneralSearchSearchTypeModel
  }
  #maximun_search_results
  type ConfigGeneralSearchMaximunSearchResultsModel {
    selected_maximum_result: Int
    maximum_results: [Int]
  }
  #search_pattern
  type ConfigGeneralSearchSearchPatternModel {
    pattern_index: Int
  }
  #search_landing_page
  type ConfigGeneralSearchSearchLandingPageModel {
    landing_page_index: Int
  }
  #search_type
  type ConfigGeneralSearchSearchTypeModel {
    default_search_type: String
    search_types: [String]
  }
  #search_pattern_setting
  type ConfigGeneralSearchSearchPatternSettingModel {
    button: ConfigGeneralSearchSearchPatternSettingButtonModel
    search_icon: ConfigGeneralSearchSearchPatternSettingSearchIconModel
    icon_color: ConfigGeneralSearchSearchPatternSettingIconColorModel
    text_color: ConfigGeneralSearchSearchPatternSettingTextColorModel
    background_color: ConfigGeneralSearchSearchPatternSettingBackgroundColorModel
  }
  #search_pattern_setting -> button
  type ConfigGeneralSearchSearchPatternSettingButtonModel {
    selected_button: String
    button_types: [String]
  }
  #search_pattern_setting -> search_icon
  type ConfigGeneralSearchSearchPatternSettingSearchIconModel {
    selected_search_icon: String
    search_icons: [String]
  }
  #search_pattern_setting -> icon_color
  type ConfigGeneralSearchSearchPatternSettingIconColorModel {
    rgb: String
    alpha: Int
  }
  #search_pattern-setting -> text_color
  type ConfigGeneralSearchSearchPatternSettingTextColorModel {
    rgb: String
    alpha: Int
  }
  #search_pattern-setting -> background_color
  type ConfigGeneralSearchSearchPatternSettingBackgroundColorModel {
    alpha: String
    type: String
    solid: ConfigGeneralSearchSearchPatternSettingBackgroundColorSolidModel
    linear: ConfigGeneralSearchSearchPatternSettingBackgroundColorLinearModel
    image: ConfigGeneralSearchSearchPatternSettingBackgroundColorImageModel
  }
  #search_pattern-setting -> background_color -> solid
  type ConfigGeneralSearchSearchPatternSettingBackgroundColorSolidModel {
    rgb: String
    alpha: Int
  }
  #search_pattern-setting -> background_color -> linear
  type ConfigGeneralSearchSearchPatternSettingBackgroundColorLinearModel {
    rgb: [String]
    alpha: Int
  }
  #search_pattern-setting -> background_color -> image
  type ConfigGeneralSearchSearchPatternSettingBackgroundColorImageModel {
    url: String
    alpha: Int
  }
  #NOTIFICATION_SECTION
  type ConfigGeneralNotificationModel {
    push_notifications: ConfigGeneralNotificationPushNotificationModel
    activity: ConfigGeneralNotificationActivityModel
  }
  #push_notifications
  type ConfigGeneralNotificationPushNotificationModel {
    line_notify: ConfigGeneralNotificationPushNotificationLineNotifyModel
    email: ConfigGeneralNotificationPushNotificationEmailModel
  }
  #push_notifications -> line_notify
  type ConfigGeneralNotificationPushNotificationLineNotifyModel {
    is_active: Boolean
    line_notify_token: String
  }
  #push_notifications -> email
  type ConfigGeneralNotificationPushNotificationEmailModel {
    is_active: Boolean
    emails: [String]
  }
  #notification -> activity
  type ConfigGeneralNotificationActivityModel {
    new_order: Boolean
    new_messages: Boolean
    new_comments: Boolean
    reject_order: Boolean
    submit_form: Boolean
    field_update: Boolean
  }
  #GENERAL_SECTION
  type ConfigGeneralGeneralModel {
    header: ConfigGeneralGeneralHeaderModel
    content: ConfigGeneralGeneralContentModel
    notification: ConfigGeneralGeneralNotificationModel
    login: ConfigGeneralGeneralLoginModel
    view: ConfigGeneralGeneralViewModel
  }

  #SOCIAL_LOGIN
  type ConfigGeneralGeneralLoginModel {
    social_login: Boolean
  }

  #SOCIAL_LOGIN_INPUT
  input ConfigGeneralGeneralLoginInput {
    social_login: Boolean
  }

  #MOBILE_VIEW_SECTION
  type ConfigGeneralMobileViewModel {
    header: ConfigGeneralMobileViewHeaderModel
    sidebar_menu: ConfigGeneralMobileViewSidebarMenuModel
    content: ConfigGeneralMobileViewContentModel
  }
  #FAVICON_SECTION
  type ConfigGeneralFaviconModel {
    image_url: String
  }

  #mobile_view_content
  type ConfigGeneralMobileViewContentModel {
    search_button: Boolean
    side_information: Boolean
    increase_image_size: Boolean
  }

  #mobile_view_header
  type ConfigGeneralMobileViewHeaderModel {
    fixed_top_menu: Boolean
  }

  #mobile_view_sidebar_menu
  type ConfigGeneralMobileViewSidebarMenuModel {
    sidebar_menu: Boolean
    sidebar_submenu_auto: Boolean
  }

  #general_general_notification
  type ConfigGeneralGeneralNotificationModel {
    show_as_modal: Boolean
  }
  #general_content
  type ConfigGeneralGeneralContentModel {
    scrollbar: Boolean
    disable_right_click: Boolean
    back_to_top_button: Boolean
    back_to_top_button_setting: ConfigGeneralGeneralContentBackToTopButtonSettingModel
    facebook_comment_tab: Boolean
    facebook_comment_tab_setting: ConfigGeneralGeneralContentFacebookCommentTabSettingModel
    advertising_display: Boolean
    advertising_display_setting: ConfigGeneralGeneralContentAdvertisingDisplaySettingModel
    webp_format_system: Boolean
    printer: Boolean
    preview_custom_form: Boolean
  }
  #general_content_advertising_display_setting_upload
  type ConfigGeneralGeneralContentAdvertisingDisplaySettingUploadModel {
    image_url: String
    link_type: linkTypeModel
  }
  #general_content_advertising_display_setting_share_clip
  type ConfigGeneralGeneralContentAdvertisingDisplaySettingShareClipModel {
    embedded_link: String
  }
  #general_content_advertising_display_setting
  type ConfigGeneralGeneralContentAdvertisingDisplaySettingModel {
    position: String
    size: String
    upload: ConfigGeneralGeneralContentAdvertisingDisplaySettingUploadModel
    share_clip: ConfigGeneralGeneralContentAdvertisingDisplaySettingShareClipModel
  }
  #general_content_back_to_top_button_setting
  type ConfigGeneralGeneralContentBackToTopButtonSettingModel {
    image_url: String
    position: String
  }
  #general_content_facebook_comment_tab_setting
  type ConfigGeneralGeneralContentFacebookCommentTabSettingModel {
    comment_tab: Boolean
    allow_member_only: Boolean
  }

  #general_header
  type ConfigGeneralGeneralHeaderModel {
    language_flag: Boolean
    fixed_top_menu: Boolean
    fixed_top_menu_setting: ConfigGeneralGeneralHeaderFixedTopMenuSettingModel
    shop_cart: Boolean
    shop_cart_setting: ConfigGeneralGeneralHeaderShopCartSettingModel
    currency_converter: Boolean
    currency_converter_setting: ConfigGeneralGeneralHeaderCurrentcyConverterSettingModel
  }

  #general_header_currency_converter_setting
  type ConfigGeneralGeneralHeaderCurrentcyConverterSettingModel {
    main_converter: String
    selected_main_converter: [String]
  }
  #general_header_fixed_top_menu_setting
  type ConfigGeneralGeneralHeaderFixedTopMenuSettingModel {
    full_screen: Boolean
    image_url: String
    link_type: linkTypeModel
  }
  #general_header_shop_cart_setting
  type ConfigGeneralGeneralHeaderShopCartSettingModel {
    shopcart_icon: Int
    icon_color: ConfigGeneralGeneralHeaderShopCartSettingIconColorModel
    text_color: ConfigGeneralGeneralHeaderShopCartSettingTextColorModel
  }

  #icon_color
  type ConfigGeneralGeneralHeaderShopCartSettingIconColorModel {
    rgb: String
    alpha: Int
  }
  #text_color
  type ConfigGeneralGeneralHeaderShopCartSettingTextColorModel {
    rgb: String
    alpha: Int
  }

  #general_view_picture_display_setting
  type ConfigGeneralGeneralViewPictureDisplaySettingModel {
    width: Int
    height: Int
    units: String
    end_time: ConfigGeneralGeneralViewPictureDisplaySettingEndTimeModel
    display_on_mobile: ConfigGeneralGeneralViewPictureDisplaySettingDisplayOnMobileModel
    selected_upload: String
    image_url: String
    image: ConfigGeneralGeneralViewPictureDisplaySettingImageModel
  }

  #general_view_picture_display_setting_image
  type ConfigGeneralGeneralViewPictureDisplaySettingImageModel {
    link_type: linkTypeModel
  }
  #general_view_picture_display_setting_display_on_mobile
  type ConfigGeneralGeneralViewPictureDisplaySettingDisplayOnMobileModel {
    is_active: Boolean
  }

  #general_view_picture_display_setting_end_time
  type ConfigGeneralGeneralViewPictureDisplaySettingEndTimeModel {
    is_active: Boolean
    duration: Int
  }
  type ConfigGeneralGeneralViewModel {
    support_responsive: Boolean
    picture_display: Boolean
    picture_display_setting: ConfigGeneralGeneralViewPictureDisplaySettingModel
    shortened_url_display: Boolean
  }
  #-------------------------------CSS-------------------------------
  input ConfigCSSInput {
    global: String
    css_with_language: [ConfigCSSwithLanguageInput]
  }
  input ConfigCSSwithLanguageInput {
    language: String
    stylesheet: String
  }
  #----------------------------------------------------------------
  #-------------------------------SEO-------------------------------
  input ConfigSEOInput {
    culture_ui: String
    title: String
    keyword: [String]
    description: String
  }

  #------------------------------END SEO-----------------------------
  #-------------------------------------------------------------------------------

  #GENERAL_CONFIG
  input ConfigGeneralInput {
    language: ConfigGeneralLanguageInput
    general: ConfigGeneralGeneralInput
    mobile_view: ConfigGeneralMobileViewInput
    email_sender_name: String
    favicon: ConfigGeneralFaviconInput
    temporary_close: Boolean
    notification: ConfigGeneralNotificationInput
    search: ConfigGeneralSearchInput
  }

  #SEARCH_SECTION
  input ConfigGeneralSearchInput {
    maximun_search_results: ConfigGeneralSearchMaximunSearchResultsInput
    define_search_score: Int
    search_pattern: ConfigGeneralSearchSearchPatternInput
    search_pattern_setting: ConfigGeneralSearchSearchPatternSettingInput
    search_landing_page: ConfigGeneralSearchSearchLandingPageInput
    search_type: ConfigGeneralSearchSearchTypeInput
  }
  #maximun_search_results
  input ConfigGeneralSearchMaximunSearchResultsInput {
    selected_maximum_result: Int
    maximum_results: [Int]
  }

  #search_pattern
  input ConfigGeneralSearchSearchPatternInput {
    pattern_index: Int
  }
  #search_landing_page
  input ConfigGeneralSearchSearchLandingPageInput {
    landing_page_index: Int
  }
  #search_type
  input ConfigGeneralSearchSearchTypeInput {
    default_search_type: String
    search_types: [String]
  }
  #search_pattern_setting
  input ConfigGeneralSearchSearchPatternSettingInput {
    button: ConfigGeneralSearchSearchPatternSettingButtonInput
    search_icon: ConfigGeneralSearchSearchPatternSettingSearchIconInput
    icon_color: ConfigGeneralSearchSearchPatternSettingIconColorInput
    text_color: ConfigGeneralSearchSearchPatternSettingTextColorInput
    background_color: ConfigGeneralSearchSearchPatternSettingBackgroundColorInput
  }
  #search_pattern_setting -> button
  input ConfigGeneralSearchSearchPatternSettingButtonInput {
    selected_button: String
    button_types: [String]
  }
  #search_pattern_setting -> search_icon
  input ConfigGeneralSearchSearchPatternSettingSearchIconInput {
    selected_search_icon: String
    search_icons: [String]
  }
  #search_pattern_setting -> icon_color
  input ConfigGeneralSearchSearchPatternSettingIconColorInput {
    rgb: String
    alpha: Int
  }
  #search_pattern-setting -> text_color
  input ConfigGeneralSearchSearchPatternSettingTextColorInput {
    rgb: String
    alpha: Int
  }
  #search_pattern-setting -> background_color
  input ConfigGeneralSearchSearchPatternSettingBackgroundColorInput {
    alpha: String
    type: String
    solid: ConfigGeneralSearchSearchPatternSettingBackgroundColorSolidInput
    linear: ConfigGeneralSearchSearchPatternSettingBackgroundColorLinearInput
    image: ConfigGeneralSearchSearchPatternSettingBackgroundColorImageInput
  }
  #search_pattern-setting -> background_color -> solid
  input ConfigGeneralSearchSearchPatternSettingBackgroundColorSolidInput {
    rgb: String
    alpha: Int
  }
  #search_pattern-setting -> background_color -> linear
  input ConfigGeneralSearchSearchPatternSettingBackgroundColorLinearInput {
    rgb: [String]
    alpha: Int
  }
  #search_pattern-setting -> background_color -> image
  input ConfigGeneralSearchSearchPatternSettingBackgroundColorImageInput {
    url: String
    alpha: Int
  }
  #NOTIFICATION_SECTION
  input ConfigGeneralNotificationInput {
    push_notifications: ConfigGeneralNotificationPushNotificationInput
    activity: ConfigGeneralNotificationActivityInput
  }
  #push_notifications
  input ConfigGeneralNotificationPushNotificationInput {
    line_notify: ConfigGeneralNotificationPushNotificationLineNotifyInput
    email: ConfigGeneralNotificationPushNotificationEmailInput
  }
  #push_notifications -> line_notify
  input ConfigGeneralNotificationPushNotificationLineNotifyInput {
    is_active: Boolean
    line_notify_token: String
  }
  #push_notifications -> email
  input ConfigGeneralNotificationPushNotificationEmailInput {
    is_active: Boolean
    emails: [String]
  }
  #notification -> activity
  input ConfigGeneralNotificationActivityInput {
    new_order: Boolean
    new_messages: Boolean
    new_comments: Boolean
    reject_order: Boolean
    submit_form: Boolean
    field_update: Boolean
  }
  #GENERAL_SECTION
  input ConfigGeneralGeneralInput {
    header: ConfigGeneralGeneralHeaderInput
    content: ConfigGeneralGeneralContentInput
    login: ConfigGeneralGeneralLoginInput
    notification: ConfigGeneralGeneralNotificationInput
    view: ConfigGeneralGeneralViewInput
  }
  #MOBILE_VIEW_SECTION
  input ConfigGeneralMobileViewInput {
    header: ConfigGeneralMobileViewHeaderInput
    sidebar_menu: ConfigGeneralMobileViewSidebarMenuInput
    content: ConfigGeneralMobileViewContentInput
  }
  #FAVICON_SECTION
  input ConfigGeneralFaviconInput {
    image_url: String
  }

  #mobile_view_content
  input ConfigGeneralMobileViewContentInput {
    search_button: Boolean
    side_information: Boolean
    increase_image_size: Boolean
  }

  #mobile_view_header
  input ConfigGeneralMobileViewHeaderInput {
    fixed_top_menu: Boolean
  }

  #mobile_view_sidebar_menu
  input ConfigGeneralMobileViewSidebarMenuInput {
    sidebar_menu: Boolean
    sidebar_submenu_auto: Boolean
  }

  #general_general_notification
  input ConfigGeneralGeneralNotificationInput {
    show_as_modal: Boolean
  }
  #general_content
  input ConfigGeneralGeneralContentInput {
    scrollbar: Boolean
    disable_right_click: Boolean
    back_to_top_button: Boolean
    back_to_top_button_setting: ConfigGeneralGeneralContentBackToTopButtonSettingInput
    facebook_comment_tab: Boolean
    facebook_comment_tab_setting: ConfigGeneralGeneralContentFacebookCommentTabSettingInput
    advertising_display: Boolean
    advertising_display_setting: ConfigGeneralGeneralContentAdvertisingDisplaySettingInput
    webp_format_system: Boolean
    printer: Boolean
    preview_custom_form: Boolean
  }
  #general_content_advertising_display_setting_upload
  input ConfigGeneralGeneralContentAdvertisingDisplaySettingUploadInput {
    image_url: String
    link_type: linkType
  }
  #general_content_advertising_display_setting_share_clip
  input ConfigGeneralGeneralContentAdvertisingDisplaySettingShareClipInput {
    embedded_link: String
  }
  #general_content_advertising_display_setting
  input ConfigGeneralGeneralContentAdvertisingDisplaySettingInput {
    position: String
    size: String
    upload: ConfigGeneralGeneralContentAdvertisingDisplaySettingUploadInput
    share_clip: ConfigGeneralGeneralContentAdvertisingDisplaySettingShareClipInput
  }
  #general_content_back_to_top_button_setting
  input ConfigGeneralGeneralContentBackToTopButtonSettingInput {
    image_url: String
    position: String
  }
  #general_content_facebook_comment_tab_setting
  input ConfigGeneralGeneralContentFacebookCommentTabSettingInput {
    comment_tab: Boolean
    allow_member_only: Boolean
  }

  #general_header
  input ConfigGeneralGeneralHeaderInput {
    language_flag: Boolean
    fixed_top_menu: Boolean
    fixed_top_menu_setting: ConfigGeneralGeneralHeaderFixedTopMenuSettingInput
    shop_cart: Boolean
    shop_cart_setting: ConfigGeneralGeneralHeaderShopCartSettingInput
    currency_converter: Boolean
    currency_converter_setting: ConfigGeneralGeneralHeaderCurrentcyConverterSettingInput
  }

  #general_header_currency_converter_setting
  input ConfigGeneralGeneralHeaderCurrentcyConverterSettingInput {
    main_converter: String
    selected_main_converter: [String]
  }
  #general_header_fixed_top_menu_setting
  input ConfigGeneralGeneralHeaderFixedTopMenuSettingInput {
    full_screen: Boolean
    image_url: String
    link_type: linkType
  }
  #general_header_shop_cart_setting
  input ConfigGeneralGeneralHeaderShopCartSettingInput {
    shopcart_icon: Int
    icon_color: ConfigGeneralGeneralHeaderShopCartSettingIconColorInput
    text_color: ConfigGeneralGeneralHeaderShopCartSettingTextColorInput
  }

  #icon_color
  input ConfigGeneralGeneralHeaderShopCartSettingIconColorInput {
    rgb: String
    alpha: Int
  }
  #text_color
  input ConfigGeneralGeneralHeaderShopCartSettingTextColorInput {
    rgb: String
    alpha: Int
  }

  #general_view_picture_display_setting
  input ConfigGeneralGeneralViewPictureDisplaySettingInput {
    width: Int
    height: Int
    units: String
    image_url: String
    end_time: ConfigGeneralGeneralViewPictureDisplaySettingEndTimeInput
    display_on_mobile: ConfigGeneralGeneralViewPictureDisplaySettingDisplayOnMobileInput
    image: ConfigGeneralGeneralViewPictureDisplaySettingImageInput
    selected_upload: String
  }
  input ConfigGeneralGeneralViewPictureDisplaySettingImageInput {
    open: String
    link_type: linkType
  }
  #general_view_picture_display_setting_display_on_mobile
  input ConfigGeneralGeneralViewPictureDisplaySettingDisplayOnMobileInput {
    is_active: Boolean
  }

  #general_view_picture_display_setting_end_time
  input ConfigGeneralGeneralViewPictureDisplaySettingEndTimeInput {
    is_active: Boolean
    duration: Int
  }
  input ConfigGeneralGeneralViewInput {
    support_responsive: Boolean
    picture_display: Boolean
    picture_display_setting: ConfigGeneralGeneralViewPictureDisplaySettingInput
    shortened_url_display: Boolean
  }

  input ConfigGeneralLanguageInput {
    defaultCultureUI: String
    selectedCultureUIs: [String]
  }

  extend type Query {
    getConfigTheme: ConfigThemeModel
    getConfigGeneral: ConfigGeneralModel
    getConfigCSS: ConfigCSSModel
    getConfigSEO: ConfigSEOModel
    getConfigMeta: ConfigMetaModel
    getConfigDataPrivacy: ConfigDataPrivacyModel
    getConfigStyle: String
    getConfigGeneralLanguage: ConfigGeneralLanguageModel
    getConfigShortcuts: [String]
  }

  extend type Mutation {
    saveConfigTheme(configTheme: ConfigThemeInput): HTTPResult
    saveConfigGeneral(configGeneral: ConfigGeneralInput): HTTPResult
    saveConfigCSS(configCSS: ConfigCSSInput): HTTPResult
    saveConfigSEO(configSEO: ConfigSEOInput): HTTPResult
    saveConfigMeta(configMeta: ConfigMetaInput): HTTPResult
    saveConfigDataPrivacy(configDataPrivacy: ConfigDataPrivacyInput): HTTPResult
    saveConfigStyle(style: String): HTTPResult
    saveConfigShortcuts(configShortcuts: [String]): HTTPResult
  }
`;
