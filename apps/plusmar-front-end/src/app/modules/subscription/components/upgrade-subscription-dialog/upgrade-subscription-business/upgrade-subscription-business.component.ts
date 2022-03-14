import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-upgrade-subscription-business',
  templateUrl: './upgrade-subscription-business.component.html',
  styleUrls: ['./upgrade-subscription-business.component.scss'],
})
export class UpgradeSubscriptionBusinessComponent implements OnInit {
  @Output() subscriptionPlanSelect = new EventEmitter<number>();
  @Input() isSubscriptionBusiness: boolean;
  @Input() currentPlanID: number;
  constructor() {}

  ngOnInit(): void {}

  scroll(): void {
    const el = document.getElementById('features');
    el.scrollIntoView();
  }

  selectSubscriptionPlan(subplanID: number): void {
    this.subscriptionPlanSelect.emit(subplanID);
  }
}
