import { IEnvironment } from '@reactor-room/environment-services-backend';
import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { IComment, IPost, IPostFacebookResponse, IPostInput } from '@reactor-room/itopplus-model-lib';
import { commentSchemaModel as FacebookComment, postSchemaModel as FacebookPost } from '@reactor-room/plusmar-model-mongo-lib';

import axios from 'axios';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import { getPageByID } from '../pages/pages.data';

export async function updatePost(client: Pool, environment: IEnvironment, postID: string, pageID: number): Promise<IPost> {
  const exists = await getPostByID(postID, pageID);
  return await findOneAndUpdatePost(client, environment, exists?.postID, pageID);
}

export async function createOrUpdatePost(client: Pool, environment: IEnvironment, postData: IPostInput, pageID: number): Promise<IPost> {
  const exists = await getPostByID(postData?.postID, pageID);

  if (exists) {
    return await findOneAndUpdatePost(client, environment, exists?.postID, pageID);
  }

  const payload = await getPostByIDFromFacebook(client, environment, postData?.postID, pageID);
  const postInput: IPostInput = { ...postData, payload: JSON.stringify(payload), createdAt: payload?.created_time };
  return await new FacebookPost(postInput).save();
}

export async function findOneAndUpdatePost(client: Pool, environment: IEnvironment, ID: string, pageID: number): Promise<IPost> {
  try {
    const payload = await getPostByIDFromFacebook(client, environment, ID, pageID);
    if (isEmpty(payload)) return null;
    const { message, story } = payload;

    const result = await FacebookPost.findOneAndUpdate(
      { postID: ID },
      {
        $set: {
          message: message || story,
          payload: payload,
        },
      },
      {
        new: true,
      },
    )
      .lean()
      .exec();
    return result;
  } catch (err) {
    console.log('update post err', err);
    throw new Error(err);
  }
}

export async function getPosts(pageID: number, audienceID: number): Promise<IPost[]> {
  const comments = await FacebookComment.find({ audienceID: audienceID, pageID: pageID }).select('postID').lean().exec();
  const postIDs = comments.map((comment: IComment) => comment.postID);

  const result = await FacebookPost.find({
    _id: {
      $in: postIDs,
    },
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return result;
}

export async function getPostByID(ID: string, pageID: number): Promise<IPost> {
  const result = await FacebookPost.findOne({ postID: ID, pageID: String(pageID) })
    .lean()
    .exec();
  return result;
}

export async function getPostByIDFromFacebook(client: Pool, environment: IEnvironment, ID: string, pageID: number): Promise<IPostFacebookResponse> {
  try {
    // TODO : Have to take a look to this function //ATOM;
    const page = await getPageByID(client, pageID);
    const accessToken = cryptoDecode(page.option.access_token, environment.pageKey);
    // full_picture incase post only have 1 image
    // attachments{subattachments} incase post have more than 1 image
    const fields = ['created_time', 'message', 'child_attachments', 'attachments{subattachments}', 'full_picture'].join(',');
    const url = `https://graph.facebook.com/v8.0/${ID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    console.log(`[Facebook Post] Fetch API ${data.id}`);
    return data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

export async function getFacebookPost(token: string, environment: IEnvironment, postID: string): Promise<IPostFacebookResponse> {
  try {
    const accessToken = cryptoDecode(token, environment.pageKey);
    // full_picture incase post only have 1 image
    // attachments{subattachments} incase post have more than 1 image
    const fields = ['created_time', 'message', 'child_attachments', 'attachments{subattachments}', 'full_picture'].join(',');
    const url = `https://graph.facebook.com/v8.0/${postID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    console.log(`[Facebook Post] Fetch API ${data.id}`);
    return data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

export async function updateFacebookPost(postID: string, pageID: number, postPayload: IPostFacebookResponse): Promise<IPost> {
  try {
    const { message, story } = postPayload;
    const result = await FacebookPost.findOneAndUpdate(
      { postID, pageID: String(pageID) },
      {
        $set: {
          message: message || story,
          payload: postPayload,
        },
      },
      {
        new: true,
      },
    )
      .lean()
      .exec();
    return result;
  } catch (err) {
    console.log('update post err', err);
    throw new Error(err);
  }
}
