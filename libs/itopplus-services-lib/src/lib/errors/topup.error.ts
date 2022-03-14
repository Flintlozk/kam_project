export class TopupHashError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TopupHashError);

      this.name = 'TopupHashError';
    }
  }
}
export class TopupAmountInvalidError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TopupAmountInvalidError);

      this.name = 'TopupAmountInvalidError';
      this.message = 'Invalid Amount Minimun(200) - Maximum(30,000)';
    }
  }
}
