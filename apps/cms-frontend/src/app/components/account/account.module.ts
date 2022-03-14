import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk/click-outsite-directive/click-outside.module';
import { SubscriptionSwitcherModule } from '@reactor-room/itopplus-cdk/subscription-switcher/subscription-switcher.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, ClickOutsideModule, SubscriptionSwitcherModule],
  exports: [AccountComponent],
})
export class AccountModule {}
