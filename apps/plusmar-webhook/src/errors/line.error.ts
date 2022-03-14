export class LineCreateAudienceError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LineCreateAudienceError);

      this.name = 'LineCreateAudienceError';
    }
  }
}
