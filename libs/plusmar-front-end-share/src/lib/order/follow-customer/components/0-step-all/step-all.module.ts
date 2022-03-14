import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { StepAllComponent } from './step-all.component';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [StepAllComponent],
  imports: [CommonModule, CustomTableModule, CustomTableContentModule, TimeAgoPipeModule, TranslateModule],
  exports: [StepAllComponent],
})
export class StepAllModule {}
