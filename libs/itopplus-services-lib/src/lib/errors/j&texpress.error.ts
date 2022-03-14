import { EnumJAndTExpressReasonResponseCode } from '@reactor-room/itopplus-model-lib';
export class JAndTExpressOrderError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      const errorReason = EnumJAndTExpressReasonResponseCode[String(params[0])];
      Error.captureStackTrace(this, JAndTExpressOrderError);
      if (params[1]) {
        this.message = JSON.stringify(params[1]);
      }
      this.name = 'FlashExpressOrderError';
      this.message += '\n' + errorReason + ' \nCODE' + params[0];
    }
  }
}

export class JAndTExpressAddressError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JAndTExpressAddressError);

      this.name = 'JAndTExpressAddressError';
    }
  }
}
