import { EDropzoneType, ICommonSettings } from '@reactor-room/cms-models-lib';

export function generateStaticHTMLContentSection(commonSettings: ICommonSettings): { html: string; closeSection: string } {
  const html = `<div class="itp-theme-content ${commonSettings.className}" id="${EDropzoneType.CONTENT}" style="padding:20px" >[CONTENT]`;
  const closeSection = '</div>';
  return { html, closeSection };
}
