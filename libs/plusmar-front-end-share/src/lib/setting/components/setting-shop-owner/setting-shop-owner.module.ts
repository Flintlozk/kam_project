import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AddressModule, CardModule, CustomDialogModule, HeadingModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { CreditTopupModule } from '@reactor-room/plusmar-front-end-share/topup/credit-topup.module';
import { CurrentBudgetModule, SettingLineDialogComponent, SettingShopOwnerDialogComponent, SettingShopSocialCardsModule } from './components';
import { SettingCompanyInfoModule } from './components/setting-company-info/setting-company-info.module';
import { SettingShopOwnerDetailModule } from './components/setting-shop-owner-detail/setting-shop-owner-detail.module';
import { SettingShopSubscriptionCommerceModule } from './components/setting-shop-subscription/setting-shop-subscription-commerce/setting-shop-subscription-commerce.module';
import { SettingShopSubscriptionFreeModule } from './components/setting-shop-subscription/setting-shop-subscription-free/setting-shop-subscription-free.module';
import { SettingShopSubscriptionBusinessModule } from './components/setting-shop-subscription/setting-shop-subscription-business/setting-shop-subscription-business.module';
import { SettingShopOwnerComponent } from './setting-shop-owner.component';

const COMPONENTS = [SettingShopOwnerComponent, SettingLineDialogComponent, SettingShopOwnerDialogComponent];
@NgModule({
  imports: [
    CommonModule,
    CardModule,
    LoaderModule,
    TranslateModule,
    SettingShopSocialCardsModule,
    CustomDialogModule,
    HeadingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    AddressModule,
    CurrentBudgetModule,
    CreditTopupModule,
    SettingCompanyInfoModule,
    SettingShopOwnerDetailModule,
    SettingShopSubscriptionFreeModule,
    SettingShopSubscriptionCommerceModule,
    SettingShopSubscriptionBusinessModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SettingShopOwnerModule {}
