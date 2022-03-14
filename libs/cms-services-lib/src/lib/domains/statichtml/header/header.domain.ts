import { EDropzoneType, ICommonSettings } from '@reactor-room/cms-models-lib';

export function generateStaticHTMLHeaderSection(commonSettings: ICommonSettings): { html: string; closeSection: string } {
  const html = `<div class="itp-theme-header ${commonSettings.className}" id="${EDropzoneType.THEME_HEADER}" style="padding:20px">`;
  const closeSection = '</div>';
  return { html, closeSection };
}
