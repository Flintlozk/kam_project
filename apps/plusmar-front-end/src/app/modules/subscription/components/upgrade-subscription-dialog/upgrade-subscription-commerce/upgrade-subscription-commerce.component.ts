import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-upgrade-subscription-commerce',
  templateUrl: './upgrade-subscription-commerce.component.html',
  styleUrls: ['./upgrade-subscription-commerce.component.scss'],
})
export class UpgradeSubscriptionCommerceComponent implements OnInit {
  constructor() {}
  @Output() subscriptionPlanSelect = new EventEmitter<number>();
  @Input() isSubscriptionBusiness: boolean;
  @Input() currentPlanID: number;

  ngOnInit(): void {}

  scroll(): void {
    const el = document.getElementById('features');
    el.scrollIntoView();
  }

  selectSubscriptionPlan(subplanID: number): void {
    this.subscriptionPlanSelect.emit(subplanID);
  }
}
