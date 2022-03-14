import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceUpdateOperation,
  AudienceViewType,
  EnumLogisticDeliveryProviderType,
  EnumPurchasingPayloadType,
  EnumTrackingType,
  GenericButtonMode,
  GenericDialogData,
  GenericDialogMode,
  GenericDialogToggle,
  IAudience,
  IPagesContext,
  IPayOffResult,
  PaymentShippingDetail,
} from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, zip } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceHistoryService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience-history.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { PipelineService } from '@reactor-room/plusmar-front-end-share/services/facebook/pipeline/pipeline.service';
import { OrderService } from '../../services/order.service';
import { DropOffCompleteComponent } from '../../containers/drop-off-complete/drop-off-complete.component';
import { DropOffWeightCalculatorComponent } from '../../containers/drop-off-weight-calculator/drop-off-weight-calculator.component';
import { ComfirmTrackingNoDialogComponent } from '../comfirm-tracking-no-dialog/comfirm-tracking-no-dialog.component';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';

@Component({
  selector: 'reactor-room-order-action',
  templateUrl: './order-action.component.html',
  styleUrls: ['./order-action.component.scss'],
  animations: [slideInOutAnimation],
})
export class OrderActionComponent implements OnInit, OnDestroy {
  AudienceViewType = AudienceViewType;
  AudienceDomainStatus = AudienceDomainStatus;
  EnumTrackingType = EnumTrackingType;
  EnumDeveliveryType = EnumLogisticDeliveryProviderType;
  private popToast = new Subject<string>();
  private destroy$ = new Subject();

  @Input() selector: string;
  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  routeResolver$ = this.route.data as Observable<AudienceChatResolver>;

  orderInfoMenuStatus = false;
  orderTrackingAndCloseSale = false;
  originRoute: AudienceViewType;
  moveToMenu = false;
  agentToken = '';
  currentPage: IPagesContext;

  constructor(
    public ngZone: NgZone,
    public route: ActivatedRoute,
    public router: Router,
    public orderService: OrderService,

    private matDialog: MatDialog,
    public purchaseOrderService: PurchaseOrderService,
    private audienceService: AudienceService,
    private audienceContactService: AudienceContactService,
    private dialogService: DialogService,
    private pipelineService: PipelineService,
    public translate: TranslateService,
    private logisticsService: LogisticsService,
    public toastr: ToastrService,
    private chatboxService: ChatboxService,
    public layoutCommonService: LayoutCommonService,
    private pagesService: PagesService,
  ) {}

  ngOnInit(): void {
    this.onButtonClickHandler();
    if (this.selector === 'HEADER') this.watchOnToggleTracking();

    this.pagesService.currentPage$.subscribe((page) => {
      this.currentPage = page;
    });

    zip(this.parentRouteResolver$, this.routeResolver$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.handleData(Object.assign(...val) as AudienceChatResolver);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  handleData({ route, token }: AudienceChatResolver): void {
    this.agentToken = token;
    this.originRoute = route;
  }

  watchOnToggleTracking(): void {
    this.purchaseOrderService.toggleTracking.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onClickTracking();
    });
  }

  onButtonClickHandler(): void {
    this.popToast.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe((text: string) => {
      const title = this.translate.instant('Caution');
      this.toastr.warning(text, title, { positionClass: 'toast-bottom-right' });
    });
  }

  onClickWaitingForPayment(): void {
    if (this.orderService.isStepPrevented) {
      // TODO : open dialog
    } else {
      this.orderService.updateAudienceStatus(true);
    }
  }

  onClickConfirmPayment(): void {
    this.orderService.isStepPrevented = this.orderService.getPreventStep();
    if (this.orderService.isPaid) {
      this.dialogService.openDialog(this.translate.instant('Confirm Payment'), GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM).subscribe((isConfirm) => {
        if (isConfirm) {
          this.orderService.isProcessing = true;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          this.audienceService.resolvePurchaseOrderPaidTransaction(this.orderService.orderId).subscribe({
            next: () => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
              this.orderService.initAudiencesOrder();
            },
            error: () => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
              this.orderService.getUnresolvedFailed();
            },
          });
        }
      });
    } else {
      if (this.orderService.isStepPrevented) {
        let popUpToastMessage = this.translate.instant('Please select logistic or payment method');
        if (this.orderService.isAutomate) {
          popUpToastMessage = this.translate.instant('Please wait for customer to select logistic and payment method');
        }

        const wait = this.translate.instant('Wait for customer to confirm');

        const { fields: emptyFields } = this.orderService.checkCustomerAddress(this.orderService.customerDetail);
        if (emptyFields.length > 0) {
          this.orderService.focusClass = 'ADDRESS';
          const missingField = this.translate.instant(emptyFields[0]);
          const text = this.translate.instant('ADDRESS_FIELD_IS_MISSING');
          this.popToast.next(text + missingField);
        } else {
          if (this.orderService.flatRate) {
            if (!this.orderService.shippingDetail) {
              this.orderService.focusClass = 'LOGISTIC';
              this.popToast.next(popUpToastMessage);
            } else {
              if (this.orderService.shippingDetail.id && this.orderService.shippingDetail.id === 0) {
                this.orderService.focusClass = 'LOGISTIC';
                this.popToast.next(popUpToastMessage);
              } else {
                console.log('555');
                this.popToast.next(wait);
              }
            }
          } else {
            if (!this.orderService.shippingDetail) {
              this.popToast.next(popUpToastMessage);
              if (!this.orderService.isAutomate) this.orderService.focusClass = 'LOGISTIC';
            } else if (!this.orderService.paymentDetail) {
              this.popToast.next(popUpToastMessage);
              if (!this.orderService.isAutomate) this.orderService.focusClass = 'PAYMENT';
            } else {
              if (this.orderService.shippingDetail.id && this.orderService.shippingDetail.id === 0) {
                this.popToast.next(popUpToastMessage);
                if (!this.orderService.isAutomate) this.orderService.focusClass = 'LOGISTIC';
              } else if (this.orderService.paymentDetail.id && this.orderService.paymentDetail.id === 0) {
                this.popToast.next(popUpToastMessage);
                if (!this.orderService.isAutomate) this.orderService.focusClass = 'PAYMENT';
              } else {
                this.popToast.next(wait);
              }
            }
          }
        }

        setTimeout(() => {
          this.orderService.focusClass = '';
        }, 900); // relate to animation: blink 0.3s * 3; of class .on-focus-field
      } else {
        if (this.orderService.initUpdate) {
          this.dialogService
            .openDialog(this.translate.instant('Please update cart before continue to next step'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE)
            .subscribe(() => {
              //
            });
        } else {
          if (this.orderService.isAutomate === false || this.orderService.paymentDetail.isPaid) {
            this.dialogService.openDialog(this.translate.instant('Confirm Payment'), GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM).subscribe((isConfirm) => {
              if (isConfirm) {
                this.orderService.isProcessing = true;
                this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
                this.orderService.updateAudienceStatus(true);
              }
            });
          }
        }
      }
    }
  }

  onClickConfirmOrder(PSID: string): void {
    // TODO : Changes to BankTransfer
    if (this.orderService.isStepPrevented) {
      if (this.orderService.isInsufficientSupply) {
        const wait = this.translate.instant('Cant confirm order, some of product are insufficient.');
        // this.popToast.next(wait);
        this.dialogService.openDialog(wait, GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe();
      } else {
        const wait = this.translate.instant('Wait for customer to complete transaction');
        this.popToast.next(wait);
      }
    } else {
      if (this.orderService.paymentDetail !== null) {
        if (!this.orderService.isStepPrevented) {
          this.openPaymentShippingInfo();
        }
      } else {
        this.dialogService
          .openDialog("Customer haven't selected payment method, send Payments to customer ?", GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM)
          .subscribe((send) => {
            if (send) {
              void this.pipelineService.sendPayload(this.orderService.audience.id, PSID, EnumPurchasingPayloadType.SEND_PAYMENT, this.orderService.audience.platform);
            }
          });
      }
    }
  }

  onClickReject(): void {
    if (this.orderService.stepIndex < this.orderService.stepFour && this.orderService.isPaid === false) {
      const dialogRef = this.matDialog.open(GenericDialogComponent, {
        width: isMobile() ? '90%' : '40%',
        data: {
          text: this.translate.instant('Are you sure you want to reject this customer'),
          disableClose: false,
          dialogMode: GenericDialogMode.REJECT,
          buttonMode: GenericButtonMode.CONFIRM,
        } as GenericDialogData,
      });
      dialogRef.afterClosed().subscribe((yes) => {
        if (yes) {
          this.orderService.isProcessing = true;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          this.audienceService
            .rejectPurchaseOrder(this.orderService.audience.id, {
              domain: AudienceDomainType.CUSTOMER,
              status: this.orderService.currentStatus,
            })
            .subscribe(
              () => {
                this.orderService.audience.status = AudienceDomainStatus.REJECT;
                // this.orderService.audience = audience;
                this.chatboxService.deactivateMobileChatboxAction.next(true);
                this.orderService.isProcessing = false;
                this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

                this.audienceContactService.updateSingleAudience.next({ audienceID: this.orderService.audience.id, operation: AudienceUpdateOperation.REMOVE });
                this.orderService.initAudiencesOrder();
              },
              (err) => {
                this.orderService.isProcessing = false;
                this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
                this.orderService.openDialogError(err.message);
              },
            );
        }
      });
    }
  }

  onClickPreviosStep(): void {
    const updateAudience = false;
    if (this.orderService.enableRollbackStep) {
      this.orderService.isProcessing = true;
      this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
      const previousStep = this.orderService.currentStatus;
      this.audienceService.updateFollowAudienceStatus(Number(this.orderService.audience.id), AudienceDomainType.CUSTOMER, updateAudience, this.orderService.orderId).subscribe(
        (audience: IAudience) => {
          this.orderService.openDialog(previousStep, audience.status);
          this.audienceContactService.updateSingleAudience.next({ audienceID: this.orderService.audience.id, operation: AudienceUpdateOperation.UPDATE });
          this.orderService.initAudiencesOrder();
        },
        (err) => {
          this.orderService.isProcessing = false;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          this.orderService.openDialogError(err.message);
        },
      );
    }
  }

  onClickTracking(): void {
    if (!this.orderService.isStepPrevented) {
      this.chatboxService.deactivateMobileChatboxAction.next(true);

      if (this.orderService.flatRate) {
        this.openTrackingPopup();
      } else {
        const { type, trackingType, isActive } = this.orderService.shippingDetail;
        if (type === this.EnumDeveliveryType.THAILAND_POST && trackingType === this.EnumTrackingType.DROP_OFF) {
          if (isActive) {
            this.openTrackingPopup();
          } else {
            this.openWeightCalculation();
          }
        } else {
          this.openTrackingPopup();
        }
      }
    }
  }

  onClickCloseSale(): void {
    let text = this.translate.instant('Please verify before close order');
    let isAware = false;
    const shipping = this.orderService.shippingDetail;
    if (shipping !== null) {
      const { type, trackingType, isActive, trackingNo } = shipping;
      if (type === this.EnumDeveliveryType.THAILAND_POST && trackingType === this.EnumTrackingType.DROP_OFF) {
        if (!isActive && !trackingNo) {
          isAware = true;
          // Calculate Dropoff
          text = this.translate.instant('Please check again Close order without tracking number');
        }
      } else {
        if (!isActive && !trackingNo) {
          isAware = true;
          text = this.translate.instant('Please check again Close order without tracking number');
        }
      }
    }

    this.dialogService.openDialog(this.translate.instant(text), GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM, false, isAware).subscribe((isConfirm) => {
      if (isConfirm) {
        this.orderService.updateAudienceStatus(true);
        this.audienceContactService.updateSingleAudience.next({ audienceID: this.orderService.audience.id, operation: AudienceUpdateOperation.UPDATE });
      }
    });
  }

  openTrackingPopup(): void {
    const dialogRef = this.matDialog.open(ComfirmTrackingNoDialogComponent, {
      width: '500px',
      data: {
        shippingDetail: this.orderService.shippingDetail,
        flatRate: this.orderService.flatRate,
      } as PaymentShippingDetail,
    });
    dialogRef.afterClosed().subscribe((trackingInfo) => {
      if (trackingInfo) {
        if (trackingInfo === 'RETRY') {
          this.afterRetryCreateTrackingInit();
        } else {
          this.afterConfirmSendingTrackNo(trackingInfo);
        }
      }
    });
  }

  openWeightCalculation(): void {
    const dialogRef = this.matDialog.open(DropOffWeightCalculatorComponent, {
      width: '500px',
      data: {
        shippingDetail: this.orderService.shippingDetail,
        flatRate: this.orderService.flatRate,
        orderIDs: [this.orderService.orderId],
      } as PaymentShippingDetail,
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((yes) => {
          if (yes) {
            this.orderService.isProcessing = true;
            this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
            return this.logisticsService.paySingleDropOffBalance(this.orderService.orderId, this.orderService.audience.platform).pipe(takeUntil(this.destroy$));
          } else {
            return of(false);
          }
        }),
      )
      .subscribe({
        next: (payResult: IPayOffResult) => {
          if (payResult) {
            if (payResult.isSuccess) {
              this.openPayOffResultDialog(payResult);
            } else {
              let message = '';
              if (payResult.message === 'THAIPOST_TRACKING_SET_EMPTY') {
                message = this.translate.instant('Thaipost tracking number in system is empty');
              } else {
                message = payResult.message;
              }
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
              this.dialogService
                .openDialog(
                  message,
                  GenericDialogMode.FAILED,
                  GenericButtonMode.CLOSE,
                  GenericDialogToggle.DISABLE, // disable close
                  GenericDialogToggle.ENABLE, // enable error
                )
                .subscribe(() => {
                  this.orderService.isProcessing = false;
                  this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
                });
            }
          }
        },
        error: () => {
          this.orderService.isProcessing = false;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
        },
      });
  }

  openPayOffResultDialog(payResult: IPayOffResult): void {
    this.orderService.isProcessing = false;
    this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
    this.matDialog.open(DropOffCompleteComponent, {
      width: '400px',
      data: {
        result: payResult,
        orderData: {
          audienceID: this.orderService.audience.id,
          orderId: this.orderService.orderId,
          orderUUID: this.orderService.orderInfo.value.uuid,
          route: this.originRoute,
        },
      },
    });

    this.orderService.initAudiencesOrder();
  }

  afterRetryCreateTrackingInit(): void {
    this.orderService.isProcessing = true;
    this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
    this.purchaseOrderService
      .retryCreateOrderTracking(this.orderService.audience.id, this.orderService.orderInfo.value.orderId)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.orderService.isProcessing = false;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
        }),
      )
      .subscribe(
        () => {
          const showPopup = false;
          const showTracking = true;
          this.orderService.initAudiencesOrder(showPopup, showTracking);
        },
        (err) => {
          this.orderService.isProcessing = false;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          this.orderService
            .openDialogError(err.message)
            .afterClosed()
            .subscribe(() => {
              this.openTrackingPopup();
            });
        },
      );
  }

  afterConfirmSendingTrackNo(trackingInfo): void {
    this.orderService.isProcessing = true;
    this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
    this.purchaseOrderService
      .updateTrackingNumber(this.orderService.audience.id, this.orderService.orderInfo.value.orderId, trackingInfo, this.orderService.audience.platform)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.orderService.initAudiencesOrder();
        },
        (err) => {
          this.orderService.isLoading = false;
          this.orderService.isProcessing = false;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          this.orderService.openDialogError(err.message);
        },
      );
  }

  onClickClose(force: boolean): void {
    this.audienceContactService
      .removeTokenFromAudienceContactList(this.orderService.audience.token, this.currentPage.pageId, false)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          console.log('success');
        },
        (err) => console.log('removeTokenFromAudienceContactList err ===> : ', err),
      );

    this.orderService.closeCart(force, this.route?.snapshot?.data?.route);
  }

  openPaymentShippingInfo(): void {
    this.orderService.openPaymentShippingInfoDialog('CONFIRM');
  }

  openNewChat(): void {
    this.showLoading(true);
    const previousID = this.orderService.audience.id;

    this.audienceService
      .openNewChat(this.orderService.audience.customer_id)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((newAudienceID) => {
          return this.audienceService.getAudienceByID(newAudienceID, this.agentToken).pipe(takeUntil(this.destroy$));
        }),
      )
      .subscribe(
        (newAudience) => {
          this.showLoading(false);
          void this.router.navigate([`/follows/chat/${newAudience.id}/post`]);
          this.audienceContactService.updateAudienceIdentity.next({ previousID, audience: newAudience });
        },
        (ex) => {
          this.dialogService.openDialog(ex.message, GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe();
        },
      );
  }

  toggleMoveTo(): void {
    this.moveToMenu = !this.moveToMenu;
  }

  clickOutsideToggleMoveToEvent(event: any): void {
    if (event) this.moveToMenu = false;
  }

  showLoading(toggle: boolean): void {
    this.layoutCommonService.toggleUILoader.next(toggle);
  }

  toggleOrderInfoMenuStatus(): void {
    this.orderInfoMenuStatus = !this.orderInfoMenuStatus;
  }
  clickOutsideOrderInfoMenuEvent(event: boolean): void {
    if (event) {
      this.orderInfoMenuStatus = false;
    }
  }
  toggleTrackingAndCloseSale(): void {
    this.orderTrackingAndCloseSale = !this.orderTrackingAndCloseSale;
  }
  clickOutsideTrackingAndCloseSale(event: boolean): void {
    if (event) {
      this.orderTrackingAndCloseSale = false;
    }
  }
}
