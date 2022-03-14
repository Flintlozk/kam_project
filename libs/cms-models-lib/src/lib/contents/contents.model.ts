import { EnumLanguageCultureUI } from '@reactor-room/cms-models-lib';

export enum EContentEditorComponentType {
  CONTAINER = 'cms-next-cms-content-editor-rendering',
  SECTION = 'cms-next-cms-content-section-rendering',
  COLUMN = 'cms-next-cms-content-column-rendering',
  TEXT = 'cms-next-cms-content-text-rendering',
  BUTTON = 'cms-next-cms-content-button-rendering',
  IMAGE = 'cms-next-cms-content-image-rendering',
  EMBEDED = 'cms-next-cms-content-embeded-rendering',
  IMAGE_GALLERY = 'cms-next-cms-content-image-gallery-rendering',
}

export enum EContentSectionType {
  FR_1 = '1fr',
  FR_1_1 = '1fr 1fr',
  FR_3_7 = '3fr 7fr',
  FR_7_3 = '7fr 3fr',
  FR_1_1_1 = '1fr 1fr 1fr',
  FR_1_2_1 = '1fr 2fr 1fr',
}

export interface IContentEditorWithLength {
  contents: IContentEditor[];
  total_rows: number;
}

export interface IContentEditor {
  _id: string;
  name: string;
  pageID: number;
  language: IContentEditorLanguage[];
  categories: string[];
  displayCategories?: string;
  tags: string[];
  authors: string[];
  isPin: boolean;
  priority: number;
  startDate: string;
  isEndDate: boolean;
  endDate: string;
  views: number;
  coverImage: string;
  isPublish: boolean;
  customCSS: string;
  draftSections: IContentEditorSection[];
  sections: IContentEditorSection[];
}

export interface IContentEditorLanguage {
  cultureUI: EnumLanguageCultureUI;
  title: string;
  subTitle: string;
  keyword: string;
}
export interface IContentEditorSection {
  type: EContentSectionType;
  gap: number;
  columns: IContentEditorColumn[];
}

export interface IContentEditorColumn {
  gap: number;
  components: IContentEditorComponent[] | string;
}

export type IContentEditorComponent = IContentEditorComponentText | IContentEditorComponentEmbeded | IContentEditorComponentImage;

export interface IContentEditorComponentCommon {
  type: EContentEditorComponentType;
}
export interface IContentEditorComponentText extends IContentEditorComponentCommon {
  quillHTMLs: IContentEditorComponentTextHTML[];
}

export interface IContentEditorComponentEmbeded extends IContentEditorComponentCommon {
  option: IContentEditorComponentEmbededOption;
}

export interface IContentEditorComponentEmbededOption {
  embeded: string;
}

export interface IContentEditorComponentImage extends IContentEditorComponentCommon {
  option: IContentEditorComponentImageOption;
}

export interface IContentEditorComponentImageOption {
  imgUrl: string;
  isCaption: boolean;
  captionType: ContentEditorComponentImageCaptionType;
  language: IContentEditorComponentImageLanguage[] | IContentEditorComponentImageLanguage;
}

export interface IContentEditorComponentImageLanguage {
  cultureUI: EnumLanguageCultureUI;
  caption: string;
  alt: string;
  title: string;
}

export enum ContentEditorComponentImageCaptionType {
  TYPE_1 = 'image-caption-bottom',
  TYPE_2 = 'image-caption-overlay',
}

export interface IContentEditorComponentTextHTML {
  cultureUI: EnumLanguageCultureUI;
  quillHTML: string;
}

export interface IDateRange {
  start: string;
  end: string;
}

export interface ILayoutStyle {
  container: ILayoutGridStyle;
  primary: ILayoutGridStyle;
  secondary: ILayoutGridStyle;
  css: string;
}

export interface ILayoutGridStyle {
  display: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridGap: string;
}
