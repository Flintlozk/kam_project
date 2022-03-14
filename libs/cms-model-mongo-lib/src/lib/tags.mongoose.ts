import { ITags } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';

export const TagsSchemaModel = mongoose?.model<ITags & Document>(
  'z_cms_tag',
  new Schema({
    pageID: Number,
    tags: [String],
  }),
);
