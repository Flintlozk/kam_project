import {
  ComponentTypeEnum,
  EnumGenerateMode,
  IContentManagementRenderingSetting,
  IDeltaRenderingComponentData,
  ILandingContentManagementRenderingSetting,
  IMockPageComponent,
  IPageComponent,
  IRenderingComponentData,
  IWebPageComponentDelta,
  LandingAreaType,
} from '@reactor-room/cms-models-lib';
import * as ComponentData from '../../data/component/component.data';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  changeFullUrlToPathUrl,
  changePathUrlToFullUrl,
  createMappingIDtoMongooseObjectId,
  isStartComponent,
  mapIdtoMongooseObjectId,
  transformComponentsToAngularHTML,
  transformLandingHTMLToAngularHTML,
} from '../../domains';
import { sortedLinkedList } from '../../domains/linked-list/linked-list.domain';
import * as lzString from 'lz-string';
import { ClientSession } from 'mongoose';
import {
  addPageComponent,
  movePageComponent,
  removePageComponent,
  updateLastIdComponentToLinkedList,
  updatePageComponent,
  updateStartID,
} from '../../data/component/component.data';
import { ThemeService } from '../theme';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { publishMessage } from '@reactor-room/itopplus-back-end-helpers';
import { getContentPatternLanding } from '../../data/content-patterns-landing/content-patterns-landing.data';
import { ContentsService } from '@reactor-room/cms-services-lib';
export const getComponent = async (webPageID: string, pageID: number, subscriptionID: string): Promise<IPageComponent> => {
  const pageComponent = await ComponentData.getComponent(webPageID, pageID);
  if (pageComponent) {
    const startID = pageComponent.startID;
    pageComponent.components = sortedLinkedList(pageComponent.components, startID, EnumGenerateMode.PAGECOMPONENT);
    pageComponent.components = changePathUrlToFullUrl(pageComponent.components, environmentLib.filesServer, subscriptionID);
    const angularHTML = transformComponentsToAngularHTML(pageComponent.components, EnumGenerateMode.PAGECOMPONENT);
    pageComponent.angularHTML = angularHTML;
    return pageComponent;
  }
  return {
    angularHTML: '',
    webPageID,
    startID: null,
    components: [],
  };
};
export const getComponentMock = async (userID: number, webPageID: string): Promise<IMockPageComponent> => {
  const pageComponent = await ComponentData.getPageComponnetDataMock(userID, webPageID);
  if (pageComponent) {
    const startID = pageComponent.startID;
    pageComponent.components = sortedLinkedList(pageComponent.components, startID, EnumGenerateMode.PAGECOMPONENT);
    pageComponent.components = changePathUrlToFullUrl(pageComponent.components, environmentLib.filesServer, pageComponent.subscriptionID);
    return pageComponent;
  }
  return {
    angularHTML: '',
    webPageID,
    startID: null,
    components: [],
  };
};

export const getLandingComponent = async (
  webPageID: string,
  previousWebPageID: string,
  componentId: string,
  contentId: string,
  pageID: number,
  subscriptionID: string,
): Promise<IPageComponent> => {
  try {
    const component = await getComponent(webPageID, pageID, subscriptionID);
    const componentList = component.components;
    const previousComponent = await ComponentData.getSingleComponent(previousWebPageID, pageID, componentId);
    switch (previousComponent.componentType) {
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING:
        {
          const landingComponent = componentList.find((component) => component.componentType === ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING);
          if (landingComponent) {
            previousComponent.options = previousComponent.options as IContentManagementRenderingSetting;
            landingComponent.options = landingComponent.options as ILandingContentManagementRenderingSetting;
            const pattern = await getContentPatternLanding(previousComponent.options.landing._id);
            const contentHTML = await ContentsService.getContentsHTML(pageID, contentId);
            pattern.html = transformLandingHTMLToAngularHTML(pattern.html, contentHTML, ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING);
            component.angularHTML = component.angularHTML.replace(LandingAreaType.LANDING_AREA, pattern.html);
            landingComponent.options.landing = previousComponent.options.landing;
            landingComponent.options.pattern = pattern;
          }
        }
        break;
      default:
        break;
    }
    return component;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSingleComponent = async (webPageID: string, pageID: number, componentId: string): Promise<IRenderingComponentData> => {
  return await ComponentData.getSingleComponent(webPageID, pageID, componentId);
};

export const getPageComponnetData = async (pageID: number): Promise<IPageComponent[]> => {
  return await ComponentData.getPageComponnetData(pageID);
};
export const getPageComponnetDataMock = async (userID: number, webPageID: string): Promise<IPageComponent> => {
  return await ComponentData.getPageComponnetDataMock(userID, webPageID);
};
export const deletePageComponnetDataMock = async (pageID: number): Promise<boolean> => {
  return await ComponentData.deletePageComponnetDataMock(pageID);
};
export const savePageComponnetDataMock = async (pageComponents: IPageComponent[]): Promise<boolean> => {
  return await ComponentData.savePageComponnetDataMock(pageComponents);
};

export const createPageComponent = async (webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  return await ComponentData.createPageComponent(webPageID, pageID, session);
};

export const updateComponentLandingPageOption = async (landing: string, webPageID: string, componentId: string, pageID: number): Promise<IHTTPResult> => {
  try {
    const landingObject = JSON.parse(landing);
    await ComponentData.updateComponentLandingPageOption(landingObject, webPageID, componentId, pageID);
    return { status: 200, value: true };
  } catch (error) {
    console.log('error->updateComponentLandingPageOption :>> ', error);
    throw new Error(error);
  }
};

export const updatePageComponentByWebPageID = async (deltaPageComponent: IDeltaRenderingComponentData, pageID: number, session?: ClientSession): Promise<IHTTPResult> => {
  let result: IHTTPResult = { status: 403, value: '' };
  const { added, moved, movedWithMutated, removed, mutated, webPageID } = deltaPageComponent;
  let lastId = deltaPageComponent.lastId;
  const idMapping = await addComponentToLinkedList(added, webPageID, pageID, session);
  const AllService = [
    moveComponentToLinkedList(idMapping, moved, webPageID, pageID, session),
    moveWithMutatedComponentToLinkedList(idMapping, movedWithMutated, webPageID, pageID, session),
    removeComponentToLinkedList(removed, webPageID, pageID, session),
    mutateComponentToLinkedList(mutated, webPageID, pageID, session),
  ];
  await Promise.all(AllService).catch((error) => {
    console.log('updatePageComponentByWebPageID', error);
  });
  if (lastId) {
    if (/^element-/.test(lastId) || /^layout-/.test(lastId)) {
      lastId = idMapping[lastId];
    }
    await updateLastIdComponentToLinkedList(lastId, webPageID, pageID, session);
  }
  result = { status: 200, value: idMapping };
  return result;
};
export const addComponentToLinkedList = async (addComponents: string[], webPageID: string, pageID: number, session: ClientSession): Promise<{ [key: string]: string }> => {
  let keys = {};
  for (const item of addComponents) {
    let component = JSON.parse(lzString.decompress(item));
    const newkeys = createMappingIDtoMongooseObjectId(component, keys);
    keys = { ...newkeys };
    component = changeFullUrlToPathUrl(component);
    await addPageComponent(component, webPageID, pageID, session);
    if (isStartComponent(component)) {
      await updateStartID(component._id, webPageID, pageID, session);
    } else {
      await movePageComponent(component, webPageID, pageID, session);
    }
  }
  return keys;
};
export const moveComponentToLinkedList = async (idMapping: { [key: string]: string }, movedComponents: string[], webPageID: string, pageID: number, session: ClientSession) => {
  for (const item of movedComponents) {
    const component = JSON.parse(lzString.decompress(item));
    if (idMapping) {
      await mapIdtoMongooseObjectId(component, idMapping);
    }
    if (isStartComponent(component)) {
      await updateStartID(component._id, webPageID, pageID, session);
    }
    await movePageComponent(component, webPageID, pageID, session);
  }
};
export const moveWithMutatedComponentToLinkedList = async (
  idMapping: { [key: string]: string },
  movedComponents: string[],
  webPageID: string,
  pageID: number,
  session: ClientSession,
) => {
  for (const item of movedComponents) {
    let component = JSON.parse(lzString.decompress(item));
    component = changeFullUrlToPathUrl(component);
    if (idMapping) {
      await mapIdtoMongooseObjectId(component, idMapping);
    }
    if (isStartComponent(component)) {
      await updateStartID(component._id, webPageID, pageID, session);
    }
    await movePageComponent(component, webPageID, pageID, session);
    await updatePageComponent(component, webPageID, pageID, session);
  }
};
export const removeComponentToLinkedList = async (removedComponents: string[], webPageID: string, pageID: number, session: ClientSession): Promise<void> => {
  for (const item of removedComponents) {
    const component = JSON.parse(lzString.decompress(item));
    await removePageComponent(component._id, webPageID, pageID, session);
  }
};
export const mutateComponentToLinkedList = async (mutatedComponents: string[], webPageID: string, pageID: number, session: ClientSession): Promise<void> => {
  for (const item of mutatedComponents) {
    let component = JSON.parse(lzString.decompress(item));
    component = changeFullUrlToPathUrl(component);
    await updatePageComponent(component, webPageID, pageID, session);
  }
};
export const removeSampleComponent = async (webPageID: string): Promise<boolean> => {
  return await ComponentData.removeSampleComponent(webPageID);
};

export const updateWebPageAllComponents = async (
  webPageAllComponentDelta: IWebPageComponentDelta,
  pageID: number,
  subscriptionID: string,
  pageUUID: string,
): Promise<IHTTPResult> => {
  const session = await PlusmarService.mongoConnector.startSession();
  let result: IHTTPResult = { status: 403, value: '' };
  let idMapping = {};
  try {
    await session.withTransaction(async () => {
      const { componentsDelta, themeComponentsDelta } = webPageAllComponentDelta;
      const httpResult = [];
      if (componentsDelta !== null) {
        const result = await updatePageComponentByWebPageID(componentsDelta, pageID, session);
        httpResult.push(result);
      }
      if (themeComponentsDelta !== null) {
        const result = await ThemeService.updateSharingThemeComponent(themeComponentsDelta, pageID, session);
        httpResult.push(result);
      }
      // const httpResult = await Promise.all(AllService);
      for (let i = 0; i < httpResult?.length; i++) {
        idMapping = { ...idMapping, ...httpResult[i]?.value };
      }

      await publishMessage({ pageID, subscriptionID, pageUUID }, environmentLib.cms.generateContentSubscription);
      await session.commitTransaction();
      result = { status: 200, value: JSON.stringify(idMapping) };
    });
  } catch (error) {
    await session.abortTransaction();
    console.log('error->updateWebPageAllComponents :>> ', error);
    result = { status: 403, value: error?.message?.toString() };
  } finally {
    session.endSession();
  }
  return result;
};
