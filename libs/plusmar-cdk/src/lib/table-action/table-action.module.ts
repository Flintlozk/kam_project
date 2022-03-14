import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableActionComponent } from './table-action.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TableActionComponent],
  imports: [CommonModule, MatMenuModule, MatTooltipModule, TranslateModule],
  exports: [TableActionComponent],
})
export class TableActionModule {}
