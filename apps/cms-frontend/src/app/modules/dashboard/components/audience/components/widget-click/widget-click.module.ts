import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { WidgetClickComponent } from './widget-click.component';
@NgModule({
  declarations: [WidgetClickComponent],
  imports: [CommonModule, DoughnutChartModule, TranslateModule],
  exports: [WidgetClickComponent],
})
export class WidgetClickModule {}
