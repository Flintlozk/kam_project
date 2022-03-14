import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopPageSwitcherComponent } from './shop-page-switcher.component';
import { ClickOutsideModule } from '../click-outsite-directive/click-outside.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ShopPageSwitcherComponent],
  imports: [CommonModule, ClickOutsideModule, TranslateModule, MatTooltipModule],
  exports: [ShopPageSwitcherComponent],
})
export class ShopPageSwitcherModule {}
