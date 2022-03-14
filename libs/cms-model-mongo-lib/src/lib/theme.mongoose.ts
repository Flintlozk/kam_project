import { IThemeCategoryModel, IThemeRendering } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';
import { RenderingComponentDataSchema } from './component.mongoose';

const settingSchemaModel = new Schema({
  color: Schema.Types.Mixed,
  font: Schema.Types.Mixed,
  integration: Schema.Types.Mixed,
  defaultFontFamily: Schema.Types.String,
});

export const themeCategorySchemaModel = mongoose?.model<IThemeCategoryModel>(
  'z_cms_themes_category',
  new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
  }),
);

export const themeSchemaModel = mongoose?.model<IThemeRendering & Document>(
  'z_cms_themes',
  new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    isActive: Boolean,
    catagoriesID: [Schema.Types.ObjectId],
    image: [
      {
        type: { type: String },
        url: String,
        name: String,
        storageId: Schema.Types.ObjectId,
      },
    ],
    style: [
      {
        type: { type: String },
        url: String,
        name: String,
        plaintext: String,
        storageId: Schema.Types.ObjectId,
      },
    ],
    javascript: [
      {
        type: { type: String },
        url: String,
        name: String,
        plaintext: String,
        storageId: Schema.Types.ObjectId,
      },
    ],
    html: [
      {
        name: String,
        html: String,
        thumbnail: Schema.Types.Mixed,
      },
    ],
    themeComponents: [
      {
        themeComponent: [RenderingComponentDataSchema],
      },
    ],
    devices: Schema.Types.Mixed,
    settings: settingSchemaModel,
  }),
);
