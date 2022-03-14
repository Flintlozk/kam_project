import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTemplatesComponent } from './message-templates.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomTableModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { PaginationModule } from '@reactor-room/itopplus-cdk/pagination/pagination.module';
import { TemplatesService } from '../templates.service';

@NgModule({
  declarations: [MessageTemplatesComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatTooltipModule, CustomTableModule, PaginationModule, TableActionModule],
  exports: [MessageTemplatesComponent],
})
export class MessageTemplatesModule {}
