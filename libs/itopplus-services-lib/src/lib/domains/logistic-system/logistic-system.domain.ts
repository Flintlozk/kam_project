import { ILogisticSystemTempMapping } from '@reactor-room/itopplus-model-lib';
import * as crypto from 'crypto';

export const getHashLogisitcSystemTempMapping = (temp: ILogisticSystemTempMapping, orderID: number): string => {
  if (!temp) return null;
  else {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(temp) + String(orderID))
      .digest('base64');
  }
};
