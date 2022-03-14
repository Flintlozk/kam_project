import { EnumFlashExpressResponseCode } from '@reactor-room/itopplus-model-lib';

export class FlashExpressOrderError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      const errorReason = EnumFlashExpressResponseCode[String(params[0])];
      Error.captureStackTrace(this, FlashExpressOrderError);
      if (params[1]) {
        this.message = JSON.stringify(params[1]);
      }
      this.name = 'FlashExpressOrderError';
      this.message += '\n' + errorReason + ' \nCODE' + params[0];
    }
  }
}
