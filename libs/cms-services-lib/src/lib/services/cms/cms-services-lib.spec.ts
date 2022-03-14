import { CMSServices } from './cms-services-lib';

describe('cmsServicesLib', () => {
  it('should work', () => {
    const func = new CMSServices();
    expect(func.cmsServicesLib()).toEqual('cms-services-lib');
  });
});
