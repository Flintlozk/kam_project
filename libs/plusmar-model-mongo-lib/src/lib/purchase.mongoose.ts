import { IPurchasingOrderFailedHistory } from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import mongoose, { Document, Schema } from 'mongoose';

export const purchaseOrderFailedHistoriesSchemaModel = mongoose?.model<IPurchasingOrderFailedHistory & Document>(
  'purchasing_order_failed_histories',
  new Schema({
    id: String,
    pageID: Number,
    orderID: Number,
    pipeline: String,
    isFixed: { type: Boolean, default: false },
    typename: { type: String },
    description: { type: String, default: '' },
    updatedAt: { type: Date, default: dayjs().utc().format() },
    createdAt: { type: Date, default: dayjs().utc().format() },
  }),
);
