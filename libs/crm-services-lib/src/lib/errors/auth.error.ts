export class AuthError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);

      this.name = 'AuthError';
    }
  }
}
