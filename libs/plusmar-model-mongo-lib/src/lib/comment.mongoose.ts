import { IComment } from '@reactor-room/itopplus-model-lib';
import mongoose, { Document, Schema } from 'mongoose';

export const commentSchemaModel = mongoose?.model<IComment & Document>(
  'comments',
  new Schema({
    id: String,
    text: String,
    source: String,
    pageID: Number,
    audienceID: Number,
    commentID: String,
    postID: String,
    sentBy: String,
    payload: String,
    attachment: String,
    isReply: Boolean,
    allowReply: Boolean,
    createdAt: Date,
    privateSent: { default: false, type: Boolean },
    sender: {
      user_id: Number,
      user_name: String,
    },
    hidden: { default: false, type: Boolean },
    replies: [{ type: Schema.Types.ObjectId, ref: 'comments', default: [] }],
  }),
);
