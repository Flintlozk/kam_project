import mongoose, { Schema } from 'mongoose';
import { IMockWebPage, IWebPage } from '@reactor-room/cms-models-lib';

export const webPageSchema = new Schema();
webPageSchema.add({
  parentID: Schema.Types.ObjectId,
  orderNumber: Number,
  masterPageID: Schema.Types.ObjectId,
  name: String,
  isHide: Boolean,
  isHomepage: Boolean,
  isChildSelected: Boolean,
  setting: new Schema({
    isOpenNewTab: Boolean,
    isMaintenancePage: Boolean,
    isIcon: Boolean,
    pageIcon: String,
    isMega: Boolean,
    socialShare: String,
    mega: {
      primaryType: String,
      footerType: String,
      primaryOption: Schema.Types.Mixed,
      footerOption: Schema.Types.Mixed,
    },
  }),
  permission: new Schema({
    type: String,
    option: {
      password: String,
      onlyPaidMember: Boolean,
    },
  }),
  configs: [
    {
      cultureUI: String,
      displayName: String,
      seo: {
        title: String,
        shortUrl: String,
        description: String,
        keyword: String,
      },
      primaryMega: Schema.Types.Mixed,
      footerMega: Schema.Types.Mixed,
    },
  ],
});
const WEB_PAGE_SCHEMA = new Schema({
  pageID: Number,
  level: Number,
  pages: [webPageSchema],
});
export const WebPageSchemaModel = mongoose?.model<IWebPage & Document>('z_cms_web_page', WEB_PAGE_SCHEMA);
export const WebPageMocksSchemaModel = mongoose?.model<IMockWebPage & Document>('z_cms_web_pages_mocks', WEB_PAGE_SCHEMA.add({ userID: Number }));
