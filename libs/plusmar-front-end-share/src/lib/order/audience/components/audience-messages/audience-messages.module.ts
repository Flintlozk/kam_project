import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceMessagesComponent } from './audience-messages.component';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule, PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [AudienceMessagesComponent],
  imports: [CommonModule, CustomTableModule, CustomTableContentModule, FormsModule, ReactiveFormsModule, TranslateModule, TimeAgoPipeModule, PaginationModule, LoaderModule],
  exports: [AudienceMessagesComponent],
})
export class AudienceMessagesModule {}
