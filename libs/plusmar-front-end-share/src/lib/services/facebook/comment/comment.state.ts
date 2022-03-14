import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IComment, ICommentSubscription } from '@reactor-room/itopplus-model-lib';

@Injectable({
  providedIn: 'root',
})
export class CommentState {
  private comments$ = new Subject<IComment[]>();
  private comment$ = new Subject<ICommentSubscription>();

  public waitingChange$ = new Subject();
  public waitingDeleted$ = new Subject();
  public waitingHidden$ = new Subject();

  public targetCommentID: string;
  public targetEditCommentID: string;
  public targetRemoveCommentID: string;
  public targetHideCommentID: string;

  constructor() {}

  getComments() {
    return this.comments$.asObservable();
  }
  getUpdateComment() {
    return this.comment$.asObservable();
  }

  setComments(comments: IComment[]) {
    this.comments$.next(comments);
  }

  addCommentToParent(comment: ICommentSubscription) {
    this.comment$.next(comment);
  }

  getParentIDFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.parent_id;
  };

  replyToComment(commentID: string) {
    this.targetCommentID = commentID;
  }

  editComment(commentID: string) {
    this.targetEditCommentID = commentID;
  }

  removeComment(commentID: string) {
    this.targetRemoveCommentID = commentID;
  }
  hideComment(commentID: string) {
    this.targetHideCommentID = commentID;
  }

  commentReplied() {
    this.waitingChange$.next(null);
    this.waitingChange$.complete();
  }
  commentDeleted() {
    this.waitingDeleted$.next(null);
    this.waitingDeleted$.complete();
  }
  commentHidHidden() {
    this.waitingHidden$.next(null);
    this.waitingHidden$.complete();
  }
}
