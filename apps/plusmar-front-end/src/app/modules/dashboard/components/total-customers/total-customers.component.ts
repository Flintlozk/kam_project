import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IDashboardOrders, IDashboardWidgets } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'reactor-room-total-customers',
  templateUrl: './total-customers.component.html',
  styleUrls: ['./total-customers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TotalCustomersComponent implements OnInit, OnChanges {
  @Input() withTitle = true;
  @Input() data: IDashboardOrders;
  steps: { index: number; label: string; text: string; total: number; image: string; route: string }[];

  padding = '20px';

  constructor(private audienceService: AudienceService, public translate: TranslateService) {
    translate.onLangChange.subscribe((lang) => {
      this.setSteps();
    });
  }

  setSteps() {
    this.steps = [
      {
        index: 0,
        label: `${this.translate.instant('Step')} 1`,
        text: this.translate.instant('Follow'),
        total: this.data ? this.data.follow_customers : 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/follow',
      },
      {
        index: 1,
        label: `${this.translate.instant('Step')} 2`,
        text: this.translate.instant('Waiting for Payment'),
        total: this.data ? this.data.waiting_for_payment_customers : 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/pending',
      },
      {
        index: 2,
        label: `${this.translate.instant('Step')} 3`,
        text: this.translate.instant('Confirm Payment'),
        total: this.data ? this.data.confirm_payment_customers : 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/confirm-payment',
      },
      {
        index: 3,
        label: `${this.translate.instant('Step')} 4`,
        text: this.translate.instant('Waiting for Shipment'),
        total: this.data ? this.data.waiting_for_shipment_customers : 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/unfulfilled',
      },
      {
        index: 4,
        label: `${this.translate.instant('Step')} 5`,
        text: this.translate.instant('Close Sales'),
        total: this.data ? this.data.closed_customers : 0,
        image: 'assets/img/step-icon-close-sales-bright.svg',
        route: '/order/close-sales',
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const cardsContainer = document.getElementById('cards-container') as HTMLElement;
    if (event.target.innerWidth <= 992) {
      cardsContainer.style.maxWidth = event.target.innerWidth - 60 + 'px';
      this.padding = '10px';
    }
  }

  ngOnInit(): void {
    const cardsContainer = document.getElementById('cards-container') as HTMLElement;
    if (window.innerWidth <= 992) {
      cardsContainer.style.maxWidth = window.innerWidth - 60 + 'px';
      this.padding = '10px';
    } else this.padding = '20px';
    this.setSteps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setSteps();
  }
}
