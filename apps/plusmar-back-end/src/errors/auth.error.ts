export class AuthError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);

      this.name = 'AuthError';
    }
  }
}

export class UserNotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotFoundError);

      this.name = 'UserNotFoundError';
    }
  }
}
export class RegisterError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegisterError);

      this.name = 'RegisterError';
    }
  }
}
