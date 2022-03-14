export class PagesError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PagesError);

      this.name = 'PagesError';
    }
  }
}

export class PagesNotExistError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PagesNotExistError);

      this.name = 'PagesNotExistError';
    }
  }
}
