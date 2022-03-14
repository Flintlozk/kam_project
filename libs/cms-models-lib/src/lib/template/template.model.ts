export interface ITemplateData {
  _id: string;
  name: string;
  thumbnail: string;
  pin?: boolean;
  priority?: number;
  type: TemplateTypeEnum;
  createDate?: Date;
  lastUpdate?: Date;
  createBy?: number;
  lastupDateBy?: number;
}
export enum TemplateTypeEnum {
  // we will not imprement ALL in database use only in frontend
  ALL = 'ALL',
  HEADER = 'HEADER',
  SECTION = 'SECTION',
  GALLERY = 'GALLERY',
  VIDEO = 'VIDEO',
  PAGE = 'PAGE',
  FOOTER = 'FOOTER',
}
