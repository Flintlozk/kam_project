import { IAliases, INotification, IAudience, NotificationStatus } from '@reactor-room/itopplus-model-lib';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { NotificationService } from './notification.service';

let notificationService = new NotificationService();
jest.mock('../../data');

describe('Notification Service getNotificationInbox Method', () => {
  PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;
  test('Get Notification Inbox', async () => {
    mock(
      data,
      'getNotificationInboxByPageID',
      jest.fn().mockResolvedValue([
        {
          id: 880,
          pageID: 249,
          first_name: 'Pariwat',
          last_name: 'Autansai',
          pagename: 'GreanApp',
          profile_pic: '',
          latestMessage: {
            text: 'test',
            createdAt: '123551156',
          },
        },
      ] as INotification[]),
    );
    const aliases = {
      pageID: 0,
    } as IAliases;
    const result = await notificationService.getNotificationInbox(aliases, 249);
    expect(result[0].first_name).toEqual('Pariwat');
    expect(result[0].latestMessage.text).toEqual('test');
  });

  test('Set Notification To Status Read', async () => {
    mock(data, 'setNotificationStatusByStatus', jest.fn().mockResolvedValueOnce({ id: 880, notify_status: NotificationStatus.READ }));
    const aliases = {
      pageID: 0,
    } as IAliases;
    const result = await notificationService.setStatusNotifyByStatus(880, 249, NotificationStatus.READ);
    expect(result.id).toEqual(880);
  });

  test('Toggle Audience Notification Status True', async () => {
    mock(
      data,
      'toggleAudienceNotification',
      jest.fn().mockResolvedValueOnce({
        id: 880,
      }),
    );
    mock(notificationService, 'toggleNotificationStatus', jest.fn());
    const aliases = {
      page_id: 249,
      id: 880,
      notify_status: NotificationStatus.READ,
    } as IAudience;
    await notificationService.toggleAudienceNotification(aliases, true);
    expect(notificationService.toggleNotificationStatus).toBeCalledWith(aliases, NotificationStatus.UNREAD);
  });

  test('Toggle Audience Notification Status False', async () => {
    mock(
      data,
      'toggleAudienceNotification',
      jest.fn().mockResolvedValueOnce({
        id: 880,
      }),
    );
    const aliases = {
      page_id: 249,
      id: 880,
      notify_status: NotificationStatus.UNREAD,
    } as IAudience;
    const result = await notificationService.toggleAudienceNotification(aliases, false);
    expect(result.id).toEqual(880);
  });

  test('Toggle Notification Status READ To UNREAD', async () => {
    notificationService = new NotificationService();
    mock(data, 'setNotificationStatusByStatus', jest.fn().mockResolvedValueOnce({ id: 880, notify_status: NotificationStatus.UNREAD }));
    const aliases = {
      page_id: 249,
      id: 880,
      notify_status: NotificationStatus.READ,
    } as IAudience;
    const resultoggle = await notificationService.toggleNotificationStatus(aliases, NotificationStatus.UNREAD);
    expect(resultoggle.notify_status).toEqual(NotificationStatus.UNREAD);
  });

  test('Toggle Notification Status UNREAD To READ', async () => {
    notificationService = new NotificationService();
    mock(data, 'setNotificationStatusByStatus', jest.fn().mockResolvedValueOnce({ id: 880, notify_status: NotificationStatus.READ }));
    const aliases = {
      page_id: 249,
      id: 880,
      notify_status: NotificationStatus.UNREAD,
    } as IAudience;
    const resultoggle = await notificationService.toggleNotificationStatus(aliases, NotificationStatus.READ);
    expect(resultoggle.notify_status).toEqual(NotificationStatus.READ);
  });
});
