import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { getBankAccountDetailArray } from '@reactor-room/plusmar-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/order/animation';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import {
  AudienceViewType,
  CustomerAddressFromGroup,
  GenericButtonMode,
  GenericDialogMode,
  IPurchaseOrderPaymentDetail,
  PaymentShippingDetail,
  PurchaseOrderCustomerDetail,
  PurchaseOrderShippingDetail,
  UpdatedPaymentValue,
  UpdatePurchasePaymentInput,
  UpdatePurchasePaymentMode,
} from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { AddressShippingInfoComponent } from '../address-shipping-info/address-shipping-info.component';
import { PaymentShippingInfoComponent } from '../payment-shipping-info/payment-shipping-info.component';

@Component({
  selector: 'reactor-room-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  animations: [slideInOutAnimation],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  @Input() route: AudienceViewType;
  orderId: number;
  aliasOrderId: string;
  orderInfo: FormGroup;
  currentStatus: string;
  customerDetail: PurchaseOrderCustomerDetail;
  paymentDetail: IPurchaseOrderPaymentDetail;
  shippingDetail: PurchaseOrderShippingDetail;
  stepIndex: number;
  currentLogisticId = 0;

  destroy$ = new Subject();

  order = {
    orderNo: 0 as number,
    orderDate: '', // 20/03/2020 11:23
    orderName: '',
    orderAddress: '',
    orderPhone: '',
    orderImg: '',
    paymentDate: null,
    paymentTime: '',
    paymentAmount: 0,
    isPaid: false,
    type: '',
    bankAccountId: '',
    bankLogo: '',
  };
  bankData = getBankAccountDetailArray();

  constructor(
    public layoutCommonService: LayoutCommonService,
    public orderService: OrderService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {}

  // Component Life Cycle Section : Start
  ngOnInit(): void {
    this.orderService.toggleLogisticAndPayment();
    this.watchOrder();
    this.watchLogisticSelected();
    this.watchPaymentChanges();
    this.subscribeOrderInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  // Component Life Cycle Section : End

  watchOrder(): void {
    this.orderService.purchaseOrderService.toggleOrderDetail.pipe(takeUntil(this.destroy$)).subscribe((isOn: boolean) => {
      if (isOn) {
        this.subscribeOrderInfo();
      }
    });
  }

  watchLogisticSelected(): void {
    this.orderService.purchaseOrderService.updateLogisticSelected.pipe(takeUntil(this.destroy$)).subscribe((isOn: boolean) => {
      if (isOn) {
        this.shippingDetail = this.orderService.shippingDetail;
      }
    });
  }

  watchPaymentChanges(): void {
    this.orderService.purchaseOrderService.updatePaymentSelected.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.order.type = value;
    });
  }

  subscribeOrderInfo(): void {
    if (this.orderService?.customerDetail) {
      this.orderId = this.orderService.orderId;
      this.aliasOrderId = this.orderService.aliasOrderId;
      this.orderInfo = this.orderService.orderInfo;
      this.currentStatus = this.orderService.currentStatus;
      this.customerDetail = this.orderService.customerDetail;
      this.paymentDetail = this.orderService.paymentDetail;
      this.shippingDetail = this.orderService.shippingDetail;
      this.currentLogisticId = this.orderService.shippingDetail ? this.orderService.shippingDetail.id : 0;
      this.stepIndex = this.orderService.stepIndex;
      this.setDetail();
    }
  }

  setDetail(): void {
    this.order.orderNo = this.orderInfo.value.orderId;
    this.order.orderDate = this.orderInfo.value.createdAt;

    if (this.customerDetail !== null) {
      this.order.orderName = this.customerDetail?.name;
      this.order.orderPhone = this.customerDetail?.phoneNumber;

      if ('location' in this.customerDetail) {
        if (this.customerDetail?.location !== null && this.customerDetail?.location?.address) {
          this.order.orderAddress = `${this.customerDetail.location.address}
          ${this.customerDetail?.location?.district}
          ${this.customerDetail?.location?.city}
          ${this.customerDetail?.location?.province}
          ${this.customerDetail?.location?.postCode}
          `;
        }
      }
    }

    if (this.paymentDetail) {
      this.order.paymentDate = this.paymentDetail?.paidDate;
      this.order.paymentTime = this.paymentDetail?.paidTime;
      this.order.paymentAmount = this.paymentDetail?.paidAmount;
      this.order.isPaid = this.paymentDetail?.isPaid || false;
      this.order.type = this.paymentDetail?.type;
      this.orderService.orderType = this.paymentDetail?.type;

      if (this.paymentDetail?.bank) {
        this.order.bankAccountId = this.paymentDetail.bank.account_id;
        const filter = this.bankData.filter((item) => item.type === this.paymentDetail.bank.type);
        this.order.bankLogo = filter[0].imgUrl;
      }
    }
  }

  openPaymentShippingInfoDialog(): void {
    if (this.paymentDetail !== null) {
      const dialogRef = this.dialog.open(PaymentShippingInfoComponent, {
        width: '400px',
        data: {
          paymentDetail: this.paymentDetail,
        } as PaymentShippingDetail,
      });
      dialogRef.afterClosed().subscribe((updatedValue: UpdatedPaymentValue) => {
        if (updatedValue) {
          this.orderService.isProcessing = true;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

          const mode = UpdatePurchasePaymentMode.EDIT;
          const params = {
            audienceId: this.orderInfo.value.audienceId,
            orderId: this.orderInfo.value.orderId,
            imagePayment: '-',
            bankAccount: updatedValue.bankAccount,
            // imagePayment: updatedValue.imagePayment,
            file: updatedValue.file,
            paymentStatus: updatedValue.paymentStatus === 'true',
            amount: updatedValue.money,
            date: updatedValue.datetime,
            time: updatedValue.hour,
            platform: this.orderService.audience.platform,
          } as UpdatePurchasePaymentInput;

          this.orderService.purchaseOrderService.updatePurchasePayment(params, mode).subscribe(
            () => {
              this.orderService.initAudiencesOrder();
            },
            (err) => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

              console.error(err);
            },
          );
        }
      });
    } else {
      this.dialogService.openDialog(this.translate.instant('Customer have not selected payment method'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe((send) => {
        // do nothin
      });
    }
  }

  openShippingInfoDialog(): void {
    if (this.customerDetail !== null) {
      const dialogRef = this.dialog.open(AddressShippingInfoComponent, {
        width: '600px',
        data: {
          customerDetail: this.customerDetail,
          stepIndex: this.stepIndex,
        } as PaymentShippingDetail,
      });
      dialogRef.afterClosed().subscribe((updatedValue: CustomerAddressFromGroup) => {
        if (updatedValue && this.orderService.enableAddressConfig) {
          this.orderService.isProcessing = true;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

          this.orderService.purchaseOrderService.updateShippingAddress(this.orderService.orderId, this.orderService.audience.id, updatedValue).subscribe(
            () => {
              this.orderService.initAudiencesOrder();
            },
            (err) => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

              if (err.message.indexOf('J_AND_T_NOT_SUPPORT_ADDRESS') !== -1) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                this.dialogService.openDialog(this.translate.instant('JAndT Not Support Address'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe();
              } else {
                this.orderService.openDialogError(err);
              }
              console.log('err : ', err);
            },
          );
        }
      });
    }
  }

  onLogisticChanges(logisticID: number): void {
    const logisticControl = this.orderService.logisticList.controls['logisticID'];
    if (logisticID !== logisticControl.value) {
      if (logisticID !== 0) {
        this.orderService.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

        // this.initUpdate = true;
        logisticControl.patchValue(logisticID);
        this.orderService.purchaseOrderService
          .updateSelectedLogisticMethod(this.orderService.audience.id, logisticControl.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

              const selectedLogistic = this.orderService.logistics.find((logistic) => logistic.id === logisticControl.value);
              this.currentLogisticId = selectedLogistic.id;
              this.orderService.getPurchaseOrderShippingDetail(selectedLogistic);
            },
            (err) => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

              if (err.message.indexOf('J_AND_T_NOT_SUPPORT_ADDRESS') !== -1) {
                this.dialogService.openDialog(this.translate.instant('JAndT Not Support Address'), GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe((send) => {
                  logisticControl.patchValue(this.currentLogisticId);
                });
              }
              console.log('err ::::::::::>>> ', err);
            },
          );
      } else {
        logisticControl.patchValue(logisticControl.value);
      }
    }
  }

  onPaymentChanges(paymentID: number): void {
    const paymentControl = this.orderService.paymentList.controls['paymentID'];
    if (paymentID !== paymentControl.value) {
      if (paymentID !== 0) {
        this.orderService.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

        paymentControl.patchValue(paymentID);
        this.orderService.purchaseOrderService
          .updateSelectedPaymentMethod(this.orderService.audience.id, paymentControl.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              const selectedPayment = this.orderService.payments.find((payment) => payment.id === paymentControl.value);

              this.orderService.orderType = selectedPayment.type;
              this.orderService.focusClass = '';

              this.orderService.isStepPrevented = this.orderService.getPreventStep();

              this.orderService.purchaseOrderService.updatePaymentSelected.next(selectedPayment.type);
              this.orderService.getPurchaseOrderPaymentDetail();
            },
            (err) => {
              this.orderService.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

              console.log('err', err);
            },
          );
      } else {
        paymentControl.patchValue(paymentControl.value);
      }
    }
  }
}
