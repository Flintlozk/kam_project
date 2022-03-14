import { IThemeSharingComponent } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';
import { RenderingComponentDataSchema } from './component.mongoose';

export const ThemeComponentModel = mongoose?.model<IThemeSharingComponent & Document>(
  'z_cms_theme_components',
  new Schema({
    _id: Schema.Types.ObjectId,
    themeComponents: [RenderingComponentDataSchema],
    devices: Schema.Types.Mixed,
    color: Schema.Types.Mixed,
    font: Schema.Types.Mixed,
    pageID: Number,
  }),
);
