import { Injectable, OnDestroy } from '@angular/core';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { IPost, IPostSubscription } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_ALL_POSTS, GET_POST_BY_ID, POST_RECEIVED, UPDATE_POST_BY_ID } from './post.query';

@Injectable({
  providedIn: 'root',
})
export class PostService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getPosts(audienceID: number): Observable<IPost[]> {
    return this.apollo
      .query({
        query: GET_ALL_POSTS,
        variables: {
          audienceID: audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPosts']),
        map((posts: IPost[]) => this.parseJSON(posts)),
      );
  }

  updatePostByID(postID: string): Observable<IPost> {
    return this.apollo
      .query({
        query: UPDATE_POST_BY_ID,
        variables: {
          postID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePostByID']),
        // map((posts: IPost) => this.parseJSON(posts)),
      );
  }

  parseJSON(posts: IPost[]): IPost[] {
    posts = deepCopy(posts);
    return posts.map((post: IPost) => {
      if (post.hasOwnProperty('payload')) {
        try {
          post.payload = JSON.parse(String(post?.payload));
          return post;
        } catch (err) {
          return post;
        }
      }
    });
  }

  getPostByID(ID: string): Observable<IPost> {
    return this.apollo
      .query({
        query: GET_POST_BY_ID,
        variables: { ID: ID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPostByID']),
      );
  }

  getPostSubscription(audienceID: number): Observable<IPostSubscription> {
    return this.apollo
      .subscribe({
        query: POST_RECEIVED,
        fetchPolicy: 'no-cache',
        variables: { audienceID: Number(audienceID) },
      })
      .pipe(map((x) => x.data['postReceived']));
  }
}
