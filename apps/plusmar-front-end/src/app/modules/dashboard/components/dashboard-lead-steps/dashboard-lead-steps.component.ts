import { Component, Input, OnInit, OnChanges, ViewEncapsulation, SimpleChanges, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IDashboardWidgets } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-dashboard-lead-steps',
  templateUrl: './dashboard-lead-steps.component.html',
  styleUrls: ['./dashboard-lead-steps.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardLeadStepsComponent implements OnInit, OnChanges {
  @Input() withTitle = true;
  @Input() data: IDashboardWidgets;
  steps: { label: string; text: string; total: number; image: string; route: string }[];

  padding = '20px';

  constructor(public translate: TranslateService) {
    translate.onLangChange.subscribe((lang) => {
      this.setSteps();
    });
  }

  setSteps() {
    this.steps = [
      {
        label: `${this.translate.instant('Step')} 1`,
        text: this.translate.instant('Follow'),
        total: this.data ? this.data.leads_follow : 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/leads/follow/1',
      },
      {
        label: `${this.translate.instant('Step')} 2`,
        text: this.translate.instant('Finished'),
        total: this.data ? this.data.leads_finished : 0,
        image: 'assets/img/step-icon-close-sales-bright.svg',
        route: '/leads/finished/1',
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const leadStepContainer = document.getElementById('lead-steps-container') as HTMLElement;
    if (event.target.innerWidth <= 992) {
      leadStepContainer.style.maxWidth = event.target.innerWidth - 60 + 'px';
      this.padding = '10px';
    }
  }

  ngOnInit(): void {
    const leadStepContainer = document.getElementById('lead-steps-container') as HTMLElement;
    if (window.innerWidth <= 992) {
      leadStepContainer.style.maxWidth = window.innerWidth - 60 + 'px';
      this.padding = '10px';
    } else this.padding = '20px';
    this.setSteps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setSteps();
  }
}
