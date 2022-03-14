export class ResourceValidationError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceValidationError);
      this.name = 'ResourceValidationError';
    }
  }
}
