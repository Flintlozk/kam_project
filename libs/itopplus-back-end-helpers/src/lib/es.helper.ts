/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@elastic/elasticsearch';
import { isEmpty } from './object.helper';

export const indexES = (isProd: boolean, client: Client, index: string, body: any): void => {
  if (isProd) {
    if (!isEmpty(body)) {
      // await client.index({
      //   index,
      //   body,
      // });
    }
  }
};
