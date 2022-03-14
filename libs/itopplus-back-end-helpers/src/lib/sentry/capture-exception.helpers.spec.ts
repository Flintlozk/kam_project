import { IEnvironment } from '@reactor-room/environment-services-backend';
import { isAllowCaptureException } from './capture-exception.helpers';
describe('Check Method isAllowCaptureExcepton', () => {
  test('must return FALSE', () => {
    const env = {
      IS_STAGING: false,
      IS_PRODUCTION: false,
    } as IEnvironment;
    const isAllow = isAllowCaptureException(env);
    expect(isAllow).toBeFalsy();
  });
  test('must return TRUE on Production', () => {
    const env = {
      IS_STAGING: true,
      IS_PRODUCTION: false,
    } as IEnvironment;
    const isAllow = isAllowCaptureException(env);
    expect(isAllow).toBeTruthy();
  });
  test('must return TRUE on Staging', () => {
    const env = {
      IS_STAGING: false,
      IS_PRODUCTION: true,
    } as IEnvironment;
    const isAllow = isAllowCaptureException(env);
    expect(isAllow).toBeTruthy();
  });
  test('must return TRUE on Staging || Production', () => {
    const env = {
      IS_STAGING: true,
      IS_PRODUCTION: true,
    } as IEnvironment;
    const isAllow = isAllowCaptureException(env);
    expect(isAllow).toBeTruthy();
  });
});
