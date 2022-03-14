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

export class InvalidTokenError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTokenError);

      this.name = 'InvalidTokenError';
    }
  }
}

export class InviteError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InviteError);

      this.name = 'InviteError';
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
export class InvalidOrigin extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidOrigin);

      this.name = 'InvalidOrigin';
      this.message = 'Cross Site Origin Are Not Allowed';
    }
  }
}

export class TokenExpired extends Error {
  constructor() {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenExpired);

      this.name = 'TokenExpired';
      this.message = 'Token Already Expired';
    }
  }
}
export class TokenInvalid extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenInvalid);

      this.name = 'TokenInvalid';
      this.message = 'Invalid Token';
    }
  }
}
export class TokenUnauthorized extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenUnauthorized);

      this.name = 'TokenUnauthorized';
    }
  }
}
