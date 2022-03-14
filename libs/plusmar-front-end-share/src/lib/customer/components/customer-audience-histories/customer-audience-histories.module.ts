import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAudienceHistoriesComponent } from './customer-audience-histories.component';
import { CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule, PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { MatSelectModule } from '@angular/material/select';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { AudienceContactFilterModule } from '@reactor-room/plusmar-front-end-share/order/audience-contact/components/audience-contact-filter/audience-contact-filter.module';

@NgModule({
  declarations: [CustomerAudienceHistoriesComponent],
  imports: [
    CommonModule,
    CustomTableModule,
    FilterModule,
    TextTrimModule,
    TranslateModule,
    PaginationModule,
    MatSelectModule,
    TimeAgoPipeModule,
    LoaderModule,
    AudienceContactFilterModule,
  ],
  exports: [CustomerAudienceHistoriesComponent],
})
export class CustomerAudienceHistoriesModule {}
