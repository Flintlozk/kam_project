export class FBSendPayloadError extends Error {
  errorOn: string;
  payloadName: string;
  constructor(params, payloadName: string) {
    super({ ...params, payloadName });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FBSendPayloadError);

      this.name = 'FBSendPayloadError';
      this.message = `${payloadName}: ${params?.response?.headers['www-authenticate']}`;
      this.errorOn = params?.response?.headers['www-authenticate'];
      this.payloadName = payloadName;
    }
  }
}

export class LastMessageRecord extends Error {
  errorOn: string;
  payloadName: string;
  constructor() {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LastMessageRecord);

      this.name = 'LastMessageRecord';
      this.message = 'LAST_MESSAGE_RECORD';
    }
  }
}
