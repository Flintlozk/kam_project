import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from '../click-outsite-directive/click-outside.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubscriptionSwitcherComponent } from './subscription-switcher.component';

@NgModule({
  declarations: [SubscriptionSwitcherComponent],
  imports: [CommonModule, TranslateModule, MatTooltipModule, ClickOutsideModule],
  exports: [SubscriptionSwitcherComponent],
})
export class SubscriptionSwitcherModule {}
