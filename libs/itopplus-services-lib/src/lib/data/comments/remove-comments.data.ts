import { RemoveFacebookCommentResponse } from '@reactor-room/model-lib';
import { ICommentRemoveInput } from '@reactor-room/itopplus-model-lib';
import { commentSchemaModel as FacebookComment } from '@reactor-room/plusmar-model-mongo-lib';

import axios from 'axios';

export async function deleteByCommentID(ID: string): Promise<boolean> {
  const { ok } = await FacebookComment.deleteOne({ commentID: ID }).lean().exec();
  return Boolean(ok);
}
export async function deleteManyByCommentIDs(IDs: string[]): Promise<boolean> {
  const { ok } = await FacebookComment.deleteMany({
    _id: {
      $in: IDs,
    },
  })
    .lean()
    .exec();
  return Boolean(ok);
}

export async function removeComment({ commentID }: ICommentRemoveInput, accessToken: string): Promise<RemoveFacebookCommentResponse> {
  try {
    const { data } = await axios.delete(`https://graph.facebook.com/v8.0/${commentID}?access_token=${accessToken}`);
    return data;
  } catch (err) {
    console.log('removeComment: ', err.response.headers['www-authenticate']);
    return err;
  }
}
export async function hideComment({ commentID }: ICommentRemoveInput, accessToken: string): Promise<RemoveFacebookCommentResponse> {
  try {
    const { data } = await axios.post(`https://graph.facebook.com/v8.0/${commentID}?access_token=${accessToken}`, { is_hidden: true });
    return data;
  } catch (err) {
    console.log('hideComment: ', err.response.headers['www-authenticate']);
    return err;
  }
}
export async function unHideComment({ commentID }: ICommentRemoveInput, accessToken: string): Promise<RemoveFacebookCommentResponse> {
  try {
    const { data } = await axios.post(`https://graph.facebook.com/v8.0/${commentID}?access_token=${accessToken}`, { is_hidden: false });
    return data;
  } catch (err) {
    console.log('unhideComment: ', err.response.headers['www-authenticate']);
    return err;
  }
}
