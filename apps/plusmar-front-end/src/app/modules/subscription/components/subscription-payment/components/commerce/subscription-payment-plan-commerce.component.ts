import { Component, OnInit, Input } from '@angular/core';
import { ISubscriptionPlan } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-subscription-payment-plan-commerce',
  templateUrl: './subscription-payment-plan-commerce.component.html',
  styleUrls: ['./subscription-payment-plan-commerce.component.scss'],
})
export class SubscriptionPaymentPlanCommerceComponent implements OnInit {
  @Input() subscriptionPlan: ISubscriptionPlan;
  planName: string;
  constructor() {}

  ngOnInit(): void {
    this.planName = this.subscriptionPlan.planName.toUpperCase();
  }
}
