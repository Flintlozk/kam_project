import mongoose, { Schema, Document } from 'mongoose';
import { ILog } from '@reactor-room/itopplus-model-lib';
export const logSchemaModel = mongoose?.model<ILog & Document>(
  'log',
  new Schema({
    // id: String,
    pageID: Number,
    user_id: Number,
    type: String,
    action: String,
    description: String,
    user_name: String,
    subject: String,
    audience_id: Number,
    audience_name: String,
    created_at: Date,
  }),
);
