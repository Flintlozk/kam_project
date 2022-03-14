import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopOwnerInfoComponent } from './shop-owner-info.component';
import { HeadingModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

import { ShopOwnerInfoRoutingModule } from './show-owner-info.routing';

import { TopupHistoryModule } from '../credit-topup/history/topup-history.module';
import { SettingShopOwnerModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/setting-shop-owner.module';
@NgModule({
  declarations: [ShopOwnerInfoComponent],
  imports: [CommonModule, HeadingModule, TranslateModule, MatTabsModule, ShopOwnerInfoRoutingModule, SettingShopOwnerModule, TopupHistoryModule],
  exports: [ShopOwnerInfoComponent],
})
export class ShopOwnerInfoModule {}
