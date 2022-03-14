import { cryptoDecode, transformMediaLink, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  EnumPurchasingPayloadType,
  IPayload,
  IProductNoVariantPayload,
  IProductRichMenu,
  IProductVariantRichMenu,
  PayloadParams,
  PipelineType,
  ProductMessagePayload,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { getCustomerByaudienceID, getPageByID, getProductForRichMenu, getProductVariantForRichMenu } from '../../data';
import { sendPayload } from '../../data/pipeline';
import { getPayloadByStep, getWebViewUrl } from '../../domains';
import { AuthService } from '../auth';
import { PlusmarService } from '../plusmarservice.class';
import { PipelineLineMessageService } from './pipeline-line-message.service';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { SubscriptionService } from '../subscription';

export class PipelineProductMessageService {
  public authService: AuthService;
  public pipelineLineMessageService: PipelineLineMessageService;
  public static subscriptionService: SubscriptionService;
  constructor() {
    this.authService = new AuthService();
    this.pipelineLineMessageService = new PipelineLineMessageService();
    PipelineProductMessageService.subscriptionService = new SubscriptionService();
  }

  sendProduct = async ({ pageID, subscriptionID }: IPayload, audienceID: number, PSID: string, ref: string): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const hashKey = this.authService.webViewAuthenticator(pageID, audienceID, subscriptionID);
    const params = {
      webViewUrl: getWebViewUrl(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE),
      audienceID,
      PSID,
      pageID,
      hashKey,
    } as PayloadParams;

    const productMenuData = await getProductForRichMenu(PlusmarService.readerClient, pageID, ref);
    const sendProductPayload = this.getProductPayload(productMenuData);
    if (!isEmpty(sendProductPayload)) {
      const options = {
        id: sendProductPayload.id,
        productId: sendProductPayload.id,
        title: sendProductPayload.name,
        subtitle: sendProductPayload.subtitle,
        currency: 'THB',
        image: transformMediaLinkString(sendProductPayload.images, environmentLib.filesServer, subscriptionID),
      } as ProductMessagePayload;
      const viewType = ViewRenderType.FACEBOOK_WEBVIEW; // ! Hardcode 'till got LINE_LIFF implementes
      const payload = await getPayloadByStep(EnumPurchasingPayloadType.SELECT_MULTIPLE_PRODUCT, params, viewType, options);
      const graphVersion = PlusmarService.environment.graphFBVersion;
      await sendPayload(graphVersion, pageAccessToken, await payload[0]);
    }
    return;
  };

  sendProductVariant = async (pageID: number, audienceID: number, PSID: string, ref: string, subscriptionID: string): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const hashKey = this.authService.webViewAuthenticator(pageID, audienceID, subscriptionID);
    const params = {
      webViewUrl: getWebViewUrl(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE),
      audienceID,
      PSID,
      pageID,
      hashKey,
    } as PayloadParams;
    const sendProductVariantPayload: IProductVariantRichMenu = await getProductVariantForRichMenu(PlusmarService.readerClient, pageID, ref);
    if (!isEmpty(sendProductVariantPayload)) {
      const customer = await getCustomerByaudienceID(PlusmarService.readerClient, audienceID, pageID);
      const { name, attributes, productVariantID, price, images } = sendProductVariantPayload;
      const title = attributes ? `${name} (${attributes})` : name;
      const subscription = await PipelineProductMessageService.subscriptionService.getSubscriptionByPageID(pageID);
      const options = {
        id: productVariantID,
        productId: productVariantID,
        title,
        audienceID,
        subtitle: `฿ ${price}`,
        currency: 'THB',
        image: transformMediaLinkString(images, environmentLib.filesServer, subscription.id),
      } as ProductMessagePayload;
      const viewType = customer.platform === AudiencePlatformType.FACEBOOKFANPAGE ? ViewRenderType.FACEBOOK_WEBVIEW : ViewRenderType.LINE_LIFF;
      const payload = getPayloadByStep(EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT, params, viewType, options);

      const graphVersion = PlusmarService.environment.graphFBVersion;

      switch (customer.platform) {
        case AudiencePlatformType.LINEOA:
          await this.pipelineLineMessageService.sendOrderLinePayload(audienceID, pageID, payload[0], EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT);
          break;
        default:
          await sendPayload(graphVersion, pageAccessToken, payload[0]);
          break;
      }
    } else {
      // TODO :: need to handle this case and send response to the user that porudct is unavailable
      throw new Error('Invalid link, product not available or product is out of stock');
    }
  };

  getProductPayload(productMenuData: IProductRichMenu): IProductNoVariantPayload {
    const { count, id, name, max, min, images } = productMenuData;
    return {
      id,
      name,
      images,
      title: name,
      subtitle: `฿ ${min} - ฿ ${max} \n Product Variant : ${count} items `,
      price: `฿ ${min} - ฿ ${max}`,
    };
  }
}
