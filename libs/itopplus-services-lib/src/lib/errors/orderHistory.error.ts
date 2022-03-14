export class OrderHistoryError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrderHistoryError);

      this.name = 'OrderHistoryError';
    }
  }
}

export class OrderHistoryHandlePostbackMessagesError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrderHistoryHandlePostbackMessagesError);

      this.name = 'OrderHistoryHandlePostbackMessagesError';
    }
  }
}
