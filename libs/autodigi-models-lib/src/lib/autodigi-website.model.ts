import { IAutodigiBusiness } from '..';

export interface IAutodigiFacebookFanpages {
  id: string;
  name: string;
  picture: string;
  isPrimary: boolean;
}
export interface IAutodigiFacebookAdAccount {
  id: string;
  name: string;
  businessId: string;
  businessName: string;
  isPrimary: boolean;
}
export interface IAutodigiWebsiteFacebookAccess {
  fanpage: IAutodigiFacebookFanpages[];
  adaccount: IAutodigiFacebookAdAccount[];
}

export interface IAutodigiWebsiteMember {
  user_id: string;
  isOwner: boolean;
  accessLevel: string; // * ADMIN , MEMBER
  createdate: Date;
}

export interface IAutodigiWebsite {
  _id: string;
  name: string;
  owner_id: string; // Old config
  users: IAutodigiWebsiteMember[];
  business_info: IAutodigiBusiness;
  linkAccount: IAutodigiWebsiteFacebookAccess;
  createdate: Date;
  lastupdate: Date;
  cid: string; // Old config
  ga_viewid: string; // Old config
  reportTemplate_id: string; // Old config
  facebook: IAutodigiWebsiteFacebookAccess; // Old config
  websiteProtocal: string;
  more_commerce_page_id: number;
}
