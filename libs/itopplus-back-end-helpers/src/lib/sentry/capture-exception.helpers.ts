import { IEnvironment } from '@reactor-room/environment-services-backend';

export const isAllowCaptureException = (environment: IEnvironment): boolean => {
  if (environment.IS_STAGING) return true;
  else if (environment.IS_PRODUCTION) return true;
  else return false;
};
