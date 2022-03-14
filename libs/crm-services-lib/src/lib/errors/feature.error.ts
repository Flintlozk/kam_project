export class FeatureError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FeatureError);

      this.name = 'FeatureError';
    }
  }
}
