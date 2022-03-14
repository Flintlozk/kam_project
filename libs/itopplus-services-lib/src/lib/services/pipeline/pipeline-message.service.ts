import { cryptoDecode, isAllowCaptureException, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceContactActionMethod,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceViewType,
  EnumLeadPayloadType,
  FacebookMessagingType,
  IFacebookLeadFormPipelineModel,
  IMessageModel,
  IMessageModelInput,
  IMessageSender,
  IPayload,
  IPayloadContainer,
  LeadPayloadOption,
  LeadPayloadParams,
  LeadsDomainStatus,
  MessageSentByEnum,
  PayloadParams,
  PipelineType,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import {
  addNewPayloadMessage,
  createChildAudience,
  getAudienceByID,
  getAudienceIDByCustomerPSID,
  getAudienceStatusById,
  getCustomerAudienceByID,
  getPageByID,
  getUserByID,
  updateCustomerUpdatedAt,
  updateParentAudience,
} from '../../data';
import {
  createReferral,
  getFormByID,
  getFormSubmissionByAudienceID,
  getLeadPipeline,
  getLeadPipelineByParentID,
  getPendingLeadByAudienceID,
  getPendingLeadByCustomerID,
} from '../../data/leads';
import { sendPayload } from '../../data/pipeline';
import {
  getLeadsPayload,
  getWebViewUrl,
  sendMessageConfirmEventUpdatePayload,
  sendMessagePayload,
  sendMessagePostPurchaseUpdatePayload,
  sendMessageTagPayload,
} from '../../domains';
import { getMessageLineFormat } from '../../domains/line-template/message.domain';
import { AudienceStepService } from '../audience-step/audience-step.service';
import { AudienceContactService } from '../audience/audience-contact.service';
import { AuthService } from '../auth/auth.service';
import { LineMessageService } from '../message/line/line.message.service';
import { PlusmarService } from '../plusmarservice.class';
import { PipelineLineMessageService } from './pipeline-line-message.service';
export class PipelineMessageService {
  public authService: AuthService;
  public audienceStep: AudienceStepService;
  public audienceContact: AudienceContactService;
  public lineMessageService: LineMessageService;
  public pipelineLineMessageService: PipelineLineMessageService;
  constructor() {
    this.authService = new AuthService();
    this.audienceStep = new AudienceStepService();
    this.audienceContact = new AudienceContactService();
    this.lineMessageService = new LineMessageService();
    this.pipelineLineMessageService = new PipelineLineMessageService();
  }

  sendMessageConfirmEventUpdatePayload = async (payload: IPayload, text: string, audienceID: number): Promise<void> => {
    await this.sendPayloadData(payload, text, 'sendMessageConfirmEventUpdatePayload', audienceID);
  };

  sendMessagePostPurchaseUpdatePayload = async (payload: IPayload, text: string, audienceID: number): Promise<void> => {
    await this.sendPayloadData(payload, text, 'sendMessagePostPurchaseUpdatePayload', audienceID);
  };
  sendMessageTagPayload = async (payload: IPayload, text: string, audienceID: number): Promise<void> => {
    await this.sendPayloadData(payload, text, 'sendMessageTagPayload', audienceID);
  };

  sendMessagePayload = async (payload: IPayload, text: string, audienceID: number): Promise<void> => {
    await this.sendPayloadData(payload, text, 'sendMessagePayload', audienceID);
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

  sendPlayloadPlatform = async ({ pageID, userID }: IPayload, text: string, payloadType: string, audienceID: number, platform: AudiencePlatformType): Promise<void> => {
    switch (platform) {
      case AudiencePlatformType.LINEOA:
        await this.sendLinePayloadData({ pageID }, text, payloadType, audienceID);
        break;
      default:
        await this.sendPayloadData({ pageID, userID }, text, payloadType, audienceID);
        break;
    }
  };

  sendPayloadData = async ({ pageID, userID }: IPayload, text: string, payloadType: string, audienceID: number): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    let sender = null;
    if (userID) {
      const user = await getUserByID(PlusmarService.readerClient, userID);
      sender = {
        user_id: user.id,
        user_name: user.name,
      } as IMessageSender;
    }

    const graphVersion = PlusmarService.environment.graphFBVersion;

    const { psid: PSID } = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);

    const params = {
      PSID,
    } as PayloadParams;
    switch (payloadType) {
      case 'sendMessagePostPurchaseUpdatePayload': {
        const response = await sendPayload(graphVersion, pageAccessToken, {
          name: 'sendMessagePostPurchaseUpdatePayload',
          json: sendMessagePostPurchaseUpdatePayload(params, text),
        });
        await this.setResponsePayload(PSID, pageID, response, FacebookMessagingType.MESSAGE_TAG, sender);
        break;
      }
      case 'sendMessageConfirmEventUpdatePayload': {
        const response = await sendPayload(graphVersion, pageAccessToken, {
          name: 'sendMessageConfirmEventUpdatePayload',
          json: sendMessageConfirmEventUpdatePayload(params, text),
        });
        await this.setResponsePayload(PSID, pageID, response, FacebookMessagingType.MESSAGE_TAG, sender);
        break;
      }
      case 'sendMessageTagPayload': {
        const response = await sendPayload(graphVersion, pageAccessToken, {
          name: 'sendMessageTagPayload',
          json: sendMessageTagPayload(params, text),
        });
        await this.setResponsePayload(PSID, pageID, response, FacebookMessagingType.MESSAGE_TAG, sender);
        break;
      }
      default: {
        const response = await sendPayload(graphVersion, pageAccessToken, { name: 'sendMessagePayload', json: sendMessagePayload(params, text) });
        await this.setResponsePayload(PSID, pageID, response, FacebookMessagingType.RESPONSE, sender);
        break;
      }
    }
  };

  sendLinePayloadData = async ({ pageID }: IPayload, text: string, payloadType: string, audienceID: number): Promise<void> => {
    const { psid: PSID } = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const params = {
      PSID,
    } as PayloadParams;
    let payload = {} as IPayloadContainer;
    switch (payloadType) {
      case 'sendMessagePostPurchaseUpdatePayload':
        payload = { name: 'sendMessagePostPurchaseUpdatePayload', json: sendMessagePostPurchaseUpdatePayload(params, text) };
        break;
      case 'sendMessageConfirmEventUpdatePayload':
        payload = { name: 'sendMessageConfirmEventUpdatePayload', json: sendMessageConfirmEventUpdatePayload(params, text) };
        break;
      case 'sendMessageTagPayload':
        payload = { name: 'sendMessageTagPayload', json: sendMessageTagPayload(params, text) };
        break;
      default:
        payload = { name: 'sendMessagePayload', json: sendMessagePayload(params, text) };
        break;
    }

    const message = getMessageLineFormat(text, JSON.stringify(payload), audienceID);
    const payloadMessage = { pageID: pageID } as IPayload;
    await this.lineMessageService.sendLineMessageFromChatbox(message, payloadMessage);
  };

  async checkLeadPipeline(audienceID: number, formID: number, pageID: number, userID: number, customerID: number): Promise<IFacebookLeadFormPipelineModel> {
    const submission = await getFormSubmissionByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    console.log('//[LOG]: submission', submission);
    if (!isEmpty(submission)) {
      console.log('THROWW!!!');
      throw new Error('LEAD_ALREADY_ADDED');
    }
    console.log('WIWOWOWO');

    const pipeline = await getPendingLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    if (isEmpty(pipeline)) {
      await createReferral(PlusmarService.writerClient, {
        form_id: formID,
        page_id: pageID,
        audience_id: audienceID,
        customer_id: customerID,
      });
      const form = await getPendingLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID);
      return form;
    } else {
      return pipeline;
    }
  }

  sendFormPayload = async (
    { pageID, userID, subscriptionID }: IPayload,
    audienceID: number,
    PSID: string,
    formID: number,
    platform: AudiencePlatformType,
  ): Promise<IMessageModel> => {
    const payloadType = EnumLeadPayloadType.CUSTOM_FORM;
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);

    const pipeline = await this.checkLeadPipeline(audienceID, formID, pageID, userID, audience.customer_id);
    const hashKey = this.authService.webViewAuthenticator(pageID, audienceID, subscriptionID);
    const params = {
      webViewUrl: getWebViewUrl(PlusmarService.environment.webViewUrl, PipelineType.LEAD),
      audienceID,
      PSID,
      pageID,
      formID,
      refID: pipeline.ref,
      hashKey,
    } as LeadPayloadParams;
    try {
      const options = await this.getLeadsOptionParams(payloadType, params);
      const viewType = platform === AudiencePlatformType.FACEBOOKFANPAGE ? ViewRenderType.FACEBOOK_WEBVIEW : ViewRenderType.LINE_LIFF;
      const payloads = getLeadsPayload(payloadType, params, viewType, options);
      let result = {} as IMessageModel;
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i] as IPayloadContainer;
        if (payload.json) {
          switch (platform) {
            case AudiencePlatformType.LINEOA:
              result = await this.pipelineLineMessageService.sendFormLinePayload(audienceID, pageID, payload, EnumLeadPayloadType.CUSTOM_FORM);
              break;
            default:
              await this.sendFormFacebookPayload(payload, pageID);
              break;
          }
        }
      }
      return result;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  };

  sendFormFacebookPayload = async (payload: IPayloadContainer, pageID: number): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const graphVersion = PlusmarService.environment.graphFBVersion;
    await sendPayload(graphVersion, pageAccessToken, payload);
  };

  getLeadsOptionParams = async (type: EnumLeadPayloadType, { formID, pageID }: LeadPayloadParams): Promise<LeadPayloadOption> => {
    const { greeting_message: greetingMessage, button_input: buttonInput } = await getFormByID(PlusmarService.readerClient, formID, pageID);
    return {
      title: !isEmpty(greetingMessage) ? greetingMessage : 'กรุณากรอกข้อมูลเพื่อใช้ในการติดต่อ',
      button: !isEmpty(buttonInput) ? buttonInput : 'ดำเนินการ',
      // greetingMessage,
      // thankYouMessage,
      // buttonInput,
    };
  };
}
