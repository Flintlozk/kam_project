export interface IAutodigiWebStatsDeviceStatus {
  old: number;
  new: number;
}
export interface IAutodigiWebStatsDevice {
  mobile: IAutodigiWebStatsDeviceStatus[];
  tablet: IAutodigiWebStatsDeviceStatus[];
  desktop: IAutodigiWebStatsDeviceStatus[];
  unknown: IAutodigiWebStatsDeviceStatus[];
}
export interface IAutodigiWebStatsDomain {
  domain: string;
  ipAddress: string;
  stats: IAutodigiWebStatsDeviceStatus[];
}
export interface IAutodigiWebStatsStatus {
  old: number;
  new: number;
  device: IAutodigiWebStatsDevice;
  reference: IAutodigiWebStatsDomain[];
}
export interface IAutodigiWebStatsTypeDetail {
  line: IAutodigiWebStatsStatus[];
  messenger: IAutodigiWebStatsStatus[];
  form: IAutodigiWebStatsStatus[];
  call: IAutodigiWebStatsStatus[];
  visitor: IAutodigiWebStatsStatus[];
  location: IAutodigiWebStatsStatus[];
  click_campaign: IAutodigiWebStatsStatus[];
  cost_campaign: IAutodigiWebStatsStatus[];
}

export interface IAutodigiWebStatsType {
  name: string;
  stats_detail: IAutodigiWebStatsTypeDetail[];
  category: string;
}

export interface IAutodigiWebStatsEachDay {
  day: number;
  stats: IAutodigiWebStatsType[];
  createdate: Date;
  lastupdate: Date;
}

export interface IAutodigiWebStats {
  website_id: string;
  stats: IAutodigiWebStatsEachDay[];
  month: number;
  year: number;
  createdate: Date;
  lastupdate: Date;
}
