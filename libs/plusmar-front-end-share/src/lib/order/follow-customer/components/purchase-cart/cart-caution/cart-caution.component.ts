import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PipelineService } from '@reactor-room/plusmar-front-end-share/services/facebook/pipeline/pipeline.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { CustomerDomainStatus, EnumPaymentType, EnumPurchaseOrderStatus, EnumPurchasingPayloadType } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { debounceTime, delay, takeUntil, tap } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'reactor-room-cart-caution',
  templateUrl: './cart-caution.component.html',
  styleUrls: ['./cart-caution.component.scss'],
})
export class CartCautionComponent implements OnInit, OnDestroy {
  EnumPaymentType = EnumPaymentType;
  EnumPurchaseOrderStatus = EnumPurchaseOrderStatus;
  isHaveUnresolvedCase = false;
  debounceSendPayload: Subject<boolean> = new Subject<boolean>();
  destroy$: Subject<void> = new Subject<void>();
  constructor(
    public toastr: ToastrService,
    public purchaseOrderService: PurchaseOrderService,
    private router: Router,
    public orderService: OrderService,
    private pipelineService: PipelineService,
  ) {}

  ngOnInit(): void {
    this.purchaseOrderService.unFixedList.subscribe((list) => {
      this.isHaveUnresolvedCase = list.length > 0;
    });

    this.sendPayloadEmitter();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  repeatSendPayload(): void {
    this.debounceSendPayload.next(true);
  }

  sendPayloadEmitter() {
    this.debounceSendPayload.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      switch (this.orderService.currentStatus) {
        case EnumPurchaseOrderStatus.FOLLOW:
          this.pipelineService
            .sendPayload(this.orderService.audience.id, this.orderService.audience?.psid, EnumPurchasingPayloadType.CONFIRM_ORDER, this.orderService.audience.platform)
            .pipe(
              takeUntil(this.destroy$),
              tap(() => {
                //
                this.toastr.success('Sent', 'Transaction card', { positionClass: 'toast-bottom-right' });
              }),
            )
            .subscribe();
          break;
        case EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT:
          this.pipelineService
            .sendPayload(this.orderService.audience.id, this.orderService.audience?.psid, EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT, this.orderService.audience.platform)
            .pipe(
              takeUntil(this.destroy$),
              tap(() => {
                //
                this.toastr.success('Sent', 'Transaction card', { positionClass: 'toast-bottom-right' });
              }),
            )
            .subscribe();
          break;
        case EnumPurchaseOrderStatus.CONFIRM_PAYMENT:
          // if (this.orderService.isAutomate === false) {
          this.pipelineService
            .sendPayload(this.orderService.audience.id, this.orderService.audience?.psid, EnumPurchasingPayloadType.REPEAT_SEND_CHECKOUT, this.orderService.audience.platform)
            .pipe(
              takeUntil(this.destroy$),
              tap(() => {
                //
                this.toastr.success('Sent', 'Transaction card', { positionClass: 'toast-bottom-right' });
              }),
            )
            .subscribe();
          // }
          break;
        // if (this.orderService.paymentDetail) {
        //   if (this.orderService.paymentDetail.type === EnumPaymentType.CASH_ON_DELIVERY) {
        //     this.pipelineService.sendPayload(this.orderService.audience.id, this.orderService.audience?.psid, EnumPurchasingPayloadType.CHECK_ADDRESS_COD,
        // this.orderService.audience.platform).subscribe();
        //   }
        // } else {
        //   this.pipelineService.sendPayload(this.orderService.audience.id, this.orderService.audience?.psid, EnumPurchasingPayloadType.SEND_PAYMENT,
        //  this.orderService.audience.platform).subscribe();
        // }
        // break;
        case EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT: {
          this.pipelineService
            .sendPayload(this.orderService.audience.id, this.orderService.audience?.psid, EnumPurchasingPayloadType.CHECK_ADDRESS, this.orderService.audience.platform)
            .pipe(
              takeUntil(this.destroy$),
              tap(() => {
                //
              }),
            )
            .subscribe();
          break;
        }
        case EnumPurchaseOrderStatus.CLOSE_SALE:
        case CustomerDomainStatus.CLOSED:
          break;
      }
    });
  }

  openProductList(): void {
    void this.router.navigate(['/products/list/1']);
  }
}
