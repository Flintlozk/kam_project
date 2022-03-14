export interface ICmsThemeElement {
  templateId: string;
  image: string;
  elementTypes: string[];
}

export interface ICmsThemeElementTab {
  title: string;
  status: boolean;
  key: ECmsThemeTypes;
}

export enum ECmsThemeTypes {
  HEADER = 'Header',
  TEXT = 'Text',
  MEDIA = 'Media',
  GALLERY = 'Gallery',
  FOOTER = 'Footer',
}
