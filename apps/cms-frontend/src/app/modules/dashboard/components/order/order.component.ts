import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DashboardOrderService } from '../../services/order/dashboard-order.service';
import { takeUntil } from 'rxjs/operators';
import { AudienceCounter, AudienceDomainType } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'cms-next-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  mainOrderTotal;
  orderData = [
    {
      title: 'Step 1',
      subTitle: 'Follow',
      value: 0,
    },
    {
      title: 'Step 2',
      subTitle: 'Waiting for Payment',
      value: 0,
    },
    {
      title: 'Step 3',
      subTitle: 'Confirm Payment',
      value: 0,
    },
    {
      title: 'Step 4',
      subTitle: 'Waiting for Shipment',
      value: 0,
    },
    {
      title: 'Step 5',
      subTitle: 'Close Sales',
      value: 0,
    },
  ];
  constructor(public dashboardOrderService: DashboardOrderService) {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.dashboardOrderService
      .getDashboardOrderStats(AudienceDomainType.CUSTOMER)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.setData(result);
        },
        (err) => {
          console.log(': ', err);
        },
      );
  }
  trackByIndex(index: number): number {
    return index;
  }
  setData(data: AudienceCounter): void {
    this.mainOrderTotal = data.step1 + data.step2 + data.step3 + data.step4 || 0;
    this.orderData[0].value = data.step1 || 0;
    this.orderData[1].value = data.step2 || 0;
    this.orderData[2].value = data.step3 || 0;
    this.orderData[3].value = data.step4 || 0;
    this.orderData[4].value = data.step5 || 0;
  }
}
