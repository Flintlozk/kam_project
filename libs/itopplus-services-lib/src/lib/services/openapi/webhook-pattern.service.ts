import { isEmptyValue, isAllowCaptureException, publishMessage } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { IMessageModelInput, IPageWebhookPatternPayload, IPageWebhookPatternSetting, IMessageSource } from '@reactor-room/itopplus-model-lib';
import { getWebhookPatternStatusActive } from '../../data';
import { PlusmarService } from '../plusmarservice.class';
import * as Sentry from '@sentry/node';

export class WebhookPatternMessageService {
  constructor() {}

  webhookPatternMessage = async (
    audience_id: number,
    page_id: number,
    customer_id: number,
    facebookSenderId: string,
    source: IMessageSource,
    messageData: IMessageModelInput,
  ): Promise<void> => {
    const webhookPattern = await getWebhookPatternStatusActive(PlusmarService.readerClient, page_id);
    if (!isEmptyValue(webhookPattern)) {
      const payload = {
        audience_id: audience_id,
        page_id: page_id,
        customer_id: customer_id,
        message: messageData.text,
        platform_user_id: '',
        platform_type: source === IMessageSource.FACEBOOK ? AudiencePlatformType.FACEBOOKFANPAGE : AudiencePlatformType.LINEOA,
      } as IPageWebhookPatternPayload;
      if (source === IMessageSource.FACEBOOK) {
        payload.platform_user_id = facebookSenderId;
      }

      if (source === IMessageSource.LINE) {
        const userId = messageData.sender?.line_user_id;
        const roomId = messageData.sender?.room_id;
        const groupId = messageData.sender?.group_id;
        payload.platform_user_id = !isEmptyValue(groupId) ? groupId : !isEmptyValue(roomId) ? roomId : userId;
      }

      if (!isEmptyValue(payload.platform_user_id)) await this.checkMatchPatternAndPublishMessage(webhookPattern, payload);
    }
  };

  checkMatchPatternAndPublishMessage = async (webhookPatternList: IPageWebhookPatternSetting[], payload: IPageWebhookPatternPayload): Promise<void> => {
    if (!isEmptyValue(webhookPatternList)) {
      for (let index = 0; index < webhookPatternList.length; index++) {
        const hookConf = webhookPatternList[index];
        const regParts = hookConf.regex_pattern.match(/^\/(.*?)\/([gim]*)$/);
        if (!isEmptyValue(regParts) && !isEmptyValue(payload.message) && typeof payload.message === 'string') {
          const regexp = new RegExp(regParts[1], regParts[2]);
          const regexCheck = regexp.test(payload.message.toLocaleLowerCase());
          if (regexCheck) {
            payload.url = hookConf.url;
            await this.publishMessageToOpenAPI(payload);
          }
        }
      }
    }
  };

  publishMessageToOpenAPI = async (payload: IPageWebhookPatternPayload): Promise<void> => {
    try {
      await publishMessage(JSON.stringify(payload), PlusmarService.environment.SUBSCRIPTION_OPEN_API_MESSAGE);
    } catch (e) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(e);
      console.log('ERR:', e);
    }
  };
}
