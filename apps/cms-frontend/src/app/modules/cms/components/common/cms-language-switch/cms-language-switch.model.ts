import { ILanguage } from '@reactor-room/cms-models-lib';

export interface ICmsLanguageSwitch extends ILanguage {
  activeStatus: boolean;
  default: boolean;
}
