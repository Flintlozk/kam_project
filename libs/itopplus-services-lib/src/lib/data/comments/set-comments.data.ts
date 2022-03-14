import { IDStringObject, RemoveFacebookCommentResponse } from '@reactor-room/model-lib';
import { IComment, ICommentReplyInput } from '@reactor-room/itopplus-model-lib';
import { commentSchemaModel as FacebookComment } from '@reactor-room/plusmar-model-mongo-lib';

import axios from 'axios';

export async function update(ID: string, isReply: boolean, allowReply: boolean): Promise<IComment> {
  const result = await FacebookComment.findOneAndUpdate(
    { _id: ID },
    {
      $set: {
        isReply: isReply,
        allowReply: allowReply,
      },
    },
    { new: true },
  )
    .lean()
    .exec();
  return result;
}

export async function attachReply(ID: string, reply: IComment): Promise<IComment> {
  if (reply) {
    const result = await FacebookComment.findOneAndUpdate(
      { _id: ID },
      {
        $push: {
          replies: reply._id,
        },
      },
      { new: true },
    )
      .lean()
      .exec();
    return result;
  }

  const result = await FacebookComment.findOne({ _id: ID }).lean().exec();
  return result;
}

export async function addComment(commentInput: IComment, pageID: number): Promise<IComment> {
  try {
    const newComment = new FacebookComment({ ...commentInput, pageID });
    const result = await newComment.save();
    return result;
  } catch (err) {
    console.log('addComment err ::::::::::>>> ', err);
    throw new Error(err);
  }
}

export async function getCommentExistenceById(commentID: string, pageID: number): Promise<boolean> {
  const result = await FacebookComment.find({ commentID, pageID });
  return !!result.length;
}

export async function updateCommentByCommentID(commentInput: IComment): Promise<IComment> {
  const { commentID, pageID } = commentInput;
  const result = await FacebookComment.findOneAndUpdate({ commentID, pageID }, { ...commentInput }, { new: true });
  return result;
}

export async function setCommentPrivateSentStatus(commentID: string, pageID: number, status: boolean): Promise<IComment> {
  const result = await FacebookComment.findOneAndUpdate({ commentID, pageID }, { $set: { privateSent: status } })
    .lean()
    .exec();
  return result;
}

export async function replyToComment({ commentID, text: message }: ICommentReplyInput, accessToken: string): Promise<IDStringObject> {
  try {
    const response = await axios.post(`https://graph.facebook.com/v8.0/${commentID}/comments?access_token=${accessToken}`, {
      message: message,
    });
    const { data } = response;
    return data;
  } catch (err) {
    console.log('replyToComment: ', err.response.headers['www-authenticate']);
    return err;
  }
}
export async function updateSenderByCommentId(sender: { user_id: number; user_name: string }, commentID: string, pageID: number): Promise<IComment> {
  const result = await FacebookComment.findOneAndUpdate({ commentID, pageID }, { sender }).exec();
  return result;
}

export async function updateCommentMessage({ commentID, text: message }: ICommentReplyInput, accessToken: string): Promise<RemoveFacebookCommentResponse> {
  try {
    const { data } = await axios.post(`https://graph.facebook.com/v8.0/${commentID}?access_token=${accessToken}`, {
      message: message,
    });
    return data;
  } catch (err) {
    console.log('updateCommentMessage: ', err.response.headers['www-authenticate']);
    return err;
  }
}
export async function updateComment(pageID: number, payload: string, { commentID, text: message }: ICommentReplyInput): Promise<void> {
  try {
    await FacebookComment.updateOne(
      { commentID: commentID, pageID: pageID },
      {
        $set: {
          payload: payload,
          text: message,
        },
      },
    ).exec();
    console.log('[Facebook Comment] Updated ');
  } catch (err) {
    console.log('updateComment: ', err.response.headers['www-authenticate']);
    return err;
  }
}

export async function hideByCommentID(ID: string): Promise<boolean> {
  const { ok } = await FacebookComment.updateOne({ commentID: ID }, { $set: { hidden: true } }).exec();
  return Boolean(ok);
}
export async function unHideByCommentID(ID: string): Promise<boolean> {
  const { ok } = await FacebookComment.updateOne({ commentID: ID }, { $set: { hidden: false } }).exec();
  return Boolean(ok);
}
