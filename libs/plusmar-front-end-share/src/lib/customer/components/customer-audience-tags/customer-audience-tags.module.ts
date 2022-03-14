import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAudienceTagsComponent } from './customer-audience-tags.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomerAudienceTagsComponent],
  imports: [CommonModule, TranslateModule],
  exports: [CustomerAudienceTagsComponent],
})
export class CustomerAudienceTagsModule {}
