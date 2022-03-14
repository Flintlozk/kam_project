export class PageMemberError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageMemberError);

      this.name = 'PageMemberError';
    }
  }
}

export class PageMemberDuplicateError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageMemberError);

      this.name = 'PageMemberDuplicateError';
    }
  }
}

export class PageMemberRemoveError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageMemberError);

      this.name = 'Cannot remove owner from page';
    }
  }
}

export class ValidatePageMemberTokenError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidatePageMemberTokenError);
      this.name = 'ValidatePageMemberTokenError';
    }
  }
}
