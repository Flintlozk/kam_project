import { axiosPost, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { IPageWebhookPatternPayload, IPageWebhookQuickpayPayload } from '@reactor-room/itopplus-model-lib';
import { PagesService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import * as crypto from 'crypto';

export class OpenAPIListenerService {
  public pageService = new PagesService();
  listen = async (payload: IPageWebhookPatternPayload | IPageWebhookQuickpayPayload): Promise<boolean> => {
    try {
      const url = JSON.parse(JSON.stringify(payload.url));
      delete payload.url;
      const page = await this.pageService.getPageByID(payload.page_id);
      const signature = crypto.createHmac('SHA256', page.api_client_secret).update(JSON.stringify(payload)).digest('base64').toString();
      const headers = {
        'Content-Type': 'application/json',
        'x-more-commerce-signature': signature,
      };
      const hook = await axiosPost(url, payload, headers);
      if (hook.status === 200) return true;
      if (hook.status !== 200) return false;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
    }
  };
}
