import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSlaComponent } from './customer-sla.component';
import { CustomerSlaRoutingModule } from './customer-sla.routing';
import { AnimatedCurrencyModule, HeadingModule, PadstartModule, PaginationModule, PercentageModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AudienceStatusModule } from '@reactor-room/plusmar-front-end-share/pipes/audience-status/audience-status.module';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { AudienceContactFilterModule } from '@reactor-room/plusmar-front-end-share/order/audience-contact/components/audience-contact-filter/audience-contact-filter.module';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [CustomerSlaComponent],
  providers: [IntervalService],
  imports: [
    /* Route */
    CustomerSlaRoutingModule,
    /* Angular Modules */
    CommonModule,
    FormsModule,
    TranslateModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    /* Share Module */
    AudienceContactFilterModule,
    /* CDK*/
    HeadingModule,
    PaginationModule,
    PadstartModule,
    PercentageModule,
    TimeAgoPipeModule,
    CustomTableModule,
    AudienceStatusModule,
    AnimatedCurrencyModule,
    CustomTableContentModule,
    MatSliderModule,
  ],
})
export class CustomerSlaModule {}
