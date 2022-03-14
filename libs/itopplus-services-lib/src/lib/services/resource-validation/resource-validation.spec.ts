import { ResourceValidationService } from './resource-validation.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import { ICount } from '@reactor-room/model-lib';
import { ResourceValidationError } from '../../errors';
import {
  EnumAuthError,
  EnumResourceValidation,
  EnumResourceValidationError,
  IPlanLimitAndDetails,
  IProductVariantDB,
  ISubscription,
  ISubscriptionActiveHistoryModel,
  ISubscriptionIDObject,
  ISubscriptionLimitAndDetails,
  PurchaseOrderModel,
} from '@reactor-room/itopplus-model-lib';

jest.mock('../../data');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('Validate is page member creatable', () => {
  const resourceValidation = new ResourceValidationService();
  test('Pagemember can be create', async () => {
    mock(data, 'getPageMemberCountByPageID', jest.fn().mockResolvedValueOnce({ count: 1 } as ICount));

    const result = await resourceValidation.isPageMemberCreatable(10, 1);
    expect(data.getPageMemberCountByPageID).toBeCalledTimes(1);
    expect(result).toBeTruthy();
  });

  test('Pagemember cannot be create : from no count page members', async () => {
    mock(data, 'getPageMemberCountByPageID', jest.fn().mockResolvedValueOnce(null));

    const result = await resourceValidation.isPageMemberCreatable(10, 1);
    expect(data.getPageMemberCountByPageID).toBeCalledTimes(1);
    expect(result).toBeFalsy();
  });

  test('Pagemember cannot be create : from reach limit', async () => {
    mock(data, 'getPageMemberCountByPageID', jest.fn().mockResolvedValueOnce({ count: 10 } as ICount));

    const result = await resourceValidation.isPageMemberCreatable(5, 1);
    expect(data.getPageMemberCountByPageID).toBeCalledTimes(1);
    expect(result).toBeFalsy();
  });
});

describe('Validate is page creatable', () => {
  const resourceValidation = new ResourceValidationService();
  test('Page can be create', async () => {
    mock(data, 'getPagesFromSubscriptionID', jest.fn().mockResolvedValueOnce({ count: 1 } as ICount));

    const result = await resourceValidation.isPageCreatable(10, 'AA1234');
    expect(data.getPagesFromSubscriptionID).toBeCalledTimes(1);
    expect(result).toBeTruthy();
  });

  test('Page cannot be create : from no count page', async () => {
    mock(data, 'getPagesFromSubscriptionID', jest.fn().mockResolvedValueOnce(null));

    const result = await resourceValidation.isPageCreatable(10, 'AA1234');
    expect(data.getPagesFromSubscriptionID).toBeCalledTimes(1);
    expect(result).toBeFalsy();
  });

  test('Page cannot be create : from reach limit', async () => {
    mock(data, 'getPagesFromSubscriptionID', jest.fn().mockResolvedValueOnce({ count: 10 } as ICount));

    const result = await resourceValidation.isPageCreatable(5, 'AA1234');
    expect(data.getPagesFromSubscriptionID).toBeCalledTimes(1);
    expect(result).toBeFalsy();
  });
});

// Test is audienceCreatable

describe('Validate is order creatable', () => {
  const resourceValidation = new ResourceValidationService();
  test('Should return true from order can be create and plan is FREE', async () => {
    mock(data, 'getSubscriptionByPageID', jest.fn().mockResolvedValueOnce({ id: '1AA', planId: 1 } as ISubscription));
    mock(data, 'getSubscriptionLimitAndDetails', jest.fn().mockResolvedValueOnce({ planId: 1, maximumOrders: 2 } as ISubscriptionLimitAndDetails));
    mock(data, 'getAllPOInMonth', jest.fn().mockResolvedValueOnce([{ id: 1 }] as PurchaseOrderModel[]));
    mock(data, 'getSubscriptionActiveHistory', jest.fn().mockResolvedValueOnce({ subscription_id: '1AA' } as ISubscriptionActiveHistoryModel));
    mock(data, 'getAllPOByDate', jest.fn());

    const result = await resourceValidation.isOrderCreatable(1);
    expect(data.getSubscriptionByPageID).toBeCalledTimes(1);
    expect(data.getSubscriptionLimitAndDetails).toBeCalledTimes(1);
    expect(data.getAllPOInMonth).toBeCalledTimes(1);
    expect(data.getSubscriptionActiveHistory).not.toBeCalled();
    expect(data.getAllPOByDate).not.toBeCalled();
    expect(result).toBeTruthy();
  });

  test('Should return true from order can be create and plan is NOT FREE', async () => {
    mock(data, 'getSubscriptionByPageID', jest.fn().mockResolvedValueOnce({ id: '1AA', planId: 2 } as ISubscription));
    mock(data, 'getSubscriptionLimitAndDetails', jest.fn().mockResolvedValueOnce({ planId: 2, maximumOrders: 2 } as ISubscriptionLimitAndDetails));
    mock(data, 'getAllPOInMonth', jest.fn());
    mock(data, 'getSubscriptionActiveHistory', jest.fn().mockResolvedValueOnce({ subscription_id: '1AA' } as ISubscriptionActiveHistoryModel));
    mock(data, 'getAllPOByDate', jest.fn().mockResolvedValueOnce([{ id: 1 }] as PurchaseOrderModel[]));

    const result = await resourceValidation.isOrderCreatable(1);
    expect(data.getSubscriptionByPageID).toBeCalledTimes(1);
    expect(data.getSubscriptionLimitAndDetails).toBeCalledTimes(1);
    expect(data.getAllPOInMonth).not.toBeCalled();
    expect(data.getSubscriptionActiveHistory).toBeCalledTimes(1);
    expect(data.getAllPOByDate).toBeCalledTimes(1);
    expect(result).toBeTruthy();
  });

  test('Order cannot be create : from reach limit and plan is FREE', async () => {
    mock(data, 'getSubscriptionByPageID', jest.fn().mockResolvedValueOnce({ id: '1AA', planId: 1 } as ISubscription));
    mock(data, 'getSubscriptionLimitAndDetails', jest.fn().mockResolvedValueOnce({ planId: 1, maximumOrders: 1 } as ISubscriptionLimitAndDetails));
    mock(data, 'getAllPOInMonth', jest.fn().mockResolvedValueOnce([{ id: 1 }] as PurchaseOrderModel[]));
    mock(data, 'getSubscriptionActiveHistory', jest.fn().mockResolvedValueOnce({ subscription_id: '1AA' } as ISubscriptionActiveHistoryModel));
    mock(data, 'getAllPOByDate', jest.fn());

    const result = await resourceValidation.isOrderCreatable(1);
    expect(data.getSubscriptionByPageID).toBeCalledTimes(1);
    expect(data.getSubscriptionLimitAndDetails).toBeCalledTimes(1);
    expect(data.getAllPOInMonth).toBeCalledTimes(1);
    expect(data.getSubscriptionActiveHistory).not.toBeCalled();
    expect(data.getAllPOByDate).not.toBeCalled();
    expect(result).toBeFalsy();
  });
});

describe('Validate is product creatable', () => {
  const resourceValidation = new ResourceValidationService();
  test('Product can be create', async () => {
    mock(data, 'getProductsByPageID', jest.fn().mockResolvedValueOnce({ count: 1 } as ICount));

    const result = await resourceValidation.isProductCreatable(10, 1);
    expect(data.getProductsByPageID).toBeCalledTimes(1);
    expect(result).toBeTruthy();
  });

  test('Product cannot be create : from reach limit', async () => {
    mock(data, 'getProductsByPageID', jest.fn().mockResolvedValueOnce([{ id: 10 }] as IProductVariantDB[]));

    const result = await resourceValidation.isProductCreatable(1, 1);
    expect(data.getProductsByPageID).toBeCalledTimes(1);
    expect(result).toBeFalsy();
  });
});

describe('Validate resources', () => {
  const resourceValidation = new ResourceValidationService();
  const limit = {
    maximumPages: 1,
    maximumLeads: 1,
    maximumMembers: 1,
    maximumOrders: 1,
    maximumProducts: 1,
    maximumPromotions: 1,
  } as IPlanLimitAndDetails;

  test('Validate all: pass', async () => {
    const validations = [
      EnumResourceValidation.VALIDATE_MAX_PRODUCTS,
      EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS,
      EnumResourceValidation.VALIDATE_MAX_ORDERS,
      EnumResourceValidation.VALIDATE_MAX_AUDIENCES,
      EnumResourceValidation.VALIDATE_MAX_PAGES,
    ] as EnumResourceValidation[];
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isPageCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isAudienceCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isOrderCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isProductCreatable', jest.fn().mockResolvedValueOnce(true));

    const result = await resourceValidation.validateResources('AA1234', 1, validations, limit);
    expect(resourceValidation.isPageMemberCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isPageCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isAudienceCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isOrderCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isProductCreatable).toBeCalledTimes(1);
    expect(result).toBeTruthy();
  });

  test('Validate Max Page member: pass', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn());

    const result = await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS], limit);
    expect(resourceValidation.isPageMemberCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isPageCreatable).not.toBeCalled();
    expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
    expect(resourceValidation.isOrderCreatable).not.toBeCalled();
    expect(resourceValidation.isProductCreatable).not.toBeCalled();
    expect(result).toBeTruthy();
  });

  test('Validate Max Page member: fail', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn().mockResolvedValueOnce(false));
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn());
    try {
      await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS], limit);
    } catch (err) {
      expect(resourceValidation.isPageMemberCreatable).toBeCalledTimes(1);
      expect(resourceValidation.isPageCreatable).not.toBeCalled();
      expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
      expect(resourceValidation.isOrderCreatable).not.toBeCalled();
      expect(resourceValidation.isProductCreatable).not.toBeCalled();
      expect(err).toStrictEqual(new ResourceValidationError(EnumResourceValidationError.MEMBER_REACHED_LIMIT));
    }
  });

  test('Validate Max Page: pass', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn());

    const result = await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_PAGES], limit);
    expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
    expect(resourceValidation.isPageCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
    expect(resourceValidation.isOrderCreatable).not.toBeCalled();
    expect(resourceValidation.isProductCreatable).not.toBeCalled();
    expect(result).toBeTruthy();
  });

  test('Validate Max Page: fail', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn().mockResolvedValueOnce(false));
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn());
    try {
      await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_PAGES], limit);
    } catch (err) {
      expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
      expect(resourceValidation.isPageCreatable).toBeCalledTimes(1);
      expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
      expect(resourceValidation.isOrderCreatable).not.toBeCalled();
      expect(resourceValidation.isProductCreatable).not.toBeCalled();
      expect(err).toStrictEqual(new ResourceValidationError(EnumAuthError.PAGE_REACHED_LIMIT));
    }
  });

  test('Validate Max Audience: pass', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn());

    const result = await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_AUDIENCES], limit);
    expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
    expect(resourceValidation.isPageCreatable).not.toBeCalled();
    expect(resourceValidation.isAudienceCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isOrderCreatable).not.toBeCalled();
    expect(resourceValidation.isProductCreatable).not.toBeCalled();
    expect(result).toBeTruthy();
  });

  test('Validate Max Audience: fail', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn().mockResolvedValueOnce(false));
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn());
    try {
      await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_AUDIENCES], limit);
    } catch (err) {
      expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
      expect(resourceValidation.isPageCreatable).not.toBeCalled();
      expect(resourceValidation.isAudienceCreatable).toBeCalledTimes(1);
      expect(resourceValidation.isOrderCreatable).not.toBeCalled();
      expect(resourceValidation.isProductCreatable).not.toBeCalled();
      expect(err).toStrictEqual(new ResourceValidationError(EnumResourceValidationError.AUDIENCE_REACHED_LIMIT));
    }
  });

  test('Validate Max Order: pass', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn().mockResolvedValueOnce(true));
    mock(resourceValidation, 'isProductCreatable', jest.fn());

    const result = await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_ORDERS], limit);
    expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
    expect(resourceValidation.isPageCreatable).not.toBeCalled();
    expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
    expect(resourceValidation.isOrderCreatable).toBeCalledTimes(1);
    expect(resourceValidation.isProductCreatable).not.toBeCalled();
    expect(result).toBeTruthy();
  });

  test('Validate Max Order: fail', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn().mockResolvedValueOnce(false));
    mock(resourceValidation, 'isProductCreatable', jest.fn());
    try {
      await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_ORDERS], limit);
    } catch (err) {
      expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
      expect(resourceValidation.isPageCreatable).not.toBeCalled();
      expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
      expect(resourceValidation.isOrderCreatable).toBeCalledTimes(1);
      expect(resourceValidation.isProductCreatable).not.toBeCalled();
      expect(err).toStrictEqual(new ResourceValidationError(EnumResourceValidationError.ORDER_REACHED_LIMIT));
    }
  });

  test('Validate Max Product: pass', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn().mockResolvedValueOnce(true));

    const result = await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_PRODUCTS], limit);
    expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
    expect(resourceValidation.isPageCreatable).not.toBeCalled();
    expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
    expect(resourceValidation.isOrderCreatable).not.toBeCalled();
    expect(resourceValidation.isProductCreatable).toBeCalledTimes(1);
    expect(result).toBeTruthy();
  });

  test('Validate Max Product: fail', async () => {
    mock(resourceValidation, 'isPageMemberCreatable', jest.fn());
    mock(resourceValidation, 'isPageCreatable', jest.fn());
    mock(resourceValidation, 'isAudienceCreatable', jest.fn());
    mock(resourceValidation, 'isOrderCreatable', jest.fn());
    mock(resourceValidation, 'isProductCreatable', jest.fn().mockResolvedValueOnce(false));
    try {
      await resourceValidation.validateResources('AA1234', 1, [EnumResourceValidation.VALIDATE_MAX_PRODUCTS], limit);
    } catch (err) {
      expect(resourceValidation.isPageMemberCreatable).not.toBeCalled();
      expect(resourceValidation.isPageCreatable).not.toBeCalled();
      expect(resourceValidation.isAudienceCreatable).not.toBeCalled();
      expect(resourceValidation.isOrderCreatable).not.toBeCalled();
      expect(resourceValidation.isProductCreatable).toBeCalledTimes(1);
      expect(err).toStrictEqual(new ResourceValidationError(EnumResourceValidationError.PRODUCT_REACHED_LIMIT));
    }
  });
});
