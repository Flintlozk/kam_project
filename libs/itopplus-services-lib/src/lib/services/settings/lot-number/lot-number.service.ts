import { ILotNumberModel, IUpdatedLotNumber, ITrackingNumber } from '@reactor-room/itopplus-model-lib';
import { PlusmarService } from '../../plusmarservice.class';
import { IHTTPResult } from '@reactor-room/model-lib';

import {
  createLotNumber,
  deleteLotNumber,
  getActiveLotNumber,
  getAvalibleLotNumber,
  getLotNumbersByLogisticID,
  updateLotNumberIsRemaining,
  updateLotNumberLatestUsedNumber,
  updateLotNumberStatus,
} from '../../../data';
import { LotNumberError } from '../../../errors';
import { getDiffrentDay, getUTCDayjs, parseTimestampToDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { getCheckDigit, nextLotNumber } from '@reactor-room/itopplus-back-end-helpers';
// import { getCheckDigit, nextLotNumber } from '../../../domains';
export class LotNumberService {
  async getLotNumbersByLogisticID(logisticId: number): Promise<ILotNumberModel[]> {
    const result = await getLotNumbersByLogisticID(PlusmarService.readerClient, logisticId);
    const lotNumberWithRemaining = result.map((r) => {
      const currentDay = getUTCDayjs();
      const expiredDay = parseTimestampToDayjs(r.expired_at);
      const diff = getDiffrentDay(currentDay, expiredDay);
      const is_expired = diff < 0;
      const remaining = r.latest_used_number ? parseInt(r.to) - parseInt(r.latest_used_number) : parseInt(r.to) - parseInt(r.from) + 1;
      const canUseDefaultActive = !is_expired && remaining > 0;
      return {
        ...r,
        remaining: remaining,
        is_expired: is_expired,
        is_active: canUseDefaultActive ? r.is_active : false,
      } as ILotNumberModel;
    });
    return lotNumberWithRemaining;
  }

  async getNewTrackingNumber(logisticId: number): Promise<ITrackingNumber> {
    try {
      let activeLotNumber: ILotNumberModel;
      activeLotNumber = await getActiveLotNumber(PlusmarService.readerClient, logisticId, true);
      if (!activeLotNumber) activeLotNumber = await this.checkAvailableLotNumber(logisticId);
      activeLotNumber = await this.checkActiveLotNumberExpiredAndRemaining(activeLotNumber, logisticId);
      let newNumber;
      if (activeLotNumber.latest_used_number) {
        newNumber = nextLotNumber(activeLotNumber.latest_used_number);
      } else {
        newNumber = activeLotNumber.from;
      }
      const checkDigit = getCheckDigit(newNumber);
      const newLotNumber = `${newNumber}${checkDigit}`;
      await this.updateLastUseNumber(activeLotNumber, newLotNumber);
      const completeNewLotNumber = `${activeLotNumber.prefix}${newLotNumber}${activeLotNumber.suffix}`;
      return {
        trackingNumber: completeNewLotNumber,
      } as ITrackingNumber;
    } catch (err) {
      console.log('err: ', err);
      if (err.message === 'NO_AVALIBLE_LOT_NUMBER') {
        return {
          trackingNumber: null,
        } as ITrackingNumber;
      } else throw err;
    }
  }

  async checkAvailableLotNumber(logisticId: number): Promise<ILotNumberModel> {
    const activeLotNumber = await getAvalibleLotNumber(PlusmarService.readerClient, logisticId);
    if (activeLotNumber) {
      await updateLotNumberStatus(PlusmarService.writerClient, activeLotNumber.id, true);
    } else {
      throw new LotNumberError('NO_AVALIBLE_LOT_NUMBER');
    }
    return activeLotNumber;
  }
  async checkActiveLotNumberExpiredAndRemaining(activeLotNumber: ILotNumberModel, logisticId: number): Promise<ILotNumberModel> {
    const currentDay = getUTCDayjs();
    const expiredDay = parseTimestampToDayjs(activeLotNumber.expired_at);
    const isExpire = getDiffrentDay(currentDay, expiredDay) < 0;
    const isRemainig = activeLotNumber.to !== activeLotNumber.latest_used_number;
    if (isExpire || !isRemainig) {
      await updateLotNumberStatus(PlusmarService.writerClient, activeLotNumber.id, false);
      if (!isRemainig && activeLotNumber.is_remaining) await updateLotNumberIsRemaining(PlusmarService.writerClient, activeLotNumber.id, false);
      activeLotNumber = await getAvalibleLotNumber(PlusmarService.readerClient, logisticId);
      if (activeLotNumber) {
        await updateLotNumberStatus(PlusmarService.writerClient, activeLotNumber.id, true);
      } else {
        throw new LotNumberError('NO_AVALIBLE_LOT_NUMBER');
      }
    }
    return activeLotNumber;
  }

  async updateLastUseNumber(lotNumber: ILotNumberModel, lastUseNumber: string): Promise<void> {
    const lastLotNumber = lotNumber.to;
    const lastNumberWithoutCheckDigit = lastUseNumber.substring(0, lastUseNumber.length - 1);
    await updateLotNumberLatestUsedNumber(PlusmarService.writerClient, lotNumber.id, lastNumberWithoutCheckDigit);
    if (lastLotNumber === lastNumberWithoutCheckDigit) {
      await updateLotNumberIsRemaining(PlusmarService.writerClient, lotNumber.id, false);
      await updateLotNumberStatus(PlusmarService.writerClient, lotNumber.id, false);
      const newAvalibleLotNumber = await getAvalibleLotNumber(PlusmarService.readerClient, lotNumber.logistic_id);
      if (newAvalibleLotNumber) {
        await updateLotNumberStatus(PlusmarService.writerClient, newAvalibleLotNumber.id, true);
      }
    }
  }

  async updateLotNumbers(lotNumbers: IUpdatedLotNumber[]): Promise<IHTTPResult> {
    const created = lotNumbers.filter((item) => item.is_created && !item.is_active && !item.is_deleted);
    const deleted = lotNumbers.filter((item) => item.id !== 0 && item.is_deleted);
    const actived = lotNumbers.find((item) => item.is_active);
    if (!actived) throw new LotNumberError('NO_ACTIVE_LOT_NUMBER');
    const currentActived = await getActiveLotNumber(PlusmarService.readerClient, lotNumbers[0].logistic_id, true);
    const isTheSameActiveLotNumber = !currentActived ? false : actived.id === currentActived.id;
    if (!isTheSameActiveLotNumber) {
      const newLotNumber = {
        logistic_id: actived.logistic_id,
        suffix: actived.suffix,
        prefix: actived.prefix,
        from: actived.from,
        to: actived.to,
        is_active: actived.is_active,
        is_remaining: true,
        expired_date: actived.expired_date,
      } as IUpdatedLotNumber;
      if (currentActived) await updateLotNumberStatus(PlusmarService.writerClient, currentActived.id, false);
      await this.updateNewActiveLotNumber(actived, newLotNumber);
    }

    await this.createAndDeleteLotnumbers(created, deleted);
    return {
      status: 200,
      value: 'Update success',
    };
  }

  async updateNewActiveLotNumber(actived: IUpdatedLotNumber, newLotNumber: IUpdatedLotNumber): Promise<void> {
    const isNewActiveAlreadyCreated = actived.id !== 0;
    if (!isNewActiveAlreadyCreated) {
      await createLotNumber(PlusmarService.writerClient, newLotNumber);
    } else {
      await updateLotNumberStatus(PlusmarService.writerClient, actived.id, true);
    }
  }

  async createAndDeleteLotnumbers(created: IUpdatedLotNumber[], deleted: IUpdatedLotNumber[]): Promise<void> {
    for (let lotIndex = 0; lotIndex < created.length; lotIndex++) {
      const lotNumber = created[lotIndex];
      const newLotNumber = {
        logistic_id: lotNumber.logistic_id,
        suffix: lotNumber.suffix,
        prefix: lotNumber.prefix,
        from: lotNumber.from,
        to: lotNumber.to,
        is_active: lotNumber.is_active,
        is_remaining: true,
        expired_date: lotNumber.expired_date,
      } as IUpdatedLotNumber;
      await createLotNumber(PlusmarService.writerClient, newLotNumber);
    }

    for (let deleteIndex = 0; deleteIndex < deleted.length; deleteIndex++) {
      const deleleTarget = deleted[deleteIndex];
      await deleteLotNumber(PlusmarService.writerClient, deleleTarget.id);
    }
  }

  async updateLotNumberStatus(lotNumber: ILotNumberModel): Promise<IHTTPResult> {
    const { id, is_active } = lotNumber;
    return await updateLotNumberStatus(PlusmarService.writerClient, id, is_active);
  }

  async deleteLotNumber(id: number): Promise<IHTTPResult> {
    return await deleteLotNumber(PlusmarService.writerClient, id);
  }
}
