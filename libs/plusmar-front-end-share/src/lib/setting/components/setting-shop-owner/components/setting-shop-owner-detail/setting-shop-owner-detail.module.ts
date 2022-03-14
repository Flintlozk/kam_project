import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingShopOwnerDetailComponent } from './setting-shop-owner-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressModule, CardModule, HeadingModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { SettingShopSocialCardsModule } from './setting-shop-social-cards/setting-shop-social-cards.module';
import { SettingCompanyInfoModule } from '../setting-company-info/setting-company-info.module';
import { SettingShopOwnerSocialNetworkModule } from '../setting-shop-owner-social-network/setting-shop-owner-social-network.module';
import { SettingHowtoLineModule } from '../setting-howto-line/setting-howto-line.module';
import { SettingShopOwnerDetailRoutingModule } from './setting-shop-owner-detail.routing';

@NgModule({
  declarations: [SettingShopOwnerDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeadingModule,
    TranslateModule,
    CardModule,
    MatSelectModule,
    AddressModule,
    SettingShopSocialCardsModule,
    SettingCompanyInfoModule,
    LoaderModule,
    SettingShopOwnerSocialNetworkModule,
    SettingHowtoLineModule,
    SettingShopOwnerDetailRoutingModule,
  ],
  exports: [SettingShopOwnerDetailComponent],
})
export class SettingShopOwnerDetailModule {}
