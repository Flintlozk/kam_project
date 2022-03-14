import mongoose, { Document, Schema } from 'mongoose';
import { IMessageModel, ITraceMessageModel } from '@reactor-room/itopplus-model-lib';
export const messageSchemaModel = mongoose?.model<IMessageModel & Document>(
  'messages',
  new Schema({
    id: { type: Schema.Types.ObjectId },
    mid: String,
    text: String,
    attachments: String,
    object: String,
    pageID: Number,
    audienceID: Number,
    createdAt: String,
    // createdAt: Date,
    sentBy: String,
    payload: String,
    sender: {
      user_id: Number,
      user_name: String,
      group_id: String,
      room_id: String,
      line_user_id: String,
      picture_url: String,
    },
    messagetype: String,
    messagingType: String,
    commentID: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    source: String,
  }),
);

export const TraceMessageSchemaModel = mongoose?.model<ITraceMessageModel & Document>(
  'trace_messages',
  new Schema({
    id: { type: Schema.Types.ObjectId },
    mid: { type: String, index: true },
    commentID: { type: String, index: true },
    webhook: Schema.Types.Mixed,
    latestIncoming: Date,
    firstIncoming: {
      type: Date,
      default: Date.now,
    },
    type: String,
    traceStage1: { type: Number, default: null },
    traceStage2: { type: Number, default: null },
    traceStage3: { type: Number, default: null },
    traceStage4: { type: Number, default: null },
    traceStage5: { type: Number, default: null },
    lastTraceStage: { type: Number, default: null },
  }),
);

const TempMessageSchema = new Schema<IMessageModel>({
  id: { type: Schema.Types.ObjectId },
  mid: String,
  text: String,
  attachments: String,
  object: String,
  pageID: Number,
  audienceID: Number,
  createdAt: String,
  // createdAt: Date,
  sentBy: String,
  payload: String,
  sender: {
    user_id: Number,
    user_name: String,
    group_id: String,
    room_id: String,
    line_user_id: String,
    picture_url: String,
  },
  messagetype: String,
  messagingType: String,
  commentID: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: String,
});

export const tempMessageStagingSchemaModel = mongoose?.model<IMessageModel & Document>('temp_staging_messages', TempMessageSchema);
export const tempMessageSchemaModel = mongoose?.model<IMessageModel & Document>('temp_messages', TempMessageSchema);
