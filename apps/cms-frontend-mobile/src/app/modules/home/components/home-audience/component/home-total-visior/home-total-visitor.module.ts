import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAudienceCardModule } from '../home-audience-card/home-audience-card.module';
import { HomeTotalVisiorComponent } from './home-total-visior.component';
import { DoughnutChartModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomeTotalVisiorComponent],
  imports: [CommonModule, HomeAudienceCardModule, DoughnutChartModule, TranslateModule],
  exports: [HomeTotalVisiorComponent],
})
export class HomeTotalVisitorModule {}
