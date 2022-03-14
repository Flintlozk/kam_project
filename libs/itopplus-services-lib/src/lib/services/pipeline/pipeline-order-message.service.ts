import { cryptoDecode, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  EnumPaymentType,
  EnumPurchasingPayloadType,
  IMessageModelInput,
  IMessageSender,
  IPayloadContainer,
  IProductVariantRichMenu,
  MessageSentByEnum,
  PayloadMessages,
  PayloadOption,
  PayloadParams,
  PipelineType,
  ProductMessagePayload,
  TrackingOrderDetail,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import {
  addNewPayloadMessage,
  getAudienceIDByCustomerPSID,
  getCustomerAudienceByID,
  getCustomerByaudienceID,
  getPageByID,
  getPaymentById,
  getProductVariantForRichMenu,
  getPurchasingOrder,
  getPurchasingTracking,
  getPurchasingTrackingInfo,
} from '../../data';
import { sendPayload } from '../../data/pipeline';
import { assembleTrackingMessage, getPayloadByStep, getWebViewUrl } from '../../domains';
import { FacebookPayloadOptionError } from '../../errors';
import { AudienceStepService } from '../audience-step/audience-step.service';
import { AuthService } from '../auth';
import { AdvanceMessageService } from '../message/advance-message.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderReceiptService } from '../purchase-order/purchase-order-receipt.service';
import { PipelineLineMessageService } from './pipeline-line-message.service';

type PipelineOption =
  | string
  | {
      receipt?: PayloadOption;
      repeatOn?: EnumPurchasingPayloadType;
      combineLogisticPaymentMessages?: PayloadMessages;
      confirmOrderMessage?: PayloadMessages;
      checkoutMessage?: PayloadMessages;
      message?: PayloadMessages;
    };

export class PipelineOrderMessageService {
  public authService: AuthService;
  public pipelineService: PipelineService;
  public purchaseOrderReceiptService: PurchaseOrderReceiptService;
  public audienceStep: AudienceStepService;
  public pipelineLineMessageService: PipelineLineMessageService;
  public advanceMessageService: AdvanceMessageService;

  constructor() {
    this.authService = new AuthService();
    this.pipelineService = new PipelineService();
    this.audienceStep = new AudienceStepService();
    this.pipelineLineMessageService = new PipelineLineMessageService();
    this.purchaseOrderReceiptService = new PurchaseOrderReceiptService();
    this.advanceMessageService = new AdvanceMessageService();
  }

  sendOrderPayload = async (pageID: number, audienceID: number, payloadType: EnumPurchasingPayloadType, platform: AudiencePlatformType, subscriptionID: string): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const hashKey = this.authService.webViewAuthenticator(pageID, audienceID, subscriptionID);

    const { psid: PSID } = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);

    const params = {
      webViewUrl: getWebViewUrl(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE),
      audienceID,
      PSID,
      pageID,
      hashKey,
    } as PayloadParams;

    const viewType = platform === AudiencePlatformType.FACEBOOKFANPAGE ? ViewRenderType.FACEBOOK_WEBVIEW : ViewRenderType.LINE_LIFF;
    try {
      const options = await this.getOptionParams(payloadType, params);
      const payloads = getPayloadByStep(payloadType, params, viewType, options);
      const graphVersion = PlusmarService.environment.graphFBVersion;
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i] as IPayloadContainer;
        if (!isEmpty(payload.json)) {
          switch (platform) {
            case AudiencePlatformType.LINEOA:
              await this.pipelineLineMessageService.sendOrderLinePayload(audienceID, pageID, payload, payloadType);
              break;
            default: {
              const response = await sendPayload(graphVersion, pageAccessToken, payload);
              await this.setResponsePayload(PSID, page.id, response, payload?.json?.messaging_type, null);
              break;
            }
          }
        }
      }
    } catch (err) {
      console.log('err ::::::::::>>> ', err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }

    return;
  };

  getOptionParams = async (payloadType: EnumPurchasingPayloadType, { pageID, audienceID }: PayloadParams): Promise<PipelineOption> => {
    try {
      switch (payloadType) {
        case EnumPurchasingPayloadType.UPDATE_CART: {
          const pipeline = await this.pipelineService.getPurchaseOrderPipeline(payloadType, pageID, audienceID);

          return {
            receipt: await this.purchaseOrderReceiptService.getReceiptDeatil(pageID, pipeline, audienceID),
            combineLogisticPaymentMessages: await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType),
          };
        }

        case EnumPurchasingPayloadType.SEND_RECEIPT: {
          const pipeline = await this.pipelineService.getPurchaseOrderPipeline(payloadType, pageID, audienceID);
          const receipt = await this.purchaseOrderReceiptService.getReceiptDeatil(pageID, pipeline, audienceID);
          const confirmOrderMessage = await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType);

          return { receipt, confirmOrderMessage };
        }

        case EnumPurchasingPayloadType.CONFIRM_ORDER: {
          return {
            combineLogisticPaymentMessages: await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType),
          };
        }

        case EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT: {
          return {
            combineLogisticPaymentMessages: await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType),
          };
        }
        case EnumPurchasingPayloadType.SEND_BANK_ACCOUNT: {
          const pipeline = await this.pipelineService.getPurchaseOrderPipeline(payloadType, pageID, audienceID);
          return {
            receipt: await this.purchaseOrderReceiptService.getReceiptDeatil(pageID, pipeline, audienceID),
            // message: await this.advanceMessageService.getOrderAdvanceMessage(pageID, EnumPurchasingPayloadType.SEND_BANK_ACCOUNT),
          };
        }
        case EnumPurchasingPayloadType.REPEAT_SEND_CHECKOUT: {
          const pipeline = await this.pipelineService.getPurchaseOrderPipeline(payloadType, pageID, audienceID);
          const payment = await getPaymentById(PlusmarService.readerClient, pipeline.page_id, pipeline.payment_id);
          let repeatOn;
          if (payment.type === EnumPaymentType.BANK_ACCOUNT) {
            repeatOn = EnumPurchasingPayloadType.SEND_BANK_ACCOUNT;
            return {
              repeatOn,
              message: await this.advanceMessageService.getOrderAdvanceMessage(pageID, EnumPurchasingPayloadType.SEND_BANK_ACCOUNT),
            };
          } else if (payment.type === EnumPaymentType.PAYPAL) repeatOn = EnumPurchasingPayloadType.CHECKOUT_PAYPAL;
          else if (payment.type === EnumPaymentType.PAYMENT_2C2P) repeatOn = EnumPurchasingPayloadType.CHECKOUT_2C2P;
          else if (payment.type === EnumPaymentType.OMISE) repeatOn = EnumPurchasingPayloadType.CHECKOUT_OMISE;
          else throw new Error('FAILED_TO_REPEAT_SENDING_CHECKOUT');
          return {
            repeatOn,
            checkoutMessage: await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType),
          };
        }
        case EnumPurchasingPayloadType.CHECKOUT_PAYPAL:
        case EnumPurchasingPayloadType.CHECKOUT_2C2P:
        case EnumPurchasingPayloadType.CHECKOUT_OMISE:
          return {
            checkoutMessage: await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType),
          };
        case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER: {
          const pipeline = await this.pipelineService.getPurchaseOrderPipeline(payloadType, pageID, audienceID);
          const purchaseOrder = await getPurchasingOrder(PlusmarService.readerClient, pageID, audienceID);
          const { flat_rate } = purchaseOrder[0];
          const isFlatRate = flat_rate;

          let tracking: TrackingOrderDetail;
          let isCOD = false;
          if (pipeline.logistic_id === null) {
            tracking = await getPurchasingTrackingInfo(PlusmarService.readerClient, pageID, audienceID, pipeline.order_id);
            isCOD = true;
          } else {
            tracking = await getPurchasingTracking(PlusmarService.readerClient, pageID, audienceID, pipeline.order_id);
          }
          const trackingMessage = assembleTrackingMessage(tracking, isCOD, isFlatRate);
          const message = await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType);
          message.title += trackingMessage;
          return message.title;
        }

        case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER_COD: {
          const pipeline = await this.pipelineService.getPurchaseOrderPipeline(payloadType, pageID, audienceID);
          const purchaseOrder = await getPurchasingOrder(PlusmarService.readerClient, pageID, audienceID);
          const { flat_rate } = purchaseOrder[0];
          const isFlatRate = flat_rate;
          const tracking = await getPurchasingTrackingInfo(PlusmarService.readerClient, pageID, audienceID, pipeline.order_id);
          const isCOD = true;
          const trackingMessage = assembleTrackingMessage(tracking, isCOD, isFlatRate);

          const message = await this.advanceMessageService.getOrderAdvanceMessage(pageID, payloadType);
          message.title += trackingMessage;
          return message.title;
        }
      }
    } catch (err) {
      throw new FacebookPayloadOptionError(err, payloadType);
    }
  };

  setResponsePayload = async (PSID: string, pageID: number, responsePayload: IPayloadContainer, messagingType: string, sender?: IMessageSender): Promise<void> => {
    const audience = await getAudienceIDByCustomerPSID(PlusmarService.readerClient, PSID, pageID);
    const message = {
      mid: responsePayload.mid,
      text: '',
      object: 'page',
      audienceID: audience.audience_id,
      sentBy: MessageSentByEnum.PAGE,
      sender: sender,
      pageID: pageID,
      attachments: null,
    } as IMessageModelInput;
    await addNewPayloadMessage(message, messagingType);
  };

  sendProductVariant = async (pageID: number, audienceID: number, PSID: string, ref: string): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const params = {
      webViewUrl: getWebViewUrl(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE),
      audienceID,
      PSID,
      pageID,
    } as PayloadParams;
    const sendProductVariantPayload: IProductVariantRichMenu = await getProductVariantForRichMenu(PlusmarService.readerClient, pageID, ref);
    if (!isEmpty(sendProductVariantPayload)) {
      const customer = await getCustomerByaudienceID(PlusmarService.readerClient, audienceID, pageID);
      const { name, attributes, productVariantID, price, images } = sendProductVariantPayload;
      const title = attributes ? `${name} (${attributes})` : name;
      const options = {
        id: productVariantID,
        productId: productVariantID,
        title,
        audienceID,
        subtitle: `฿ ${price}`,
        currency: 'THB',
        image: images,
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
}
