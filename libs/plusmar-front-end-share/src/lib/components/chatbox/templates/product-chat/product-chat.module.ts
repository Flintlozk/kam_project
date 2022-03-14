import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductChatComponent } from './product-chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { TemplatesService } from '../templates.service';

@NgModule({
  declarations: [ProductChatComponent],
  imports: [CommonModule, CustomTableModule, ReactiveFormsModule, TranslateModule, PaginationModule],
  exports: [ProductChatComponent],
})
export class ProductChatModule {}
