export class WebViewTemplateError extends Error {
  errorOn: string;
  payloadName: string;
  constructor(params, payloadName: string) {
    super({ ...params, payloadName });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebViewTemplateError);

      this.name = 'WebViewTemplateError';
    }
  }
}
