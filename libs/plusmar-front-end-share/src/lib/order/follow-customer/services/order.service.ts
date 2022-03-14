import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceHistoryService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience-history.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { deepCopy, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  ChatboxView,
  CustomerDomainStatus,
  EnumButtonTextNextStep,
  EnumCustomStep,
  EnumCustomStepIndex,
  EnumFollowRoute,
  EnumLogisticDeliveryProviderType,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  GenericButtonMode,
  GenericDialogMode,
  IAudience,
  IAudienceWithCustomer,
  IGetPriceCalculator,
  ILogisticModel,
  IPayment,
  IPurchaseOrder,
  IPurchaseOrderPaymentDetail,
  LeadsDomainStatus,
  PaymentShippingDetail,
  ProductCartCaution,
  PurchaseInventory,
  PurchaseOrderCustomerDetail,
  PurchaseOrderShippingDetail,
  UpdatedPaymentValue,
  UpdatePurchasePaymentInput,
  UpdatePurchasePaymentMode,
  EnumStepFollow,
  EnumStepWaitingForPayment,
  EnumStepConfirmPayment,
  EnumStepWaitingForShippment,
  EnumStepClosed,
  AudienceViewType,
  PurchaseOrderProducts,
  IPurchaseOrerErrors,
  AudienceUpdateOperation,
} from '@reactor-room/itopplus-model-lib';
import { lowerCase, startCase, isEmpty } from 'lodash';
import { of, Subject, Subscription, Observable } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PaymentShippingInfoComponent } from '../containers/payment-shipping-info/payment-shipping-info.component';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';

// ! DO NOT INJECT THIS SERVICE INTO ANY MODULE
// ! DO NOT INJECT THIS SERVICE INTO ANY MODULE
// ! DO NOT INJECT THIS SERVICE INTO ANY MODULE

// GOT INJECTED BY Audience-Contact ONLY
@Injectable()
export class OrderService {
  EnumFollowRoute = EnumFollowRoute;
  EnumCustomStep = EnumCustomStep;
  EnumCustomStepIndex = EnumCustomStepIndex;
  EnumButtonTextNextStep = EnumButtonTextNextStep;
  stepOne = EnumStepFollow;
  stepTwo = EnumStepWaitingForPayment;
  stepThree = EnumStepConfirmPayment;
  stepFour = EnumStepWaitingForShippment;
  stepFive = EnumStepClosed;

  // primary data
  audience: IAudienceWithCustomer;
  customerDetail: PurchaseOrderCustomerDetail;
  paymentDetail: IPurchaseOrderPaymentDetail;
  shippingDetail: PurchaseOrderShippingDetail;
  currentProducts: PurchaseOrderProducts[];
  deliveryFee: number;
  flatRate: boolean;

  // vairables
  orderId: number;
  aliasOrderId: string;
  uuid: string;
  orderInfo: FormGroup;
  orderInfoHistory: FormGroup;
  customStepLabel = '';
  stepIndex: number;
  currentStatus: EnumPurchaseOrderStatus | AudienceDomainStatus | CustomerDomainStatus | LeadsDomainStatus;
  orderReady = false;
  freeShipping = false;

  enableUpdateProduct = false;
  enableUpdateMethod = false;
  enableRollbackStep = false;
  enableLogistic = false;
  enablePayment = false;
  enableConfig = false;
  enableAddressConfig = false;
  enableRefund = false;

  productInvertoryLimit: PurchaseInventory[] = [];
  tempProductInvertory: number[] = [];

  initUpdate = false;

  destroy$: Subject<boolean>;
  getCurrentPurchasingStep$: Subscription;
  getPurchaseOrderSubscription$: Subscription;
  subscriptionDestroyer$: Subject<boolean>;

  isLoading: boolean;
  isProcessing: boolean;
  isStepPrevented: boolean;
  isInsufficientSupply: boolean;
  isAutomate: boolean;
  isPipelineError: boolean;
  isPaid = false;

  logistics: ILogisticModel[];
  logisticList: FormGroup;
  payments = [{ id: 0, name: 'Please Select Logistic first', type: 'Select Payment' }] as unknown as IPayment[];
  paymentList: FormGroup;
  orderType: string;
  focusClass = '';
  extraGrid = false;

  purchaseOrder: IPurchaseOrder;

  constructor(
    private dialogService: DialogService,
    private audienceService: AudienceService,
    public chatboxService: ChatboxService,

    private matDialog: MatDialog,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public router: Router,
    private audienceHistoryService: AudienceHistoryService,
    public purchaseOrderService: PurchaseOrderService,
    private logisticsService: LogisticsService,
    private paymentsService: PaymentsService,
    public layoutCommonService: LayoutCommonService,
    public audienceContactService: AudienceContactService,
    private routeService: RouteService,
  ) {}

  initAudiencesOrder(showPopup = false, showTracking = false): void {
    this.destroy$ = new Subject<boolean>();
    this.subscriptionDestroyer$ = new Subject<boolean>();

    if (this.getCurrentPurchasingStep$) this.getCurrentPurchasingStep$.unsubscribe();
    if (this.getPurchaseOrderSubscription$) this.getPurchaseOrderSubscription$.unsubscribe();

    this.isLoading = true;
    this.getCurrentPurchasingStep(showPopup, showTracking);
  }

  getCurrentPurchasingStep(showPopup: boolean, showTracking: boolean): void {
    this.getCurrentPurchasingStep$ = this.audienceHistoryService
      .getSteps(this.audience.id)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((currentStep) => {
          this.mapCurrentStepToOrder(showPopup, currentStep);
          if (this.stepIndex > this.stepFour) this.chatboxService.switchChatboxView.next(ChatboxView.CLOSED);
          return this.getPurchaseOrder(currentStep, showTracking);
        }),
        tap(() => {
          if (this.stepIndex < this.stepFive) {
            this.getPurchaseOrderSubscription();
          }
        }),
      )
      .subscribe(() => {
        this.isLoading = false;
        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);
      });
  }

  getPurchaseOrder(currentStep: IAudience, showTracking: boolean): Observable<boolean | PurchaseInventory[] | IPurchaseOrder> {
    return this.purchaseOrderService.getPurchaseOrder(this.audience.id, currentStep.status).pipe(
      takeUntil(this.destroy$),
      switchMap((purchaseOrder) => {
        if (purchaseOrder === null) {
          this.closeCart(true);
          return of(false);
        } else {
          this.purchaseOrder = purchaseOrder;
          this.setPurchasingOrderFailed(purchaseOrder.errors);
          this.setPurchasingOrderDetail(purchaseOrder); // 1
          this.enableFeatureOnStep(); // 2

          this.logisticList = this.setLogisticFormGroup();

          this.paymentList = this.setPaymentFormGroup();

          if (this.stepIndex !== this.stepFive) {
            this.setPaymentAndLogisticConfig(purchaseOrder); // 3
          }
          this.isAutomate = purchaseOrder.isAuto;

          if (showTracking) {
            this.purchaseOrderService.toggleTracking.next(true);
          }

          if (purchaseOrder.products !== null) {
            const productIds = purchaseOrder.products.map((item) => {
              return item.variantId;
            });

            if (productIds.length > 0) {
              if (this.tempProductInvertory.length > 0) {
                return this.updateVariantsInventoryLimits(this.tempProductInvertory, true);
              } else {
                return this.updateVariantsInventoryLimits(productIds);
              }
            }
          } else {
            if (this.tempProductInvertory.length > 0) {
              return this.updateVariantsInventoryLimits(this.tempProductInvertory, true);
            } else {
              return of(false);
            }
          }
          return of(true);
        }
      }),
      catchError((err) => {
        console.log('PO ERROR > ', err);
        if (err.message.indexOf('PURCHASE_ORDER_NOT_FOUND')) this.closeCart(true);
        return of(true);
      }),
    );
  }

  mapCurrentStepToOrder(showPopup: boolean, currentStep: IAudience): void {
    if (showPopup && this.currentStatus !== currentStep.status) {
      this.openDialog(this.currentStatus, currentStep.status);
    }
    this.currentStatus = currentStep.status;

    this.customStepLabel = this.EnumCustomStep[currentStep.status];
    this.stepIndex = this.EnumCustomStepIndex[currentStep.status];
  }

  updateVariantsInventoryLimits(productIds: number[], clearTemp = false): Observable<PurchaseInventory[]> {
    return this.purchaseOrderService.getCurrentPurchaseProductInventory(this.orderId, productIds).pipe(
      tap((purchaseInventories) => {
        this.productInvertoryLimit = purchaseInventories;
        this.setProductInventory();
        this.isLoading = false;
        this.isStepPrevented = this.getPreventStep();
        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);
        if (clearTemp) this.tempProductInvertory = [];
      }),
    );
  }

  setProductInventory(): void {
    const products = <FormArray>this['orderInfo'].controls['products'];
    products.controls.forEach((product) => {
      product.value.caution = []; // reset caution;
      const filter = this.productInvertoryLimit.filter((item) => item.id === product.value['variantId']);
      product.value.inventory = filter[0].inventory;
      product.value.stock = filter[0].stock;

      if (!this.paymentDetail?.isPaid) {
        if (this.stepIndex === this.stepThree) {
          if (product.value.quantity > product.value.stock) {
            product.value.caution = [ProductCartCaution.NOT_ENOUGH];
            this.isInsufficientSupply = true;
          }
        }
        if (this.stepIndex < this.stepThree) {
          if (product.value.quantity > product.value.inventory) {
            product.value.caution = [ProductCartCaution.NOT_ENOUGH];
            this.isInsufficientSupply = true;
          }
        }
      }

      product.setValue(product.value);
    });
  }

  updateVariantsInventoryLimitsOnAddingProduct(productIds: number[]): void {
    if (this.productInvertoryLimit.length > 0) {
      this.productInvertoryLimit.map((product) => {
        productIds.push(product.id);
      });
    }
    this.tempProductInvertory = productIds;
    this.updateVariantsInventoryLimits(this.tempProductInvertory, true).subscribe();
  }

  enableFeatureOnStep(): void {
    this.toggleUpdateProduct();
    this.toggleRollbackStep();
  }

  toggleLogisticAndPayment(): void {
    if (!this.logisticList) this.logisticList = this.setLogisticFormGroup(); // create order form
    if (!this.paymentList) this.paymentList = this.setPaymentFormGroup(); // create order form
    this.isStepPrevented = this.getPreventStep();

    if (this.stepIndex === this.stepTwo) {
      if (this.flatRate) {
        this.getPaymentList(0);
      } else {
        this.getLogisticList();
      }
    }
  }

  toggleUpdateProduct(): void {
    if (this.paymentDetail) {
      if (this.paymentDetail?.isPaid) {
        this.enableUpdateProduct = false;
        this.enableUpdateMethod = false;
      } else {
        if (this.stepIndex < this.stepThree) {
          this.enableUpdateProduct = true;
          this.enableUpdateMethod = true;
        } else {
          this.enableUpdateProduct = false;
          this.enableUpdateMethod = false;
        }
      }

      const blockRefund = [EnumPaymentType.BANK_ACCOUNT, EnumPaymentType.CASH_ON_DELIVERY];
      if (blockRefund.includes(this.paymentDetail.type)) {
        this.enableRefund = false;
      } else {
        this.enableRefund = this.paymentDetail?.isPaid;
      }
    } else {
      this.enableUpdateProduct = true;
      this.enableUpdateMethod = true;
    }
  }

  toggleRollbackStep(): void {
    if (this.paymentDetail && this.paymentDetail.type === EnumPaymentType.BANK_ACCOUNT) {
      if (this.stepIndex === this.stepFour) {
        this.enableRollbackStep = true;
      } else {
        this.enableRollbackStep = false;
      }
    } else {
      this.enableRollbackStep = false;
    }
  }

  setFormGroupValue(purchaseOrder: IPurchaseOrder, groupName = 'orderInfo'): void {
    const { orderId, totalPrice, status, tax, taxIncluded, createdAt, uuid, isAuto } = purchaseOrder;
    this[groupName].controls['audienceId'].setValue(this.audience.id);
    this[groupName].controls['orderId'].setValue(orderId);
    this[groupName].controls['totalPrice'].setValue(totalPrice);
    this[groupName].controls['status'].setValue(status);
    this[groupName].controls['tax'].setValue(taxIncluded ? tax : 0);
    this[groupName].controls['createdAt'].setValue(createdAt);
    this[groupName].controls['uuid'].setValue(uuid);
    this[groupName].controls['isAuto'].setValue(isAuto);
    const products = this[groupName].controls['products'] as FormArray;
    purchaseOrder.products?.forEach((item) => {
      const isFound = products.value.find((val) => val.variantId === item.variantId);
      const itemImage = item?.images ? item?.images[0]?.mediaLink : null;
      item['productImage'] = itemImage?.toString();
      item['caution'] = ['']; // alert for each product
      item['stock'] = 0; // inventory for each product
      item['inventory'] = 0; // inventory for each product
      if (!isFound) {
        products.push(this.formBuilder.group(item));
      } else {
        isFound.quantity = item.quantity;
      }
    });
  }
  setPurchasingOrderFailed(errorLists: IPurchaseOrerErrors[]): void {
    const unFixedList = errorLists.filter((list) => !list.isFixed);
    this.isPipelineError = true;
    this.purchaseOrderService.unFixedList.next(unFixedList);
  }

  getUnresolvedFailed(): void {
    this.purchaseOrderService
      .getPurchaseOrderFailedHistory(this.audience.id, this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((errorLists) => {
        this.setPurchasingOrderFailed(errorLists);
      });
  }

  setPurchasingOrderDetail(purchaseOrder: IPurchaseOrder): void {
    purchaseOrder = deepCopy(purchaseOrder);
    const { deliveryFee, flatRate, orderId, uuid, customerDetail, payment, shipping, aliasOrderId, products } = purchaseOrder;

    this.orderReady = true;
    this.customerDetail = customerDetail;
    this.paymentDetail = payment;
    if (payment !== null) this.isPaid = payment.isPaid;

    this.shippingDetail = shipping;
    this.currentProducts = products;
    this.deliveryFee = deliveryFee;
    this.flatRate = flatRate;
    this.orderId = orderId;
    this.aliasOrderId = aliasOrderId;
    this.uuid = uuid;

    if (flatRate === false || flatRate === null) {
      this.enableLogistic = true;
    }

    if ('location' in this.customerDetail) {
      if (this.stepIndex !== this.stepOne && this.stepIndex !== this.stepFive) this.enableAddressConfig = true;
      else this.enableAddressConfig = false;
    }

    this.setFormGroupValue(purchaseOrder, 'orderInfo');
    this.extraGrid = this.stepIndex > this.stepOne && this.orderReady;
    this.purchaseOrderService.toggleOrderDetail.next(this.extraGrid);
  }

  setPaymentAndLogisticConfig(purchaseOrder: IPurchaseOrder): void {
    const { flatRate, shipping } = purchaseOrder;
    if (this.shippingDetail !== null) {
      this.logisticList.controls['logisticID'].setValue(shipping.id);
      this.getPaymentList(flatRate ? 0 : shipping.id);
    }
    if (this.paymentDetail !== null) {
      this.paymentList.controls['paymentID'].setValue(this.paymentDetail.id);

      if (this.paymentDetail.type === EnumPaymentType.CASH_ON_DELIVERY && this.stepIndex === this.stepFive) this.enableConfig = true;
      else this.enableConfig = false;
    }
  }

  getPurchaseOrderSubscription(): void {
    this.getPurchaseOrderSubscription$ = this.purchaseOrderService
      .getPurchaseOrderSubscription(this.audience.id, this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.initAudiencesOrder(true);
        },
        () => {
          console.error('socket hang up');
        },
      );
  }

  closeCart(force: boolean, route: AudienceViewType = AudienceViewType.ORDER): void {
    if (force) void this.router.navigateByUrl('order/all');
    else {
      const routeHistory = this.routeService.routeHistory.getValue();
      if (routeHistory === '/') {
        this.routeService.routeHistory.next('/');
        if (route === AudienceViewType.ORDER) void this.router.navigateByUrl(`order/${this.EnumFollowRoute[this.currentStatus]}`);
        else void this.router.navigateByUrl('follows/list/all/1');
      } else {
        void this.router.navigate([routeHistory]);
      }
    }
  }
  alertAddingProduct(): void {
    this.dialogService.openDialog(this.translate.instant('Please add at least 1 product to cart'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe(() => {
      this.isProcessing = false;
      this.layoutCommonService.toggleUILoader.next(this.isProcessing);
    });
  }
  updateAudienceStatus(updateAudience: boolean): void {
    const isNotPrevent = !this.isStepPrevented;
    this.isProcessing = true;
    this.layoutCommonService.toggleUILoader.next(this.isProcessing);
    if (isNotPrevent) {
      const products = this.orderInfo.controls['products'] as FormArray;
      if (this.initUpdate) {
        this.dialogService
          .openDialog(this.translate.instant('Please update cart before continue to next step'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE)
          .subscribe(() => {
            this.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.isProcessing);
          });
      } else if (products.length > 0 && !this.initUpdate) {
        const previousStep = this.currentStatus;
        this.audienceService.updateFollowAudienceStatus(Number(this.audience.id), AudienceDomainType.CUSTOMER, updateAudience, this.orderId).subscribe(
          (audience: IAudience) => {
            this.audience = { ...this.audience, ...audience }; // Bind new Audience
            this.chatboxService.deactivateMobileChatboxAction.next(true);
            this.audienceContactService.updateSingleAudience.next({ audienceID: audience.id, operation: AudienceUpdateOperation.UPDATE });
            this.openDialog(previousStep, audience.status);
            this.initAudiencesOrder();
          },
          (err) => {
            this.openDialogError(err.message);
            this.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.isProcessing);
          },
        );
      } else {
        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);
      }

      if (products.length < 1) {
        this.alertAddingProduct();
      }
    } else {
      this.isProcessing = false;
      this.layoutCommonService.toggleUILoader.next(this.isProcessing);
    }
  }

  openDialog(previousStatus: string, currentStatus: string): void {
    this.matDialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '422px',
      data: {
        title: this.translate.instant('Changed Successfully'),
        text: `Changed <b>"${this.titleCase(previousStatus)}"</b> Status to <b>"${this.titleCase(currentStatus)}"</b> Status successfully…`,
      },
    });
  }
  openDialogError(text: string): MatDialogRef<SuccessDialogComponent> {
    const dialogRef = this.matDialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '422px',
      data: {
        title: this.translate.instant('Error'),
        text: text,
      },
    });
    dialogRef.componentInstance.isError = true;
    return dialogRef;
  }

  titleCase(string: string): string {
    return startCase(lowerCase(string));
  }

  openPaymentShippingInfoDialog(type: 'CONFIRM' | 'NORMAL' = 'NORMAL'): void {
    const dialogRef = this.matDialog.open(PaymentShippingInfoComponent, {
      width: isMobile() ? '90%' : '600px',
      data: {
        customerDetail: this.customerDetail,
        paymentDetail: this.paymentDetail,
        toggleShipment: true,
        amount: +this.getPrice.total,
        type: type,
      } as PaymentShippingDetail,
    });
    dialogRef.afterClosed().subscribe((updatedValue: UpdatedPaymentValue) => {
      if (updatedValue) {
        this.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);
        const mode = UpdatePurchasePaymentMode.UPDATE;
        const isPaid = updatedValue.paymentStatus === 'true';
        const params = {
          audienceId: this.audience.id,
          bankAccount: updatedValue.bankAccount,
          orderId: this.orderInfo.value.orderId,
          uuid: this.orderInfo.value.uuid,
          imagePayment: '-',
          // imagePayment: updatedValue.imagePayment,
          file: updatedValue.file,
          paymentStatus: isPaid,
          amount: Number(updatedValue.money),
          date: updatedValue.datetime,
          time: updatedValue.hour,
          platform: this.audience.platform,
        } as UpdatePurchasePaymentInput;

        this.purchaseOrderService.updatePurchasePayment(params, mode).subscribe(
          () => {
            if (isPaid) {
              this.updateAudienceStatus(true);
            } else {
              this.initAudiencesOrder();
            }
          },
          (err) => {
            console.log('err [LOG]:--> ', err);

            this.initAudiencesOrder();
            // this.getUnresolvedFailed();
            if (err.message.indexOf('OUT_OF_STOCK') !== -1) {
              this.dialogService.openDialog(this.translate.instant('Some of product are Out of Stock'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe(() => {
                this.isProcessing = false;
                this.layoutCommonService.toggleUILoader.next(this.isProcessing);
              });
            } else if (err.message.indexOf('INSUFFICIENT_SUPPLY') !== -1) {
              this.dialogService.openDialog(this.translate.instant('Insuffcient Product for reserved'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe(() => {
                this.isProcessing = false;
                this.layoutCommonService.toggleUILoader.next(this.isProcessing);
              });
            } else if (err.message.indexOf('PLEASE_SELECT_ACCOUNT') !== -1) {
              this.dialogService.openDialog(this.translate.instant('Please select bank account'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe(() => {
                this.isProcessing = false;
                this.layoutCommonService.toggleUILoader.next(this.isProcessing);
              });
            } else {
              // included MAX_RETRY_REACH
              this.dialogService.openDialog(this.translate.instant('Something went wrong'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe(() => {
                this.isProcessing = false;
                this.layoutCommonService.toggleUILoader.next(this.isProcessing);
              });
            }
          },
        );
      }
    });
  }

  getPreventStep(): boolean {
    const { isPrevent, message } = this.preventStep();
    if (isPrevent === true) {
      console.warn('ERROR:', message);
    }
    return isPrevent;
  }

  checkCustomerAddress = (detail: PurchaseOrderCustomerDetail): { fields: string[] } => {
    const fields = [];
    if (isEmpty(detail.name)) fields.push('KEY_NAME');
    if (isEmpty(detail.phoneNumber)) fields.push('KEY_PHONE');
    if (!isEmpty(detail.location)) {
      Object.keys(detail.location).forEach((key) => {
        if (key !== 'country' && isEmpty(detail.location[key])) fields.push(`KEY_${key.toUpperCase()}`);
      });
    } else {
      fields.push('KEY_LOCATION');
    }
    return { fields };
  };

  preventStep(): { isPrevent: boolean; message: string } {
    switch (this.currentStatus) {
      case EnumPurchaseOrderStatus.FOLLOW: {
        const isPrevent = this.orderProductInfo.length < 1;
        const message = isPrevent ? 'Please add some product' : '';
        return { isPrevent, message };
      }
      case EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT: {
        const { fields: emptyFields } = this.checkCustomerAddress(this.customerDetail);
        if (emptyFields.length > 0) {
          return { isPrevent: true, message: 'No Customer destination ' + emptyFields.join(', ') };
        }
        // if ('location' in this.customerDetail) {
        //   if (!(this.customerDetail?.location !== null && this.customerDetail?.location?.address)) {
        //     return { isPrevent: true, message: 'No Customer destination' };
        //   }
        // }

        if (this.isAutomate) {
          if (this.paymentDetail !== null) {
            const isPrevent = !this.paymentDetail.isPaid;
            const message = isPrevent ? 'Not paid' : '';
            return { isPrevent, message };
          } else {
            return { isPrevent: true, message: 'No Payment detail' };
          }
        } else {
          if (this.flatRate) {
            if (this.paymentDetail === null) {
              return { isPrevent: true, message: '' };
            } else {
              return { isPrevent: false, message: 'No Payment detail' };
            }
          } else {
            if (this.shippingDetail === null || this.paymentDetail === null) {
              return { isPrevent: true, message: 'No shipping detail or payment detail' };
            } else {
              return { isPrevent: false, message: '' };
            }
          }
        }
      }
      case EnumPurchaseOrderStatus.CONFIRM_PAYMENT: {
        if (this.paymentDetail) {
          if (this.isAutomate === false) {
            const isBank = this.paymentDetail.type === EnumPaymentType.BANK_ACCOUNT;
            const isCOD = this.paymentDetail.type === EnumPaymentType.CASH_ON_DELIVERY;
            if (isBank || isCOD) {
              return { isPrevent: false, message: '' };
            } else {
              return { isPrevent: false, message: '' };
            }
          }
          if (!this.paymentDetail.isPaid) {
            if (this.isInsufficientSupply) {
              return { isPrevent: true, message: 'Insufficient Supply' };
            } else {
              return { isPrevent: false, message: '' };
            }
          } else {
            return { isPrevent: false, message: '' };
          }
        } else {
          return { isPrevent: true, message: 'No Payment detail' };
        }
      }
      case EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT: {
        if (this.customerDetail && this.customerDetail !== null) {
          if ('location' in this.customerDetail) {
            if (this.customerDetail?.location?.address) {
              return { isPrevent: false, message: '' };
            } else {
              return { isPrevent: true, message: 'No Customer destination' };
            }
          } else {
            return { isPrevent: true, message: 'No Customer destination' };
          }
        } else {
          return { isPrevent: true, message: 'No Customer destination' };
        }
      }
      case EnumPurchaseOrderStatus.CLOSE_SALE:
      case CustomerDomainStatus.CLOSED:
        return { isPrevent: false, message: '' };
      default:
        return { isPrevent: true, message: 'Unhandled Case' };
    }
  }

  get orderProductInfo(): FormGroup[] {
    const productList = this.orderInfo.get('products')['controls'];
    return productList;
  }

  get getPrice(): IGetPriceCalculator {
    let subtotal = 0;
    const product = this.orderProductInfo.map((item) => ({ price: item.value.unitPrice as number, qty: item.value.quantity as number }));
    if (product.length > 0) {
      if (product.length === 1) {
        subtotal = product[0].price * product[0].qty;
      } else
        product.map((item) => {
          subtotal += item.price * item.qty;
        });
    }

    let shipping = 0;
    const deliveryFee = this.shippingDetail?.deliveryFee || this.deliveryFee;
    if (deliveryFee) {
      shipping = deliveryFee;
    }

    if (shipping === 0) {
      this.freeShipping = true;
    }

    const price = subtotal;

    const tax = (Number(this.orderInfo.value.tax) / 100) * price;
    const _subtotal = subtotal.toFixed(2);

    const _shipping = shipping.toFixed(2);
    const _tax = tax.toFixed(2);
    const _total = (price + tax + shipping).toFixed(2);
    const calculated = { subtotal: _subtotal, shipping: _shipping, tax: _tax, total: _total };
    return calculated;
  }

  setFormGroup(): FormGroup {
    return this.formBuilder.group({
      audienceId: ['', [Validators.required]],
      uuid: ['', [Validators.required]],
      orderId: ['', [Validators.required]],
      totalPrice: [null, [Validators.required]],
      status: ['', [Validators.required]],
      tax: [0, [Validators.required]],
      products: this.formBuilder.array([]),
      isAuto: [this.isAutomate],
      createdAt: [''],
    });
  }
  setLogisticFormGroup(): FormGroup {
    return this.formBuilder.group({
      // logisticID: [{ value: 0, disabled: !this.enableUpdateMethod }, [Validators.required]],
      logisticID: [0, [Validators.required]],
    });
  }
  setPaymentFormGroup(): FormGroup {
    return this.formBuilder.group({
      // paymentID: [{ value: 0, disabled: !this.enableUpdateMethod }, [Validators.required]],
      paymentID: [0, [Validators.required]],
    });
  }

  returnLogisticIcon(type: EnumLogisticDeliveryProviderType): string {
    try {
      if (type === EnumLogisticDeliveryProviderType.CUSTOM) return 'assets/img/logistic/round/custom-image.png';
      else
        return {
          THAILAND_POST: 'assets/img/logistic/round/ThailandPost_logo.png',
          FLASH_EXPRESS: 'assets/img/logistic/round/flashexpress_logo.png',
          J_AND_T: 'assets/img/logistic/round/jt_logo.png',
        }[type];
    } catch (err) {
      return 'assets/img/logistic/round/custom-image.png';
    }
  }

  getLogisticList(): void {
    this.logisticsService
      .getLogisticPageLogisticSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((logistics) => {
        const defaultLogistics = [{ id: 0, name: 'Select Logistic' }] as unknown as ILogisticModel[];
        this.logistics = [...defaultLogistics, ...logistics];
        if (this.stepIndex !== this.stepFive) this.setPaymentAndLogisticConfig(this.purchaseOrder); // 3
      });
  }
  getPaymentList(shippingID: number): void {
    this.paymentsService
      .getPaymentListByLogistic(this.audience.id, shippingID)
      .pipe(
        takeUntil(this.destroy$),
        map((payment: IPayment[]) => {
          const x = deepCopy(payment);

          return x.map((value) => {
            switch (value.type) {
              case EnumPaymentType.BANK_ACCOUNT:
                value.name = 'Bank Transfer';
                value.logo = 'assets/img/payment/bank-transfer.svg';
                break;
              case EnumPaymentType.CASH_ON_DELIVERY:
                value.name = 'Cash on Delivery';
                value.logo = 'assets/img/payment/COD.svg';
                break;
              case EnumPaymentType.OMISE:
                value.name = 'Omise';
                value.logo = 'assets/img/payment/omise.svg';
                break;
              case EnumPaymentType.PAYMENT_2C2P:
                value.name = '2C2P';
                value.logo = 'assets/img/payment/2c2p.svg';
                break;
              case EnumPaymentType.PAYPAL:
                value.name = 'Paypal';
                value.logo = 'assets/img/payment/paypal.svg';
                break;
            }
            return value;
          });
        }),
      )
      .subscribe((payments) => {
        const defaultPayments = [{ id: 0, name: 'Select Payment', type: 'Select Payment' }] as unknown as IPayment[];
        this.payments = [...defaultPayments, ...payments];
      });
  }

  getPurchaseOrderShippingDetail(selectedLogistic: ILogisticModel): void {
    this.purchaseOrderService
      .getPurchaseOrderShippingDetail(this.orderId, this.audience.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((shippingDetail) => {
        this.shippingDetail = shippingDetail;

        this.freeShipping = selectedLogistic.fee_type === 'FREE';
        this.paymentList.controls['paymentID'].setValue(0);
        this.isStepPrevented = true;
        this.focusClass = 'PAYMENT';

        this.purchaseOrderService.updateLogisticSelected.next(true);
        this.purchaseOrderService.updatePaymentSelected.next('');
        this.getPaymentList(this.shippingDetail.id || selectedLogistic.id);
      });
  }
  getPurchaseOrderPaymentDetail(): void {
    this.purchaseOrderService
      .getPurchaseOrderPaymentDetail(this.orderId, this.audience.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentDetail) => {
        this.paymentDetail = paymentDetail;

        this.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);
      });
  }
}
