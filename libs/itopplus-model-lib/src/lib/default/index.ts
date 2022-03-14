import { ICustomerTemp } from '../customer/customer.model';
import { IAudience } from '../audience/audience.model';
import { IPages } from '../pages/pages.model';

export interface IHandleDefault {
  customer: ICustomerTemp;
  audience: IAudience;
  page: IPages;
  isPageNotFound: boolean;
  isAudienceCreated: boolean;
}

export enum PageExitsType {
  FACEBOOK = 'FACEBOOK',
  LINE = 'LINE',
  OPENAPI = 'OPENAPI',
}
