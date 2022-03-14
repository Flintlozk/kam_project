import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenReportComponent } from './open-report.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OpenReportComponent],
  exports: [OpenReportComponent],
  imports: [CommonModule, TranslateModule],
})
export class OpenReportModule {}
