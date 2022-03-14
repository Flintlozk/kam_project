import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCmsTableComponent } from './custom-cms-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [CustomCmsTableComponent],
  imports: [CommonModule, MatTooltipModule, TranslateModule, ClickOutsideModule],
  exports: [CustomCmsTableComponent],
})
export class CustomCmsTableModule {}
