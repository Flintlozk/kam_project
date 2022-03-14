import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSlaStatisticComponent } from './admin-sla-statistic.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AdminSlaStatisticComponent],
  imports: [CommonModule, TranslateModule],
  exports: [AdminSlaStatisticComponent],
})
export class AdminSlaStatisticModule {}
