import { getRouteOptionalParams } from '@reactor-room/itopplus-back-end-helpers';
import { ILazadaEnv, IPageThirdPartyConnectRedirectParams, IShopeeEnv, ISocialConnectResponse, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { SettingService } from '@reactor-room/itopplus-services-lib';
import { Express } from 'express';
import { environment } from '../environments/environment';
export const marketPlaceRouteRegister = (app: Express, parentRoute = '/marketplace'): void => {
  app.get(`${parentRoute}/lazada/auth`, async (req, res) => {
    const redirectURL = await lazadaConnectAuth(app, req);
    res.redirect(redirectURL);
  });

  app.get(`${parentRoute}/shopee/auth`, async (req, res) => {
    const redirectURL = await shopeeConnectAuth(app, req);
    res.redirect(redirectURL);
  });
};

const shopeeConnectAuth = async (app: Express, req): Promise<string> => {
  const { code, id: pageUUID, shop_id } = req.query as IPageThirdPartyConnectRedirectParams;
  if (code && pageUUID) {
    const settingService = new SettingService();
    const shopeeEnv: IShopeeEnv = environment.shopee;
    const result = await settingService.handleShopeeConnect(code, pageUUID, shop_id, shopeeEnv);
    const optionalParams = getRouteOptionalParams(result);
    return getRedirectURL(optionalParams);
  } else {
    const result = { result: false, source: SocialTypes.SHOPEE, message: 'ERROR' } as ISocialConnectResponse;
    const optionalParams = getRouteOptionalParams(result);
    return getRedirectURL(optionalParams);
  }
};

const lazadaConnectAuth = async (app: Express, req): Promise<string> => {
  const { code, id: pageUUID } = req.query as IPageThirdPartyConnectRedirectParams;
  if (code && pageUUID) {
    const lazadaEnv: ILazadaEnv = environment.lazada;
    const settingService = new SettingService();
    const result = await settingService.handleLazadaConnect(code, pageUUID, lazadaEnv);
    const optionalParams = getRouteOptionalParams(result);
    return getRedirectURL(optionalParams);
  } else {
    const result = { result: false, source: SocialTypes.LAZADA, message: 'ERROR' } as ISocialConnectResponse;
    const optionalParams = getRouteOptionalParams(result);
    return getRedirectURL(optionalParams);
  }
};

const getRedirectURL = (optionalParams: string): string => {
  return `${environment.origin}/pages/edit${optionalParams}`;
};
