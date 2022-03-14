import type { IDeltaRenderingComponentDataArg } from '@reactor-room/cms-models-lib';
import {
  ComponentTypeEnum,
  EContentManagementGeneralBottomType,
  EContentManagementGeneralDisplay,
  IContentManagementGeneralBottom,
  IContentManagementGeneralDisplay,
  IPageComponent,
  IWebPageComponentDelta,
} from '@reactor-room/cms-models-lib';
import { ComponentService } from '@reactor-room/cms-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { validateDefaultRequest, validateDefaultResponse, validateResponseHTTPObject, ValidateUpdatePageComponentByWebPageID } from '../../schema/default/default.schema';
import { graphQLHandler } from '../graphql-handler';
class ComponentController {
  public static instance: ComponentController;

  public static getInstance(): ComponentController {
    if (!ComponentController.instance) ComponentController.instance = new ComponentController();
    return ComponentController.instance;
  }
  constructor() {}

  @requireLogin([EnumAuthScope.CMS])
  async updatePageComponentByWebPageIDHandler(parent, args: IDeltaRenderingComponentDataArg, context: IGQLContext): Promise<IHTTPResult> {
    const delta = ValidateUpdatePageComponentByWebPageID(args.deltaPageComponent);
    return await ComponentService.updatePageComponentByWebPageID(delta, context.payload.pageID);
  }
  @requireLogin([EnumAuthScope.CMS])
  async getComponentHandler(parent, args, context: IGQLContext): Promise<IPageComponent> {
    const { webPageID } = validateDefaultRequest<{ webPageID: string }>(args);
    return await ComponentService.getComponent(webPageID, context.payload.pageID, context.payload.subscriptionID);
  }

  @requireLogin([EnumAuthScope.CMS])
  async getLandingComponentHandler(
    parent,
    args: { webPageID: string; previousWebPageID: string; componentId: string; contentId: string },
    context: IGQLContext,
  ): Promise<IPageComponent> {
    const { webPageID, previousWebPageID, componentId, contentId } =
      validateDefaultRequest<{ webPageID: string; previousWebPageID: string; componentId: string; contentId: string }>(args);
    const components = await ComponentService.getLandingComponent(webPageID, previousWebPageID, componentId, contentId, context.payload.pageID, context.payload.subscriptionID);
    return components;
  }

  async removeSampleComponentHandler(parent, args, context: IGQLContext): Promise<boolean> {
    const { webPageID } = validateDefaultRequest<{ webPageID: string }>(args);
    return await ComponentService.removeSampleComponent(webPageID);
  }
  @requireLogin([EnumAuthScope.CMS])
  async updateWebPageAllComponentsHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const webPageDelta = ValidateUpdatePageComponentByWebPageID<IWebPageComponentDelta>(args.webPageDelta);
    const result = await ComponentService.updateWebPageAllComponents(webPageDelta, context.payload.pageID, context.payload.subscriptionID, context.payload.page.uuid);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS])
  async updateComponentLandingPageOptionHandler(parent, args: { landing: string; webPageID: string; componentId: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { landing, webPageID, componentId } = validateDefaultRequest<{ landing: string; webPageID: string; componentId: string }>(args);
    const result = await ComponentService.updateComponentLandingPageOption(landing, webPageID, componentId, context.payload.pageID);
    return result;
  }
}

const componentCtrl: ComponentController = ComponentController.getInstance();
export const componentResolver = {
  ComponentOptions: {
    __resolveType(argument: { componentType: ComponentTypeEnum }): string {
      switch (argument.componentType) {
        case ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING:
          return 'ComponentTextRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING:
          return 'ComponentLayoutRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING:
          return 'ComponentMediaGalleryItemRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING:
          return 'ComponentContentManagementRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING:
          return 'ComponentContentManagementLandingRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_CONTAINER_RENDERING:
          return 'ComponentContainerRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING:
          return 'ComponentMediaGalleryRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_BUTTON_RENDERING:
          return 'ComponentButtonRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_MENU_RENDERING:
          return 'ComponentMenuRendering';
        case ComponentTypeEnum.CMS_NEXT_CMS_SHOPPING_CART_RENDERING:
          return 'ShoppingCartRendering';
        default:
          return 'ComponentTextRendering';
      }
    },
  },
  ContentManagementGeneralDisplay: {
    __resolveType(argument: IContentManagementGeneralDisplay): string {
      switch (argument.displayType) {
        case EContentManagementGeneralDisplay.LINK:
          return 'ContentManagementGeneralDisplayLink';
        case EContentManagementGeneralDisplay.TAB:
          return 'ContentManagementGeneralDisplayTab';
        default:
          return 'ContentManagementGeneralDisplayNone';
      }
    },
  },
  ContentManagementGeneralBottom: {
    __resolveType(argument: IContentManagementGeneralBottom): string {
      switch (argument.bottomType) {
        case EContentManagementGeneralBottomType.BUTTON:
          return 'ContentManagementGeneralBottomButton';
        case EContentManagementGeneralBottomType.PAGINATION:
          return 'ContentManagementGeneralBottomPagination';
        default:
          return 'ContentManagementGeneralBottomNone';
      }
    },
  },
  Mutation: {
    updatePageComponentByWebPageID: graphQLHandler({
      handler: componentCtrl.updatePageComponentByWebPageIDHandler,
      validator: validateDefaultResponse,
    }),
    removeSampleComponent: graphQLHandler({
      handler: componentCtrl.removeSampleComponentHandler,
      validator: validateDefaultResponse,
    }),
    updateWebPageAllComponents: graphQLHandler({
      handler: componentCtrl.updateWebPageAllComponentsHandler,
      validator: validateResponseHTTPObject,
    }),
    updateComponentLandingPageOption: graphQLHandler({
      handler: componentCtrl.updateComponentLandingPageOptionHandler,
      validator: validateResponseHTTPObject,
    }),
  },
  Query: {
    getComponent: graphQLHandler({
      handler: componentCtrl.getComponentHandler,
      validator: validateDefaultResponse,
    }),
    getLandingComponent: graphQLHandler({
      handler: componentCtrl.getLandingComponentHandler,
      validator: validateDefaultResponse,
    }),
  },
};
