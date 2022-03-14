import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { AdminReasonsClosedCaseComponent } from './admin-reasons-closed-case.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AdminReasonsClosedCaseComponent],
  imports: [CommonModule, NgChartsModule, TranslateModule],
  exports: [AdminReasonsClosedCaseComponent],
})
export class AdminReasonsClosedCaseModule {}
