export class AppScopeError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppScopeError);

      this.name = 'AppScopeError';
    }
  }
}
export class UserAppScopeError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserAppScopeError);

      this.name = 'UserAppScopeError';
    }
  }
}
export class PageAppScopeError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageAppScopeError);

      this.name = 'PageAppScopeError';
    }
  }
}
