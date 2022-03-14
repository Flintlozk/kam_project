import { IFile } from '@reactor-room/itopplus-model-lib';
import mongoose, { Schema, Document } from 'mongoose';

export const FilesSchemaModel = mongoose?.model<IFile & Document>(
  'z_cms_file',
  new Schema({
    pageID: Number,
    subscriptionID: String,
    path: String,
    name: String,
    extension: String,
    description: String,
    date: Schema.Types.Date,
    tags: [String],
    isDeleted: Boolean,
    deleteable: Boolean,
    type: String,
    identifyID: String,
  }),
);
