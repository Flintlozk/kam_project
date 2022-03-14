import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  EnumPurchasingPayloadType,
  IPayloadContainer,
  ISendQuickPayToChatBoxArgs,
  PayloadParams,
  PipelineType,
  QuickPayChatPreviewPayload,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import * as dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { getCustomerByaudienceID, getPageByID, getQuickPayOrderByID } from '../../data';
import { sendPayload } from '../../data/pipeline';
import { numberWithComma } from '../../domains/report/number-with-comma';
import { getPayloadByStep, getWebViewUrl } from '../../itopplus-services-lib';
import { AuthService } from '../auth/auth.service';
import { PlusmarService } from '../plusmarservice.class';
import { PipelineLineMessageService } from './pipeline-line-message.service';
export class PipelineQuickPayMessageService {
  public authService: AuthService;
  public pipelineLineMessageService: PipelineLineMessageService;

  constructor() {
    this.authService = new AuthService();
    this.pipelineLineMessageService = new PipelineLineMessageService();
  }

  async sendQuickPayToChatBox(pageID: number, { audienceID, quickPayID, PSID }: ISendQuickPayToChatBoxArgs, subscriptionID: string): Promise<void> {
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
      const quickPayOrder = await getQuickPayOrderByID(PlusmarService.readerClient, pageID, quickPayID, audienceID);
      if (isEmpty(quickPayOrder)) throw new Error('Quick pay order not found');
      if (quickPayOrder?.isExpired) throw new Error('Quick pay link already expired');
      const { totalPrice, expiredAt, expired_at } = quickPayOrder;
      const expireDateWithoutTime = dayjs(expired_at).format('DD/MM/YYYY');
      const title = `Grand Total  ฿ ${numberWithComma(totalPrice)}`;
      const subTitle = `Expire date ${expireDateWithoutTime} 23:59`;
      const options: QuickPayChatPreviewPayload = {
        title,
        subTitle,
        audienceID,
        quickPayID,
        expiredAt,
        currency: 'THB',
      };
      const viewType = customer.platform === AudiencePlatformType.FACEBOOKFANPAGE ? ViewRenderType.FACEBOOK_WEBVIEW : ViewRenderType.LINE_LIFF;
      const payload = getPayloadByStep(EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW, params, viewType, options);
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
      console.log(error);
      const errMessage = `Error sending quickpay to chatbox, try again later. Chat Error Message -  ${
        error?.message?.includes('policy-overview') ? 'According to Facebook standard policy, Businesses will have up to 24 hours to respond to a user.' : error.message
      }`;
      Sentry.captureException(error);
      throw new Error(errMessage);
    }
  }

  async sendFaceBookQuickPay(pageAccessToken: string, payload: IPayloadContainer[]): Promise<void> {
    const graphVersion = PlusmarService.environment.graphFBVersion;
    await sendPayload(graphVersion, pageAccessToken, await payload[0]);
  }
}
