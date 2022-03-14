import { Component, OnDestroy, OnInit } from '@angular/core';
import { ILogisticsOperator } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogisticsService } from './logistics.service';
@Component({
  selector: 'admin-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.scss'],
})
export class LogisticsComponent implements OnInit, OnDestroy {
  bundles: ILogisticsOperator[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public logisticsService: LogisticsService) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getBundles();
  }

  getBundles(): void {
    this.logisticsService
      .getLogisticBundles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.bundles = res;
        },
        (err) => {
          console.log('err ::::::::::>>> ', err);
        },
      );
  }

  bundleAddedHandler(status: number): void {
    if (status === 200) this.getBundles();
  }

  trackBy(index: number, el: ILogisticsOperator): number {
    return el.logistic_operator_id;
  }
}
