import { IPost } from '@reactor-room/itopplus-model-lib';
import mongoose, { Document, Schema } from 'mongoose';

export const postSchemaModel = mongoose?.model<IPost & Document>(
  'posts',
  new Schema({
    id: String,
    postID: String,
    pageID: String,
    payload: Object,
    createdAt: Date,
    updatedAt: Number,
  }),
);
