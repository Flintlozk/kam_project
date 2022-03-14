export enum EPreviewMode {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile',
}

export interface IPreviewMode {
  mode: string;
  imgUrl: string;
  imgActiveUrl: string;
}
