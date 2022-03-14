import mongoose, { Schema } from 'mongoose';
import { IWebPage, IMenuGroup } from '@reactor-room/cms-models-lib';
import { webPageSchema } from './web-page.mongoose';

export const MenuCustomSchemaModel = mongoose?.model<IWebPage & Document>(
  'z_cms_menu_custom',
  new Schema({
    pageID: Number,
    level: Number,
    menuGroupId: Schema.Types.ObjectId,
    pages: [webPageSchema],
  }),
);

export const MenuGroupSchemaModel = mongoose?.model<IMenuGroup & Document>(
  'z_cms_menu_group',
  new Schema({
    pageID: Number,
    name: String,
    html: String,
  }),
);
