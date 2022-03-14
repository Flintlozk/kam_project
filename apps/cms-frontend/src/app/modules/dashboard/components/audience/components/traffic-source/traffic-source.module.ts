import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { TrafficSourceComponent } from './traffic-source.component';

@NgModule({
  declarations: [TrafficSourceComponent],
  imports: [CommonModule, DoughnutChartModule, TranslateModule],
  exports: [TrafficSourceComponent],
})
export class TrafficSourceModule {}
