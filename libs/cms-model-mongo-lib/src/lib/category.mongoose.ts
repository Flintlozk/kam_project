import { ICategory } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';

export const categoryCultureSchemaModel = new Schema();
categoryCultureSchemaModel.add({
  cultureUI: String,
  name: String,
  description: String,
  slug: String,
});

export const contentCategorySchemaModel = mongoose?.model<ICategory & Document>(
  'z_cms_categories',
  new Schema({
    pageID: Number,
    name: String,
    language: [categoryCultureSchemaModel],
    featuredImg: String,
    parentId: Schema.Types.ObjectId,
    status: Boolean,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  }),
);
