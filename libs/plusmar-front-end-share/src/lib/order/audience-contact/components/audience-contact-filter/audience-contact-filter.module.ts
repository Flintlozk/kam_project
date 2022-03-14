import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceContactFilterComponent } from './audience-contact-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AudienceContactFilterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, ClickOutsideModule, MatTooltipModule],
  exports: [AudienceContactFilterComponent],
})
export class AudienceContactFilterModule {}
