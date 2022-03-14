import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';

import { OrderActionComponent } from './order-action.component';
import { DropOffWeightCalculatorModule } from '../../containers/drop-off-weight-calculator/drop-off-weight-calculator.module';
import { DropOffCompleteModule } from '../../containers/drop-off-complete/drop-off-complete.module';

@NgModule({
  declarations: [OrderActionComponent],
  exports: [OrderActionComponent],
  imports: [CommonModule, TranslateModule, ComponentModule, DropOffCompleteModule, DropOffWeightCalculatorModule, ITOPPLUSCDKModule],
})
export class OrderActionModule {}
