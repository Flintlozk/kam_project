import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TimepickerModule } from '@reactor-room/itopplus-cdk';
import { SettingCustomerSlaComponent } from './setting-customer-sla.component';

@NgModule({
  declarations: [SettingCustomerSlaComponent],
  imports: [CommonModule, FormsModule, TimepickerModule, ReactiveFormsModule, MatExpansionModule, MatTooltipModule, TranslateModule],
  exports: [SettingCustomerSlaComponent],
})
export class SettingCustomerSlaModule {}
