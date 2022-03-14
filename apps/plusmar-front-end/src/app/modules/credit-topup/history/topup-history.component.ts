import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ITopupHistories, EnumTopUpStatus } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CreditTopupService } from '@reactor-room/plusmar-front-end-share/topup/credit-topup.service';

@Component({
  selector: 'reactor-room-topup-history',
  templateUrl: './topup-history.component.html',
  styleUrls: ['./topup-history.component.scss'],
})
export class TopupHistoryComponent implements OnInit, OnDestroy {
  enumTopUpStatus = EnumTopUpStatus;
  histories: ITopupHistories[];
  tableHeader = [
    { sort: false, title: this.translate.instant('Date') },
    { sort: false, title: this.translate.instant('Description') },
    { sort: false, title: this.translate.instant('Balance') },
    { sort: false, title: this.translate.instant('Status') },
  ];

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private creditTopupService: CreditTopupService, public translate: TranslateService) {
    this.translate.onLangChange.subscribe((langs) => {
      this.getTopupHistories();
    });
  }

  ngOnInit(): void {
    this.getTopupHistories();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTopupHistories(): void {
    this.creditTopupService
      .getTopUpHistories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const clonedList = JSON.parse(JSON.stringify(result));
        for (let index = 0; index < clonedList.length; index++) {
          const messageSplit = result[index].description.split(':');
          const descNumber = messageSplit[0] + ': ';
          const newBalanceTextSplit = messageSplit[1].split(',')[0].substring(1, 21);
          const statusTextSplit = messageSplit[1].split(',')[0].substring(22, messageSplit[1].split(',')[0].length);
          const balanceAmount = messageSplit[1].split(',')[1];
          const fulldescriptionText: string = descNumber + this.translate.instant(newBalanceTextSplit) + ' ' + this.translate.instant(statusTextSplit) + ',' + balanceAmount;
          clonedList[index].description = fulldescriptionText;
        }

        this.histories = clonedList;
      });
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
