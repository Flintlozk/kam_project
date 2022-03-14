export class SharedServiceError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SharedServiceError);

      this.name = 'SharedServiceError';
    }
  }
}

export class CustomerHasBeenBlocked extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomerHasBeenBlocked);

      this.name = 'CustomerHasBeenBlocked';
    }
  }
}
