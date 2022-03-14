import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import * as plusmarHelpers from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumValidateToken,
  IFacebookThreadUserMetadata,
  IPageMemberModel,
  IPageMemberToken,
  ISubscription,
  ISubscriptionIDObject,
  ISubscriptionPlan,
  IUserCredential,
  IUserSubscriptionMappingModel,
} from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import * as domains from '../../domains';
import { SubscriptionError } from '../../errors';
import { mock } from '../../test/mock';
import { SubscriptionService } from './subscription.service';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');

jest.mock('../../data');
jest.mock('../../domains');

jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('Subscription Service: createUserSubscription', () => {
  const subscriptionService = new SubscriptionService();
  test('Should success create new subscription with free plan', async () => {
    mock(
      data,
      'getUserSubscriptionMappingByUserID',
      jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ user_id: 1 } as IUserSubscriptionMappingModel),
    );
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn());
    mock(data, 'createSubscription', jest.fn().mockResolvedValueOnce({ id: 's1123' } as ISubscriptionIDObject));
    mock(data, 'addSubscriptionMappingToUser', jest.fn());
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({} as ISubscriptionPlan));
    mock(data, 'updateSubscriptionStorageAccount', jest.fn());
    mock(subscriptionService, 'triggerSubscription', jest.fn());
    mock(subscriptionService, 'updateSubscriptionFreePlan', jest.fn());

    const result = await subscriptionService.createUserSubscription(1, 1, 'asdf', '');
    expect(data.getUserSubscriptionMappingByUserID).toBeCalledTimes(2);
    expect(data.getSubscriptionBySubscriptionID).not.toBeCalled();
    expect(data.createSubscription).toBeCalledTimes(1);
    expect(data.addSubscriptionMappingToUser).toBeCalledTimes(1);
    expect(data.getSubscriptionPlan).toBeCalledTimes(1);
    expect(subscriptionService.updateSubscriptionFreePlan).toBeCalledTimes(1);
    expect(subscriptionService.triggerSubscription).toBeCalledTimes(1);
    expect(result.user_id).toEqual(1);
  });

  test('Should success create new subscription with NOT free plan', async () => {
    mock(
      data,
      'getUserSubscriptionMappingByUserID',
      jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ user_id: 1 } as IUserSubscriptionMappingModel),
    );
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn());
    mock(data, 'createSubscription', jest.fn().mockResolvedValueOnce({ id: 's1123' } as ISubscriptionIDObject));
    mock(data, 'addSubscriptionMappingToUser', jest.fn());
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({} as ISubscriptionPlan));
    mock(data, 'updateSubscriptionStorageAccount', jest.fn());
    mock(subscriptionService, 'triggerSubscription', jest.fn());
    mock(subscriptionService, 'updateSubscriptionFreePlan', jest.fn());

    const result = await subscriptionService.createUserSubscription(1, 2, 'asdf', 'ref');
    expect(data.getUserSubscriptionMappingByUserID).toBeCalledTimes(2);
    expect(data.getSubscriptionBySubscriptionID).not.toBeCalled();
    expect(data.createSubscription).toBeCalledTimes(1);
    expect(data.addSubscriptionMappingToUser).toBeCalledTimes(1);
    expect(data.getSubscriptionPlan).toBeCalledTimes(1);
    expect(subscriptionService.triggerSubscription).toBeCalledTimes(1);
    expect(subscriptionService.updateSubscriptionFreePlan).not.toBeCalled();
    expect(result.user_id).toEqual(1);
  });

  test('Should success create(update) subscription with no plan', async () => {
    mock(
      data,
      'getUserSubscriptionMappingByUserID',
      jest
        .fn()
        .mockResolvedValueOnce({ user_id: 1, subscription_id: 'a1234' } as IUserSubscriptionMappingModel)
        .mockResolvedValueOnce({ user_id: 1, subscription_id: 'a1234' } as IUserSubscriptionMappingModel),
    );
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce({ id: 'a1234', planId: null } as ISubscription));
    mock(data, 'createSubscription', jest.fn());
    mock(data, 'addSubscriptionMappingToUser', jest.fn());
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({} as ISubscriptionPlan));
    mock(subscriptionService, 'triggerSubscription', jest.fn());
    mock(subscriptionService, 'updateSubscriptionFreePlan', jest.fn());
    mock(data, 'updateSubscriptionStorageAccount', jest.fn());

    const result = await subscriptionService.createUserSubscription(1, 2, 'asdf', '');
    expect(data.getUserSubscriptionMappingByUserID).toBeCalledTimes(2);
    expect(data.getSubscriptionBySubscriptionID).toBeCalledTimes(1);
    expect(data.createSubscription).not.toBeCalled();
    expect(data.addSubscriptionMappingToUser).not.toBeCalled();
    expect(data.getSubscriptionPlan).toBeCalledTimes(1);
    expect(subscriptionService.triggerSubscription).toBeCalledTimes(1);
    expect(subscriptionService.updateSubscriptionFreePlan).not.toBeCalled();
    expect(result.user_id).toEqual(1);
    expect(result.subscription_id).toEqual('a1234');
  });

  test('Should failed create new subscription from createSubscription fail', async () => {
    mock(data, 'getUserSubscriptionMappingByUserID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn());
    mock(data, 'createSubscription', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'addSubscriptionMappingToUser', jest.fn());
    mock(data, 'getSubscriptionPlan', jest.fn());
    mock(subscriptionService, 'triggerSubscription', jest.fn());
    mock(subscriptionService, 'updateSubscriptionFreePlan', jest.fn());
    mock(data, 'updateSubscriptionStorageAccount', jest.fn());

    try {
      await subscriptionService.createUserSubscription(1, 2, 'asdf', 'ref');
    } catch (err) {
      expect(data.getUserSubscriptionMappingByUserID).toBeCalledTimes(1);
      expect(data.getSubscriptionBySubscriptionID).not.toBeCalled();
      expect(data.createSubscription).toBeCalledTimes(1);
      expect(data.addSubscriptionMappingToUser).not.toBeCalled();
      expect(data.getSubscriptionPlan).not.toBeCalled();
      expect(subscriptionService.triggerSubscription).not.toBeCalled();
      expect(subscriptionService.updateSubscriptionFreePlan).not.toBeCalled();
      expect(err).toStrictEqual(new SubscriptionError('ERROR_CREATE_SUBSCRIPTION'));
    }
  });

  test('Should failed create new subscription from user already have subscription with plan', async () => {
    mock(data, 'getUserSubscriptionMappingByUserID', jest.fn().mockResolvedValueOnce({ user_id: 1 } as IUserSubscriptionMappingModel));
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce({ id: 'a1234', planId: 1 } as ISubscription));
    mock(data, 'createSubscription', jest.fn());
    mock(data, 'addSubscriptionMappingToUser', jest.fn());
    mock(data, 'getSubscriptionPlan', jest.fn());
    mock(subscriptionService, 'triggerSubscription', jest.fn());
    mock(subscriptionService, 'updateSubscriptionFreePlan', jest.fn());
    mock(data, 'updateSubscriptionStorageAccount', jest.fn());

    try {
      await subscriptionService.createUserSubscription(1, 2, 'asdf', 'asd');
    } catch (err) {
      expect(data.getUserSubscriptionMappingByUserID).toBeCalledTimes(1);
      expect(data.getSubscriptionBySubscriptionID).toBeCalledTimes(1);
      expect(data.createSubscription).not.toBeCalled();
      expect(data.addSubscriptionMappingToUser).not.toBeCalled();
      expect(data.getSubscriptionPlan).not.toBeCalled();
      expect(subscriptionService.triggerSubscription).not.toBeCalled();
      expect(subscriptionService.updateSubscriptionFreePlan).not.toBeCalled();
      expect(err).toStrictEqual(new SubscriptionError('ALREADY_HAVE_SUB'));
    }
  });

  test('Should failed create new subscription from invalid plan ID', async () => {
    mock(data, 'getUserSubscriptionMappingByUserID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn());
    mock(data, 'createSubscription', jest.fn().mockResolvedValueOnce({ id: 's1123' } as ISubscriptionIDObject));
    mock(data, 'addSubscriptionMappingToUser', jest.fn());
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce(null));
    mock(subscriptionService, 'triggerSubscription', jest.fn());
    mock(subscriptionService, 'updateSubscriptionFreePlan', jest.fn());
    mock(data, 'updateSubscriptionStorageAccount', jest.fn());

    try {
      await subscriptionService.createUserSubscription(1, 2, 'asdf', '');
    } catch (err) {
      expect(data.getUserSubscriptionMappingByUserID).toBeCalledTimes(1);
      expect(data.getSubscriptionBySubscriptionID).not.toBeCalled();
      expect(data.createSubscription).toBeCalledTimes(1);
      expect(data.addSubscriptionMappingToUser).toBeCalledTimes(1);
      expect(data.getSubscriptionPlan).toBeCalledTimes(1);
      expect(subscriptionService.triggerSubscription).not.toBeCalled();
      expect(subscriptionService.updateSubscriptionFreePlan).not.toBeCalled();
      expect(err).toStrictEqual(new SubscriptionError('INVALID_SUBSCRIPTION_PLAN'));
    }
  });
});

describe('Validate is page member creatable', () => {
  const subscriptionService = new SubscriptionService();
  test('Success: with user id', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: { email: 'test@mail.com', page_id: 1, user_id: 2 } } as IHTTPResult));
    mock(data, 'findInvitedUserProfile', jest.fn().mockResolvedValueOnce({ email: 'test@mail.com' } as IFacebookThreadUserMetadata));
    mock(data, 'getUserBySID', jest.fn().mockResolvedValueOnce({ email: 'test@mail.com' } as IUserCredential));
    mock(data, 'getPageMemberTokenByPageIDAndUserEmail', jest.fn().mockResolvedValueOnce({ email: 'test@mail.com' } as IPageMemberToken));
    mock(domains, 'validatePageMemberToken', jest.fn().mockReturnValue(EnumValidateToken.VALID));
    mock(data, 'getPageMemberByPageIDAndEmail', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getPageMemberByPageIDAndUserID', jest.fn().mockResolvedValueOnce({ id: 1, email: 'test2@mail.com' } as IPageMemberModel));
    mock(data, 'getSubscriptionByPageID', jest.fn().mockResolvedValueOnce({ id: '123ABCD' } as ISubscriptionIDObject));
    mock(subscriptionService, 'activeInviteMemberMapping', jest.fn());
    mock(data, 'getSubscriptionByIDAndUserID', jest.fn().mockResolvedValueOnce({ id: '123ABCD' } as ISubscription));

    const result = await subscriptionService.updateInvitedMemberSubscriptionMapping('sid999', 'acc123', 'token123', 'email@test.com');
    expect(data.verifyToken).toBeCalledTimes(1);
    expect(data.findInvitedUserProfile).toBeCalledTimes(1);
    expect(data.getUserBySID).toBeCalledTimes(1);
    expect(data.getPageMemberTokenByPageIDAndUserEmail).toBeCalledTimes(1);
    expect(domains.validatePageMemberToken).toBeCalledTimes(1);
    expect(data.getPageMemberByPageIDAndEmail).toBeCalledTimes(1);
    expect(data.getPageMemberByPageIDAndUserID).toBeCalledTimes(1);
    expect(data.getSubscriptionByPageID).toBeCalledTimes(1);
    expect(subscriptionService.activeInviteMemberMapping).toBeCalledTimes(1);
    expect(data.getSubscriptionByIDAndUserID).toBeCalledTimes(1);
    expect(result.id).toEqual('123ABCD');
  });

  test('Success: with user email', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: { email: 'test@mail.com', page_id: 1, user_id: null } } as IHTTPResult));
    mock(data, 'findInvitedUserProfile', jest.fn().mockResolvedValueOnce({ email: 'test@mail.com' } as IFacebookThreadUserMetadata));
    mock(data, 'getUserBySID', jest.fn().mockResolvedValueOnce({ email: 'test@mail.com' } as IUserCredential));
    mock(data, 'getPageMemberTokenByPageIDAndUserEmail', jest.fn().mockResolvedValueOnce({ email: 'test@mail.com' } as IPageMemberToken));
    mock(domains, 'validatePageMemberToken', jest.fn().mockReturnValue(EnumValidateToken.VALID));
    mock(data, 'getPageMemberByPageIDAndEmail', jest.fn().mockResolvedValueOnce({ id: 1, email: 'test2@mail.com' } as IPageMemberModel));
    mock(data, 'getPageMemberByPageIDAndUserID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getSubscriptionByPageID', jest.fn().mockResolvedValueOnce({ id: '123ABCD' } as ISubscriptionIDObject));
    mock(subscriptionService, 'activeInviteMemberMapping', jest.fn());
    mock(data, 'getSubscriptionByIDAndUserID', jest.fn().mockResolvedValueOnce({ id: '123ABCD' } as ISubscription));

    const result = await subscriptionService.updateInvitedMemberSubscriptionMapping('sid999', 'acc123', 'token123', 'email@test.com');
    expect(data.verifyToken).toBeCalledTimes(1);
    expect(data.findInvitedUserProfile).toBeCalledTimes(1);
    expect(data.getUserBySID).toBeCalledTimes(1);
    expect(data.getPageMemberTokenByPageIDAndUserEmail).toBeCalledTimes(1);
    expect(domains.validatePageMemberToken).toBeCalledTimes(1);
    expect(data.getPageMemberByPageIDAndEmail).toBeCalledTimes(1);
    expect(data.getPageMemberByPageIDAndUserID).toBeCalledTimes(1);
    expect(data.getSubscriptionByPageID).toBeCalledTimes(1);
    expect(subscriptionService.activeInviteMemberMapping).toBeCalledTimes(1);
    expect(data.getSubscriptionByIDAndUserID).toBeCalledTimes(1);
    expect(result.id).toEqual('123ABCD');
  });
});

describe('Active Member mapping', () => {
  const subscriptionService = new SubscriptionService();
  test('Success', async () => {
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'getSubscriptionByIDAndUserID', jest.fn().mockResolvedValueOnce({ id: 's1123' } as ISubscription));
    mock(data, 'activePageMember', jest.fn());
    mock(data, 'deletePageMemberToken', jest.fn());

    await subscriptionService.activeInviteMemberMapping({ id: 1 } as IPageMemberModel, 'acc123', 1, 1);
    expect(helpers.PostgresHelper.execBeginBatchTransaction).toBeCalledTimes(1);
    expect(data.getSubscriptionByIDAndUserID).toBeCalledTimes(1);
    expect(data.activePageMember).toBeCalledTimes(1);
    expect(data.deletePageMemberToken).toBeCalledTimes(1);
  });
});

describe('Subscription Service updateSubscriptionFreePlan method', () => {
  const subscriptionService = new SubscriptionService();
  test('Success', async () => {
    mock(plusmarHelpers, 'renewExpiredDateFreePackage', jest.fn().mockReturnValue(new Date()));
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'updateSubscriptionWithPlan', jest.fn());
    mock(data, 'updateSubscriptionExpireDate', jest.fn());
    mock(data, 'updateSubscriptionStatus', jest.fn());
    mock(helpers.PostgresHelper, 'execBatchCommitTransaction', jest.fn());
    mock(subscriptionService, 'sendMailOnCreateFreePlan', jest.fn());

    await subscriptionService.updateSubscriptionFreePlan('asd1234', { price: 100 } as ISubscriptionPlan);
    expect(plusmarHelpers.renewExpiredDateFreePackage).toBeCalledTimes(1);
    expect(helpers.PostgresHelper.execBeginBatchTransaction).toBeCalledTimes(1);
    expect(data.updateSubscriptionWithPlan).toBeCalledTimes(1);
    expect(data.updateSubscriptionExpireDate).toBeCalledTimes(1);
    expect(data.updateSubscriptionStatus).toBeCalledTimes(1);
    expect(subscriptionService.sendMailOnCreateFreePlan).toBeCalledTimes(1);
    expect(helpers.PostgresHelper.execBatchCommitTransaction).toBeCalledTimes(1);
  });
});
