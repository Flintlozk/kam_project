import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SettingLogisticJAndTExpressDetailComponent } from './setting-logistic-j&t-express-detail.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticJAndTExpressDetailComponent],
  imports: [CommonModule, TranslateModule, MatSelectModule, ReactiveFormsModule],
  exports: [SettingLogisticJAndTExpressDetailComponent],
})
export class SettingLogisticJAndTExpressDetailModule {}
