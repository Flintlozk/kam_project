import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './custom-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [CustomTableComponent],
  imports: [CommonModule, MatTooltipModule, TranslateModule, ClickOutsideModule],
  exports: [CustomTableComponent],
})
export class CustomTableModule {}
