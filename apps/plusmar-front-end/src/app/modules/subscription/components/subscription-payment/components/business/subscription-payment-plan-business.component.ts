import { Component, OnInit, Input } from '@angular/core';
import { ISubscriptionPlan } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-subscription-payment-plan-business',
  templateUrl: './subscription-payment-plan-business.component.html',
  styleUrls: ['./subscription-payment-plan-business.component.scss'],
})
export class SubscriptionPaymentPlanBusinessComponent implements OnInit {
  @Input() subscriptionPlan: ISubscriptionPlan;
  planName: string;
  constructor() {}

  ngOnInit(): void {
    this.planName = this.subscriptionPlan.planName.toUpperCase();
  }
}
