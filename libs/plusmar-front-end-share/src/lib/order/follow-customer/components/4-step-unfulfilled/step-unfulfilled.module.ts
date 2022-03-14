import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepUnfulfilledComponent } from './step-unfulfilled.component';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [StepUnfulfilledComponent],
  imports: [CommonModule, CustomTableModule, MatTooltipModule, CustomTableContentModule, TranslateModule, TimeAgoPipeModule],
  exports: [StepUnfulfilledComponent],
})
export class StepUnfulfilledModule {}
