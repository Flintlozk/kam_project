import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingShopComponent } from './setting-shop.component';
import { SettingShopRoutingModule } from './setting-shop.routing';
import { HeadingModule } from 'apps/cms-frontend/src/app/components/heading/heading.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SettingPaymentModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-payment/setting-payment.module';
import { SettingLogisticModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-logistic/setting-logistic.module';
import { SettingShopOwnerModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/setting-shop-owner.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { TopupDialogModule } from '@reactor-room/plusmar-front-end-share/topup/topup-dialog/topup-dialog.module';

@NgModule({
  declarations: [SettingShopComponent],
  imports: [
    CommonModule,
    SettingShopRoutingModule,
    SettingPaymentModule,
    HeadingModule,
    MatTabsModule,
    TranslateModule,
    SettingLogisticModule,
    ReactiveFormsModule,
    CustomDialogModule,
    TopupDialogModule,
    SettingShopOwnerModule,
  ],
  exports: [SettingShopComponent],
})
export class SettingShopModule {}
