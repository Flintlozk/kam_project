import { getUTCDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { CommentSentByEnum, IAttachmentComment, IComment, IGetComment, IMessageUsers } from '@reactor-room/itopplus-model-lib';
import { commentSchemaModel as FacebookComment } from '@reactor-room/plusmar-model-mongo-lib';
import axios from 'axios';
import { AttachmentCommentError } from '../../errors';

export async function getLastCommentSentByIDs(audienceIds: number[], pageID: number, sentBy: string, limit = 3): Promise<IComment[]> {
  const result = await FacebookComment.find({
    audienceID: {
      $in: audienceIds,
    },
    pageID,
    sentBy,
  })
    .sort({ _id: -1 })
    .limit(limit);
  return result.length > 0 ? result : [];
}
export async function getByCommentID(ID: string): Promise<IComment> {
  const result = await FacebookComment.findOne({ commentID: ID }).lean().exec();
  return result;
}

export async function getActiveCommentOnPrivateMessage(audienceID: number, pageID: number): Promise<IComment[]> {
  const start = getUTCDayjs().subtract(7, 'day').toDate();
  const comments = await FacebookComment.find({
    createdAt: { $gte: start, $lt: new Date() },
    audienceID: audienceID,
    pageID: pageID,
    sentBy: 'AUDIENCE',
    privateSent: { $ne: true },
  })
    .sort({ _id: -1 })
    .collation({ locale: 'en_US', numericOrdering: true })
    .lean()
    .exec();

  return comments;
}

export async function getComments(threadUsers: IMessageUsers): Promise<IComment[]> {
  const { audienceID, pageID } = threadUsers;

  const result = await FacebookComment.find({
    audienceID: audienceID,
    pageID: pageID,
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return result;
}

export async function getLatestComment(users: IMessageUsers): Promise<IComment> {
  const latestComment = await FacebookComment.findOne({ audienceID: users.audienceID, pageID: users.pageID }).sort({ createdAt: -1 }).lean().exec();
  return latestComment;
}

export async function getLatestCommentExceptSentByPage(users: IMessageUsers): Promise<IComment> {
  const latestComment = await FacebookComment.findOne({ audienceID: users.audienceID, pageID: users.pageID, sentBy: { $ne: 'PAGE' } })
    .sort({ createdAt: -1 })
    .collation({ locale: 'en_US', numericOrdering: true })
    .lean()
    .exec();

  return latestComment;
}

export async function getCommentsByPostID(users: IMessageUsers, postID: string): Promise<IComment[]> {
  const comments = await FacebookComment.find({
    // audienceID: users.audienceID,
    pageID: users.pageID,
    postID: postID,
    isReply: false,
  })
    .populate({
      path: 'replies',
      // match: { audienceID: users.audienceID },
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return comments;
}

export async function getParentCommentsByPostID(users: IMessageUsers, postID: string): Promise<IComment[]> {
  const comments = await FacebookComment.find({
    audienceID: users.audienceID,
    pageID: users.pageID,
    postID: postID,
    isReply: false,
  })
    .populate({
      path: 'replies',
      match: { audienceID: users.audienceID },
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return comments;
}

export async function getParentCommentsInParentList(commentIDs: string[], users: IMessageUsers, postID: string): Promise<IComment[]> {
  const comments = await FacebookComment.find({
    commentID: { $in: commentIDs },
    pageID: users.pageID,
    postID: postID,
    sentBy: CommentSentByEnum.AUDIENCE, // Remove this for get unrelate comment by audienceID
    isReply: false,
  })
    .populate({
      path: 'replies',
      // match: { audienceID: users.audienceID, sentBy: CommentSentByEnum.PAGE },
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return comments;
}

export async function getChildCommentsByPostID(users: IMessageUsers, postID: string): Promise<IComment[]> {
  const comments = await FacebookComment.find({
    audienceID: users.audienceID,
    pageID: users.pageID,
    postID: postID,
    sentBy: CommentSentByEnum.AUDIENCE,
    isReply: true,
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return comments;
}

export async function getPostsCommentByCommentID(commentID: string, accessToken: string): Promise<IGetComment> {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v8.0/${commentID}?access_token=${accessToken}`);
    return data;
  } catch (err) {
    console.log('getPostsCommentByCommentID: ', err.response.headers['www-authenticate']);
    return err;
  }
}

export async function getAttactmentComment(accessToken: string, commentID: string): Promise<IAttachmentComment> {
  try {
    const url = `https://graph.facebook.com/v8.0/${commentID}?fields=attachment&access_token=${accessToken}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    const error = err?.response?.data?.error;
    throw new AttachmentCommentError(error?.message);
  }
}
