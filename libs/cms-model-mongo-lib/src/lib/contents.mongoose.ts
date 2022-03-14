import { IContentEditor } from '@reactor-room/cms-models-lib';
import mongoose, { Document, Schema } from 'mongoose';

export const contentsColumnSchemaModel = new Schema();
contentsColumnSchemaModel.add({
  gap: Number,
  components: Schema.Types.Mixed,
});

export const contentsSectionSchemaModel = new Schema();
contentsSectionSchemaModel.add({
  type: String,
  gap: Number,
  columns: [contentsColumnSchemaModel],
});

export const contentsLanguageSchemaModel = new Schema();
contentsLanguageSchemaModel.add({
  cultureUI: String,
  title: String,
  subTitle: String,
  keyword: String,
});

export const contentsSchemaModel = mongoose?.model<IContentEditor & Document>(
  'z_cms_content',
  new Schema({
    pageID: Number,
    name: String,
    language: [contentsLanguageSchemaModel],
    categories: [Schema.Types.ObjectId],
    tags: [String],
    authors: [Schema.Types.ObjectId],
    isPin: Boolean,
    priority: Number,
    startDate: Schema.Types.Date,
    isEndDate: Boolean,
    endDate: Schema.Types.Date,
    views: Number,
    coverImage: String,
    isPublish: Boolean,
    customCSS: String,
    draftSections: [contentsSectionSchemaModel],
    sections: [contentsSectionSchemaModel],
  }),
);
