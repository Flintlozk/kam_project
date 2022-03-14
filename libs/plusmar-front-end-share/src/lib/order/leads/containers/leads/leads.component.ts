import { Component, HostListener, OnInit, OnDestroy, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { FilterDateService } from '@reactor-room/plusmar-front-end-share/services/filter-date.service';

import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { IStep } from '@reactor-room/itopplus-model-lib';
import { Subscription, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  providers: [IntervalService],
  selector: 'reactor-room-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
})
export class LeadsComponent implements OnInit, OnDestroy {
  headingTitle = 'Lead Info';
  Route: string = 'Leads ' + this.headingTitle;

  steps: IStep[];
  stepsContainer;

  range;

  destroy$ = new Subject();
  interval$: Subscription;
  INTERVAL_THRESHOLD = 30000;
  refetch = false;

  constructor(
    @Inject(IntervalService) private intervalService: IntervalService,
    private audienceService: AudienceService,
    private filterDateService: FilterDateService,
    public translate: TranslateService,
  ) {}

  setLabels() {
    this.steps = [
      { label: 'Step 1', text: 'Follow', total: 0, image: 'assets/img/icon_next.svg', route: 'follow/1' },
      { label: 'Step 2', text: 'Finished', total: 0, image: 'assets/img/step-icon-close-sales.svg', route: 'finished/1' },
    ];
  }

  getTotals(range): void {
    const { start, end } = range;
    if (start && end)
      this.audienceService
        .getLeadsListTotal(range, this.refetch)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result) => {
            this.steps[0].total = result?.follow || 0;
            this.steps[1].total = result?.finished || 0;
          },
          (err) => {
            console.log(err);
          },
        );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 992) {
      if (this.stepsContainer) this.stepsContainer.style.maxWidth = event.target.innerWidth - 40 + 'px';
    }
  }

  cardStepOffsetLeft(event): void {
    if (this.stepsContainer) {
      this.stepsContainer.scrollLeft = event;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.intervalService.stopInterval();
    this.interval$?.unsubscribe();
  }

  ngOnInit(): void {
    this.setLabels();
    this.getSharedDate();
    this.startInterval();
    this.setContainerWidth();
  }

  getSharedDate(): void {
    this.filterDateService.sharedDate.pipe(takeUntil(this.destroy$)).subscribe((range) => {
      this.range = range;
      this.refetch = true;
      this.getTotals(this.range);
    });
  }

  setContainerWidth(): void {
    this.stepsContainer = document.getElementById('lead-steps-container') as HTMLElement;
    if (window.innerWidth <= 992) {
      if (this.stepsContainer) this.stepsContainer.style.maxWidth = window.innerWidth - 40 + 'px';
    }
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getTotals(this.range);
      });
  }
}
