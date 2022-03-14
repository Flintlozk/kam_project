import { ITopupReference } from '@reactor-room/itopplus-model-lib';
import mongoose, { Document, Schema } from 'mongoose';

export const topupReferenceSchemaModel = mongoose?.model<ITopupReference & Document>(
  'topup_references',
  new Schema({
    UUID: { type: String, required: true },
    refID: { type: String, required: true },
    pageID: { type: Number, required: true },
    amount: { type: String, required: true },
    isApproved: { type: Boolean, required: true, default: false },
    createdAt: Date,
    updatedAt: Date,
    importer: {
      user_id: Number,
      user_name: String,
    },
  }),
);
