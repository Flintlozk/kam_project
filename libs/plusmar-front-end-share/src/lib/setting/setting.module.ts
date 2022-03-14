import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule, LoaderModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { AddressModule } from '@reactor-room/itopplus-cdk/address/address.module';
import { CustomTableContentModule, CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { LogDescriptionTranslatePipeModule } from '@reactor-room/plusmar-front-end-share/pipes/log-description-translate.pipe.module';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { SettingAdvanceModule, SettingInvalidComponent, SettingLogComponent, SettingOrderComponent, SettingTaxComponent } from './components';
import { SettingDirectAdminModule } from './components/setting-direct-admin/setting-direct-admin.module';
import { SettingGeneralModule } from './components/setting-general/setting-general.module';
import { SettingLogisticModule } from './components/setting-logistic/setting-logistic.module';
import { SettingOpenapiModule } from './components/setting-openapi/setting-openapi.module';
import { SettingOrderExpiredDialogComponent, SettingOrderPrefixDialogComponent } from './components/setting-order/components';
import { CompanyInfoDialogComponent } from './components/setting-shop-owner/components/setting-company-info/company-info-dialog/company-info-dialog.component';

import { SettingShopOwnerModule } from './components/setting-shop-owner/setting-shop-owner.module';
import { SettingTaxDialogComponent } from './components/setting-tax/components';
import { SettingComponent } from './setting.component';
import { SettingPaymentModule } from './components/setting-payment/setting-payment.module';
import { SettingModuleService } from './setting.module.service';
import { SettingRoutingModule } from './setting.routing';
import { SettingHowtoLineModule } from './components/setting-shop-owner/components/setting-howto-line/setting-howto-line.module';
import { SettingShopOwnerSocialNetworkModule } from './components/setting-shop-owner/components/setting-shop-owner-social-network/setting-shop-owner-social-network.module';

registerLocaleData(localePt, 'th-TH');

const COMPONENTS = [
  SettingComponent,
  SettingTaxComponent,
  SettingTaxDialogComponent,
  SettingOrderComponent,
  SettingOrderPrefixDialogComponent,
  SettingOrderExpiredDialogComponent,
  SettingLogComponent,
  SettingInvalidComponent,
  //SettingHowtoLineComponent,
  // CompanyInfoDialogComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ITOPPLUSCDKModule,
    SettingRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslateModule,
    MatExpansionModule,
    MatTreeModule,
    MatTooltipModule,
    SettingDirectAdminModule,
    SettingLogisticModule,
    SettingAdvanceModule,
    SettingGeneralModule,
    SettingShopOwnerModule,
    AddressModule,
    CustomTableContentModule,
    CustomTableModule,
    FilterModule,
    SettingOpenapiModule,
    LogDescriptionTranslatePipeModule,
    LoaderModule,
    TimeAgoPipeModule,
    SettingPaymentModule,
    SettingHowtoLineModule,
    SettingShopOwnerSocialNetworkModule,
  ],
  providers: [PaymentsService, SettingModuleService],
})
export class SettingModule {}
