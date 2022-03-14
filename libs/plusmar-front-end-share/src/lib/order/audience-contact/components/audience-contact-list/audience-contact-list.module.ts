import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { AudienceContactListComponent } from './audience-contact-list.component';
import { CustomerTagsDialogModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tags-dialog/customer-tags-dialog.module';
import { AudienceContactFilterModule } from '../audience-contact-filter/audience-contact-filter.module';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { AudienceStatusModule } from '@reactor-room/plusmar-front-end-share/pipes/audience-status/audience-status.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TimeAgoPipeModule,
    MatSelectModule,
    ClickOutsideModule,
    MatTooltipModule,
    CustomerTagsDialogModule,
    AudienceContactFilterModule,
    TextTrimModule,
    AudienceStatusModule,
  ],
  declarations: [AudienceContactListComponent],
  exports: [AudienceContactListComponent],
})
export class AudienceContactListModule {}
