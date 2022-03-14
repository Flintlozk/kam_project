import type { IDeltaRenderingComponentDataArg } from '@reactor-room/cms-models-lib';
import {
  IDeltaRenderingComponentData,
  IThemeComponent,
  IThemeDevice,
  IThemeRendering,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingFont,
  IThemeSharingComponentConfig,
  IUpdateThumnail,
  IWebPageThemelayoutIndex,
} from '@reactor-room/cms-models-lib';
import { ThemeService } from '@reactor-room/cms-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import { requiredPermission, requireLogin } from '@reactor-room/itopplus-services-lib';
import { EnumUserAppRole, IHTTPResult } from '@reactor-room/model-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateRequestPageID } from '../../schema';
import { validateDefaultResponse, validateGetThemeComponentsRequest, ValidateUpdatePageComponentByWebPageID } from '../../schema/default/default.schema';
import {
  validateGetHtmlByThemeIdResponse,
  validateHTTPResponse,
  validateIdParamsRequest,
  validateIdRequest,
  validateRequestGetThemeByLimit,
  validateRequestUpdateSharingThemeConfigColor,
  validateRequestUpdateSharingThemeConfigDevices,
  validateRequestUpdateSharingThemeConfigFont,
  validateResponseGetThemeByLimit,
  validatethemeRenderingRequest,
  validatethemeRenderingResponse,
  validateUpdateFileResquest,
  validateUpdateThumbnailResquest,
  validateUploadFileResquest,
} from '../../schema/theme/theme.schema';

class Theme {
  public static instance;
  public static ThemeService: ThemeService;

  public static getInstance() {
    if (!Theme.instance) Theme.instance = new Theme();
    return Theme.instance;
  }

  constructor() {}

  //#region Sharing Between ADMIN and CMS Client
  @requireLogin([EnumAuthScope.CMS])
  async getThemeHandler(parent, args, context: IGQLContext): Promise<IThemeRendering> {
    //get by Config theme settings.
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await ThemeService.getThemeByPageId(pageID);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async getSharingThemeConfigAndSetThemeSharingHandler(parent, args, context: IGQLContext): Promise<IThemeSharingComponentConfig> {
    // isnotGetSharing Them they have set
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await ThemeService.getSharingThemeConfigAndSetThemeSharing(pageID);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getTotalThemeNumberHandler(parent, args, context: IGQLContext): Promise<number> {
    const result = await ThemeService.getTotalThemeNumber();
    return result;
  }
  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getThemesByLimitHandler(parent, args: { skip: number; limit: number }, context: IGQLContext): Promise<IThemeRendering[]> {
    const { skip, limit } = validateRequestGetThemeByLimit<{ skip: number; limit: number }>(args);
    const result = await ThemeService.getThemesByLimit(skip, limit);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getThemeByThemeIdHandler(parent, args: { _id: string }, context: IGQLContext): Promise<IThemeRendering> {
    const _idObject = await validateIdRequest(args);
    const result = await ThemeService.getThemeByThemeId(_idObject._id);
    return result;
  }
  //#endregion

  //#region ADMIN and Theme Builder
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async getHtmlByThemeIdHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const params = await validateIdParamsRequest(args.IDFile);
    const result = await ThemeService.getHtmlByThemeId(params._id, params.index);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async getCssByThemeIdHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const params = await validateIdParamsRequest(args.IDFile);
    const result = await ThemeService.getCssByThemeId(params._id, params.index);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async getJavascriptByThemeIdHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const params = await validateIdParamsRequest(args.IDFile);
    const result = await ThemeService.getJavascriptByThemeId(params._id, params.index);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async createThemeHandler(parent, args, context: IGQLContext): Promise<{ _id: string }> {
    const themeModel = validatethemeRenderingRequest(args.themeModel);
    const result = await ThemeService.createTheme(themeModel);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async updateThemeHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const themeModel = validatethemeRenderingRequest<IThemeRendering>(args.themeModel);
    const result = await ThemeService.updateTheme(themeModel, context.payload.userID, context.payload.subscriptionID);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async deleteThemeHandler(parent, args: { _id: string }, context: IGQLContext): Promise<boolean> {
    const objectId = validateIdRequest(args);
    const result = await ThemeService.deleteTheme(objectId._id);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async uploadFileToCMSFileServerHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const uploadFile = validateUploadFileResquest(args.file);
    const result = await ThemeService.uploadFileToCMSFileServer(uploadFile);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async updateFileToCMSFileServerHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const updateFile = validateUpdateFileResquest(args.file);
    const result = await ThemeService.updateFileToCmsFileServer(updateFile);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async updateThumnailByIndexHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const updateThumnail = validateUpdateThumbnailResquest<IUpdateThumnail>(args.updateThumnail);
    const result = await ThemeService.updateThumnailByIndex(updateThumnail, args.updateThumnail.thumbnail?.stream);
    return result;
  }

  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_TEMPLATE, EnumUserAppRole.CMS_ADMIN])
  async updateThumnailHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const result = await ThemeService.updateThumnail(args.stream);
    return result;
  }

  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_ADMIN])
  async createThemeLayoutHtmlFileHandler(parent, args: { _id: string }, context: IGQLContext): Promise<IHTTPResult> {
    const obejctId = validateIdRequest(args);
    return await ThemeService.createThemeLayoutHtmlFile(obejctId._id);
  }
  //#endregion

  //#region CMS Client
  @requireLogin([EnumAuthScope.CMS])
  async updateSharingThemeComponentHandler(parent, args: IDeltaRenderingComponentDataArg, context: IGQLContext): Promise<IHTTPResult> {
    const delta = ValidateUpdatePageComponentByWebPageID<IDeltaRenderingComponentData>(args.deltaPageComponent);
    return await ThemeService.updateSharingThemeComponent(delta, context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.CMS])
  async getThemeComponentsHandler(parent, args, context: IGQLContext): Promise<IThemeComponent> {
    const { webPageID, themeLayoutIndex } = validateGetThemeComponentsRequest<IWebPageThemelayoutIndex>(args.webPageThemelayoutIndex);
    const themeComponents = await ThemeService.getThemeComponents(webPageID, themeLayoutIndex, context.payload.pageID, context.payload.subscriptionID);
    return themeComponents;
  }

  @requireLogin([EnumAuthScope.CMS])
  async getUpdatedSiteCSSHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await ThemeService.getUpdatedSiteCSS(pageID, context.payload.page.uuid);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async updateSharingThemeConfigColorHandler(parent, args: { color: IThemeRenderingSettingColors[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { color } = validateRequestUpdateSharingThemeConfigColor<{ color: IThemeRenderingSettingColors[] }>(args);
    const result = await ThemeService.updateSharingThemeConfigColor(pageID, color, context.payload.page.uuid);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async updateSharingThemeConfigFontHandler(parent, args: { font: IThemeRenderingSettingFont[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { font } = validateRequestUpdateSharingThemeConfigFont<{ font: IThemeRenderingSettingFont[] }>(args);
    const result = await ThemeService.updateSharingThemeConfigFont(pageID, font);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async updateSharingThemeConfigDevicesHandler(parent, args: { devices: IThemeDevice[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { devices } = validateRequestUpdateSharingThemeConfigDevices<{ devices: IThemeDevice[] }>(args);
    const result = await ThemeService.updateSharingThemeConfigDevices(pageID, devices);
    return result;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async mockWebPageAndPageComponentForCmsAdminHandler(parent, args: { devices: IThemeDevice[] }, context: IGQLContext): Promise<IHTTPResult> {
    const result = await ThemeService.mockWebPageAndPageComponentForCmsAdmin(context.payload.pageID, context.payload.userID, context.payload.subscriptionID);
    return result;
  }
  //#endregion
}
const themeService: Theme = Theme.getInstance();
export const themeResolver = {
  Query: {
    getTotalThemeNumber: graphQLHandler({
      handler: themeService.getTotalThemeNumberHandler,
      validator: validateDefaultResponse,
    }),
    getSharingThemeConfigAndSetThemeSharing: graphQLHandler({
      handler: themeService.getSharingThemeConfigAndSetThemeSharingHandler,
      validator: validateDefaultResponse,
    }),
    getThemeByThemeId: graphQLHandler({
      handler: themeService.getThemeByThemeIdHandler,
      validator: validatethemeRenderingResponse,
    }),
    getHtmlByThemeId: graphQLHandler({
      handler: themeService.getHtmlByThemeIdHandler,
      validator: validateGetHtmlByThemeIdResponse,
    }),
    getCssByThemeId: graphQLHandler({
      handler: themeService.getCssByThemeIdHandler,
      validator: validateHTTPResponse,
    }),
    getJavascriptByThemeId: graphQLHandler({
      handler: themeService.getJavascriptByThemeIdHandler,
      validator: validateHTTPResponse,
    }),
    getTheme: graphQLHandler({
      handler: themeService.getThemeHandler,
      validator: validatethemeRenderingResponse,
    }),
    getThemesByLimit: graphQLHandler({
      handler: themeService.getThemesByLimitHandler,
      validator: validateResponseGetThemeByLimit,
    }),
    getThemeComponents: graphQLHandler({
      handler: themeService.getThemeComponentsHandler,
      validator: validateDefaultResponse,
    }),
    getUpdatedSiteCSS: graphQLHandler({
      handler: themeService.getUpdatedSiteCSSHandler,
      validator: validateDefaultResponse,
    }),
  },
  Mutation: {
    createTheme: graphQLHandler({
      handler: themeService.createThemeHandler,
      validator: validateDefaultResponse,
    }),
    updateTheme: graphQLHandler({
      handler: themeService.updateThemeHandler,
      validator: validateDefaultResponse,
    }),
    updateSharingThemeConfigColor: graphQLHandler({
      handler: themeService.updateSharingThemeConfigColorHandler,
      validator: validateDefaultResponse,
    }),
    updateSharingThemeConfigFont: graphQLHandler({
      handler: themeService.updateSharingThemeConfigFontHandler,
      validator: validateDefaultResponse,
    }),
    updateSharingThemeConfigDevices: graphQLHandler({
      handler: themeService.updateSharingThemeConfigDevicesHandler,
      validator: validateDefaultResponse,
    }),
    deleteTheme: graphQLHandler({
      handler: themeService.deleteThemeHandler,
      validator: validateDefaultResponse,
    }),
    uploadFileToCMSFileServer: graphQLHandler({
      handler: themeService.uploadFileToCMSFileServerHandler,
      validator: validateHTTPResponse,
    }),
    updateFileToCMSFileServer: graphQLHandler({
      handler: themeService.updateFileToCMSFileServerHandler,
      validator: validateHTTPResponse,
    }),
    updateSharingThemeComponent: graphQLHandler({
      handler: themeService.updateSharingThemeComponentHandler,
      validator: validateDefaultResponse,
    }),
    updateThumnailByIndex: graphQLHandler({
      handler: themeService.updateThumnailByIndexHandler,
      validator: validateHTTPResponse,
    }),
    updateThumnail: graphQLHandler({
      handler: themeService.updateThumnailHandler,
      validator: validateHTTPResponse,
    }),
    createThemeLayoutHtmlFile: graphQLHandler({
      handler: themeService.createThemeLayoutHtmlFileHandler,
      validator: validateHTTPResponse,
    }),
    mockWebPageAndPageComponentForCmsAdmin: graphQLHandler({
      handler: themeService.mockWebPageAndPageComponentForCmsAdminHandler,
      validator: validateHTTPResponse,
    }),
  },
};
