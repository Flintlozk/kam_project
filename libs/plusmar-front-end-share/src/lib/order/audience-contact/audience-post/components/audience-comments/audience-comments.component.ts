import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { TemplatesComponent } from '@reactor-room/plusmar-front-end-share/components/chatbox/templates/templates.component';
import { TemplatesService } from '@reactor-room/plusmar-front-end-share/components/chatbox/templates/templates.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { CommentService } from '@reactor-room/plusmar-front-end-share/services/facebook/comment/comment.service';
import { CommentState } from '@reactor-room/plusmar-front-end-share/services/facebook/comment/comment.state';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import {
  CommentSentByEnum,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceWithCustomer,
  IComment,
  ICommentReplyInput,
  ICommentSubscription,
  ICommentSubscriptionMethod,
  IPages,
  IPost,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AudiencePostComponent } from '../../audience-post.component';
import { DisplayImageComponent } from '@reactor-room/plusmar-front-end-share/components/display-image/display-image.component';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/order/animation';

@Component({
  selector: 'reactor-room-audience-comments',
  templateUrl: './audience-comments.component.html',
  styleUrls: ['./audience-comments.component.scss'],
  animations: [slideInOutAnimation],
})
export class AudienceCommentsComponent implements OnInit, OnDestroy {
  // @HostListener(){}
  @Input() audience$: IAudienceWithCustomer;
  @Input() page$: IPages;
  @Input() selectedPost: IPost;
  @Input() pageUsersCount: number;
  destroy$: Subject<boolean> = new Subject<boolean>();

  comments$: Observable<IComment[]>;
  commentsSubscription$: Subscription;

  comment$: Observable<IComment>;
  commentSubscription$: Subscription;
  public comments: IComment[];

  replyCommentID: string;
  replyText: string;

  editReplyText: string;
  commentEdit: string;
  menuEdit: string;
  allowChange = true as boolean;
  userSender: {
    user_id: number;
    user_name: string;
  };
  @Input() changePost: Subject<string> = new Subject<string>();
  @ViewChild('replyInput') replyInput: ElementRef;
  @ViewChild('replyFailed') replyFailed: ElementRef;
  @ViewChild('replyTools') replyTools: ElementRef;
  @ViewChild('editCommentInput') editCommentInput: ElementRef;

  constructor(
    public translate: TranslateService,
    private dialogService: DialogService,
    private templateService: TemplatesService,
    private dialog: MatDialog,
    private commentService: CommentService,
    private commentState: CommentState,
    private userService: UserService,
    private chatService: ChatboxService,
    @Inject(AudiencePostComponent) private _audiencePostComponent: AudiencePostComponent, // private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.getChangedPost();
    this.getUser();
  }

  getChangedPost(): void {
    this.changePost.pipe(takeUntil(this.destroy$)).subscribe((postID: string) => {
      this.comments = null;
      if (postID !== '') {
        if (this.commentSubscription$) {
          this.commentSubscription$.unsubscribe();
        }
        this.getAllCommentsOfPost(postID);
        this.getCommentsSubscription(postID);
      }
    });

    this.getComments();
    this.getUpdatedComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    if (this.commentsSubscription$) this.commentsSubscription$.unsubscribe();
    if (this.commentSubscription$) this.commentSubscription$.unsubscribe();
  }

  getUser(): void {
    this.userService.$userContext.subscribe(({ id: user_id, name: user_name }) => {
      this.userSender = {
        user_id,
        user_name,
      };
    });
  }

  getComments(): void {
    this.comments$ = this.commentState.getComments();
    this.commentsSubscription$ = this.comments$.pipe(takeUntil(this.destroy$)).subscribe((comments) => {
      this.comments = deepCopy(comments);
      const getLatestComment = this.comments[0];
      this.chatService.latestComment.next(getLatestComment);
    });
  }

  getUpdatedComments(): void {
    this.comment$ = this.commentState.getUpdateComment();
    this.comment$.pipe(takeUntil(this.destroy$)).subscribe((comment: ICommentSubscription) => {
      switch (comment.method) {
        case ICommentSubscriptionMethod.ADD:
          this.onUpdateAddMethod(comment);
          break;
        case ICommentSubscriptionMethod.EDIT:
          this.onUpdateEditMethod(comment);
          break;
        case ICommentSubscriptionMethod.DELETE:
          this.onUpdateDeleteMethod(comment);
          break;
        case ICommentSubscriptionMethod.HIDE:
          this.onUpdateHideMethod(comment, true);
          break;
        case ICommentSubscriptionMethod.UNHIDE:
          this.onUpdateHideMethod(comment, false);
          break;
        default:
          break;
      }
    });
  }

  onUpdateHideMethod(comment: ICommentSubscription, isHidden: boolean): void {
    const parentID = this.commentState.getParentIDFromComment(JSON.parse(comment.payload));

    this.onCommentHidHidden();
    this.comments.map((refComment: IComment) => {
      if (refComment.commentID === parentID) {
        refComment.replies.map((refReply) => {
          if (comment.commentID === refReply.commentID) {
            refReply.hidden = isHidden;
            this.onCommentHidHidden();
          }
        });
      } else if (refComment.commentID === comment.commentID) {
        refComment.hidden = isHidden;
        this.onCommentHidHidden();
      }
      return refComment;
    });
  }

  onUpdateAddMethod(comment: ICommentSubscription): void {
    const parentID = this.commentState.getParentIDFromComment(JSON.parse(comment.payload));

    let isChild = false;
    this.comments.map((refComment: IComment) => {
      if (refComment.commentID === parentID) {
        isChild = true;
        if (!refComment.replies) refComment.replies = [];
        refComment.replies.unshift(comment);
        refComment.replies.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      }
      return refComment;
    });
    if (!isChild) this.comments.unshift(comment);

    if (parentID === this.commentState.targetCommentID) {
      this.onCommentReplied();
    }
  }

  onUpdateEditMethod(comment: ICommentSubscription): void {
    const parentID = this.commentState.getParentIDFromComment(JSON.parse(comment.payload));
    this.comments.map((refComment: IComment) => {
      if (refComment.commentID === parentID) {
        refComment.replies.map((refReply) => {
          if (comment.commentID === refReply.commentID) {
            refReply.text = comment.text;
            if (comment.commentID === this.commentState.targetEditCommentID) this.onCommentEditReplied();
          }
        });
      } else if (refComment.commentID === comment.commentID) refComment.text = comment.text;
      return refComment;
    });
  }

  onUpdateDeleteMethod(comment: ICommentSubscription): void {
    const parentID = this.commentState.getParentIDFromComment(JSON.parse(comment.payload));

    this.comments.map((refComment: IComment) => {
      if (refComment.commentID === parentID) {
        refComment.replies.map((refReply) => {
          if (comment.commentID === refReply.commentID) {
            refReply.deleted = true;
            this.onCommentDeleted();
          }
        });
      } else if (refComment.commentID === comment.commentID) {
        refComment.deleted = true;
        this.onCommentDeleted();
      }
      return refComment;
    });
  }

  getAllCommentsOfPost(postID: string): void {
    this.commentService
      .getCommentsByPostID(this.audience$.id, postID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.commentState.setComments(comments);
        },
        error: (err) => {
          console.log('Comments Failed to Load 1 err ::::::::::>>> ', err);
          alert('Comments Failed to Load');
        },
      });
  }

  getCommentsSubscription(postID: string): void {
    this.commentSubscription$ = this.commentService
      .getCommentsByPostIDSubscription(this.audience$.id, postID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment: ICommentSubscription) => {
          this.commentState.addCommentToParent(comment);
        },
        error: (err) => {
          console.log('Comments Failed to Load 2 err ::::::::::>>> ', err);
          alert('Comments Failed to Load');
        },
      });
  }

  formatComments(key: string, total: any): string {
    let replyCount = 0;
    const newTotal = total
      ?.map((comment: { audienceID: number; replies: any[]; sentBy: CommentSentByEnum }) => {
        if (comment?.replies && comment?.replies?.length) {
          const rep = comment?.replies.filter((item) => item.sentBy === 'AUDIENCE' && item.audienceID === this.audience$.id);
          replyCount += rep.length;
        }
        if (comment.audienceID === this.audience$.id && comment.sentBy === 'AUDIENCE') {
          return comment;
        }
      })
      .filter((x) => x != null);

    return this.formatTotal(key, newTotal.length + replyCount);
  }

  formatTotal(key: string, total: any): string {
    return `${key} (${Array.isArray(total) ? total?.length : total})`;
  }

  formatPosts(key: string, total: any): string {
    return this.formatTotal(key, total);
  }

  /* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* *REPLY* */
  toggleReply(comment: IComment): void {
    if (this.allowChange) {
      this.menuEdit = '';
      this.replyText = '';
      this.replyCommentID = comment._id;
      setTimeout(() => {
        this.replyInput.nativeElement.focus();
      }, 1);
    }
  }

  togglePrivateMessage(comment: IComment): void {
    this._audiencePostComponent.getParentComponent().openPrivateMessage(comment);
  }

  enabledReplyInput(commentID: string): boolean {
    if (this.replyCommentID === commentID) return true;
    return false;
  }

  replyComment(event: KeyboardEvent, comment: IComment, textarea: HTMLElement): void {
    textarea.style.cssText = 'height:auto; padding:0';
    textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';

    if (event.key === 'Escape') {
      this.replyText = '';
      this.replyCommentID = '';
    }

    const payload: ICommentReplyInput = {
      commentID: comment.commentID,
      text: this.replyText.trim(),
      sender: this.userSender,
      audienceID: this.audience$.id,
    };

    if (event.key === 'Enter' && payload.text !== '') {
      this.allowChange = false;
      this.replyInput.nativeElement.disabled = true;
      this.sendReply(payload, comment);
    }
  }

  resendReply(comment: IComment): void {
    const payload: ICommentReplyInput = {
      commentID: comment.commentID,
      text: this.replyText.trim(),
      sender: this.userSender,
      audienceID: this.audience$.id,
    };

    this.allowChange = false;
    this.replyInput.nativeElement.disabled = true;
    this.sendReply(payload, comment);
  }

  sendReply(payload: ICommentReplyInput, comment: IComment): void {
    this.commentService
      .replyToComment(payload)
      .pipe(takeUntil(this.commentState.waitingChange$))
      .subscribe(
        (response) => {
          this.commentState.replyToComment(comment.commentID);
        },
        (error) => {
          this.replyInput.nativeElement.disabled = false;
          this.allowChange = true;
          this.replyInput.nativeElement.focus();
          this.replyFailed.nativeElement.style.display = 'block';
          this.replyTools.nativeElement.style.display = 'none';
        },
      );
  }

  onCommentReplied(): void {
    this.commentState.commentReplied();
    if (this.replyInput) this.replyInput.nativeElement.disabled = false;
    this.replyText = '';
    this.replyCommentID = '';
    this.allowChange = true;
  }

  /* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* *HIDE* */
  hideComment(comment: IComment): void {
    const text = this.translate.instant('Please confirm hiding comment');
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.allowChange = false;
        this.menuEdit = '';
        this.commentService
          .hideComment({
            commentID: comment.commentID,
          })
          .pipe(takeUntil(this.commentState.waitingHidden$))
          .subscribe(
            () => {
              comment.hidden = true;
              this.commentState.hideComment(comment.commentID);
            },
            () => {
              this.allowChange = true;
            },
          );
      }
    });
  }
  unhideComment(comment: IComment): void {
    const text = this.translate.instant('Please confirm unhiding comment');
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.allowChange = false;
        this.menuEdit = '';
        this.commentService
          .unhideComment({
            commentID: comment.commentID,
          })
          .pipe(takeUntil(this.commentState.waitingHidden$))
          .subscribe(
            () => {
              comment.hidden = false;
              this.commentState.hideComment(comment.commentID);
            },
            () => {
              this.allowChange = true;
            },
          );
      }
    });
  }

  onCommentHidHidden(): void {
    this.commentState.commentHidHidden();
    this.allowChange = true;
  }

  /* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE* *REMOVE*  */
  removeComment(comment: IComment): void {
    const text = this.translate.instant('Please confirm removing comment');
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.allowChange = false;
        this.menuEdit = '';
        this.commentService
          .removeComment({
            commentID: comment.commentID,
          })
          .pipe(takeUntil(this.commentState.waitingDeleted$))
          .subscribe(
            () => {
              this.commentState.removeComment(comment.commentID);
            },
            () => {
              this.allowChange = true;
            },
          );
      }
    });
  }

  onCommentDeleted(): void {
    this.commentState.commentDeleted();
    this.allowChange = true;
  }

  /* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* *EDIT* */
  editComment(event: KeyboardEvent, comment: IComment, textarea: HTMLElement): void {
    textarea.style.cssText = 'height:auto; padding:0';
    textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
    if (event.key === 'Escape') {
      this.editReplyText = '';
      this.commentEdit = '';
    }

    const payload: ICommentReplyInput = {
      commentID: comment.commentID,
      text: this.editReplyText.trim(),
      sender: this.userSender,
      audienceID: this.audience$.id,
    };

    if (event.key === 'Enter' && payload.text !== '') {
      this.allowChange = false;
      this.editCommentInput.nativeElement.disabled = true;
      this.commentService
        .editComment(payload)
        .pipe(takeUntil(this.commentState.waitingChange$))
        .subscribe(
          () => {
            this.commentState.editComment(comment.commentID);
          },
          () => {
            this.editCommentInput.nativeElement.disabled = false;
            this.allowChange = true;
          },
        );
    }
  }

  onCommentEditReplied(): void {
    this.commentState.commentReplied();
    if (this.editCommentInput) this.editCommentInput.nativeElement.disabled = false;
    this.editReplyText = '';
    this.commentEdit = '';
    this.allowChange = true;
  }

  toggleEditComment(reply: IComment): void {
    if (this.allowChange) {
      this.menuEdit = '';
      this.editReplyText = reply.text;
      this.commentEdit = reply._id;

      setTimeout(() => {
        this.editCommentInput.nativeElement.focus();
      }, 1);
    }
  }

  editInputText(commentID: string): boolean {
    if (this.commentEdit === commentID) return true;
    return false;
  }

  toggleMenuEditor(commentID: string): void {
    if (this.allowChange) {
      if (this.menuEdit === commentID) this.menuEdit = '';
      else this.menuEdit = commentID;
    }
  }

  clearMenuEditor(): void {
    this.menuEdit = '';
  }
  displayMenuEditor(commentID: string): boolean {
    if (this.menuEdit === commentID) return true;
    return false;
  }

  openPresetsDialog(isEdit: boolean): void {
    const dialogRef = this.dialog.open(TemplatesComponent, {
      // width: '70%',
      data: {
        feature: {
          message: true,
          form: false,
          social: true,
        },
        type: 'COMMENT',
      },
    });

    this.templateService.returnMessageToComment.subscribe((val: string) => {
      if (isEdit) {
        this.editReplyText = this.editReplyText + val;
      } else {
        this.replyText = this.replyText + val;
      }
      dialogRef.close();
    });
  }
  zoomIn(url: string, type: string): void {
    this.dialog.open(DisplayImageComponent, {
      width: '100%',
      data: {
        url,
        type,
      },
    });
  }
}
