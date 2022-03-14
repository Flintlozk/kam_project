import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { getUTCDateTimestamps } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthScope, ISubscriptionBudget } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-current-budget',
  templateUrl: './current-budget.component.html',
  styleUrls: ['./current-budget.component.scss'],
})
export class CurrentBudgetComponent implements OnInit, OnDestroy {
  @Input() theme = 'SOCIAL';
  themeType = EnumAuthScope;
  budget = { currentBudget: 0, updatedAt: getUTCDateTimestamps() } as ISubscriptionBudget;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private router: Router, private subscriptionService: SubscriptionService, public translate: TranslateService) {}

  ngOnInit(): void {
    this.getSubscriptionBudget();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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

  toHistory(): void {
    void this.router.navigate(['shopowner/credit']);
  }
}
