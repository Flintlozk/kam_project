import { Injectable } from '@angular/core';
import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  EnumPurchasingPayloadType,
  IPayloadContainer,
  ISendCatalogChatBoxOptions,
  ISendCatalogToChatBoxArgs,
  PayloadParams,
  PipelineType,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { PipelineLineMessageService } from '.';
import { AuthService, PlusmarService } from '..';
import { getCountOfProduct, getCustomerByaudienceID, getPageByID } from '../../data';
import { sendPayload } from '../../data/pipeline';
import { getPayloadByStep, getWebViewUrl } from '../../domains';
import { numberWithComma } from '../../domains/report/number-with-comma';

export class PipelineProductCatalogMessageService {
  public authService: AuthService;
  public pipelineLineMessageService: PipelineLineMessageService;

  constructor() {
    this.authService = new AuthService();
    this.pipelineLineMessageService = new PipelineLineMessageService();
  }

  async sendProductCatalogToChatBox(pageID: number, { audienceID, catalogID, PSID }: ISendCatalogToChatBoxArgs, subscriptionID: string): Promise<void> {
    try {
      const page = await getPageByID(PlusmarService.readerClient, pageID);
      const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
      const hashKey = this.authService.webViewAuthenticator(pageID, audienceID, subscriptionID);
      const customer = await getCustomerByaudienceID(PlusmarService.readerClient, audienceID, pageID);
      const params = {
        webViewUrl: getWebViewUrl(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE),
        audienceID,
        PSID,
        pageID,
        hashKey,
      } as PayloadParams;
      if (catalogID !== 0) throw new Error('IMPLEMENT_PRODUCT_CATALOG_OTHER_PRODUCTS');
      const productCount = await getCountOfProduct(PlusmarService.readerClient, pageID);
      const title = 'Product Catalog';
      const subTitle = `Total ${numberWithComma(productCount)} Products`;
      const options: ISendCatalogChatBoxOptions = {
        title,
        subTitle,
        audienceID,
        catalogID,
        page: 1,
      };
      const viewType = customer.platform === AudiencePlatformType.FACEBOOKFANPAGE ? ViewRenderType.FACEBOOK_WEBVIEW : ViewRenderType.LINE_LIFF;
      const payload = getPayloadByStep(EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG, params, viewType, options);

      switch (viewType) {
        case ViewRenderType.LINE_LIFF:
          {
            await this.pipelineLineMessageService.sendLineQuickPay(audienceID, pageID, payload[0]);
          }
          break;
        default:
          await this.sendFaceBookQuickPay(pageAccessToken, payload);
          break;
      }
    } catch (error) {
      const errMessage = `Error sending quickpay to chatbox, try again later. Chat Error Message -  ${error.message}`;
      Sentry.captureException(error);
      throw new Error(errMessage);
    }
  }

  async sendFaceBookQuickPay(pageAccessToken: string, payload: IPayloadContainer[]): Promise<void> {
    const graphVersion = PlusmarService.environment.graphFBVersion;
    await sendPayload(graphVersion, pageAccessToken, await payload[0]);
  }
}
