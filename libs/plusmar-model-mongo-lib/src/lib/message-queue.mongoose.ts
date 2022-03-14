import { GenericRecursiveMessageType } from '@reactor-room/model-lib';
import { IQueueingModel, QueueingMethodEnum, QueueingPayloadType, QueueingStatusEnum } from '@reactor-room/itopplus-model-lib';
import mongoose, { Schema, Document } from 'mongoose';

const QueueingSchema = new Schema<IQueueingModel>({
  pageID: Number,
  subscriptionID: String,
  status: {
    default: QueueingStatusEnum.PENDING,
    type: QueueingStatusEnum,
  },
  payload: [
    new Schema<QueueingPayloadType>({
      status: { default: QueueingStatusEnum.PENDING, type: QueueingStatusEnum },
      method: { default: QueueingMethodEnum.NONE, type: QueueingMethodEnum },
      type: { type: GenericRecursiveMessageType },
      options: Schema.Types.Mixed,
      createdAt: {
        default: Date.now,
        type: Date,
      },
      updatedAt: {
        default: Date.now,
        type: Date,
      },
      retryAttempt: {
        default: 0,
        type: Number,
      },
    }),
  ],
  createdAt: {
    default: Date.now,
    type: Date,
  },
  updatedAt: {
    default: Date.now,
    type: Date,
  },
  retryAttempt: {
    default: 0,
    type: Number,
  },
});

// AUTO Generate by ITOPPLUS Mongoose Generator"
export const QueueingSchemaStagingModel = mongoose?.model<IQueueingModel & Document>('message_queueing_staging', QueueingSchema);
export const QueueingSchemaModel = mongoose?.model<IQueueingModel & Document>('message_queueing', QueueingSchema);
