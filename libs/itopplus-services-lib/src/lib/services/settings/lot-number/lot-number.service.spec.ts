import { LotNumberService } from './lot-number.service';
import { mock } from '../../../test/mock';
import * as data from '../../../data';
import { PlusmarService } from '../../plusmarservice.class';
import { LotNumberError } from '../../../errors';
import { ILotNumberModel, IUpdatedLotNumber } from '@reactor-room/itopplus-model-lib';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as plsumarHelpers from '@reactor-room/itopplus-back-end-helpers';
import { environmentLib } from '@reactor-room/environment-services-backend';

PlusmarService.environment = { ...environmentLib, THAI_BULK_APP_KEY: 'KEY', THAI_BULK_APP_SECRET: 'ITS_A_SECRET_:)', tokenKey: 'HELLO_WORLD' };
jest.mock('../../../data');
jest.mock('../../../domains');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('LotNumberSerivce | getLotNumbersByLogisticID()', () => {
  test('getLotNumbersByLogisticID() should work successfully', async () => {
    const func = new LotNumberService();
    mock(data, 'getLotNumbersByLogisticID', jest.fn().mockResolvedValue([{ id: 1, expired_at: new Date() } as ILotNumberModel] as ILotNumberModel[]));
    mock(helpers, 'getUTCDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'parseTimestampToDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'getDiffrentDay', jest.fn().mockReturnValue(0));
    const result = await func.getLotNumbersByLogisticID(1);
    expect(data.getLotNumbersByLogisticID).toBeCalledTimes(1);
    expect(helpers.getUTCDayjs).toBeCalledTimes(1);
    expect(helpers.parseTimestampToDayjs).toBeCalledTimes(1);
    expect(helpers.getDiffrentDay).toBeCalledTimes(1);
    expect(result[0].id).toEqual(1);
  });
});

describe('LotNumberSerivce | getNewTrackingNumber()', () => {
  test('getNewTrackingNumber with activeLotNumber + latestUseNumber', async () => {
    const lotNumber = {
      id: 1,
      latest_used_number: '123',
      from: '100',
      to: '124',
      prefix: 'AA',
      suffix: 'BB',
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(data, 'getActiveLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(func, 'checkAvailableLotNumber', jest.fn());
    mock(func, 'checkActiveLotNumberExpiredAndRemaining', jest.fn().mockResolvedValue(lotNumber));
    mock(plsumarHelpers, 'nextLotNumber', jest.fn().mockReturnValue('125'));
    mock(plsumarHelpers, 'getCheckDigit', jest.fn().mockReturnValue(5));
    mock(func, 'updateLastUseNumber', jest.fn());

    const result = await func.getNewTrackingNumber(1);
    expect(data.getActiveLotNumber).toBeCalledTimes(1);
    expect(func.checkAvailableLotNumber).not.toBeCalled();
    expect(func.checkActiveLotNumberExpiredAndRemaining).toBeCalledTimes(1);
    expect(plsumarHelpers.nextLotNumber).toBeCalledTimes(1);
    expect(plsumarHelpers.getCheckDigit).toBeCalledTimes(1);
    expect(func.updateLastUseNumber).toBeCalledTimes(1);
    expect(result.trackingNumber).toEqual('AA1255BB');
  });

  test('getNewTrackingNumber with activeLotNumber + latestUseNumber is null', async () => {
    const lotNumber = {
      id: 1,
      latest_used_number: null,
      from: '100',
      to: '124',
      prefix: 'AA',
      suffix: 'BB',
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(data, 'getActiveLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(func, 'checkAvailableLotNumber', jest.fn());
    mock(func, 'checkActiveLotNumberExpiredAndRemaining', jest.fn().mockResolvedValue(lotNumber));
    mock(plsumarHelpers, 'nextLotNumber', jest.fn().mockReturnValue('100'));
    mock(plsumarHelpers, 'getCheckDigit', jest.fn().mockReturnValue(5));
    mock(func, 'updateLastUseNumber', jest.fn());

    const result = await func.getNewTrackingNumber(1);
    expect(data.getActiveLotNumber).toBeCalledTimes(1);
    expect(func.checkAvailableLotNumber).not.toBeCalled();
    expect(func.checkActiveLotNumberExpiredAndRemaining).toBeCalledTimes(1);
    expect(plsumarHelpers.nextLotNumber).not.toBeCalled();
    expect(plsumarHelpers.getCheckDigit).toBeCalledTimes(1);
    expect(func.updateLastUseNumber).toBeCalledTimes(1);
    expect(result.trackingNumber).toEqual('AA1005BB');
  });

  test('getNewTrackingNumber withOut activeLotNumber ', async () => {
    const lotNumber = {
      id: 1,
      latest_used_number: '123',
      from: '100',
      to: '124',
      prefix: 'AA',
      suffix: 'BB',
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(data, 'getActiveLotNumber', jest.fn().mockResolvedValue(null));
    mock(func, 'checkAvailableLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(func, 'checkActiveLotNumberExpiredAndRemaining', jest.fn().mockResolvedValue(lotNumber));
    mock(plsumarHelpers, 'nextLotNumber', jest.fn().mockReturnValue('100'));
    mock(plsumarHelpers, 'getCheckDigit', jest.fn().mockReturnValue(5));
    mock(func, 'updateLastUseNumber', jest.fn());

    const result = await func.getNewTrackingNumber(1);
    expect(data.getActiveLotNumber).toBeCalledTimes(1);
    expect(func.checkAvailableLotNumber).toBeCalledTimes(1);
    expect(func.checkActiveLotNumberExpiredAndRemaining).toBeCalledTimes(1);
    expect(plsumarHelpers.nextLotNumber).toBeCalledTimes(1);
    expect(plsumarHelpers.getCheckDigit).toBeCalledTimes(1);
    expect(func.updateLastUseNumber).toBeCalledTimes(1);
    expect(result.trackingNumber).toEqual('AA1005BB');
  });
});

describe('LotNumberSerivce | checkAvailableLotNumber()', () => {
  test('Have avalibleLotNumber', async () => {
    const lotNumber = {
      id: 2,
      latest_used_number: null,
      from: '100',
      to: '124',
      prefix: 'AA',
      suffix: 'BB',
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(data, 'getAvalibleLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(data, 'updateLotNumberStatus', jest.fn());

    const result = await func.checkAvailableLotNumber(1);
    expect(data.getAvalibleLotNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).toBeCalledTimes(1);
    expect(result.id).toEqual(2);
  });

  test('Dont have avalibleLotNumber', async () => {
    const func = new LotNumberService();
    mock(data, 'getAvalibleLotNumber', jest.fn().mockResolvedValue(null));
    mock(data, 'updateLotNumberStatus', jest.fn());
    try {
      await func.checkAvailableLotNumber(1);
    } catch (err) {
      expect(data.getAvalibleLotNumber).toBeCalledTimes(1);
      expect(data.updateLotNumberStatus).not.toBeCalled();
      expect(err).toStrictEqual(new LotNumberError('NO_AVALIBLE_LOT_NUMBER'));
    }
  });
});

describe('LotNumberSerivce | checkActiveLotNumberExpiredAndRemaining()', () => {
  test('LotNumber is not expired', async () => {
    const lotNumber = {
      id: 1,
      latest_used_number: '123',
      from: '100',
      to: '124',
      prefix: 'AA',
      suffix: 'BB',
      expired_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(helpers, 'getUTCDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'parseTimestampToDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'getDiffrentDay', jest.fn().mockReturnValue(0));
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(data, 'getAvalibleLotNumber', jest.fn());

    const result = await func.checkActiveLotNumberExpiredAndRemaining(lotNumber, 1);
    expect(helpers.getUTCDayjs).toBeCalledTimes(1);
    expect(helpers.parseTimestampToDayjs).toBeCalledTimes(1);
    expect(helpers.getDiffrentDay).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).not.toBeCalled();
    expect(data.getAvalibleLotNumber).not.toBeCalled();
    expect(result.id).toEqual(1);
  });

  test('LotNumber is expired + have next avalible lot number', async () => {
    const expiredLotNumber = {
      id: 1,
      expired_at: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    } as ILotNumberModel;

    const lotNumber = {
      id: 2,
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(helpers, 'getUTCDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'parseTimestampToDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'getDiffrentDay', jest.fn().mockReturnValue(0));
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(data, 'getAvalibleLotNumber', jest.fn().mockResolvedValue(lotNumber));

    const result = await func.checkActiveLotNumberExpiredAndRemaining(expiredLotNumber, 1);
    expect(helpers.getUTCDayjs).toBeCalledTimes(1);
    expect(helpers.parseTimestampToDayjs).toBeCalledTimes(1);
    expect(helpers.getDiffrentDay).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).toBeCalledTimes(2);
    expect(data.getAvalibleLotNumber).toBeCalledTimes(1);
    expect(result.id).toEqual(2);
  });

  test('LotNumber is expired + dont have next avalible lot number', async () => {
    const expiredLotNumber = {
      id: 1,
      expired_at: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    } as ILotNumberModel;
    const func = new LotNumberService();
    mock(helpers, 'getUTCDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'parseTimestampToDayjs', jest.fn().mockReturnValue(0));
    mock(helpers, 'getDiffrentDay', jest.fn().mockReturnValue(0));
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(data, 'getAvalibleLotNumber', jest.fn().mockResolvedValue(null));

    try {
      await func.checkActiveLotNumberExpiredAndRemaining(expiredLotNumber, 1);
    } catch (err) {
      expect(data.updateLotNumberStatus).toBeCalledTimes(1);
      expect(helpers.getUTCDayjs).toBeCalledTimes(1);
      expect(helpers.parseTimestampToDayjs).toBeCalledTimes(1);
      expect(helpers.getDiffrentDay).toBeCalledTimes(1);
      expect(data.getAvalibleLotNumber).toBeCalledTimes(1);
      expect(err).toStrictEqual(new LotNumberError('NO_AVALIBLE_LOT_NUMBER'));
    }
  });
});

describe('LotNumberSerivce | updateLastUseNumber()', () => {
  test('lastUseNumber is not last lot number', async () => {
    const lotNumber = {
      id: 1,
      from: '100',
      to: '124',
      logistic_id: 234,
    } as ILotNumberModel;
    const func = new LotNumberService();

    mock(data, 'updateLotNumberLatestUsedNumber', jest.fn());
    mock(data, 'updateLotNumberIsRemaining', jest.fn());
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(data, 'getAvalibleLotNumber', jest.fn());

    await func.updateLastUseNumber(lotNumber, '122');
    expect(data.updateLotNumberLatestUsedNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberIsRemaining).not.toBeCalled();
    expect(data.updateLotNumberStatus).not.toBeCalled();
    expect(data.getAvalibleLotNumber).not.toBeCalled();
  });

  test('lastUseNumber is last lot number + have avalible lot number', async () => {
    const lotNumber = {
      id: 1,
      from: '100',
      to: '124',
      logistic_id: 234,
    } as ILotNumberModel;
    const func = new LotNumberService();

    const avalibleLotNumber = {
      id: 2,
      from: '100',
      to: '124',
      logistic_id: 234,
    } as ILotNumberModel;

    mock(data, 'updateLotNumberLatestUsedNumber', jest.fn());
    mock(data, 'updateLotNumberIsRemaining', jest.fn());
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(data, 'getAvalibleLotNumber', jest.fn().mockResolvedValue(avalibleLotNumber));

    await func.updateLastUseNumber(lotNumber, '1245');
    expect(data.updateLotNumberLatestUsedNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberIsRemaining).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).toBeCalledTimes(2);
    expect(data.getAvalibleLotNumber).toBeCalledTimes(1);
  });

  test('lastUseNumber is last lot number + dont have avalible lot number', async () => {
    const lotNumber = {
      id: 1,
      from: '100',
      to: '124',
      logistic_id: 234,
    } as ILotNumberModel;
    const func = new LotNumberService();

    mock(data, 'updateLotNumberLatestUsedNumber', jest.fn());
    mock(data, 'updateLotNumberIsRemaining', jest.fn());
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(data, 'getAvalibleLotNumber', jest.fn().mockResolvedValue(null));

    await func.updateLastUseNumber(lotNumber, '1245');
    expect(data.updateLotNumberLatestUsedNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberIsRemaining).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).toBeCalledTimes(1);
    expect(data.getAvalibleLotNumber).toBeCalledTimes(1);
  });
});

describe('LotNumberSerivce | updateLotNumbers()', () => {
  test('updateLotNumbers with the same active lot number', async () => {
    const updatedLotNumber = [
      {
        id: 124,
        is_active: true,
      },
    ] as IUpdatedLotNumber[];
    const lotNumber = {
      id: 124,
      from: '100',
      to: '124',
      logistic_id: 234,
    } as ILotNumberModel;
    const func = new LotNumberService();

    mock(data, 'getActiveLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(func, 'updateNewActiveLotNumber', jest.fn());
    mock(func, 'createAndDeleteLotnumbers', jest.fn());

    const result = await func.updateLotNumbers(updatedLotNumber);
    expect(data.getActiveLotNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).not.toBeCalled();
    expect(func.updateNewActiveLotNumber).not.toBeCalled();
    expect(func.createAndDeleteLotnumbers).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });

  test('updateLotNumbers with no active lot number', async () => {
    const func = new LotNumberService();

    mock(data, 'getActiveLotNumber', jest.fn());
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(func, 'updateNewActiveLotNumber', jest.fn());
    mock(func, 'createAndDeleteLotnumbers', jest.fn());

    try {
      await func.updateLotNumbers([]);
    } catch (err) {
      expect(data.getActiveLotNumber).not.toBeCalled();
      expect(data.updateLotNumberStatus).not.toBeCalled();
      expect(func.updateNewActiveLotNumber).not.toBeCalled();
      expect(func.createAndDeleteLotnumbers).not.toBeCalled();
      expect(err).toStrictEqual(new LotNumberError('NO_ACTIVE_LOT_NUMBER'));
    }
  });

  test('updateLotNumbers with active lot number + new active lot number ', async () => {
    const updatedLotNumber = [
      {
        id: 99,
        logistic_id: 1,
        suffix: 'aa',
        prefix: 'bb',
        from: '1999',
        to: '2000',
        is_remaining: true,
        expired_date: '12-12-12',
        is_active: true,
      },
    ] as IUpdatedLotNumber[];
    const lotNumber = {
      id: 1,
      from: '100',
      to: '124',
      logistic_id: 234,
    } as ILotNumberModel;
    const func = new LotNumberService();

    mock(data, 'getActiveLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(func, 'updateNewActiveLotNumber', jest.fn());
    mock(func, 'createAndDeleteLotnumbers', jest.fn());

    const result = await func.updateLotNumbers(updatedLotNumber);
    expect(data.getActiveLotNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).toBeCalledTimes(1);
    expect(func.updateNewActiveLotNumber).toBeCalledTimes(1);
    expect(func.createAndDeleteLotnumbers).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });

  test('updateLotNumbers with active lot number + the same active lot number ', async () => {
    const updatedLotNumber = [
      {
        id: 1,
        logistic_id: 1,
        is_active: true,
      },
    ] as IUpdatedLotNumber[];
    const lotNumber = {
      id: 1,
    } as ILotNumberModel;

    const func = new LotNumberService();

    mock(data, 'getActiveLotNumber', jest.fn().mockResolvedValue(lotNumber));
    mock(data, 'updateLotNumberStatus', jest.fn());
    mock(func, 'updateNewActiveLotNumber', jest.fn());
    mock(func, 'createAndDeleteLotnumbers', jest.fn());

    const result = await func.updateLotNumbers(updatedLotNumber);
    expect(data.getActiveLotNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).not.toBeCalled();
    expect(func.updateNewActiveLotNumber).not.toBeCalled();
    expect(func.createAndDeleteLotnumbers).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});

describe('LotNumberSerivce | updateNewActiveLotNumber()', () => {
  test('updateNewActiveLotNumber with created new active lot number', async () => {
    const activeLotNumber = {
      id: 124,
    } as IUpdatedLotNumber;
    const lotNumber = {
      id: 123,
    } as IUpdatedLotNumber;
    const func = new LotNumberService();

    mock(data, 'createLotNumber', jest.fn());
    mock(data, 'updateLotNumberStatus', jest.fn());

    await func.updateNewActiveLotNumber(activeLotNumber, lotNumber);
    expect(data.createLotNumber).not.toBeCalled();
    expect(data.updateLotNumberStatus).toBeCalledTimes(1);
  });

  test('updateNewActiveLotNumber with not create active lot number', async () => {
    const activeLotNumber = {
      id: 0,
    } as IUpdatedLotNumber;
    const lotNumber = {
      id: 123,
    } as IUpdatedLotNumber;
    const func = new LotNumberService();

    mock(data, 'createLotNumber', jest.fn());
    mock(data, 'updateLotNumberStatus', jest.fn());

    await func.updateNewActiveLotNumber(activeLotNumber, lotNumber);
    expect(data.createLotNumber).toBeCalledTimes(1);
    expect(data.updateLotNumberStatus).not.toBeCalled();
  });
});
