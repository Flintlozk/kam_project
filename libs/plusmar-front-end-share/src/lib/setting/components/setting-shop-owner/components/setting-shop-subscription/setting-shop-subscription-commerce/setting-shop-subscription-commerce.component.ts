import { Component, OnInit, Input } from '@angular/core';
import { ISubscriptionLimitAndDetails } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-setting-shop-subscription-commerce',
  templateUrl: './setting-shop-subscription-commerce.component.html',
  styleUrls: ['./setting-shop-subscription-commerce.component.scss'],
})
export class SettingShopSubscriptionCommerceComponent implements OnInit {
  @Input() subscriptionLimitAndPrice: ISubscriptionLimitAndDetails;
  planName: string;

  ngOnInit(): void {
    this.planName = this.subscriptionLimitAndPrice.planName.toUpperCase();
  }
}
