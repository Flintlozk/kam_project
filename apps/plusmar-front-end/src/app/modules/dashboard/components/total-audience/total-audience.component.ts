import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IDashboardWidgets } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'reactor-room-total-audience',
  templateUrl: './total-audience.component.html',
  styleUrls: ['./total-audience.component.scss'],
})
export class TotalAudienceComponent implements OnInit, OnChanges {
  @Input() withTitle = true;
  @Input() data: IDashboardWidgets;

  audienceSteps: { color: string; label: string; total: number; route: string }[];
  audienceTotal;

  automatedSteps;
  automatedTotal;

  padding = '20px';

  constructor(private router: Router, private audienceService: AudienceService, public translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setLabels();
  }

  setLabels() {
    this.audienceSteps = [
      {
        color: '#65b017',
        label: this.translate.instant('Inbox'),
        total: this.data?.inbox_audience,
        route: 'inbox',
      },
      {
        color: '#4267b3',
        label: this.translate.instant('Comment'),
        total: this.data?.comment_audience,
        route: 'comment',
      },
      // {
      //   color: '#dc493d',
      //   label: 'Live',
      //   total: this.data?.live_audience,
      //   route: '/messages/live',
      // },
    ];

    this.audienceTotal = this.audienceSteps.reduce((a, c) => a + c.total, 0);

    this.automatedSteps = [
      {
        text: this.translate.instant('Follow'),
        total: this.data?.automated_guest_leads,
        route: '/messages/inbox',
      },
      // {
      //   text: 'Leads',
      //   total: this.data?.automated_guest_follow,
      //   route: '/messages/comment',
      // },
      // {
      //   text: 'Customer Services',
      //   total: this.data?.automated_guest_customer_service,
      //   route: '/messages/live',
      // },
    ];

    this.automatedTotal = this.automatedSteps.reduce((a, c) => a + c.total, 0);
  }

  selectSubTab(event, routeBase, routeParam) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    void this.router.navigate(['/follows', routeBase, routeParam, 1]);
  }
  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.padding = '10px';
    } else this.padding = '20px';
  }
}
