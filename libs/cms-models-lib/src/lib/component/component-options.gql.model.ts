import { gql } from '@apollo/client/core';

export const ComponentOptionsTypeDefs = gql`
  type LayoutColumn {
    column: String
    gap: Int
  }
  input InputLayoutColumn {
    column: String
    gap: Int
  }

  type MediaGalleryList {
    url: String
    fileType: String
    title: String
    setting: MediaGalleryItem
  }

  type MediaGalleryItem {
    generalBackgroundSetting: LayoutSettingBackground
    generalTextSetting: GeneralText
    generalLinkSetting: GeneralLink
  }

  input InputMediaGalleryList {
    url: String
    fileType: String
  }

  type MediaGallerySetting {
    galleryPatternId: String
    galleryPatternUrl: String
    galleryGap: Int
    gallleryList: [MediaGalleryList]
    galleryMaxHeight: Int
    isChangePattern: Boolean
  }
  input InputMediaGallerySetting {
    galleryPatternId: String
    galleryPatternUrl: String
    galleryGap: Int
    gallleryList: [InputMediaGalleryList]
    galleryMaxHeight: Int
  }

  type MediaGalleryControl {
    isPageSlide: Boolean
    isAutoSlide: Boolean
    isPageButton: Boolean
    pageButtonSize: Int
    pageButtonOffset: Int
    isPageArrow: Boolean
    pageArrowSize: Int
    pageArrowOffset: Int
    slideSpeed: Int
  }
  input InputMediaGalleryControl {
    isPageSlide: Boolean
    isAutoSlide: Boolean
    isPageButton: Boolean
    pageButtonSize: Int
    pageButtonOffset: Int
    isPageArrow: Boolean
    pageArrowSize: Int
    pageArrowOffset: Int
    slideSpeed: Int
  }
  type GeneralLink {
    linkType: String
    linkValue: String
    parentID: String
  }
  input InputGeneralLink {
    linkType: String
    linkValue: String
    parentID: String
  }

  type GeneralTextText {
    isText: Boolean
    text: [GeneralTextTextCultureUI]
    isFontDefault: Boolean
    isFontIndexDefault: Int
    isStyleDefault: Boolean
    isTextColorDefault: Boolean
    isTextOpacityDefault: Boolean
    isLineHeightDefault: Boolean
    isLetterSpacingDefault: Boolean
    fontFamily: String
    fontStyle: String
    titleFontSize: String
    descriptionFontSize: String
    textColor: String
    textOpacity: String
    textAlignment: String
    lineHeight: String
    letterSpacing: String
    textAnimation: String
  }
  type GeneralTextTextCultureUI {
    cultureUI: String
    title: String
    description: String
  }
  input InputGeneralTextText {
    isText: Boolean
    text: [InputGeneralTextTextCultureUI]
    isFontDefault: Boolean
    isFontIndexDefault: Int
    isStyleDefault: Boolean
    isTextColorDefault: Boolean
    isTextOpacityDefault: Boolean
    isLineHeightDefault: Boolean
    isLetterSpacingDefault: Boolean
    fontFamily: String
    fontStyle: String
    titleFontSize: String
    descriptionFontSize: String
    textColor: String
    textOpacity: String
    textAlignment: String
    lineHeight: String
    letterSpacing: String
    textAnimation: String
  }

  input InputGeneralTextTextCultureUI {
    cultureUI: String
    title: String
    description: String
  }

  type GeneralTextOverlay {
    isOverlay: Boolean
    isOverlayFullWidth: Boolean
    overlayColor: String
    overlayOpacity: String
    overlayAnimation: String
  }
  input InputGeneralTextOverlay {
    isOverlay: Boolean
    isOverlayFullWidth: Boolean
    overlayColor: String
    overlayOpacity: String
    overlayAnimation: String
  }

  type GeneralText {
    text: GeneralTextText
    overlay: GeneralTextOverlay
    horizontalPosition: String
    verticalPosition: String
    isApplyAll: Boolean
  }
  input InputGeneralText {
    text: InputGeneralTextText
    overlay: InputGeneralTextOverlay
    horizontalPosition: String
    verticalPosition: String
    isApplyAll: Boolean
  }

  type ComponentTextRenderingSetting {
    quillHTMLs: [ComponentQuillHTMLs]
  }
  type ComponentQuillHTMLs {
    quillHTML: String
    cultureUI: String
  }

  input InputComponentTextRenderingSetting {
    quillHTMLs: [InputComponentQuillHTMLs]
  }
  input InputComponentQuillHTMLs {
    quillHTML: String
    cultureUI: String
  }
  type ComponentLayoutRenderingSetting {
    setting: LayoutColumn
    containerSettings: [CommonSettings]
  }
  input InputComponentLayoutRenderingSetting {
    setting: InputLayoutColumn
    containerSettings: [InputCommonSettings]
  }

  type ComponentMediaGalleryRenderingSetting {
    gallery: MediaGallerySetting
    control: MediaGalleryControl
  }
  input InputComponentMediaGalleryRenderingSetting {
    gallery: InputMediaGallerySetting
    control: InputMediaGalleryControl
  }

  type ComponentContentManagementRenderingSetting {
    general: ContentManagementGeneral
    contents: ContentManagementContents
    landing: ContentManagementGeneralLanding
  }

  type ShoppingCartPatternAdvanceSettingButton {
    name: String
    link: GeneralLink
    openType: String
  }

  type ShoppingCartPatternAdvanceSettingPagination {
    type: String
  }

  type ShoppingCartRenderingSetting {
    pattern: ShoppingCartPattern
  }

  type ShoppingCartPattern {
    type: String
    advanceSetting: ShoppingCartPatternAdvanceSetting
  }

  type ShoppingCartPatternAdvanceSetting {
    options: String
    button: ShoppingCartPatternAdvanceSettingButton
    pagination: ShoppingCartPatternAdvanceSettingPagination
  }

  type ComponentContentManagementLandingRenderingSetting {
    pattern: ContentPatternLanding
    landing: ContentManagementGeneralLanding
  }

  type ContentManagementGeneralLanding {
    _id: String
    option: ContentManagementGeneralLandingOption
  }

  type ContentManagementGeneralLandingOption {
    isView: Boolean
    isComment: Boolean
    isPublishDate: Boolean
    isSocialShare: Boolean
    isRightContent: Boolean
    rightContent: ContentManagementGeneralLandingOptionRightContent
  }

  type ContentManagementGeneralLandingOptionRightContent {
    type: String
    title: String
    categoryIds: [String]
    contentSortBy: String
    isPinContentFirst: Boolean
    isMaxItem: Boolean
    maxItemNumber: Int
    moreTitle: String
  }

  type ContentManagementGeneral {
    pattern: ContentManagementGeneralPattern
    advance: ContentManagementGeneralAdvance
  }

  type ContentManagementGeneralAdvance {
    display: ContentManagementGeneralDisplay
    isContentGroup: Boolean
    bottom: ContentManagementGeneralBottom
  }

  union ContentManagementGeneralDisplay = ContentManagementGeneralDisplayNone | ContentManagementGeneralDisplayLink | ContentManagementGeneralDisplayTab

  type ContentManagementGeneralDisplayNone {
    displayType: String
  }

  type ContentManagementGeneralDisplayTab {
    displayType: String
    array: [ContentManagementGeneralDisplayTabLinkArray]
  }

  type ContentManagementGeneralDisplayLink {
    displayType: String
    displayTitle: String
    array: [ContentManagementGeneralDisplayTabLinkArray]
  }

  type ContentManagementGeneralDisplayTabLinkArray {
    title: String
    value: String
  }

  union ContentManagementGeneralBottom = ContentManagementGeneralBottomButton | ContentManagementGeneralBottomPagination | ContentManagementGeneralBottomNone

  type ContentManagementGeneralBottomNone {
    bottomType: String
  }

  type ContentManagementGeneralBottomButton {
    bottomType: String
    name: String
    link: ContentManagementGeneralLink
    isNewWindow: Boolean
  }

  type ContentManagementGeneralLink {
    linkType: String
    linkValue: String
    parentID: String
  }

  type ContentManagementGeneralBottomPagination {
    bottomType: String
    type: String
    position: String
  }

  type ContentManagementGeneralPattern {
    _id: String
    patternName: String
    patternUrl: String
    patternStyle: ContentManagementPatternStyle
  }

  type ContentManagementPatternStyle {
    container: ContentManagementPaternGrid
    primary: ContentManagementPaternItem
    secondary: ContentManagementPaternItem
    css: String
  }

  type ContentManagementPaternItem {
    maxContent: Int
    grid: ContentManagementPaternGrid
    status: Boolean
  }

  type ContentManagementPaternGrid {
    gridTemplateColumns: String
    gridTemplateRows: String
    gridGap: String
  }

  enum ContentManagementType {
    TYPE_1
    TYPE_2
    TYPE_3
    TYPE_4
    TYPE_5
  }
  type ContentManagementContents {
    categoryIds: [String]
    contentSortBy: String
    isPinContentFirst: Boolean
    isShortDescription: Boolean
    isView: Boolean
    isPublishedDate: Boolean
    isShare: Boolean
  }
  enum EFontFamilyCode {
    racing
    prompt
    quantico
    colombo
    neucha
  }
  enum EFontStyle {
    Regular
    Bold
    Italic
  }
  type ComponentButtonRenderingSetting {
    buttonSetting: ButtonSetting
    buttonBorder: ButtonBorder
    buttonText: ButtonText
    generalLinkSetting: GeneralLink
    buttonHover: ButtonHover
  }

  type ComponentMenuRenderingSetting {
    source: ComponentMenuRenderingSettingSource
    setting: ComponentMenuRenderingSettingSetting
    mobile: ComponentMenuRenderingSettingMobile
    level: ComponentMenuRenderingSettingLevel
  }
  type ComponentMenuRenderingSettingSource {
    menuGroupId: String
    sourceType: String
    parentMenuId: String
  }
  type ComponentMenuRenderingSettingSetting {
    sticky: String
    animation: String
    alignment: String
    style: String
    icon: ComponentMenuRenderingSettingSettingIcon
    mega: ComponentMenuRenderingSettingSettingMega
  }
  type ComponentMenuRenderingSettingSettingIcon {
    isIcon: Boolean
    size: String
    color: ColorValueSetting
    status: Boolean
    position: String
  }
  type ComponentMenuRenderingSettingSettingMega {
    size: String
    color: ColorValueSetting
  }
  type ComponentMenuRenderingSettingMobile {
    hamburger: ComponentMenuRenderingSettingMobileHamburger
    featureIcon: ComponentMenuRenderingSettingMobileFeatureIcon
  }
  type ComponentMenuRenderingSettingMobileHamburger {
    icon: ComponentMenuRenderingSettingMobileHamburgerIcon
    isText: Boolean
    text: String
    position: String
  }
  type ComponentMenuRenderingSettingMobileHamburgerIcon {
    iconGroup: String
    activeIcon: String
    inactiveIcon: String
  }
  type ComponentMenuRenderingSettingMobileFeatureIcon {
    icons: [String]
    isSearch: Boolean
    isLanguage: Boolean
  }
  type ComponentMenuRenderingSettingLevel {
    one: ComponentMenuRenderingSettingLevelOptions
    two: ComponentMenuRenderingSettingLevelOptions
    three: ComponentMenuRenderingSettingLevelOptions
    four: ComponentMenuRenderingSettingLevelOptions
  }
  type ComponentMenuRenderingSettingLevelOptions {
    size: String
    style: String
    text: ComponentMenuRenderingSettingLevelOptionsColorStyle
    backGround: ComponentMenuRenderingSettingLevelOptionsColorStyle
    shadow: ILayoutSettingShadow
    textAnimation: String
    backgroundAnimation: String
  }
  type ComponentMenuRenderingSettingLevelOptionsColorStyle {
    normal: ColorStyleSetting
    hover: ColorStyleSetting
    active: ColorStyleSetting
  }
  type ColorStyleSetting {
    style: String
    color: ColorValueSetting
    gradientColor: GradientColorSetting
    image: String
  }
  type GradientColorSetting {
    type: String
    colors: [String]
  }
  type ILayoutSettingShadow {
    isShadow: Boolean
    color: String
    opacity: Int
    xAxis: Int
    yAxis: Int
    distance: Int
    blur: Int
  }

  type ColorValueSetting {
    value: String
    opacity: String
  }
  type ButtonSetting {
    background: ButtonSettingBackground
    padding: ButtonSettingPadding
  }
  type ButtonSettingBackground {
    backgroundColor: String
    backgroundColorOpacity: Int
  }
  type ButtonSettingPadding {
    left: Int
    top: Int
    right: Int
    bottom: Int
  }
  type ButtonBorder {
    corner: ButtonBorderCorner
    color: String
    opacity: Int
    thickness: Int
    position: ButtonBorderPosition
  }
  type ButtonBorderCorner {
    topLeft: Int
    topRight: Int
    bottomLeft: Int
    bottomRight: Int
  }
  type ButtonBorderPosition {
    left: Boolean
    top: Boolean
    right: Boolean
    bottom: Boolean
  }
  type ButtonText {
    text: String
    isFontDefault: Boolean
    isFontIndexDefault: Int
    isStyleDefault: Boolean
    isTextColorDefault: Boolean
    isTextOpacityDefault: Boolean
    isLineHeightDefault: Boolean
    isLetterSpacingDefault: Boolean
    fontFamily: EFontFamilyCode
    fontStyle: EFontStyle
    fontSize: String
    textColor: String
    textOpacity: String
    textAlignment: String
    lineHeight: String
    letterSpacing: String
    isIcon: Boolean
    iconCode: String
    iconBeforeText: Boolean
    iconSize: Int
    iconColor: String
    iconColorOpacity: Int
  }
  type ButtonHover {
    isHover: Boolean
    buttonHoverColor: String
    buttonHoverColorOpacity: Int
    borderHoverColor: String
    borderHoverColorOpacity: Int
    textHoverColor: String
    textHoverColorOpacity: Int
    textHoverTransform: ETextStyle
    hoverEffect: String
  }
  enum ETextStyle {
    regular
    underline
    bold
    italic
  }
  interface ComponentOptions {
    componentType: String
    isActive: Boolean
    prevId: String
    nextId: String
  }
  type ThemeComponent {
    themeComponents: [ComponentOptions]
    angularHTML: String
  }

  input InputComponentOptions {
    quillHTML: String
    setting: InputLayoutColumn
    containerSettings: [InputCommonSettings]
    gallery: InputMediaGallerySetting
    control: InputMediaGalleryControl
    general: InputContentManagementGeneral
    contents: InputContentManagementGeneral
    textButton: InputButtonSetting
  }
  input InputButtonSetting {
    buttonSetting: InputButtonSettingSet
    buttonText: InputLayoutSettingAdvanceDetail
    generalLinkSetting: InputGeneralLink
    buttonHover: InputButtonHover
  }
  input InputButtonHover {
    isHover: Boolean
    buttonHoverColor: String
    buttonHoverColorOpacity: Int
    borderHoverColor: String
    borderHoverColorOpacity: Int
    textHoverColor: String
    textHoverColorOpacity: Int
    textHoverTransform: String
    hoverEffect: String
  }
  input InputButtonSettingSet {
    background: InputButtonSettingBackground
    padding: String
  }
  input InputButtonSettingBackground {
    backgroundColor: String
    backgroundColorOpacity: Int
  }
  input InputContentManagementGeneral {
    contentPatternId: String
    contentPatternUrl: String
  }
  type ThemeOption {
    themeIdentifier: String
  }
  type ComponentTextRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentTextRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }
  type ComponentLayoutRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentLayoutRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }

  type ComponentMediaGalleryRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentMediaGalleryRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }
  type ComponentContentManagementRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentContentManagementRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }

  type ShoppingCartRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ShoppingCartRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }

  type ComponentContentManagementLandingRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentContentManagementLandingRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }
  type ComponentButtonRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentButtonRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }

  type ComponentMenuRendering implements ComponentOptions {
    _id: String
    componentType: String
    section: String
    themeOption: ThemeOption
    commonSettings: CommonSettings
    options: ComponentMenuRenderingSetting
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
    prevId: String
    nextId: String
  }

  type PageComponent {
    components: [ComponentOptions]
    webPageID: String
  }

  type PageAngularHTML {
    webPageID: String
    angularHTML: String
    components: [ComponentOptions]
    themeComponents: [ComponentOptions]
  }

  input InputPageComponent {
    webPageID: String
    components: [InputRederingComponentData]
  }

  input InputRederingComponentData {
    _id: String
    componentType: String
    commonSettings: InputCommonSettings
    options: InputComponentOptions
    layoutID: String
    layoutPosition: Int
    isActive: Boolean
  }
  input InputRederingTextData {
    _id: String
    componentType: String
    commonSettings: InputCommonSettings
    options: InputComponentOptions
    layoutID: String
    layoutPosition: Int
  }
  input InputRederingLayoutData {
    _id: String
    componentType: String
    commonSettings: InputCommonSettings
    options: InputComponentOptions
    layoutID: String
    layoutPosition: Int
  }
  input InputRederingMedaiGalleryData {
    _id: String
    componentType: String
    commonSettings: InputCommonSettings
    options: InputComponentOptions
    layoutID: String
    layoutPosition: Int
  }
  input InputRederingMediaGalleryItemData {
    _id: String
    componentType: String
    commonSettings: InputCommonSettings
    options: InputComponentOptions
    layoutID: String
    layoutPosition: Int
  }

  input InputIterableChangeRecord {
    currentIndex: Int
    previousIndex: Int
    trackById: String
    item: String
  }

  input InputDeltaPageComponent {
    webPageID: String
    added: [String]
    moved: [String]
    movedWithMutated: [String]
    removed: [String]
    mutated: [String]
    lastId: String
    lastHeaderId: String
    lastFooterId: String
  }
  input InputWebPageThemeLayoutIndex {
    webPageID: String
    themeLayoutIndex: Int
  }
  extend type Mutation {
    addSampleComponent(pageComponent: InputPageComponent): Boolean
    updatePageComponentByWebPageID(deltaPageComponent: InputDeltaPageComponent): HTTPResult
    updateComponentLandingPageOption(landing: String, webPageID: String, componentId: String): HTTPResult
    removeSampleComponent(webPageID: String): Boolean
  }
  extend type Query {
    getComponent(webPageID: String): PageAngularHTML
    getLandingComponent(webPageID: String, previousWebPageID: String, componentId: String, contentId: String): PageAngularHTML
    getThemeComponents(webPageThemelayoutIndex: InputWebPageThemeLayoutIndex): ThemeComponent
  }
`;
