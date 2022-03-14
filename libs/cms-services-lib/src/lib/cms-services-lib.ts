export class CMSServices {
  cmsServicesLib = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      resolve('cms-services-lib');
    });
  };
}
