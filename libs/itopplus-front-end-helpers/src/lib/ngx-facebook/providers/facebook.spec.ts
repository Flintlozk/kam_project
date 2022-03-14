import { FacebookService } from './facebook';
import { async } from '@angular/core/testing';
import { InitParams } from '../models/init-params';

declare let window: any;

describe('FacebookService', () => {
  let service: FacebookService;

  beforeAll(() => {
    service = new FacebookService();
    (window as any)['FB'] = {
      init: (params: InitParams) => params,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      login: () => {},
    };
  });

  it('should create an instance of the service', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if we call api before init', async(() => {
    service.api('friends').catch((e) => {
      expect(e).toBeDefined();
    });
  }));

  it('should init', () => {
    jest.spyOn(window.FB, 'init');
    const options: InitParams = {
      appId: '1927971220769787',
      version: 'v2.8',
    };
    service.init(options);
    expect(window.FB.init).toHaveBeenCalledWith(options);
  });

  it('should call login', () => {
    jest.spyOn(window.FB, 'login');
    service.login();
    expect(window.FB.login).toHaveBeenCalled();
  });
});
