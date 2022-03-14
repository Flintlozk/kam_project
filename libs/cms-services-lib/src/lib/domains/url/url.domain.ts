import { IThemeRendering } from '@reactor-room/cms-models-lib';

export function addPrefixUrl(theme: IThemeRendering, CMSFilesServer: string): IThemeRendering {
  for (let i = 0; i < theme?.style?.length; i++) {
    theme.style[i].url = CMSFilesServer + theme.style[i].url;
  }
  for (let i = 0; i < theme?.image?.length; i++) {
    theme.image[i].url = CMSFilesServer + theme.image[i].url;
  }
  return theme;
}
