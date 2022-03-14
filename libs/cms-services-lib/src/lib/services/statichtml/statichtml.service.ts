import * as ThemeData from '../../data/theme/theme.data';
import { generateHTMLTag, generateStaticHtmlCssJsFromCoponents } from '../../domains/statichtml/statichtml.domain';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { addPrefixUrl } from '../../domains/url/url.domain';
import { EnumGenerateMode, EnumLanguageCultureUI, EnumTypeMode } from '@reactor-room/cms-models-lib';
import { getComponentMock } from '../component';
import { WebPageService } from '../web-page';
export class StaticHtmlService {
  static getThemeStaticHtml = async (themeId: string, themeLayoutNumber: string, userID: string, webPageID: string): Promise<string> => {
    const themeData = await ThemeData.getThemeByThemeId(themeId);
    const webPageService = new WebPageService();
    const webPages = await webPageService.getWebPagesMocks(parseInt(userID));
    const pageComponent = await getComponentMock(+userID, webPageID);
    const iframeLink = `${environmentLib.cms.backendUrl}/themes/${themeId}/${themeLayoutNumber}/${userID}/`;
    const contentData = await generateStaticHtmlCssJsFromCoponents(
      pageComponent.components,
      EnumGenerateMode.THEME,
      themeData.devices,
      webPages,
      EnumLanguageCultureUI.TH,
      EnumTypeMode.PREVIEW,
      iframeLink,
    );
    const themeDataWithLink = addPrefixUrl(themeData, environmentLib.filesServer);
    const html = await generateHTMLTag(
      themeData.themeComponents[themeLayoutNumber].themeComponent,
      themeDataWithLink.style,
      themeDataWithLink._id,
      parseInt(themeLayoutNumber),
      contentData.html,
      themeData.devices,
      contentData.css,
      EnumTypeMode.PREVIEW,
      iframeLink,
      webPages,
      EnumLanguageCultureUI.TH,
    );
    return html;
  };
}
