import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceComponent } from './device.component';

@NgModule({
  declarations: [DeviceComponent],
  imports: [CommonModule, DoughnutChartModule, TranslateModule],
  exports: [DeviceComponent],
})
export class DeviceModule {}
