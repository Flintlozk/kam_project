import { SharedService } from './shared.service';
import type { IAudience } from '@reactor-room/itopplus-model-lib';
import { mock } from '../../test/mock';

describe('class SharedService | setCustomerNotify() ', () => {
  const webhook = {
    object: 'page',
    entry: [
      {
        id: '104971717895360',
        time: 1601982976681,
        messaging: [
          {
            recipient: {
              id: '104971717895360',
            },
            timestamp: 1601982976681,
            sender: {
              id: 'AUDIENCE',
            },
          },
        ],
        changes: [
          {
            value: {
              form: {
                id: 'AUDIENCE',
              },
            },
          },
        ],
      },
    ],
  };

  test('Should set notification [ON] if incoming as Audience', async () => {
    const func = new SharedService();

    mock(func.notificationService, 'toggleAudienceNotification', jest.fn());
    mock(func.notificationService, 'toggleChildAudienceNotification', jest.fn());

    const notifyOff = false;
    const audience = {
      is_notify: false,
    } as IAudience;
    await func.setCustomerNotify(audience, notifyOff);
    expect(func.notificationService.toggleAudienceNotification).toBeCalledWith(audience, false);
    expect(func.notificationService.toggleChildAudienceNotification).toBeCalledWith(audience, false);
  });

  test('Should not set notification [ON] if incoming as Audience', async () => {
    const func = new SharedService();

    mock(func.notificationService, 'toggleAudienceNotification', jest.fn());
    mock(func.notificationService, 'toggleChildAudienceNotification', jest.fn());

    const notifyOff = true;
    const audience = {
      is_notify: true,
    } as IAudience;
    await func.setCustomerNotify(audience, notifyOff);
    expect(func.notificationService.toggleAudienceNotification).toBeCalledWith(audience, true);
    expect(func.notificationService.toggleChildAudienceNotification).toBeCalledWith(audience, true);
  });
  test('Should set notification [ON] if incoming as Page', async () => {
    const func = new SharedService();

    mock(func.notificationService, 'toggleAudienceNotification', jest.fn());
    mock(func.notificationService, 'toggleChildAudienceNotification', jest.fn());

    const notifyOff = true;
    const audience = {
      is_notify: true,
    } as IAudience;
    await func.setCustomerNotify(audience, notifyOff);
    expect(func.notificationService.toggleAudienceNotification).toBeCalledWith(audience, true);
    expect(func.notificationService.toggleChildAudienceNotification).toBeCalledWith(audience, true);
  });

  test('Should not set notification [ON] if incoming as Page', async () => {
    const func = new SharedService();

    mock(func.notificationService, 'toggleAudienceNotification', jest.fn());
    mock(func.notificationService, 'toggleChildAudienceNotification', jest.fn());

    const notifyOff = false;
    const audience = {
      is_notify: false,
    } as IAudience;
    await func.setCustomerNotify(audience, notifyOff);
    expect(func.notificationService.toggleAudienceNotification).toBeCalledWith(audience, false);
    expect(func.notificationService.toggleChildAudienceNotification).toBeCalledWith(audience, false);
  });
});
