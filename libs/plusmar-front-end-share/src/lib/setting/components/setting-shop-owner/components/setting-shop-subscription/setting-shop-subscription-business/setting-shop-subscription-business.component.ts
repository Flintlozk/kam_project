import { Component, OnInit, Input } from '@angular/core';
import { EnumSubscriptionPackageType, ISubscriptionLimitAndDetails } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-setting-shop-subscription-business',
  templateUrl: './setting-shop-subscription-business.component.html',
  styleUrls: ['./setting-shop-subscription-business.component.scss'],
})
export class SettingShopSubscriptionBusinessComponent implements OnInit {
  @Input() subscriptionLimitAndPrice: ISubscriptionLimitAndDetails;
  planName: string;
  isEnterpriseBusiness: boolean;

  ngOnInit(): void {
    this.planName = this.subscriptionLimitAndPrice.planName.toUpperCase();
    this.isEnterpriseBusiness = this.subscriptionLimitAndPrice.packageType === EnumSubscriptionPackageType.ENTERPRISE_BUSINESS;
  }
}
