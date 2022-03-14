export class SubscriptionError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SubscriptionError);

      this.name = 'SubscriptionError';
    }
  }
}

export class SubscriptionExpiredError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SubscriptionExpiredError);

      this.name = 'SubscriptionExpiredError';
    }
  }
}
