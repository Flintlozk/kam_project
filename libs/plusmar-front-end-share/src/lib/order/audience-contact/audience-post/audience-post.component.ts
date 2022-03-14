import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/order/animation';
import { AudienceContactComponent } from '@reactor-room/plusmar-front-end-share/order/audience-contact/audience-contact.component';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { DisplayImageComponent } from '@reactor-room/plusmar-front-end-share/components/display-image/display-image.component';
import { CommentService } from '@reactor-room/plusmar-front-end-share/services/facebook/comment/comment.service';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { PostService } from '@reactor-room/plusmar-front-end-share/services/facebook/post/post.service';
import { PageMemberService } from '@reactor-room/plusmar-front-end-share/services/settings/page-member.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  AudienceViewType,
  IAudience,
  IAudienceWithCustomer,
  IComment,
  IMessageModel,
  IPages,
  IPost,
  IThread,
  IUserContext,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-audience-post',
  templateUrl: './audience-post.component.html',
  styleUrls: ['./audience-post.component.scss'],
  animations: [slideInOutAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class AudiencePostComponent implements OnInit, OnDestroy {
  originRoute: AudienceViewType;
  destroy$: Subject<boolean> = new Subject<boolean>();
  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  childRouteResolver$ = this.route.data as Observable<AudienceChatResolver>;
  audienceID: number;
  audience$: IAudienceWithCustomer;

  readMoreAppearance = false;
  descriptionContentStatus = false;

  changePost: Subject<string> = new Subject<string>();
  sentBy = MessageSentByEnum;
  thread$: IThread = null;
  messages$: Observable<IMessageModel[]>;
  page$: IPages;
  currentStep$: Observable<IAudience>;

  getPostSubscription$: Subscription;

  postsSubscription: Subscription;
  posts$: IPost[];
  postLists$: IPost[];
  defaultPost: string;

  selectedPost: IPost;
  customerServiceMenu = false;
  userContext$: Observable<IUserContext> = this.userService.$userContext;
  pageUsersCount: number;
  @ViewChild('description') description: ElementRef;

  listenToContextExpire: Subject<boolean> = new Subject<boolean>();
  isReloadContent = false;

  isExpand = false;
  constructor(
    private pageService: PagesService,
    private commentService: CommentService,
    private postService: PostService,
    private route: ActivatedRoute,
    private chatboxService: ChatboxService,
    private userService: UserService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private pageMemberService: PageMemberService,
    @Inject(AudienceContactComponent) private _audienceContactComponent: AudienceContactComponent,
  ) {}

  onDescriptionDomChange(event: Event): void {
    this.showReadMore(event.target as HTMLElement);
  }

  setPostHeight(): void {
    if (this.description) {
      this.showReadMore(this.description.nativeElement as HTMLElement);
    }
  }

  showReadMore(element: HTMLElement): void {
    if (element.offsetHeight < 200) this.readMoreAppearance = false;
    else this.readMoreAppearance = true;
  }

  toggleExpand(): void {
    this.isExpand = !this.isExpand;
  }
  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.destroy$.subscribe();

    this.onImageExpiredHandler();
    this.getPageUsers();

    this.parentRouteResolver$.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.handleData(val as AudienceChatResolver);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    if (this.getPostSubscription$) this.getPostSubscription$.unsubscribe();
  }

  getPostSubscription(): void {
    this.getPostSubscription$ = this.postService
      .getPostSubscription(this.audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.posts$.length) {
          this.postService
            .getPosts(this.audienceID)
            .pipe(takeUntil(this.destroy$))
            .subscribe((posts) => {
              this.posts$ = posts;
            });
        } else {
          this.getPosts().pipe(takeUntil(this.destroy$)).subscribe();
        }
      });
  }

  toggleDescriptionContent(): void {
    this.descriptionContentStatus = !this.descriptionContentStatus;
  }

  getLatestComment(): Observable<IComment> {
    return this.commentService.getLatestComment(this.audienceID).pipe(takeUntil(this.destroy$));
  }

  getCurrentPage(): Observable<IPages> {
    const pageIndex = Number(getCookie('page_index'));
    return this.pageService.getPages().pipe(
      takeUntil(this.destroy$),
      switchMap((pages) => of(pages[pageIndex])),
    );
  }

  handleData({ audience, route }: AudienceChatResolver): void {
    this.originRoute = route;
    this.audience$ = audience;
    this.audienceID = this.audience$?.id;
    this.selectedPost = null;
    this.changePost.next('');
    this.getPostSubscription();

    forkJoin([this.getPagesDetail(), this.getPosts()]).pipe(takeUntil(this.destroy$)).subscribe();
  }

  getPagesDetail(): Observable<IPages> {
    return this.getCurrentPage().pipe(
      takeUntil(this.destroy$),
      take(1),
      tap((page) => {
        this.page$ = page;
      }),
    );
  }

  getPosts(bSwitchPost = true): Observable<IComment> {
    return this.postService.getPosts(this.audienceID).pipe(
      takeUntil(this.destroy$),
      switchMap((posts) => {
        this.posts$ = posts;

        if (posts.length > 0) {
          return this.getLatestComment().pipe(
            takeUntil(this.destroy$),
            tap((latestComment) => {
              if (latestComment) {
                this.selectedPost = this.posts$.find((val) => val._id === latestComment.postID);
                this.defaultPost = latestComment.postID;
              } else {
                this.selectedPost = this.posts$[this.posts$.length - 1];
                this.defaultPost = this.selectedPost._id;
              }
            }),
            tap(() => {
              if (bSwitchPost) this.changePost.next(this.selectedPost._id);
            }),
          );
        } else {
          if (bSwitchPost) this.changePost.next('');
          return of({} as IComment);
        }
      }),
    );
  }

  getPageUsers(): void {
    this.pageMemberService
      .getPageMembersAmountByPageID()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.pageUsersCount = result.amount_of_users));
  }

  onChangePost(event: any): void {
    this.isExpand = false;
    this.setPostHeight();
    this.selectedPost = this.posts$.find((post) => post._id === event.value);
    this.changePost.next(this.selectedPost._id);
    setTimeout(() => {
      this.setPostHeight(); // wait for dom render
    }, 1);
  }

  toggleCustomerService(): void {
    this.customerServiceMenu = !this.customerServiceMenu;
  }

  clickOutsideCustomerServiceEvent(event: boolean): void {
    if (event) this.customerServiceMenu = false;
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

  getParentComponent(): AudienceContactComponent {
    return this._audienceContactComponent;
  }

  postAttachmentExpired(event: Event) {
    const soruce = (<HTMLImageElement>event.target).currentSrc;
    this.listenToContextExpire.next(true);
  }

  onImageExpiredHandler() {
    this.listenToContextExpire.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      this.isReloadContent = true;

      this.postService
        .updatePostByID(this.selectedPost.postID)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (postContent) => {
            this.selectedPost = postContent;
            this.isReloadContent = false;
          },
          () => {
            this.isReloadContent = false;
          },
        );
    });
  }
}
