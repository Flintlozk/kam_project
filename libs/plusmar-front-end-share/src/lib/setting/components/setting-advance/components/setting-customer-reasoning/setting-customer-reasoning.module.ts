import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SettingCustomerReasoningComponent } from './setting-customer-reasoning.component';

@NgModule({
  declarations: [SettingCustomerReasoningComponent],
  imports: [CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatTabsModule, MatExpansionModule, TranslateModule],
  exports: [SettingCustomerReasoningComponent],
})
export class SettingCustomerReasoningModule {}
