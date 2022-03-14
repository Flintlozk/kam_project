import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumAuthScope, EnumSubscriptionPackageType, EnumUserSubscriptionType, ISubscriptionContext, IUserSubscriptionsContext } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-subscription-switcher',
  templateUrl: './subscription-switcher.component.html',
  styleUrls: ['./subscription-switcher.component.scss'],
})
export class SubscriptionSwitcherComponent implements OnInit {
  @Input() userSubscriptionsContext: IUserSubscriptionsContext;
  @Input() userSubscriptions;
  @Input() activeSubscription;
  @Input() hasSub;
  @Output() subcriptionItemClick = new EventEmitter<ISubscriptionContext>();
  @Output() createSubscriptionClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  @Input() theme: EnumAuthScope;
  themeType = EnumAuthScope;

  accountToogleStatus = false;
  EnumSubscriptionPackageType = EnumSubscriptionPackageType;
  EnumUserSubscriptionType = EnumUserSubscriptionType;

  constructor() {}

  ngOnInit(): void {}

  clickedOutsideEvent(event) {
    if (event) this.accountToogleStatus = false;
  }
  accountToogle() {
    this.accountToogleStatus = !this.accountToogleStatus;
  }
  setSubscriptionItemStatus(item) {
    this.accountToogleStatus = true;
    this.subcriptionItemClick.emit(item);
  }
  createSubscription() {
    this.createSubscriptionClick.emit();
  }
  logout() {
    this.logoutClick.emit();
  }
}
