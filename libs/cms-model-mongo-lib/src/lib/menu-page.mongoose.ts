import mongoose, { Schema } from 'mongoose';
import { IMenuPageModel } from '@reactor-room/cms-models-lib';

export const MenuPageSchemaModel = mongoose?.model<IMenuPageModel & Document>(
  'z_cms_menu_page',
  new Schema({
    pageID: Number,
    html: String,
  }),
);
