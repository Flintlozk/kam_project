import gql from 'graphql-tag';
export const ThemeTypeDefs = gql`
  "Theme Schema"
  type ThemeModel {
    _id: String
    thumbnail: ThumbnailPath
    menu: String
    name: String
    settings: ThemeSetting
    image: [ThemeImage]
    style: [ThemeResource]
    javascript: [ThemeAssert]
    html: [ThemeHtml]
    devices: [ThemeDevices]
    themeLayoutLength: Int
  }
  type ThemeConfigModel {
    devices: [ThemeDevices]
    font: [ThemeSettingFont]
    color: [ThemeSettingColor]
  }

  type ThemeDevices {
    minwidth: Int
    icon: String
    default: Boolean
    baseFontSize: Int
  }
  input ThemeModelInput {
    _id: String
    name: String
    catagoriesID: [String]
    settings: ThemeSettingsInput
    image: [ThemeImageInput]
    style: [ThemeResourceInput]
    javascript: [ThemeAssertInput]
    html: [ThemeHtmlInput]
    devices: [ThemeDevicesInput]
  }
  input ThemeDevicesInput {
    minwidth: Int
    icon: String
    default: Boolean
    baseFontSize: Int
  }
  input ThumbnailStream {
    stream: Upload
    path: String
  }
  type ThemeSetting {
    font: [ThemeSettingFont]
    color: [ThemeSettingColor]
    integration: ThemeSettingIntregration
    defaultFontFamily: String
  }
  input ThemeSettingsInput {
    font: [ThemeSettingFontInput]
    color: [ThemeSettingColorInput]
    integration: ThemeSettingIntregrationInput
    defaultFontFamily: String
  }
  type ThemeSettingIntregration {
    googleFont: Boolean
    fontAwesome: Boolean
  }
  input ThemeSettingIntregrationInput {
    googleFont: Boolean
    fontAwesome: Boolean
  }

  type ThemeSettingColor {
    type: String
    dark: ColorSetting
    light: ColorSetting
  }
  type ColorSetting {
    color: String
    opacity: Float
    bgColor: String
    bgOpacity: Float
  }
  input ThemeSettingColorInput {
    type: String
    dark: ColorSettingInput
    light: ColorSettingInput
  }
  input ColorSettingInput {
    color: String
    opacity: Float
    bgColor: String
    bgOpacity: Float
  }

  type ThemeSettingFont {
    type: String
    familyCode: String
    size: Float
    unit: String
    style: String
    lineHeight: String
    letterSpacing: String
  }
  input ThemeSettingFontInput {
    type: String
    familyCode: String
    size: Float
    unit: String
    style: String
    lineHeight: String
    letterSpacing: String
  }

  type ThemeImage {
    _id: String
    type: EnumThemeImageType
    url: String
    image: String
    name: String
  }
  input ThemeImageInput {
    _id: String
    type: EnumThemeImageType
    url: String
    image: Upload
    name: String
  }

  type ThemeResource {
    _id: String
    type: EmumThemeResourceType
    url: String
    style: Upload
    name: String
    plaintext: String
  }
  input ThemeResourceInput {
    _id: String
    type: EmumThemeResourceType
    url: String
    style: Upload
    name: String
    plaintext: String
  }

  type ThemeAssert {
    _id: String
    type: EmumThemeResourceType
    url: String
    javascript: Upload
    name: String
    plaintext: String
  }
  input ThemeAssertInput {
    _id: String
    type: EmumThemeResourceType
    url: String
    javascript: Upload
    name: String
    plaintext: String
  }

  type ThemeHtml {
    name: String
    html: String
    thumbnail: ThumbnailPath
  }

  type ThumbnailPath {
    stream: Upload
    path: String
  }

  input ThemeHtmlInput {
    name: String
    html: String
    thumbnail: ThumbnailStream
  }

  enum EnumThemeImageType {
    MOBILE
    DESKTOP
    TABLET
    IMAGE
  }

  enum EnumThemeAssertType {
    FILE
    ICON
    IMAGE
  }

  enum EmumThemeResourceType {
    CSS
    JS
  }

  enum EnumThemeHtmlType {
    HTML
    ANGULAHTML
  }
  input IDFile {
    _id: String
    index: Int
  }
  input fileInput {
    type: String
    style: Upload
    javascript: Upload
    html: String
    image: Upload
    name: String
    _id: String
  }
  input UpdatefileInput {
    type: String
    plaintext: String
    url: String
    _id: String
    index: Int
    name: String
  }
  type ThemeHtmlResponse {
    status: Int
    value: ThemeHtml
  }
  input updateThumnail {
    _id: String
    index: Int
    thumbnail: ThumbnailStream
  }

  extend type Query {
    getTheme: ThemeModel
    getSharingThemeConfigAndSetThemeSharing: ThemeConfigModel
    getThemeByThemeId(_id: String): ThemeModel
    getHtmlByThemeId(IDFile: IDFile): ThemeHtmlResponse
    getCssByThemeId(IDFile: IDFile): HTTPResult
    getJavascriptByThemeId(IDFile: IDFile): HTTPResult
    getTotalThemeNumber: Int
    getThemesByLimit(skip: Int, limit: Int): [ThemeModel]
    getUpdatedSiteCSS: HTTPResult
  }

  extend type Mutation {
    createTheme(themeModel: ThemeModelInput): ID
    updateTheme(themeModel: ThemeModelInput): HTTPResult
    updateSharingThemeConfigDevices(devices: [ThemeDevicesInput]): HTTPResult
    updateSharingThemeConfigColor(color: [ThemeSettingColorInput]): HTTPResult
    updateSharingThemeConfigFont(font: [ThemeSettingFontInput]): HTTPResult
    uploadFileToCMSFileServer(file: fileInput): HTTPResult
    updateFileToCMSFileServer(file: UpdatefileInput): HTTPResult
    updateSharingThemeComponent(deltaPageComponent: InputDeltaPageComponent): HTTPResult
    updateThumnailByIndex(updateThumnail: updateThumnail): HTTPResult
    updateThumnail(stream: Upload): HTTPResult
    createThemeLayoutHtmlFile(_id: String): HTTPResult
    deleteTheme(_id: String): Boolean
    mockWebPageAndPageComponentForCmsAdmin: HTTPResult
  }
`;
