import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableContentComponent } from './custom-table-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyTextPipe, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [CustomTableContentComponent, EmptyTextPipe],
  imports: [CommonModule, TranslateModule, TextTrimModule, MatTooltipModule, TimeAgoPipeModule],
  exports: [CustomTableContentComponent],
})
export class CustomTableContentModule {}
