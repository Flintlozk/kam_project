import {
  IContentEditor,
  IContentManagementPaternItem,
  IContentManagementPatternStyle,
  IContentManagementRenderingSetting,
  IRenderingComponentData,
} from '@reactor-room/cms-models-lib';
import { ContentsService } from '../../../services';
import { generateCommonSettingsStyle } from '../../commonsettings';
import { chunk } from 'lodash';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { deepCopy } from '@reactor-room/itopplus-back-end-helpers';

export async function generateStaticHTMLContentManager(component: IRenderingComponentData, pageID: number): Promise<string> {
  const commonSettingsStyle = generateCommonSettingsStyle(component.commonSettings);
  const options = component.options as IContentManagementRenderingSetting;
  const limit = options.general.pattern.patternStyle.primary.maxContent + options.general.pattern.patternStyle.secondary.maxContent;
  const contentCategoryData = await ContentsService.getContentsByCategories(pageID, [], limit);
  const contentCategoryDataChuck = getContentChuck(options.general.pattern.patternStyle, contentCategoryData);
  let testHTML = '';
  contentCategoryDataChuck.forEach((primaryAndSecondaryContent) => {
    testHTML = generateStaticHTMLPrimaryAndSecondaryContent(options.general.pattern.patternStyle, primaryAndSecondaryContent);
  });
  let html = '<style>' + options.general.pattern.patternStyle.css + '</style>';
  html += `<div id="${component._id}" style="${commonSettingsStyle}"><div id=${options.general.pattern._id}>${testHTML}</div></div>`;
  return html;
}
export function generateStaticHTMLPrimaryAndSecondaryContent(patternStyle: IContentManagementPatternStyle, PrimaryAndSecondary: IContentEditor[][]): string {
  let html = generateStaticHTMLContentManagerPriamryContent(patternStyle, PrimaryAndSecondary[0]);
  html += generateStaticHTMLContentManagerSecondaryContent(patternStyle, PrimaryAndSecondary[1]);
  return html;
}
export function generateStaticHTMLContentManagerStyle(contentMangerStyle: IContentManagementPaternItem): string {
  let contentStyle = 'display:grid;';
  if (contentMangerStyle.grid?.gridGap) {
    contentStyle += `gap:${contentMangerStyle.grid?.gridGap};`;
  }
  if (contentMangerStyle.grid?.gridTemplateColumns) {
    contentStyle += `grid-template-columns:${contentMangerStyle.grid.gridTemplateColumns}`;
  }
  if (contentMangerStyle.grid?.gridTemplateRows) {
    contentStyle += `grid-template-rows:${contentMangerStyle.grid.gridTemplateRows}`;
  }
  return contentStyle;
}

export function generateStaticHTMLContentManagerSecondaryContent(patternStyle: IContentManagementPatternStyle, contentData: IContentEditor[]): string {
  let html = '';
  contentData.forEach((secondaryContent) => {
    const contentRendering = fs.readFileSync(path.join(__dirname + `/assets/content-manager/ejs/content.ejs`));
    html += ejs.render(contentRendering.toString(), { content: secondaryContent, contentType: 'secondary-content' });
  });
  const htmlSecondaryContainer = `<div class="secondary-container itp-sub-detail-true" style="${generateStaticHTMLContentManagerStyle(patternStyle.secondary)}">${html}</div>`;
  return htmlSecondaryContainer;
}

export function generateStaticHTMLContentManagerPriamryContent(patternStyle: IContentManagementPatternStyle, contentData: IContentEditor[]): string {
  let html = '';
  contentData.forEach((primaryContent) => {
    const contentRendering = fs.readFileSync(path.join(__dirname + `/assets/content-manager/ejs/content.ejs`));
    html += ejs.render(contentRendering.toString(), { content: primaryContent, contentType: 'primary-content' });
  });
  const htmlPrimaryContainer = `<div class="primary-container itp-detail-true" style="${generateStaticHTMLContentManagerStyle(patternStyle.primary)}">${html}</div>`;
  return htmlPrimaryContainer;
}

export function getContentChuck(patternStyle: IContentManagementPatternStyle, contentCategoryData: IContentEditor[]): IContentEditor[][][] {
  const contentArrayChuck = [];
  const maxPrimaryContent = patternStyle?.primary?.maxContent ? patternStyle?.primary?.maxContent : 0;
  const maxSecondaryContent = patternStyle?.secondary?.maxContent ? patternStyle?.secondary?.maxContent : 0;
  const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
  const layoutArrayChuck: IContentEditor[][] = chunk(contentCategoryData, maxItemPerRow);
  layoutArrayChuck.forEach((layoutChuck) => {
    contentArrayChuck.push(layoutChuck);
  });
  contentArrayChuck.forEach((contentChuck: IContentEditor[], index: number) => {
    const deepCopyPrimary = deepCopy(contentChuck);
    const deepCopySecondary = deepCopy(contentChuck);
    const primary = deepCopyPrimary.splice(0, maxPrimaryContent);
    const secondary = deepCopySecondary.splice(maxPrimaryContent, maxSecondaryContent);
    contentArrayChuck[index] = [primary, secondary];
  });
  return contentArrayChuck;
}
