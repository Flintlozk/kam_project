import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { EnumSubscriptionPackageType } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-create-subscription-plan',
  templateUrl: './create-subscription-plan.component.html',
  styleUrls: ['./create-subscription-plan.component.scss'],
})
export class CreateSubscriptionPlanComponent implements OnInit {
  constructor(private ngZone: NgZone, private router: Router) {}
  @Input() isSubscriptionFree;
  @Input() isSubscriptionBusiness;
  @Input() isSubscriptionCommerce;
  @Input() isSubscriptionNoPlan;
  @Output() subscriptionPlanSelect = new EventEmitter<EnumSubscriptionPackageType>();

  isForceContactUs = false as boolean;
  EnumSubscriptionPackageType = EnumSubscriptionPackageType;
  ngOnInit(): void {}

  selectSubscriptionPlan(planType: EnumSubscriptionPackageType): void {
    this.subscriptionPlanSelect.emit(planType);
  }

  toContactUs(): void {
    void this.ngZone.run(() => this.router.navigateByUrl('https://more-commerce.com/contact'));
  }
}
