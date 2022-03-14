import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SettingDirectMessageAddressDialogComponent,
  SettingDirectMessageIgnoreDialogComponent,
  SettingDirectMessageOrderDialogComponent,
  SettingOrderPipelineMessageComponent,
} from './components';
import { SettingAdvanceComponent } from './setting-advance.component';
import { SettingCustomerReasoningModule } from './components/setting-customer-reasoning/setting-customer-reasoning.module';
import { SettingCustomerSlaModule } from './components/setting-customer-sla/setting-customer-sla.module';
import { SettingLeadPipelineMessageModule } from './components/setting-lead-pipeline-message/setting-lead-pipeline-message.module';
import { SettingTermConditionModule } from './components/setting-term-condition/setting-term-condition.module';
import { SettingPrivacyPolicyModule } from './components/setting-privacy-policy/setting-privacy-policy.module';
import { SettingDataUseModule } from './components/setting-data-use/setting-data-use.module';
// import { SettingCustomerReasoningComponent } from './components/setting-customer-reasoning/setting-customer-reasoning.component';

@NgModule({
  declarations: [
    SettingAdvanceComponent,
    SettingDirectMessageIgnoreDialogComponent,
    SettingDirectMessageOrderDialogComponent,
    SettingDirectMessageAddressDialogComponent,
    SettingOrderPipelineMessageComponent,
    // SettingCustomerReasoningComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ITOPPLUSCDKModule,
    TranslateModule,
    MatTabsModule,
    MatExpansionModule,
    SettingCustomerReasoningModule,
    SettingCustomerSlaModule,
    SettingLeadPipelineMessageModule,
    SettingTermConditionModule,
    SettingPrivacyPolicyModule,
    SettingDataUseModule,
  ],
  exports: [
    SettingAdvanceComponent,
    SettingDirectMessageIgnoreDialogComponent,
    SettingDirectMessageOrderDialogComponent,
    SettingDirectMessageAddressDialogComponent,
    SettingOrderPipelineMessageComponent,
  ],
})
export class SettingAdvanceModule {}
