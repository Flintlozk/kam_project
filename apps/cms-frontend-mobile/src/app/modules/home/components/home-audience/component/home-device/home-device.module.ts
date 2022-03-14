import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAudienceCardModule } from '../home-audience-card/home-audience-card.module';
import { HomeDeviceComponent } from './home-device.component';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomeDeviceComponent],
  imports: [CommonModule, HomeAudienceCardModule, DoughnutChartModule, TranslateModule],
  exports: [HomeDeviceComponent],
})
export class HomeDeviceModule {}
