import { ComponentTypeEnum, ELayoutColumns, ILayoutRenderingSetting, IRenderingComponentData, ITextRenderingSetting } from '@reactor-room/cms-models-lib';
import { JSDOM } from 'jsdom';
import { groupBy, sortBy } from 'lodash';
import * as sanitizeHtml from 'sanitize-html';
import { generateCommonSettingsStyle } from '../commonsettings';
import { performSetLayoutOptionsToElementStyle } from '../options';

export function pageComponentToHTML(components: IRenderingComponentData[]): string {
  const sortedComponents = sortBy(components, ['orderNumber']);
  const html = generateWebsiteData(sortedComponents);
  return html;
}

export function generateTheme(html: string, components: IRenderingComponentData[]): string {
  const dom = new JSDOM(html);
  const groups = groupBy(components, 'themeIdentifier');
  for (const themeId in Object.keys(groups)) {
    const themeComponentHTML = pageComponentToHTML(groups[themeId]);
    dom.window.document.getElementById(themeId).innerHTML = themeComponentHTML;
  }
  return dom.window.document.documentElement.outerHTML;
}

function generateWebsiteData(components: IRenderingComponentData[]): string {
  const dom = new JSDOM();
  const { document } = dom.window;
  const { documentElement } = document;
  const length = components.length;
  for (let i = 0; i < length; i++) {
    const { _id, componentType, layoutID, options, layoutPosition } = components[i];
    switch (componentType) {
      case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING: {
        const layoutOption = options as ILayoutRenderingSetting;
        const className = getColumnClassName(layoutOption.setting.column);
        const commonSettingsStyle = generateCommonSettingsStyle(components[i].commonSettings);
        const optionStyle = performSetLayoutOptionsToElementStyle(layoutOption);
        const sumStyle = commonSettingsStyle + optionStyle;
        documentElement.innerHTML += `<div id="${_id}" class="${className}" style="${sumStyle}"></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTAINER_RENDERING: {
        documentElement.innerHTML += '';
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING: {
        const textOption = options as ITextRenderingSetting;
        const cleanText = sanitizeHtml(textOption.quillHTMLs[0].quillHTML);
        const commonSettingsStyle = generateCommonSettingsStyle(components[i].commonSettings);
        if (layoutID) {
          const parent = document.getElementById(layoutID);
          if (parent) {
            parent.innerHTML += `<div class="${
              layoutPosition ? 'column-' + layoutPosition : 'no-column'
            }"><div id="${_id}" style="${commonSettingsStyle}">${cleanText}</div></div>`;
          } else {
            throw new Error(`No parent: ${layoutID} for child ${_id}`);
          }
        } else {
          documentElement.innerHTML += `<div class="${
            layoutPosition ? 'column-' + layoutPosition : 'no-column'
          }"><div id="${_id}" style="${commonSettingsStyle}">${cleanText}</div></div>`;
        }
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING: {
        documentElement.innerHTML += `<div id="${_id}"></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING: {
        documentElement.innerHTML += `<div id="${_id}"></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING: {
        documentElement.innerHTML += `<div id="${_id}"></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_THEME_RENDERING: {
        documentElement.innerHTML += `<div id="${_id}"></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_BUTTON_RENDERING: {
        documentElement.innerHTML += `<div id="${_id}"></div>`;
        break;
      }
      default:
        console.error('not implemented component:', componentType);
    }
  }
  return documentElement.outerHTML;
}
function getColumnClassName(layoutOptionSettingColumn: string): string {
  let className = '';
  switch (layoutOptionSettingColumn) {
    case ELayoutColumns.ONE_COLUMN: {
      className = 'one-column';
      break;
    }
    case ELayoutColumns.FIVE_FIVE_COLUMN ||
      ELayoutColumns.SIX_FOUR_COLUMN ||
      ELayoutColumns.FOUR_SIX_COLUMN ||
      ELayoutColumns.SEVEN_THREE_COLUMN ||
      ELayoutColumns.THREE_SEVEN_COLUMN: {
      className = 'two-column';
      break;
    }
    case ELayoutColumns.THREE_COLUMN: {
      className = 'three-column';
      break;
    }
    case ELayoutColumns.FOUR_COLUMN: {
      className = 'four-column';
      break;
    }

    default:
      console.error('not implemented ColumnType:', layoutOptionSettingColumn);
  }
  return className;
}
