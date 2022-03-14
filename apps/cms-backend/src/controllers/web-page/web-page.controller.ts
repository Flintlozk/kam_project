import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { MenuService, WebPageService } from '@reactor-room/cms-services-lib';
import {
  validateRequestPageID,
  validateRequestWebPageCreate,
  validateRequestWebPageRemoveFromContainer,
  validateRequestWebPageUpdateFromToContainer,
  validateRequestWebPageUpdateHide,
  validateRequestWebPageUpdateHomepage,
  validateRequestWebPageUpdateName,
  validateRequestWebPageUpdateOrderNumber,
  validateRequestWebPageID,
  validateRequestWebPageDetails,
  validateResponseHTTPObject,
  validateResponseWebPagePage,
  validateResponseWebPage,
  validateMenuHTMLRequest,
  validateDefaultResponse,
  validateRequestMenuCssJs,
  validateGetLandingWebPageByNameRequest,
  validateResponseWebPageLandingPage,
} from '../../schema';
import {
  IWebPageFromToContainer,
  IWebPageOrderNumber,
  IUpdateWebPagesHide,
  IUpdateWebPageHomePage,
  IWebPage,
  IWebPagePage,
  IWebPageDetails,
  IMegaOption,
  IMegaFooterOption,
  IMegaConfig,
  IMegaFooterConfig,
  IMenuHTML,
  IMenuCssJs,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateHTTPResponse } from '../../schema/theme/theme.schema';

@requireScope([EnumAuthScope.CMS])
class WebPage {
  public static instance: WebPage;
  public static webPageService: WebPageService;

  public static getInstance() {
    if (!WebPage.instance) WebPage.instance = new WebPage();
    return WebPage.instance;
  }

  constructor() {
    WebPage.webPageService = new WebPageService();
  }

  async getMenuHTMLHandler(parent, args, context: IGQLContext): Promise<string> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { menuHTML } = validateMenuHTMLRequest<{ menuHTML: IMenuHTML }>(args);
    const result = await MenuService.getMenuHTML(menuHTML, pageID);
    return result;
  }

  async getMenuCssJsHandler(parent, args: { webPageID: string; _id: string; isFromTheme: boolean }, context: IGQLContext): Promise<IMenuCssJs> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { webPageID, _id, isFromTheme } = validateRequestMenuCssJs<{ webPageID: string; _id: string; isFromTheme: boolean }>(args);
    const result = await MenuService.getMenuCssJs(pageID, _id, isFromTheme, webPageID);
    return result;
  }

  async getWebPagesByPageIDHandler(parent, args, context: IGQLContext): Promise<IWebPage[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await WebPage.webPageService.getWebPagesByPageID(pageID);
    return result;
  }

  async getWebPageByWebPageIDHandler(parent, args: { _id: string }, context: IGQLContext): Promise<IWebPagePage> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { _id } = validateRequestWebPageID<{ _id: string }>(args);
    const result = await WebPage.webPageService.getWebPageByWebPageID(pageID, _id);
    return result;
  }

  async createWebPageHandler(parent, args: { level: number; page: IWebPagePage }, context: IGQLContext): Promise<IWebPagePage> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = validateRequestWebPageCreate<{ level: number; page: IWebPagePage }>(args);
    const returnedValue = await WebPage.webPageService.createWebPage(pageID, result.level, result.page);
    if (returnedValue) await MenuService.generateMenuHTML(pageID, null);
    return returnedValue;
  }

  async updateWebPageDetailsHandler(parent, args: { _id: string; pageDetails: IWebPageDetails }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { _id, pageDetails } = validateRequestWebPageDetails<{ _id: string; pageDetails: IWebPageDetails }>(args);
    const result = await WebPage.webPageService.updateWebPageDetails(pageID, _id, pageDetails);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, null);
    return result;
  }

  async updateWebPageNameHandler(parent, args: { name: string; level: number; _id: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { name, level, _id } = validateRequestWebPageUpdateName<{ name: string; level: number; _id: string }>(args);
    const result = await WebPage.webPageService.updateWebPageName(pageID, name, level, _id);
    return result;
  }

  async updateWebPagesHideHandler(parent, args: { updateWebPagesHide: IUpdateWebPagesHide[]; isHide: boolean }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { updateWebPagesHide, isHide } = validateRequestWebPageUpdateHide<{ updateWebPagesHide: IUpdateWebPagesHide[]; isHide: boolean }>(args);
    const result = await WebPage.webPageService.updateWebPagesHide(pageID, updateWebPagesHide, isHide);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, null);
    return result;
  }

  async updateWebPageHomepageHandler(parent, args: { updateWebPageHomePage: IUpdateWebPageHomePage }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { updateWebPageHomePage } = validateRequestWebPageUpdateHomepage<{ updateWebPageHomePage: IUpdateWebPageHomePage }>(args);
    const result = await WebPage.webPageService.updateWebPageHomepage(
      pageID,
      updateWebPageHomePage.previousLevel,
      updateWebPageHomePage.previousId,
      updateWebPageHomePage.currentLevel,
      updateWebPageHomePage.currentId,
    );
    return result;
  }

  async updateWebPageOrderNumbersHandler(parent, args: { webPageOrderNumbers: IWebPageOrderNumber[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { webPageOrderNumbers } = validateRequestWebPageUpdateOrderNumber<{ webPageOrderNumbers: IWebPageOrderNumber[] }>(args);
    const result = await WebPage.webPageService.updateWebPageOrderNumbers(pageID, webPageOrderNumbers);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, null);
    return result;
  }

  async removeWebPageFromContainerHandler(
    parent,
    args: {
      webPagePositions: IWebPageFromToContainer[];
      webPageOrderNumbers: IWebPageOrderNumber[];
    },
    context: IGQLContext,
  ): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { webPagePositions, webPageOrderNumbers } = validateRequestWebPageRemoveFromContainer<{
      webPagePositions: IWebPageFromToContainer[];
      webPageOrderNumbers: IWebPageOrderNumber[];
    }>(args);
    const result = await WebPage.webPageService.removeWebPageFromContainer(pageID, webPagePositions, webPageOrderNumbers);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, null);
    return result;
  }

  async updateWebPageFromToContainerHandler(
    parent,
    args: {
      previousWebPagePositions: IWebPageFromToContainer[];
      nextWebPagePositions: IWebPageFromToContainer[];
      oldWebPageOrderNumbers: IWebPageOrderNumber[];
      newWebPageOrderNumbers: IWebPageOrderNumber[];
    },
    context: IGQLContext,
  ): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const validateResult = validateRequestWebPageUpdateFromToContainer<{
      previousWebPagePositions: IWebPageFromToContainer[];
      nextWebPagePositions: IWebPageFromToContainer[];
      oldWebPageOrderNumbers: IWebPageOrderNumber[];
      newWebPageOrderNumbers: IWebPageOrderNumber[];
    }>(args);
    const result = await WebPage.webPageService.updateWebPageFromToContainer(
      pageID,
      validateResult.previousWebPagePositions,
      validateResult.nextWebPagePositions,
      validateResult.oldWebPageOrderNumbers,
      validateResult.newWebPageOrderNumbers,
    );
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, null);
    return result;
  }
  async getHomePageIdHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await WebPage.webPageService.getHomePageId(pageID);
    return result;
  }

  async getLandingWebPageByNameHandler(parent, args: { previousWebPageID: string; componentId: string }, context: IGQLContext): Promise<IWebPagePage> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { previousWebPageID, componentId } = validateGetLandingWebPageByNameRequest<{ previousWebPageID: string; componentId: string }>(args);
    const result = await WebPage.webPageService.getLandingWebPageByName(previousWebPageID, pageID, componentId);
    return result;
  }
}

const webPage: WebPage = WebPage.getInstance();
export const webPageResolver = {
  MegaOptionModel: {
    __resolveType(root: IMegaOption): string {
      if ('textImage' in root) return 'MegaOptionTextImageModel';
      else if ('custom' in root) return 'MegaOptionCustomModel';
      else return 'MegaOptionTextImageModel';
    },
  },
  MegaOptionFooterModel: {
    __resolveType(root: IMegaFooterOption): string {
      if ('textImage' in root) return 'MegaOptionFooterTextImageModel';
      else if ('custom' in root) return 'MegaOptionFooterCustomModel';
      else return 'MegaOptionFooterTextImageModel';
    },
  },
  MegaConfigModel: {
    __resolveType(root: IMegaConfig): string {
      if ('textImage' in root) return 'MegaConfigTextImageModel';
      else if ('custom' in root) return 'MegaConfigCustomModel';
      else return 'MegaConfigTextImageModel';
    },
  },
  MegaFooterConfigModel: {
    __resolveType(root: IMegaFooterConfig): string {
      if ('textImage' in root) return 'MegaFooterConfigTextImageModel';
      else if ('custom' in root) return 'MegaFooterConfigCustomModel';
      else return 'MegaFooterConfigTextImageModel';
    },
  },
  Query: {
    getMenuHTML: graphQLHandler({
      handler: webPage.getMenuHTMLHandler,
      validator: validateDefaultResponse,
    }),
    getMenuCssJs: graphQLHandler({
      handler: webPage.getMenuCssJsHandler,
      validator: validateDefaultResponse,
    }),
    getWebPagesByPageID: graphQLHandler({
      handler: webPage.getWebPagesByPageIDHandler,
      validator: validateResponseWebPage,
    }),
    getWebPageByWebPageID: graphQLHandler({
      handler: webPage.getWebPageByWebPageIDHandler,
      validator: validateResponseWebPagePage,
    }),
    getHomePageId: graphQLHandler({
      handler: webPage.getHomePageIdHandler,
      validator: validateHTTPResponse,
    }),
    getLandingWebPageByName: graphQLHandler({
      handler: webPage.getLandingWebPageByNameHandler,
      validator: validateResponseWebPageLandingPage,
    }),
  },
  Mutation: {
    createWebPage: graphQLHandler({
      handler: webPage.createWebPageHandler,
      validator: validateResponseWebPagePage,
    }),
    updateWebPageDetails: graphQLHandler({
      handler: webPage.updateWebPageDetailsHandler,
      validator: validateResponseHTTPObject,
    }),
    updateWebPageName: graphQLHandler({
      handler: webPage.updateWebPageNameHandler,
      validator: validateResponseHTTPObject,
    }),
    updateWebPagesHide: graphQLHandler({
      handler: webPage.updateWebPagesHideHandler,
      validator: validateResponseHTTPObject,
    }),
    updateWebPageHomepage: graphQLHandler({
      handler: webPage.updateWebPageHomepageHandler,
      validator: validateResponseHTTPObject,
    }),
    updateWebPageOrderNumbers: graphQLHandler({
      handler: webPage.updateWebPageOrderNumbersHandler,
      validator: validateResponseHTTPObject,
    }),
    removeWebPageFromContainer: graphQLHandler({
      handler: webPage.removeWebPageFromContainerHandler,
      validator: validateResponseHTTPObject,
    }),
    updateWebPageFromToContainer: graphQLHandler({
      handler: webPage.updateWebPageFromToContainerHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
