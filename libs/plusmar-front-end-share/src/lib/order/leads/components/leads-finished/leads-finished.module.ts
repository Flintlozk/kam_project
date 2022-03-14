import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsFinishedComponent } from './leads-finished.component';
import { CustomTableContentModule, CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LeadsFinishedComponent],
  imports: [CommonModule, CustomTableModule, FilterModule, CustomTableContentModule, TimeAgoPipeModule, PaginationModule, TranslateModule],
  exports: [LeadsFinishedComponent],
})
export class LeadsFinishedModule {}
