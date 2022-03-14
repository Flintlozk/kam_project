import { onWaitFor } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, IHTTPResult } from '@reactor-room/model-lib';
import {
  AudienceContactActionMethod,
  CONTACT_UPDATE,
  IAliases,
  IAllPageCountNotification,
  IAudience,
  ICountNotification,
  ILineMarkAsReadPayload,
  INotification,
  INotificationSubScription,
  IPayload,
  NotificationStatus,
  NOTIFICATION_COUNT,
} from '@reactor-room/itopplus-model-lib';
import {
  getAllPageCountNotificationInboxByPageID,
  getCountNotificationInboxByPageID,
  getCustomerByaudienceID,
  getLineChannelTokenByPageID,
  getNotificationInboxByPageID,
  setAllNotificationStatusAsRead,
  setNotificationStatusByStatus,
  toggleAudienceNotification,
  toggleChildAudienceNotification,
} from '../../data';
import { lineMessageMarkAsRead } from '../../data/line/line.data';
import { PlusmarService } from '../plusmarservice.class';

export class NotificationService {
  constructor() {}
  async toggleAudienceNotification(audience: IAudience, toggler: boolean): Promise<IAudience> {
    const result = await toggleAudienceNotification(PlusmarService.writerClient, audience.id, audience.page_id, toggler);
    if (toggler) await this.toggleNotificationStatus(audience, NotificationStatus.UNREAD);
    if (!toggler) await this.toggleNotificationStatus(audience, NotificationStatus.READ);

    return result;
  }
  async toggleChildAudienceNotification(audience: IAudience, toggler: boolean): Promise<void> {
    await toggleChildAudienceNotification(PlusmarService.writerClient, audience.id, audience.page_id, toggler);
  }

  async getNotificationInbox(aliases: IAliases, pageID: number): Promise<INotification[]> {
    aliases.pageID = pageID;
    aliases.page = (aliases.currentPage - 1) * aliases.pageSize;
    const result = await getNotificationInboxByPageID(PlusmarService.writerClient, aliases);
    return result;
  }

  async getCountNotificationInbox(aliases: IAliases, pageID: number): Promise<ICountNotification> {
    aliases.pageID = pageID;
    const result = await getCountNotificationInboxByPageID(PlusmarService.writerClient, aliases);
    return result;
  }
  async getAllPageCountNotificationInbox(subscriptionID: string): Promise<IAllPageCountNotification[]> {
    return await getAllPageCountNotificationInboxByPageID(PlusmarService.readerClient, subscriptionID);
  }

  async toggleNotificationStatus(audience: IAudience, status: NotificationStatus): Promise<IAudience> {
    let result = audience as IAudience;
    const payload = { page_id: audience.page_id } as INotificationSubScription;
    if (audience.notify_status !== status) {
      if (audience.notify_status === NotificationStatus.READ) {
        result = await setNotificationStatusByStatus(PlusmarService.writerClient, audience.id, audience.page_id, NotificationStatus.UNREAD);
      } else {
        result = await setNotificationStatusByStatus(PlusmarService.writerClient, audience.id, audience.page_id, NotificationStatus.READ);
      }
      await PlusmarService.pubsub.publish(NOTIFICATION_COUNT, payload);
    }
    return result;
  }

  async setStatusNotifyByStatus(audienceID: number, pageID: number, status: NotificationStatus, platform?: AudiencePlatformType): Promise<IAudience> {
    const result = await setNotificationStatusByStatus(PlusmarService.writerClient, audienceID, pageID, status);

    if (status === NotificationStatus.READ) {
      const onContactUpdateSubscription = { onContactUpdateSubscription: { isFetch: true, action: AudienceContactActionMethod.AUDIENCE_SET_READ, pageID } };
      await PlusmarService.pubsub.publish(CONTACT_UPDATE, onContactUpdateSubscription);

      if (platform === AudiencePlatformType.LINEOA) {
        void this.lineMarkAsRead(pageID, audienceID);
      }
    }
    return result;
  }

  async markAllNotificationAsRead(pageID: number): Promise<IHTTPResult> {
    await setAllNotificationStatusAsRead(PlusmarService.writerClient, pageID);

    return { status: 200, value: 'ok' };
  }

  async lineMarkAsRead(pageID: number, audienceID: number): Promise<void> {
    try {
      const { line_user_id } = await getCustomerByaudienceID(PlusmarService.readerClient, audienceID, pageID);
      const pageChannelToken = await getLineChannelTokenByPageID(PlusmarService.readerClient, pageID);
      const markAsReadPayload: ILineMarkAsReadPayload = { chat: { userId: line_user_id } };
      await lineMessageMarkAsRead(pageChannelToken.line_channel_accesstoken, markAsReadPayload, PlusmarService.environment.lineMessageAPI);

      return;
    } catch (ex) {
      // DO NOT CATCH ANY ERROR
      return;
    }
  }
}
