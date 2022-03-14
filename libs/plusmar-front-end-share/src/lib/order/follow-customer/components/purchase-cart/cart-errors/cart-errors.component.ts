import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { EnumPaymentType, EnumPurchaseOrderSubStatus, GenericButtonMode, GenericDialogMode, IPurchaseOrerErrors } from '@reactor-room/itopplus-model-lib';
import { OrderService } from '../../../services/order.service';

enum viewMode {
  RESOLVE = 'RESOLVE',
  REFUND = 'REFUND',
}

@Component({
  selector: 'reactor-room-cart-errors',
  templateUrl: './cart-errors.component.html',
  styleUrls: ['./cart-errors.component.scss'],
})
export class CartErrorsComponent implements OnInit {
  viewEnum = viewMode;
  viewMode: viewMode = this.viewEnum.RESOLVE;
  unFixedList: IPurchaseOrerErrors = { allow: false } as IPurchaseOrerErrors;
  isHaveUnresolvedCase = false;
  EnumSubStatus = EnumPurchaseOrderSubStatus;

  refundPaymentType: EnumPaymentType;

  constructor(
    public dialog: DialogService,
    public translate: TranslateService,
    public purchaseOrderService: PurchaseOrderService,
    public orderService: OrderService,
    public router: Router,
    public layoutCommonService: LayoutCommonService,
  ) {}

  ngOnInit(): void {
    this.purchaseOrderService.unFixedList.subscribe((list) => {
      this.convertEnumIntoMessage(list);
    });
  }

  convertEnumIntoMessage(list: IPurchaseOrerErrors[]): void {
    const translateErrorEnumMessage = {
      PRODUCT_SUBTRACT_FAILED: this.translate.instant('PRODUCT_SUBTRACT_FAILED'),
      REFUND_PAYPAL_FAILED: this.translate.instant('Something went wrong while refunding via Paypal'),
      REFUND_2C2P_FAILED: this.translate.instant('Something went wrong while refunding via 2C2P'),
      REFUND_OMISE_CREDIT_FAILED: this.translate.instant('Something went wrong while refunding via Omise'),
      TRANSACTION_2C2P_FAILED: this.translate.instant('2C2P Transaction failed'),
    };

    const realtimeTranslate = true;
    if (list.length > 0) {
      this.unFixedList = list.map((value) => {
        if (this.orderService.stepIndex < this.orderService.stepFour) value.allow = true;
        if (realtimeTranslate) {
          value.message = value.typename; // NOTE : use dynamic translate
        } else {
          const translateMessage = translateErrorEnumMessage[value.typename];
          value.message = translateMessage || this.translate.instant('Something went wrong');
        }
        return value;
      })[0];
      this.isHaveUnresolvedCase = true;
    } else {
      this.isHaveUnresolvedCase = false;
    }
  }

  resolveProblem(typename: EnumPurchaseOrderSubStatus): void {
    switch (typename) {
      case EnumPurchaseOrderSubStatus.PRODUCT_SUBTRACT_FAILED:
        this.resolveOnProductSubtractFailed(typename);
        break;

      default:
        this.resolveOnDefault(typename);
        break;
    }
  }

  resolveOnProductSubtractFailed(typename: EnumPurchaseOrderSubStatus): void {
    this.dialog
      .openDialog(
        this.orderService.isPaid ? this.translate.instant('PROBLEM_RESOLVED') : this.translate.instant('Problem is already resolved'),
        GenericDialogMode.CONFIRM,
        GenericButtonMode.CONFIRM,
      )
      .subscribe((isConfirm) => {
        if (isConfirm) {
          this.purchaseOrderService.resolvePurchaseOrderProblem(this.orderService.audience.id, this.orderService.orderId, typename).subscribe(() => {
            // void this.router.navigate(['/products/list/1']);
            this.orderService.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

            this.orderService.getUnresolvedFailed();
          });
        }
      });
  }

  resolveOnDefault(typename: EnumPurchaseOrderSubStatus): void {
    this.dialog.openDialog(this.translate.instant('Problem is already resolved'), GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((isConfirm) => {
      if (isConfirm) {
        this.purchaseOrderService.resolvePurchaseOrderProblem(this.orderService.audience.id, this.orderService.orderId, typename).subscribe(() => {
          this.orderService.isProcessing = false;
          this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

          this.orderService.getUnresolvedFailed();
        });
      }
    });
  }

  // REFUND
  refundOrder(typename: EnumPurchaseOrderSubStatus): void {
    if (this.orderService.enableRefund) {
      this.purchaseOrderService.getPurchasingOrderUnrefundedPaymentInfo(this.orderService.orderId).subscribe((result) => {
        this.dialog
          .openDialog(this.translate.instant('Please confirm to proceed a refund for this order'), GenericDialogMode.REFUND, GenericButtonMode.CONFIRM)
          .subscribe((isConfirm) => {
            if (isConfirm) {
              this.orderService.isProcessing = true;
              this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

              this.purchaseOrderService.proceedToRefundOrder(this.orderService.orderId).subscribe(
                () => {
                  this.refundResolvedByTypename(typename);
                  this.orderService.getUnresolvedFailed();
                  this.orderService.initAudiencesOrder();
                },
                (err) => {
                  this.dialog.openDialog(this.translate.instant(err.message), GenericDialogMode.CAUTION, GenericButtonMode.OK, false, true).subscribe();
                  this.orderService.isProcessing = false;
                  this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

                  this.orderService.getUnresolvedFailed();
                },
              );
            }
          });
      });
    }
  }

  refundResolvedByTypename(typename: EnumPurchaseOrderSubStatus): void {
    switch (typename) {
      case EnumPurchaseOrderSubStatus.REFUND_PAYPAL_FAILED:
      case EnumPurchaseOrderSubStatus.REFUND_2C2P_FAILED:
      case EnumPurchaseOrderSubStatus.REFUND_OMISE_CREDIT_FAILED:
        this.purchaseOrderService.resolvePurchaseOrderProblem(this.orderService.audience.id, this.orderService.orderId, typename).subscribe(
          () => {
            this.orderService.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          },
          (err) => {
            this.orderService.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);
          },
        );
        break;
      default:
        this.orderService.isProcessing = false;
        this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

        // do nothing
        break;
    }
  }
}
