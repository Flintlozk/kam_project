export class AppScopeError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppScopeError);

      this.name = 'AppScopeError';
    }
  }
}
