import { environmentLib } from '@reactor-room/environment-services-backend';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { mock } from '../../test/mock';
import { FacebookListenerService } from './listener.service';

describe('FacebookListenerService', () => {
  test('Checking function execution of referral start', async () => {
    const facebookListenerService = new FacebookListenerService();
    PlusmarService.environment = { ...environmentLib };
    const webhook = getReferralWebhook();
    mock(facebookListenerService.webhookHelper, 'getDeliveryFromMessage', jest.fn().mockReturnValueOnce(false));
    mock(facebookListenerService.webhookHelper, 'getReadFromMessage', jest.fn().mockReturnValueOnce(false));
    mock(facebookListenerService.webhookHelper, 'getChangesFromMessage', jest.fn().mockReturnValueOnce(false));
    mock(facebookListenerService.webhookHelper, 'getReferralFromMessage', jest.fn().mockReturnValue({ ref: '9644e49e-acf3-4e56-949f-cb46a0d76ec7__v' }));
    mock(facebookListenerService.webhookHelper, 'getPostbackFromMessage', jest.fn().mockReturnValueOnce(false));
    mock(facebookListenerService.webhookHelper, 'getReferralTypeFromRef', jest.fn().mockReturnValueOnce('PRODUCTS'));
    mock(facebookListenerService.referralProductHandler, 'start', jest.fn().mockReturnValueOnce(true));
    await facebookListenerService.listen(webhook);

    expect(facebookListenerService.referralProductHandler.start).toBeCalledTimes(1);
  });
});

const getReferralWebhook = () => {
  return {
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
              id: '4254962181242841',
            },
            referral: {
              ref: '9644e49e-acf3-4e56-949f-cb46a0d76ec7__v',
              source: 'SHORTLINK',
              type: 'OPEN_THREAD',
            },
          },
        ],
      },
    ],
  };
};
