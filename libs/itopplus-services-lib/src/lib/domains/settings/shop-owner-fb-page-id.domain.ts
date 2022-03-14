import { getDayTilExpired } from '@reactor-room/itopplus-back-end-helpers';
import { IFacebookPageResponse, ISettingSubscriptionDetail, ISubscriptionPeriod } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';

export const getFbPageFromFbPagesByFbPageID = (fbPages: IFacebookPageResponse[], fbPageID: string): IFacebookPageResponse[] => {
  return fbPages.filter((fbPage: IFacebookPageResponse) => fbPage.id === fbPageID) as any;
};

export const createObjSubScription = (pageDetail: [ISubscriptionPeriod]): [ISettingSubscriptionDetail] => {
  if (pageDetail) {
    const createObj = [
      {
        package: pageDetail[0].plan_name,
        pagelimit: pageDetail[0].maximum_pages,
        pageusing: pageDetail.length,
        daysRemaining: getDayTilExpired(pageDetail[0].expired_at),
        expiredDate: dayjs(pageDetail[0].expired_at).format('D/M/YYYY'),
      },
    ] as [ISettingSubscriptionDetail];
    return createObj;
  }
};
