import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/order/animation';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { ResourceValidationService } from '@reactor-room/plusmar-front-end-share/services/resource-validation/resource-validation.service';
import { PageMemberService } from '@reactor-room/plusmar-front-end-share/services/settings/page-member.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceUpdateOperation,
  AudienceViewType,
  ChatboxView,
  EnumResourceValidation,
  EnumSubscriptionFeatureType,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceWithCustomer,
  IPagesContext,
  IPurchaseOrder,
  ISubscriptionLimitAndDetails,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, zip } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { CloseReasonDialogService } from '@reactor-room/plusmar-front-end-share/services/close-reason-dialog.service';

@Component({
  selector: 'reactor-room-audience-action',
  templateUrl: './audience-action.component.html',
  styleUrls: ['./audience-action.component.scss'],
  animations: [slideInOutAnimation],
})
export class AudienceActionComponent implements OnInit, OnChanges, OnDestroy {
  type: string;
  @Input() selector: string;
  destroy$ = new Subject<boolean>();
  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  routeResolver$ = this.route.data as Observable<AudienceChatResolver>;
  AudienceDomainStatus = AudienceDomainStatus;
  audience: IAudienceWithCustomer;
  addLead = false as boolean;
  audienceID: number;
  audience$: IAudienceWithCustomer;
  currentPage: IPagesContext;

  moveToMenu = false;
  redirectRoute: AudienceViewType;
  originRoute: AudienceViewType;
  routeName: string;

  chatViewMode: ChatboxView = ChatboxView.AUDIENCE;

  // latestComment: IComment;

  maximumOrders = 0;
  totalPO$: Observable<IPurchaseOrder[]>;
  buttonGroupStatus = false;
  user_id: number;
  pageUsersCount: number;
  chatBoxStatus = false;
  isSubscriptionBusiness = false;
  isSubscriptionFree: boolean;
  isContactFormSent = false;
  isLeadFormSubmitted: boolean;
  isProcessing = false;
  agentToken = '';
  EAudiencePlatformType = AudiencePlatformType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeService: RouteService,
    private userService: UserService,
    private audienceService: AudienceService,
    private audienceContactService: AudienceContactService,
    private dialogService: DialogService,
    private closeReasonDialogService: CloseReasonDialogService,
    private resourceValidationService: ResourceValidationService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
    private pageMembers: PageMemberService,
    private subscriptionService: SubscriptionService,
    private purchasingOrderService: PurchaseOrderService,
    private messageService: MessageService,
    private pagesService: PagesService,
    private chatboxService: ChatboxService,
    public layoutCommonService: LayoutCommonService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.triggerCommentChangeToInbox();
    this.triggerMoveToFollow();
    this.getSubscriptionLimitAndDetails();
    this.checkSubscriptionFeatureType();
    zip(this.parentRouteResolver$, this.routeResolver$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.handleData(Object.assign(...val) as AudienceChatResolver);
      });
    this.pagesService.currentPage$.subscribe((page) => {
      this.currentPage = page;
    });
    this.messageService.getLeadFormDialogListener$.pipe(tap((flag) => (this.isContactFormSent = flag))).subscribe();
    this.messageService.getIsLeadFormSubmitted$.pipe(tap((flag) => (this.isLeadFormSubmitted = flag))).subscribe();
  }

  getSubscriptionLimitAndDetails(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscriptionLimit: ISubscriptionLimitAndDetails) => {
      this.maximumOrders = subscriptionLimit.maximumOrders;
    });
  }
  checkSubscriptionFeatureType(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscriptionLimit) => {
      this.isSubscriptionBusiness = subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS;
      this.isSubscriptionFree = subscriptionLimit.featureType === EnumSubscriptionFeatureType.FREE;
      if (this.isSubscriptionFree) this.totalPO$ = this.purchasingOrderService.getAllPOInMonth();
    });
  }

  handleData({ audience, route, token }: AudienceChatResolver): void {
    this.agentToken = token;
    this.audience = audience;
    this.toggleLeadFormOnAudienceMoveToLead();

    if (audience.domain === AudienceDomainType.AUDIENCE) {
      this.routeName = 'Follow';
      if (audience.status === AudienceDomainStatus.FOLLOW) {
        this.redirectRoute = AudienceViewType.FOLLOW;
      } else {
        this.redirectRoute = AudienceViewType.MESSAGE;
      }
    } else {
      this.redirectRoute = route;
      this.routeName = route === AudienceViewType.FOLLOW ? 'Follow' : 'New Messages';
    }

    this.originRoute = route;
    this.audience$ = audience as IAudienceWithCustomer;
    this.audienceID = this.audience$?.id;
  }

  ngOnChanges(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onCancel(): void {
    this.audienceContactService
      .removeTokenFromAudienceContactList(this.audience.token, this.currentPage.pageId, false)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          console.log('success');
        },
        (err) => console.log('removeTokenFromAudienceContactList err ===> : ', err),
      );
    // void this.router.navigate(['/follows/list/all/1']);

    const routeHistory = this.routeService.routeHistory.getValue();
    if (routeHistory === '/') {
      this.routeService.routeHistory.next('/');
      void this.router.navigate(['/follows/list/all/1']);
    } else {
      void this.router.navigate([routeHistory]);
    }
  }

  toggleMoveTo(): void {
    this.moveToMenu = !this.moveToMenu;
  }

  clickOutsideToggleMoveToEvent(event: any): void {
    if (event) this.moveToMenu = false;
  }

  triggerMoveToFollow(): void {
    this.audienceContactService.triggerMoveToFollow.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showLoading(true);
      this.setAudienceAsFollow();
    });
  }
  triggerCommentChangeToInbox(): void {
    this.audienceContactService.triggerCommentChangeToInbox.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.audience.status = AudienceDomainStatus.INBOX;
      this.audienceContactService.triggerLatestUserChanges.next(null);
    });
  }

  redirectToFollows(): void {
    this.isProcessing = true;
    // this.layoutCommonService.toggleUILoader.next(this.isProcessing);
    this.showLoading(true);

    this.audienceService
      .updateAudienceStatus(this.audience$.psid, this.audience$.id, AudienceDomainType.AUDIENCE, AudienceDomainStatus.FOLLOW)
      .pipe(
        tap(() => {
          this.setAudienceAsFollow();
        }),
      )
      .subscribe();
  }

  setAudienceAsFollow(): void {
    this.chatboxService.deactivateMobileChatboxAction.next(true);

    this.isProcessing = false;
    this.showLoading(false);
    // this.layoutCommonService.toggleUILoader.next(this.isProcessing);

    if (this.audience.platform === this.EAudiencePlatformType.FACEBOOKFANPAGE) {
      this.toastr.success(
        this.audience$.first_name +
          ' ' +
          (this.audience$.last_name !== null ? this.audience$.last_name : '') +
          ' ' +
          (this.audience$.aliases !== null ? this.audience$.aliases : '') +
          ' has been moved to Follow',
        'Success',
      );
    } else if (this.audience.platform === this.EAudiencePlatformType.LINEOA) {
      this.toastr.success(this.audience$.first_name + ' ' + (this.audience$.aliases !== null ? this.audience$.aliases : '') + ' has been moved to Follow', 'Success');
    }

    this.redirectRoute = AudienceViewType.FOLLOW;
    this.routeName = 'Follow';
    this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience$.id, operation: AudienceUpdateOperation.UPDATE });
    this.audienceContactService.triggerLatestUserChanges.next(null);
  }

  validateIsOrderCreatable(): void {
    const text = this.translate.instant('ASK_MOVE_CUSTOMER_TO_ORDER');
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        const requestValidations: EnumResourceValidation[] = [EnumResourceValidation.VALIDATE_MAX_ORDERS];
        this.resourceValidationService
          .validateResources(requestValidations)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              void this.moveCustomerToFollowPipeline();
            },
            (err) => {
              this.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.isProcessing);

              console.log('err :::', err);
              if (err.message.indexOf('ORDER_REACHED_LIMIT') !== -1) {
                this.openSuccessDialog(
                  {
                    text:
                      this.translate.instant('Your package has a limit to create') +
                      this.maximumOrders +
                      this.translate.instant(' orders. You already reached the maiximum number of orders. For more information, please contact us at 02-029-1200.'),
                    title: this.translate.instant('Cannot add new order'),
                  },
                  true,
                );
              } else {
                this.openSuccessDialog({ text: this.translate.instant('Error create new order, try again later!'), title: 'Error' }, true);
              }
            },
          );
      }
    });
  }

  showLoading(toggle: boolean): void {
    this.layoutCommonService.toggleUILoader.next(toggle);
  }

  rejectAudience(): void {
    const text = this.translate.instant('Are you sure you want to remove this audience');
    this.dialogService.openDialog(text, GenericDialogMode.NOT_CUSTOMER, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.showLoading(true);
        this.audienceService.rejectAudience(this.audience$.psid, this.audienceID, this.redirectRoute).subscribe(
          () => {
            this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience$.id, operation: AudienceUpdateOperation.REMOVE });
            this.audience.status = AudienceDomainStatus.REJECT;
            this.chatboxService.deactivateMobileChatboxAction.next(true);
            this.showLoading(false);
          },
          (ex) => {
            this.showLoading(false);
            switch (ex.message) {
              case 'LEAD_FOLLOW_EXIST':
                this.toastr.error(this.translate.instant(ex.message), 'Error');
                break;
              default:
                this.toastr.error(ex.message, 'Error');
                break;
            }
          },
        );
      }
    });
  }

  closeFollowedAudience(): void {
    this.settingsService
      .getPageSetting(PageSettingType.CUSTOMER_CLOSED_REASON)
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config?.status) {
          this.closeReasonDialogService.openClosedAudienceReason(this.audience.id).subscribe((success) => {
            if (success) {
              this.initCloseAudience();
            }
          });
        } else {
          this.closeAudience();
        }
      });
  }

  closeAudience(): void {
    const text =
      this.redirectRoute === AudienceViewType.MESSAGE ? this.translate.instant('Are you sure you want to remove this audience ?') : this.translate.instant('Close this audience');
    this.dialogService.openDialog(text, GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.showLoading(true);
        this.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        this.initCloseAudience();
      }
    });
  }

  initCloseAudience(): void {
    this.showLoading(true);
    this.audienceService.closeAudience(this.audience$.psid, this.audienceID).subscribe(
      () => {
        this.showLoading(false);
        this.chatboxService.deactivateMobileChatboxAction.next(true);
        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);
        this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience$.id, operation: AudienceUpdateOperation.REMOVE });
        this.audience.status = AudienceDomainStatus.CLOSED;
        this.audienceContactService.triggerLatestUserChanges.next(null);
      },
      (ex) => {
        this.showLoading(false);
        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        switch (ex.message) {
          case 'LEAD_FOLLOW_EXIST':
            this.toastr.error(this.translate.instant(ex.message), 'Error');
            break;
          default:
            this.toastr.error(ex.message, 'Error');
            break;
        }
      },
    );
  }

  getUser(): void {
    this.userService.$userContext.subscribe(({ id: user_id }) => {
      this.user_id = user_id;
    });
  }

  getPageUsers(): void {
    this.pageMembers.getPageMembersAmountByPageID().subscribe((result) => (this.pageUsersCount = result.amount_of_users));
  }

  chatBoxStatusEvent(event: boolean): void {
    this.chatBoxStatus = event;
  }

  toggleLeadFormOnAudienceMoveToLead(): void {
    this.route.params
      .subscribe((r) => {
        if ('form' in r) {
          if (r.form === 'true') {
            this.addLead = true;
          }
        }
      })
      .unsubscribe();
  }

  moveCustomerToFollowPipeline(): void {
    this.showLoading(true);
    this.audienceService.moveAudienceDomain(this.audience$.id, AudienceDomainType.CUSTOMER).subscribe(
      () => {
        this.showLoading(false);
        if (isMobile()) {
          this.chatboxService.deactivateMobileChatboxAction.next(true);
        }

        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        if (this.audience.platform === this.EAudiencePlatformType.FACEBOOKFANPAGE) {
          this.toastr.success(
            this.audience.first_name +
              ' ' +
              (this.audience.last_name !== null ? this.audience.last_name : '') +
              ' ' +
              (this.audience.aliases !== null ? this.audience.aliases : '') +
              ' has moved to Order',
            'Success',
          );
        } else if (this.audience.platform === this.EAudiencePlatformType.LINEOA) {
          this.toastr.success(this.audience.first_name + ' ' + (this.audience.aliases !== null ? this.audience.aliases : '') + ' has moved to Order', 'Success');
        }

        this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience$.id, operation: AudienceUpdateOperation.UPDATE });
        this.audienceContactService.triggerLatestUserChanges.next(null);

        void this.router.navigate([`/follows/chat/${this.audienceID}/cart`]);
      },
      (err) => {
        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        switch (true) {
          case err.message.indexOf('ORDER_REACHED_LIMIT') !== -1:
            this.openSuccessDialog(
              {
                text:
                  this.translate.instant('Your package has a limit to create') +
                  this.maximumOrders +
                  this.translate.instant(' orders. You already reached the maiximum number of orders. For more information, please contact us at 02-029-1200.'),
                title: this.translate.instant('Cannot add new order'),
              },
              true,
            );
            break;
          case err.message.indexOf('NO_LOGISTIC_AVALIABLE') !== -1:
            this.openSuccessDialog({ text: this.translate.instant('NO_LOGISTIC_AVALIABLE'), title: 'Error' }, true);
            break;
          case err.message.indexOf('NO_PAYMENT_AVALIABLE') !== -1:
            this.openSuccessDialog({ text: this.translate.instant('NO_PAYMENT_AVALIABLE'), title: 'Error' }, true);
            break;
          default:
            this.openSuccessDialog({ text: this.translate.instant('DEFAULT_MOVE_TO_ORDER'), title: 'Error' }, true);
            break;
        }
      },
    );
  }

  openSuccessDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  activeButtonGroup(): void {
    if (!this.buttonGroupStatus) this.buttonGroupStatus = true;
  }

  openNewChat(): void {
    this.showLoading(true);
    const previousID = this.audience.id;

    this.audienceService
      .openNewChat(this.audience.customer_id)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((newAudienceID) => {
          return this.audienceService.getAudienceByID(newAudienceID, this.agentToken).pipe(takeUntil(this.destroy$));
        }),
      )
      .subscribe((newAudience) => {
        this.showLoading(false);
        void this.router.navigate([`/follows/chat/${newAudience.id}/post`]);
        this.audienceContactService.updateAudienceIdentity.next({ previousID, audience: newAudience });
      });
  }
}
