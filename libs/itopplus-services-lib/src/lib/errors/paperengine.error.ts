export class GetSourceFileError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GetSourceFileError);

      this.name = 'GetSourceFileError';
    }
  }
}
export class GetSourceFileRetryAttemptReach extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GetSourceFileRetryAttemptReach);

      this.name = 'GetSourceFileRetryAttemptReach';
    }
  }
}
