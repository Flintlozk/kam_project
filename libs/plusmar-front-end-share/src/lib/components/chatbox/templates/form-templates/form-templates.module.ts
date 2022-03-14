import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTemplatesComponent } from './form-templates.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FormTemplatesComponent],
  imports: [CommonModule, ReactiveFormsModule, CustomTableModule, TranslateModule, MatTooltipModule, PaginationModule],
  exports: [FormTemplatesComponent],
})
export class FormTemplatesModule {}
