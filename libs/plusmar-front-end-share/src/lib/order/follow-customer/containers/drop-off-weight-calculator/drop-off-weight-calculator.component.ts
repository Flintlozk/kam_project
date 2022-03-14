import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { TopupDialogComponent } from '@reactor-room/plusmar-front-end-share/topup/topup-dialog/topup-dialog.component';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { getUTCDateTimestamps } from '@reactor-room/itopplus-front-end-helpers';
import { EnumPurchaseOrderError, ICalculatedShipping, ISubscriptionBudget, ITopupRequest2C2P, PaymentShippingDetail } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'reactor-room-drop-off-weight-calculator',
  templateUrl: './drop-off-weight-calculator.component.html',
  styleUrls: ['./drop-off-weight-calculator.component.scss'],
})
export class DropOffWeightCalculatorComponent implements OnInit, OnDestroy {
  isReady = false;
  isAlert = false;
  isWeightOutOfRange = false;
  orderList: ICalculatedShipping = { orders: [], totalPrice: 0, isAfford: false };
  isMultiple = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  budget = { currentBudget: 0, updatedAt: getUTCDateTimestamps() } as ISubscriptionBudget;

  constructor(
    private subscriptionService: SubscriptionService,
    private logisticsService: LogisticsService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DropOffWeightCalculatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentShippingDetail,
    public orderService: OrderService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getCalculatedShippingPrice();
    this.getSubscriptionBudget();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getSubscriptionBudget(): void {
    this.subscriptionService
      .getSubscriptionBudget()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: ISubscriptionBudget) => {
        if (result != null) {
          this.budget = result;
        }
      });
  }

  getCalculatedShippingPrice(): void {
    this.logisticsService
      .calculateShippingPrice(this.data.orderIDs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.orderList = res;
          this.checkReadiness();
        },
        (err) => {
          if (err.message.indexOf(EnumPurchaseOrderError.WEIGHT_OUT_OF_RANGE) !== -1) {
            this.orderService.openDialogError(this.translate.instant('Weight Out Of Range'));
            this.isWeightOutOfRange = true;
          } else {
            this.orderService.openDialogError(err.message);
          }
        },
      );
  }

  checkReadiness(): void {
    if (this.orderList.isAfford) {
      this.isReady = true;
    } else {
      this.isAlert = true;
    }
  }

  openTopUpDialog(): void {
    const paymentSetting = {
      version: environmentLib.PAYMENT_2C2P_VERSION,
      merchant_id: '',
      payment_description: 'More-Commerce Topup',
      order_id: '',
      currency: 0,
      amount: '',
      returnurl: '', //result_url_1
      postbackurl: '', //result_url_2
      request_3ds: environmentLib.PAYMENT_2C2P_REQUEST_3DS,
      payment_option: '',
      user_defined_1: '',
      user_defined_2: '',
      user_defined_3: '',
      user_defined_4: '',
      hash_value: '',
    } as ITopupRequest2C2P;

    this.dialog.open(TopupDialogComponent, {
      width: '30%',
      data: paymentSetting,
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
  submitCredit(): void {
    if (this.isReady && this.orderList.isAfford) {
      this.dialogRef.close(true);
    }
  }
}
