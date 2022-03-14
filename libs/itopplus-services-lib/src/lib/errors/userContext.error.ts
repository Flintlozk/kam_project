export class UserContextError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserContextError);
      this.name = 'UserContextError';
    }
  }
}
