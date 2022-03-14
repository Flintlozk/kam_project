export interface ILanguage {
  _id: string;
  name: string;
  localName: string;
  icon: string;
  cultureUI: EnumLanguageCultureUI;
}

export enum EnumLanguageCultureUI {
  EN = 'EN',
  TH = 'TH',
  JP = 'JP',
}
