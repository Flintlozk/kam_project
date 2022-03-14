import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { MenuCustomService, MenuService } from '@reactor-room/cms-services-lib';
import {
  validateRequestPageID,
  validateRequestMenuPageCreate,
  validateRequestMenuPageRemoveFromContainer,
  validateRequestMenuPageUpdateFromToContainer,
  validateRequestMenuPageUpdateHide,
  validateRequestMenuPageUpdateHomepage,
  validateRequestMenuPageUpdateName,
  validateRequestMenuPageUpdateOrderNumber,
  validateRequestMenuPageID,
  validateRequestMenuPageDetails,
  validateResponseHTTPObject,
  validateResponseMenuPagePage,
  validateResponseMenuPage,
  validateRequestMenuGroupID,
  validateResponseMenuGroup,
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
  IMenuGroup,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';

@requireScope([EnumAuthScope.CMS])
class MenuPage {
  public static instance: MenuPage;
  public static menuPageService: MenuCustomService;

  public static getInstance() {
    if (!MenuPage.instance) MenuPage.instance = new MenuPage();
    return MenuPage.instance;
  }

  constructor() {
    MenuPage.menuPageService = new MenuCustomService();
  }

  async getMenuGroupHandler(parent, args, context: IGQLContext): Promise<IMenuGroup[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await MenuPage.menuPageService.getMenuGroup(pageID);
    return result;
  }

  async getMenuPagesByMenuPageIDHandler(parent, args: { menuGroupId: string }, context: IGQLContext): Promise<IWebPage[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { menuGroupId } = validateRequestMenuGroupID<{ menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.getMenuPagesByPageID(pageID, menuGroupId);
    return result;
  }

  async getMenuPageByMenuPageIDHandler(parent, args: { _id: string; menuGroupId: string }, context: IGQLContext): Promise<IWebPagePage> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { _id, menuGroupId } = validateRequestMenuPageID<{ _id: string; menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.getMenuPageByMenuPageID(pageID, _id, menuGroupId);
    return result;
  }

  async createMenuPageHandler(parent, args: { level: number; page: IWebPagePage; menuGroupId: string }, context: IGQLContext): Promise<IWebPagePage> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = validateRequestMenuPageCreate<{ level: number; page: IWebPagePage; menuGroupId: string }>(args);
    const returnedValue = await MenuPage.menuPageService.createMenuPage(pageID, result.level, result.page, result.menuGroupId);
    if (returnedValue) await MenuService.generateMenuHTML(pageID, result.menuGroupId);
    return returnedValue;
  }

  async updateMenuPageDetailsHandler(parent, args: { _id: string; pageDetails: IWebPageDetails; menuGroupId: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { _id, pageDetails, menuGroupId } = validateRequestMenuPageDetails<{ _id: string; pageDetails: IWebPageDetails; menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.updateMenuPageDetails(pageID, _id, pageDetails, menuGroupId);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, menuGroupId);
    return result;
  }

  async updateMenuPageNameHandler(parent, args: { name: string; level: number; _id: string; menuGroupId: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { name, level, _id, menuGroupId } = validateRequestMenuPageUpdateName<{ name: string; level: number; _id: string; menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.updateMenuPageName(pageID, name, level, _id, menuGroupId);
    return result;
  }

  async updateMenuPagesHideHandler(parent, args: { updateMenuPagesHide: IUpdateWebPagesHide[]; isHide: boolean; menuGroupId: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { updateMenuPagesHide, isHide, menuGroupId } =
      validateRequestMenuPageUpdateHide<{ updateMenuPagesHide: IUpdateWebPagesHide[]; isHide: boolean; menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.updateMenuPagesHide(pageID, updateMenuPagesHide, isHide, menuGroupId);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, menuGroupId);
    return result;
  }

  async updateMenuPageHomepageHandler(parent, args: { updateMenuPageHomePage: IUpdateWebPageHomePage; menuGroupId: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { updateMenuPageHomePage, menuGroupId } = validateRequestMenuPageUpdateHomepage<{ updateMenuPageHomePage: IUpdateWebPageHomePage; menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.updateMenuPageHomepage(
      pageID,
      updateMenuPageHomePage.previousLevel,
      updateMenuPageHomePage.previousId,
      updateMenuPageHomePage.currentLevel,
      updateMenuPageHomePage.currentId,
      menuGroupId,
    );
    return result;
  }

  async updateMenuPageOrderNumbersHandler(parent, args: { menuPageOrderNumbers: IWebPageOrderNumber[]; menuGroupId: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { menuPageOrderNumbers, menuGroupId } = validateRequestMenuPageUpdateOrderNumber<{ menuPageOrderNumbers: IWebPageOrderNumber[]; menuGroupId: string }>(args);
    const result = await MenuPage.menuPageService.updateMenuPageOrderNumbers(pageID, menuPageOrderNumbers, menuGroupId);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, menuGroupId);
    return result;
  }

  async removeMenuPageFromContainerHandler(
    parent,
    args: {
      menuPagePositions: IWebPageFromToContainer[];
      menuPageOrderNumbers: IWebPageOrderNumber[];
      menuGroupId: string;
    },
    context: IGQLContext,
  ): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { menuPagePositions, menuPageOrderNumbers, menuGroupId } = validateRequestMenuPageRemoveFromContainer<{
      menuPagePositions: IWebPageFromToContainer[];
      menuPageOrderNumbers: IWebPageOrderNumber[];
      menuGroupId: string;
    }>(args);
    const result = await MenuPage.menuPageService.removeMenuPageFromContainer(pageID, menuPagePositions, menuPageOrderNumbers, menuGroupId);
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, menuGroupId);
    return result;
  }

  async updateMenuPageFromToContainerHandler(
    parent,
    args: {
      previousMenuPagePositions: IWebPageFromToContainer[];
      nextMenuPagePositions: IWebPageFromToContainer[];
      oldMenuPageOrderNumbers: IWebPageOrderNumber[];
      newMenuPageOrderNumbers: IWebPageOrderNumber[];
      menuGroupId: string;
    },
    context: IGQLContext,
  ): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const validateResult = validateRequestMenuPageUpdateFromToContainer<{
      previousMenuPagePositions: IWebPageFromToContainer[];
      nextMenuPagePositions: IWebPageFromToContainer[];
      oldMenuPageOrderNumbers: IWebPageOrderNumber[];
      newMenuPageOrderNumbers: IWebPageOrderNumber[];
      menuGroupId: string;
    }>(args);
    const result = await MenuPage.menuPageService.updateMenuPageFromToContainer(
      pageID,
      validateResult.previousMenuPagePositions,
      validateResult.nextMenuPagePositions,
      validateResult.oldMenuPageOrderNumbers,
      validateResult.newMenuPageOrderNumbers,
      validateResult.menuGroupId,
    );
    if (result.status === 200) await MenuService.generateMenuHTML(pageID, validateResult.menuGroupId);
    return result;
  }
}

const menuPage: MenuPage = MenuPage.getInstance();
export const menuPageResolver = {
  MegaOptionMenuModel: {
    __resolveType(root: IMegaOption): string {
      if ('textImage' in root) return 'MegaOptionTextImageMenuModel';
      else if ('custom' in root) return 'MegaOptionCustomMenuModel';
      else return 'MegaOptionTextImageMenuModel';
    },
  },
  MegaOptionFooterMenuModel: {
    __resolveType(root: IMegaFooterOption): string {
      if ('textImage' in root) return 'MegaOptionFooterTextImageMenuModel';
      else if ('custom' in root) return 'MegaOptionFooterCustomMenuModel';
      else return 'MegaOptionFooterTextImageMenuModel';
    },
  },
  MegaConfigMenuModel: {
    __resolveType(root: IMegaConfig): string {
      if ('textImage' in root) return 'MegaConfigTextImageMenuModel';
      else if ('custom' in root) return 'MegaConfigCustomMenuModel';
      else return 'MegaConfigTextImageMenuModel';
    },
  },
  MegaFooterConfigMenuModel: {
    __resolveType(root: IMegaFooterConfig): string {
      if ('textImage' in root) return 'MegaFooterConfigTextImageMenuModel';
      else if ('custom' in root) return 'MegaFooterConfigCustomMenuModel';
      else return 'MegaFooterConfigTextImageMenuModel';
    },
  },
  Query: {
    getMenuGroup: graphQLHandler({
      handler: menuPage.getMenuGroupHandler,
      validator: validateResponseMenuGroup,
    }),
    getMenuPagesByPageID: graphQLHandler({
      handler: menuPage.getMenuPagesByMenuPageIDHandler,
      validator: validateResponseMenuPage,
    }),
    getMenuPageByMenuPageID: graphQLHandler({
      handler: menuPage.getMenuPageByMenuPageIDHandler,
      validator: validateResponseMenuPagePage,
    }),
  },
  Mutation: {
    createMenuPage: graphQLHandler({
      handler: menuPage.createMenuPageHandler,
      validator: validateResponseMenuPagePage,
    }),
    updateMenuPageDetails: graphQLHandler({
      handler: menuPage.updateMenuPageDetailsHandler,
      validator: validateResponseHTTPObject,
    }),
    updateMenuPageName: graphQLHandler({
      handler: menuPage.updateMenuPageNameHandler,
      validator: validateResponseHTTPObject,
    }),
    updateMenuPagesHide: graphQLHandler({
      handler: menuPage.updateMenuPagesHideHandler,
      validator: validateResponseHTTPObject,
    }),
    updateMenuPageHomepage: graphQLHandler({
      handler: menuPage.updateMenuPageHomepageHandler,
      validator: validateResponseHTTPObject,
    }),
    updateMenuPageOrderNumbers: graphQLHandler({
      handler: menuPage.updateMenuPageOrderNumbersHandler,
      validator: validateResponseHTTPObject,
    }),
    removeMenuPageFromContainer: graphQLHandler({
      handler: menuPage.removeMenuPageFromContainerHandler,
      validator: validateResponseHTTPObject,
    }),
    updateMenuPageFromToContainer: graphQLHandler({
      handler: menuPage.updateMenuPageFromToContainerHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
