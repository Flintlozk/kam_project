import { IPost, IPostFacebookResponse, IPostInput } from '@reactor-room/itopplus-model-lib';
import { createOrUpdatePost, getFacebookPost, getPostByID, getPostByIDFromFacebook, getPosts, updateFacebookPost, updatePost } from '../../data/post';
import { PlusmarService } from '../plusmarservice.class';

export class PostService {
  getPosts = async (pageID: number, audienceID: number): Promise<IPost[]> => {
    const posts = await getPosts(pageID, audienceID);
    try {
      posts.forEach((post) => {
        if (typeof post.payload === 'string') post.payload = JSON.parse(post.payload as string);
      });
    } catch {
      return [] as IPost[];
    }
    return posts;
  };

  getPostByID = async (ID: string, pageID: number): Promise<IPost> => {
    return await getPostByID(ID, pageID);
  };
  getPostByIDFromFacebook = async (ID: string, pageID: number): Promise<IPostFacebookResponse> => {
    return await getPostByIDFromFacebook(PlusmarService.readerClient, PlusmarService.environment, ID, pageID);
  };

  createOrUpdatePost = async (post: IPostInput, pageID: number): Promise<IPost> => {
    return await createOrUpdatePost(PlusmarService.readerClient, PlusmarService.environment, post, pageID);
  };

  updateEdittedPost = async (postID: string, pageID: number): Promise<IPost> => {
    return await updatePost(PlusmarService.readerClient, PlusmarService.environment, postID, pageID);
  };

  updatePostByID = async (postID: string, pageID: number, fbToken: string): Promise<IPost> => {
    const postPayload = await getFacebookPost(fbToken, PlusmarService.environment, postID);
    return await updateFacebookPost(postID, pageID, postPayload);
  };
}
