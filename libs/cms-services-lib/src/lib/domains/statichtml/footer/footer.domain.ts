import { EDropzoneType, ICommonSettings } from '@reactor-room/cms-models-lib';

export function generateStaticHTMLFooterSection(commonSettings: ICommonSettings): { html: string; closeSection: string } {
  const html = `<div class="itp-theme-footer ${commonSettings.className}" id="${EDropzoneType.THEME_FOOTER}" style="padding:20px">`;
  const closeSection = '</div>';
  return { html, closeSection };
}
