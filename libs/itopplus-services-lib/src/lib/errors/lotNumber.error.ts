export class LotNumberError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LotNumberError);

      this.name = 'LotNumberError';
    }
  }
}
