import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './wizard.component';
import { WizardRoutingModule } from './wizard.routing';
import { AddressModule } from '@reactor-room/itopplus-cdk/address/address.module';
import { TranslateModule } from '@ngx-translate/core';

import {
  WizardStepsComponent,
  WizardStepOneComponent,
  WizardStepTwoComponent,
  WizardStepThreeComponent,
  WizardStepFourComponent,
  WizardStepFinishComponent,
  WizardStepFourBankAccountsComponent,
} from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderModule } from '@reactor-room/itopplus-cdk';

import { SettingShopOwnerModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/setting-shop-owner.module';
import { LogisticSystemModule } from '@reactor-room/plusmar-front-end-share/logistic-system/logistic-system.module';
import { SettingShopOwnerDetailModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/components/setting-shop-owner-detail/setting-shop-owner-detail.module';

@NgModule({
  declarations: [
    WizardComponent,
    WizardStepsComponent,
    WizardStepOneComponent,
    WizardStepTwoComponent,
    WizardStepThreeComponent,
    WizardStepFourComponent,
    WizardStepFourBankAccountsComponent,
    WizardStepFinishComponent,
  ],
  imports: [
    CommonModule,
    WizardRoutingModule,
    TranslateModule,
    AddressModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    LoaderModule,
    SettingShopOwnerModule,
    SettingShopOwnerDetailModule,
    LogisticSystemModule,
  ],
})
export class WizardModule {}
