export class SettingError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SettingError);
      this.name = 'SettingError';
    }
  }
}
