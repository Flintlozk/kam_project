import { EnumLeadPayloadType, EnumPurchasingPayloadType, IFacebookPipelineStepTemplateType, IMessageModel, IPayload, IPayloadContainer } from '@reactor-room/itopplus-model-lib';
import { getLineLiffIDByPageID } from '../../data';
import { getConvertedFacebookPayloadToLineFlexTemplate } from '../../domains';
import { getMessageLineFormat, setLineFlexMessagePurchase, setLineFormFlexMessage, setLineQuickPayMessage } from '../../domains/line-template/message.domain';
import { LineMessageService } from '../message/line/line.message.service';
import { PlusmarService } from '../plusmarservice.class';

export class PipelineLineMessageService {
  public lineMessageService: LineMessageService;
  constructor() {
    this.lineMessageService = new LineMessageService();
  }

  sendFormLinePayload = async (audienceID: number, pageID: number, payload: IPayloadContainer, payloadType: EnumLeadPayloadType): Promise<IMessageModel> => {
    const template_type = payload.json.message.attachment !== undefined ? payload.json.message.attachment.payload.template_type : IFacebookPipelineStepTemplateType.GENERIC;
    const lineLiff = await getLineLiffIDByPageID(PlusmarService.readerClient, pageID);
    const { textMessage, lineMessageType, attachmentPayload } = getConvertedFacebookPayloadToLineFlexTemplate(
      payload,
      template_type,
      payloadType,
      lineLiff,
      PlusmarService.environment.lineliff,
    );
    const paramFlex = setLineFormFlexMessage(payload, payloadType);
    const message = getMessageLineFormat(textMessage, JSON.stringify(attachmentPayload), audienceID);

    const payloadMessage = { pageID: pageID } as IPayload;
    return await this.lineMessageService.sendMessageByWebview(message, payloadMessage, lineMessageType, payloadType, paramFlex);
  };

  sendLineQuickPay = async (audienceID: number, pageID: number, payload: IPayloadContainer): Promise<IMessageModel> => {
    payload.json.message.attachment.payload.template_type = IFacebookPipelineStepTemplateType.BUTTON;
    const template_type = payload.json.message.attachment !== undefined ? payload.json.message.attachment.payload.template_type : IFacebookPipelineStepTemplateType.GENERIC;
    const payloadType = EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW;
    const lineLiff = await getLineLiffIDByPageID(PlusmarService.readerClient, pageID);
    const { textMessage, lineMessageType, attachmentPayload } = getConvertedFacebookPayloadToLineFlexTemplate(
      payload,
      template_type,
      payloadType,
      lineLiff,
      PlusmarService.environment.lineliff,
    );
    attachmentPayload.buttons[0].webview_height_ratio = 'full';
    const paramFlex = setLineQuickPayMessage(payload);
    const message = getMessageLineFormat(textMessage, JSON.stringify(attachmentPayload), audienceID);
    const payloadMessage = { pageID: pageID } as IPayload;
    return await this.lineMessageService.sendMessageByWebview(message, payloadMessage, lineMessageType, payloadType, paramFlex);
  };

  sendOrderLinePayload = async (audienceID: number, pageID: number, payload: IPayloadContainer, payloadType: EnumPurchasingPayloadType): Promise<IMessageModel> => {
    const template_type = payload.json.message.attachment !== undefined ? payload.json.message.attachment.payload.template_type : IFacebookPipelineStepTemplateType.GENERIC;
    const lineLiff = await getLineLiffIDByPageID(PlusmarService.readerClient, pageID);
    const { textMessage, lineMessageType, attachmentPayload } = getConvertedFacebookPayloadToLineFlexTemplate(
      payload,
      template_type,
      payloadType,
      lineLiff,
      PlusmarService.environment.lineliff,
    );

    const paramFlex = setLineFlexMessagePurchase(payload, payloadType); //this.setLineOrderFlexMessage(payloadType, payload);
    const message = getMessageLineFormat(textMessage, JSON.stringify(attachmentPayload), audienceID);
    const payloadMessage = { pageID: pageID } as IPayload;
    return await this.lineMessageService.sendMessageByWebview(message, payloadMessage, lineMessageType, payloadType, paramFlex);
  };
}
