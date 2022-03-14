import { EPageMessageTrackMode } from '@reactor-room/itopplus-model-lib';

export interface IDynamicSubscriptionQuery {
  dynamicParams: { [name: string]: string | number };
  statementAlmost: string;
  statementOver: string;
  isActiveSLA: boolean;
  pageIDs: number[];
}

export interface IAllSubscriptionClosedReason {
  reasonID: number;
  pageID: number;
  pageName: string;
  total: number;
  reason: string;
}

export interface IAllSubscriptionSLAStatisiticWaitForOpen {
  onProcess: number;
  almostSLA: number;
  overSLA: number;
}

export interface IPageListOnMessageTrackMode {
  pageID: number;
  pageImgUrl: string;
  pageTitle: string;
  pageMessageMode: EPageMessageTrackMode;
}
export interface IAllSubscriptionSLAStatisitic {
  totalCase: number;
  todayCase: number;
  waitForOpen: IAllSubscriptionSLAStatisiticWaitForOpen;
  closedCaseToday: number;
  onProcessSla: number;
  onProcessOverSla: number;
  onProcessSlaTier2: number;
  onProcessOverSlaTier2: number;
}

export const SLAFilterType = {
  TAG: -1,
  ASSIGNEE: -2,
};

export interface IAllSubscriptionSLAAllSatffUser {
  userID: number;
  name: string;
  picture: string;
}
export interface IAllSubscriptionSLAAllSatff {
  tagID: number;
  pageID: number;
  totalOnProcess: number;
  todayClosed: number;
  almostSLA: number;
  overSLA: number;
  tagName: string;
  users: IAllSubscriptionSLAAllSatffUser | IAllSubscriptionSLAAllSatffUser[];
}

export interface AllSubscriptionSLAStatisiticInput {
  [name: string]: string | number | boolean | Date | { [name: string]: string | number };
  pageID?: number;
  subscriptionID: string;
  startDate: Date;
  endDate: Date;
  dynamicParams?: { [name: string]: string | number };
  statementOver?: string;
  isActiveSLA?: boolean;
}
export interface AllSubscriptionClosedReasonInput {
  subscriptionID: string;
  pageID?: number;
  startDate: Date;
  endDate: Date;
}
export interface AllSubscriptionSLAAllSatff {
  [name: string]: string | number | boolean | Date | { [name: string]: string | number };
  pageID?: number;
  subscriptionID: string;
  startDate: Date;
  endDate: Date;
  dynamicParams?: { [name: string]: string | number };
  statementAlmost?: string;
  statementOver?: string;
  isActiveSLA?: boolean;
  // [name: string]?: string | number;
}

export interface IAllSubscriptionFilter {
  pageID: number;
}
