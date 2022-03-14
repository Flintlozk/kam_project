import { ComponentTypeEnum, EnumGenerateMode, IRenderingComponentData } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';

export function sortedLinkedList(components: IRenderingComponentData[], startId: string, type: EnumGenerateMode, prevIdOption?: string): IRenderingComponentData[] {
  const keys = makeComponentMaps(components, type);
  const orderdThemeComponent = [];
  let next = startId;
  let prevId = prevIdOption || null;
  while (next) {
    const component = keys[next];
    if (component) {
      if (prevId) {
        component.prevId = prevId;
      }
      orderdThemeComponent.push(component);
    }
    prevId = next;
    // case text node
    if (keys[prevId]?.componentType === ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_TEXT_RENDERING) {
      prevId = keys[prevId].prevId;
    }
    next = keys[next]?.nextId;
  }
  return orderdThemeComponent;
}

export function sortedLinkedListOnlySameLayout(components: IRenderingComponentData[], startId: string, type: EnumGenerateMode, prevIdOption?: string): IRenderingComponentData[] {
  const orderdThemeComponent = [];
  if (type === EnumGenerateMode.THEME) {
    const keys = makeComponentMaps(components, type);
    let next = startId;
    let prevId = prevIdOption || null;
    const layoutId = prevId;
    while (next) {
      const component = keys[next];
      if (component) {
        if (component?.themeLayoutID === layoutId) {
          if (prevId) {
            component.prevId = prevId;
          }
          orderdThemeComponent.push(component);
        } else {
          break;
        }
      }
      prevId = next;
      next = keys[next]?.nextId;
    }
  } else {
    throw Error(`cannot use with type ${type}`);
  }
  return orderdThemeComponent;
}

export function makeComponentMaps(components: IRenderingComponentData[], type: EnumGenerateMode): { [key: string]: IRenderingComponentData } {
  const keys = {};
  for (let i = 0; i < components.length; i++) {
    const c = components[i];
    let id;
    switch (type) {
      case EnumGenerateMode.PAGECOMPONENT:
        id = c._id;
        break;
      case EnumGenerateMode.THEME:
        id = c.themeOption?.themeIdentifier;
        break;
    }
    keys[id] = c;
  }
  return keys;
}
export function sortLinkedListComponentsWithinSection(components: IRenderingComponentData[]): IRenderingComponentData[] {
  let orderdThemeComponent = [];
  const sectionComponent = components.filter((component) => component.section === undefined);
  const sortedSectionComponent: IRenderingComponentData[] = _.sortBy(sectionComponent, 'orderNumber');
  const themeComponent = components.filter((component) => component.section !== undefined);
  const groupThemeComponent = _.groupBy(themeComponent, 'section');

  for (const sectionComponent of sortedSectionComponent) {
    orderdThemeComponent.push(sectionComponent);
    const componentType = sectionComponent.componentType;
    if (groupThemeComponent[componentType] !== undefined) {
      const groupComponent = groupThemeComponent[componentType];
      const startId = sectionComponent.nextId;
      const componentSorted = sortedLinkedList(groupComponent, startId, EnumGenerateMode.THEME, sectionComponent.themeOption.themeIdentifier);
      orderdThemeComponent = orderdThemeComponent.concat(componentSorted);
    }
  }
  return orderdThemeComponent;
}
