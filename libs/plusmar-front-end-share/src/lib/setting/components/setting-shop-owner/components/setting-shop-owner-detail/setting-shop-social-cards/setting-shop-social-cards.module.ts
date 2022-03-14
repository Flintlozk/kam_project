import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { SettingShopSocialCardsComponent } from './setting-shop-social-cards.component';

@NgModule({
  declarations: [SettingShopSocialCardsComponent],
  imports: [CommonModule, ITOPPLUSCDKModule, TranslateModule],
  exports: [SettingShopSocialCardsComponent],
})
export class SettingShopSocialCardsModule {}
