import { censorEmail } from '@reactor-room/itopplus-back-end-helpers';
import { IPageInfoWithOwnerInfo, IFacebookPageWithBindedPageStatus, IFacebookPageResponse } from '@reactor-room/itopplus-model-lib';

export const updateFbPagesWithPages = (facebookPages: IFacebookPageResponse[], pageUsing: IPageInfoWithOwnerInfo[]): IFacebookPageWithBindedPageStatus[] => {
  const result = facebookPages.map((fbPage) => {
    let page;
    if (pageUsing) page = pageUsing.find((p) => p.fb_page_id === fbPage.id.toString());
    return {
      facebook_page: fbPage,
      is_binded: page ? true : false,
      email: page ? censorEmail(page.email) : '',
    };
  });
  return result;
};
