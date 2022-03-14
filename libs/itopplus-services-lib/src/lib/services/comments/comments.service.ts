import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { IDStringObject, RemoveFacebookCommentResponse } from '@reactor-room/model-lib';
import {
  IAttachmentComment,
  IComment,
  ICommentRemoveInput,
  ICommentReplyInput,
  IGetComment,
  IMessageUsers,
  IPayload,
  UpdateCommentResponse,
} from '@reactor-room/itopplus-model-lib';
import { getAudienceByID } from '../../data';
import {
  addComment,
  attachReply,
  deleteByCommentID,
  deleteManyByCommentIDs,
  getActiveCommentOnPrivateMessage,
  getAttactmentComment,
  getByCommentID,
  getChildCommentsByPostID,
  getCommentExistenceById,
  getComments,
  getLatestComment,
  getLatestCommentExceptSentByPage,
  getParentCommentsByPostID,
  getParentCommentsInParentList,
  getPostsCommentByCommentID,
  hideByCommentID,
  hideComment,
  removeComment,
  replyToComment,
  unHideByCommentID,
  unHideComment,
  update,
  updateComment,
  updateCommentByCommentID,
  updateCommentMessage,
  updateSenderByCommentId,
} from '../../data/comments';
import { AudienceService } from '../audience';
import { PlusmarService } from '../plusmarservice.class';

export class CommentService {
  audienceService: AudienceService;
  constructor() {
    this.audienceService = new AudienceService();
  }

  getActiveCommentOnPrivateMessage = async (audienceID: number, pageID: number): Promise<IComment[]> => {
    return await getActiveCommentOnPrivateMessage(audienceID, pageID);
  };
  addComment = async (commentInput: IComment, pageID: number): Promise<IComment> => {
    return await addComment(commentInput, pageID);
  };

  getCommentExistenceById = async (commentID: string, pageID: number): Promise<boolean> => {
    return await getCommentExistenceById(commentID, pageID);
  };

  update = async (ID: string, isReply: boolean, allowReply: boolean): Promise<IComment> => {
    return await update(ID, isReply, allowReply);
  };

  attachReply = async (ID: string, reply: IComment): Promise<IComment> => {
    return await attachReply(ID, reply);
  };

  getByCommentID = async (ID: string): Promise<IComment> => {
    return await getByCommentID(ID);
  };
  getPostsCommentByCommentID = async (ID: string, accessToken: string): Promise<IGetComment> => {
    return await getPostsCommentByCommentID(ID, cryptoDecode(accessToken, PlusmarService.environment.pageKey));
  };

  deleteByCommentID = async (ID: string): Promise<boolean> => {
    const { replies } = await getByCommentID(ID);
    if (replies.length > 0) {
      const repliesID = replies.map((item) => item._id);
      await deleteManyByCommentIDs(repliesID);
    }
    return await deleteByCommentID(ID);
  };

  hideByCommentID = async (ID: string): Promise<boolean> => {
    return await hideByCommentID(ID);
  };

  unHideByCommentID = async (ID: string): Promise<boolean> => {
    return await unHideByCommentID(ID);
  };

  // called by webhook after finish
  updateCommentByCommentID = async (commentInput: IComment): Promise<IComment> => {
    const result = await updateCommentByCommentID(commentInput);
    return result;
  };

  hideComment = async (comment: ICommentRemoveInput, accessToken: string): Promise<UpdateCommentResponse> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    const result = await hideComment(comment, token);
    await hideByCommentID(comment.commentID);
    return result;
  };

  unhideComment = async (comment: ICommentRemoveInput, accessToken: string): Promise<UpdateCommentResponse> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    const result = await unHideComment(comment, token);
    await unHideByCommentID(comment.commentID);
    return result;
  };

  getComments = async (users: IMessageUsers): Promise<IComment[]> => {
    return await getComments(users);
  };

  getLatestComment = async (users: IMessageUsers): Promise<IComment> => {
    const latestComment = await getLatestComment(users);
    return latestComment;
  };

  getLatestCommentExceptSentByPage = async (users: IMessageUsers): Promise<IComment> => {
    return await getLatestCommentExceptSentByPage(users);
  };

  getParentIDFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.parent_id;
  };
  getCommentsByPostID = async (users: IMessageUsers, postID: string): Promise<IComment[]> => {
    // Filter ['MOST_RELEVANT','NEWEST','ALL_COMMENTS']
    // [Should See]
    // Case 1 : Comment
    // Case 2 : Replied in Comment

    const parentComments = await getParentCommentsByPostID(users, postID);
    const childComments = await getChildCommentsByPostID(users, postID);

    const parentCommentIDs = parentComments.map((comment) => comment.commentID);
    const parentCommentIDsFromChild = childComments.map((item) => this.getParentIDFromComment(JSON.parse(item.payload)));
    const filteredCommentID = parentCommentIDsFromChild.filter((commentID) => !parentCommentIDs.includes(commentID));

    const insideComment = await getParentCommentsInParentList(filteredCommentID, users, postID);
    const comments = parentComments.concat(insideComment);
    return comments;
  };

  replyToComment = async (reply: ICommentReplyInput, payload: IPayload, pageID: number): Promise<IDStringObject> => {
    try {
      const accessToken = payload?.page?.option?.access_token;
      const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
      const result = await replyToComment(reply, token);

      const comment: IComment = { ...reply, ...{ commentID: result.id } } as IComment;
      await addComment(comment, payload.pageID);

      const AutoMoveToFollow = true;
      const audience = await getAudienceByID(PlusmarService.readerClient, Number(reply.audienceID), pageID);
      await this.audienceService.autoSetAudienceStatus(payload, audience, AutoMoveToFollow);

      return result;
    } catch (err) {
      console.log('replyToComment error : ', err);
      throw err;
    }
  };

  removeComment = async (comment: ICommentRemoveInput, accessToken: string): Promise<RemoveFacebookCommentResponse> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    return await removeComment(comment, token);
  };

  editComment = async (comment: ICommentReplyInput, accessToken: string, pageID: number): Promise<RemoveFacebookCommentResponse> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    // ? mongo will update once the webhook have a editted comment event
    const result = await updateCommentMessage(comment, token);
    await updateSenderByCommentId(comment.sender, comment.commentID, pageID);
    return result;
  };

  editCommentOnWebhookEvent = async (pageID: number, payload: string, comment: ICommentReplyInput): Promise<void> => {
    await updateComment(pageID, payload, comment);
  };

  getAttactmentComment = async (accessToken: string, commentID: string): Promise<IAttachmentComment> => {
    return await getAttactmentComment(accessToken, commentID);
  };
}
