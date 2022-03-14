import { ComponentTypeEnum, HTMLTypeEnum, IRenderingComponentData } from '@reactor-room/cms-models-lib';
import mongoose from 'mongoose';
import { generatePageComponent, generateStringComponent, isComponentInSide } from '../angularhtml.domain';
export function generatePageComponentFromPlainHTML(
  html: Element,
  themeLayoutID: string,
  layoutPosition: number,
  section: ComponentTypeEnum,
  HTMLType: HTMLTypeEnum,
): IRenderingComponentData[] {
  let pageComponentListData = [];
  const pageComponentData = {} as IRenderingComponentData;
  pageComponentData._id = mongoose.Types.ObjectId().toHexString();
  pageComponentData.componentType = generateTypeHTML(HTMLType);
  pageComponentData.section = section;
  if (isComponentInSide(html)) {
    const splitHTML = html.outerHTML.split('>');
    pageComponentData.outterHTML = splitHTML[0] + '>';
  } else {
    pageComponentData.outterHTML = generateOutterHTMLForNOChildHTML(html, HTMLType);
  }
  pageComponentData.isActive = true;
  pageComponentData.themeOption = { themeIdentifier: pageComponentData._id };
  pageComponentData.themeLayoutID = themeLayoutID;
  pageComponentData.layoutPosition = layoutPosition;
  pageComponentListData = pageComponentListData.concat(pageComponentData);
  if (isComponentInSide(html)) {
    let indexChild = 0;
    for (let j = 0; j < html.childNodes.length; j++) {
      if (html.childNodes.item(j).nodeName === '#text') {
        const childComponent = html.childNodes.item(j);
        pageComponentListData.push(generateStringComponent(childComponent, pageComponentData.themeOption.themeIdentifier, layoutPosition, section));
      } else {
        const childComponent = html.children.item(indexChild);
        pageComponentListData = pageComponentListData.concat(
          generatePageComponent(childComponent, pageComponentData.themeOption.themeIdentifier, layoutPosition, childComponent.attributes.getNamedItem('style'), section),
        );
        indexChild += 1;
      }
    }
  }
  return pageComponentListData;
}
function generateOutterHTMLForNOChildHTML(html: Element, HTMLType: HTMLTypeEnum): string {
  switch (HTMLType) {
    case HTMLTypeEnum.DIV:
      return html.outerHTML.slice(0, -6);
    case HTMLTypeEnum.P:
      return html.outerHTML.slice(0, -4);
    case HTMLTypeEnum.SPAN:
      return html.outerHTML.slice(0, -7);
    case HTMLTypeEnum.IMG:
      return html.outerHTML;
  }
}
function generateTypeHTML(HTMLType: HTMLTypeEnum): ComponentTypeEnum {
  switch (HTMLType) {
    case HTMLTypeEnum.DIV:
      return ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING;
    case HTMLTypeEnum.P:
      return ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING;
    case HTMLTypeEnum.SPAN:
      return ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING;
    case HTMLTypeEnum.IMG:
      return ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING;
  }
}
