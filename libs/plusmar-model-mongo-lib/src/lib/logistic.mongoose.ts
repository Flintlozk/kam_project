import { ILogisticLabels } from '@reactor-room/itopplus-model-lib';
import mongoose, { Schema, Document } from 'mongoose';

export const logisticLabelSchemaModel = mongoose?.model<ILogisticLabels & Document>(
  'logistic_labels',
  new Schema({
    // _id: Schema.Types.ObjectId,
    // trackID: Number, // reference to PG purchasing_order_tracking_info (id)
    trackID: { type: Number, required: true }, // reference to PG purchasing_order_tracking_info (id)
    // pageID: Number, // reference to PG pages (id)
    pageID: { type: Number, required: true }, // reference to PG pages (id)
    // orderID: Number, // reference to PG purchasing_orders (id)
    orderID: { type: Number, required: true }, // reference to PG purchasing_orders (id)
    label1: String,
    label3: String,
    label4: String,
  }),
);
