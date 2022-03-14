import { Injectable, OnDestroy } from '@angular/core';
import { IComment, ICommentHideInput, ICommentRemoveInput, ICommentReplyInput, ICommentSubscription } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  COMMENT_RECEIVED,
  EDIT_COMMENT,
  GET_ACTIVE_COMMENT_ON_PRIVATE_MESSAGE,
  GET_COMMENTS,
  GET_COMMENTS_BY_POST_ID,
  GET_LATEST_COMMENT,
  HIDE_COMMENT,
  REMOVE_COMMENT,
  REPLY_TO_COMMENT,
  UN_HIDE_COMMENT,
} from './comment.query';

@Injectable({
  providedIn: 'root',
})
export class CommentService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getComments(audienceID: number): Observable<IComment[]> {
    return this.apollo
      .query({
        query: GET_COMMENTS,
        fetchPolicy: 'no-cache',
        variables: { audienceID: audienceID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getComments']),
      );
  }

  getLatestComment(audienceID: number): Observable<IComment> {
    return this.apollo
      .query({
        query: GET_LATEST_COMMENT,
        fetchPolicy: 'no-cache',
        variables: { audienceID: audienceID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLatestComment']),
      );
  }
  getActiveCommentOnPrivateMessage(audienceID: number): Observable<IComment[]> {
    return this.apollo
      .query({
        query: GET_ACTIVE_COMMENT_ON_PRIVATE_MESSAGE,
        fetchPolicy: 'no-cache',
        variables: { audienceID: audienceID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getActiveCommentOnPrivateMessage']),
      );
  }

  getCommentsByPostID(audienceID: number, postID: string): Observable<IComment[]> {
    return this.apollo
      .query({
        query: GET_COMMENTS_BY_POST_ID,
        variables: { audienceID: Number(audienceID), postID: postID },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getCommentsByPostID']),
      );
  }

  getCommentsByPostIDSubscription(audienceID: number, postID: string): Observable<ICommentSubscription> {
    return this.apollo
      .subscribe({
        query: COMMENT_RECEIVED,
        fetchPolicy: 'no-cache',
        variables: { audienceID: Number(audienceID), postID: postID },
      })
      .pipe(map((x) => x.data['commentReceived']));
  }

  replyToComment(reply: ICommentReplyInput): Observable<IComment> {
    return this.apollo
      .mutate({
        mutation: REPLY_TO_COMMENT,
        variables: { reply: reply },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['replyToComment']),
      );
  }

  editComment(comment: ICommentReplyInput): Observable<IComment> {
    return this.apollo
      .mutate({
        mutation: EDIT_COMMENT,
        variables: { comment: comment },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['editComment']),
      );
  }

  removeComment(comment: ICommentRemoveInput): Observable<IComment> {
    return this.apollo
      .mutate({
        mutation: REMOVE_COMMENT,
        variables: { comment },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['removeComment']),
      );
  }
  hideComment(comment: ICommentHideInput): Observable<IComment> {
    return this.apollo
      .mutate({
        mutation: HIDE_COMMENT,
        variables: { comment },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['hideComment']),
      );
  }
  unhideComment(comment: ICommentHideInput): Observable<IComment> {
    return this.apollo
      .mutate({
        mutation: UN_HIDE_COMMENT,
        variables: { comment },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['unHideComment']),
      );
  }
}
