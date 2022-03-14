import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAudienceCardModule } from '../home-audience-card/home-audience-card.module';
import { HomeTrafficSourceComponent } from './home-traffic-source.component';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomeTrafficSourceComponent],
  imports: [CommonModule, HomeAudienceCardModule, DoughnutChartModule, TranslateModule],
  exports: [HomeTrafficSourceComponent],
})
export class HomeTrafficSourceModule {}
