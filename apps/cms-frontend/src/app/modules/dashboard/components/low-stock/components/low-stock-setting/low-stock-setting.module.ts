import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LowStockSettingComponent } from './low-stock-setting.component';
import { HeadingModule } from 'apps/cms-frontend/src/app/components/heading/heading.module';
import { CustomTableModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LowStockSettingComponent],
  imports: [CommonModule, HeadingModule, CustomTableModule, TableActionModule, FormsModule, ReactiveFormsModule],
  exports: [LowStockSettingComponent],
})
export class LowStockSettingModule {
  'assets': ['src/assets'];
}
