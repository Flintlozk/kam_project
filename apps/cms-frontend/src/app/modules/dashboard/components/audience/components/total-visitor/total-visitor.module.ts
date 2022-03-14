import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalVisitorComponent } from './total-visitor.component';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TotalVisitorComponent],
  imports: [CommonModule, DoughnutChartModule, TranslateModule],
  exports: [TotalVisitorComponent],
})
export class TotalVisitorModule {}
