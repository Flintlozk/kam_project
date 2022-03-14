import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsComponent } from './logistics.component';
import { LogisticsRoutingModule } from './logistics.routing';
import { LogisticOperatorModule } from './logistic-operator/logistic-operator.module';

import { LogisticsService } from './logistics.service';

@NgModule({
  declarations: [LogisticsComponent],
  imports: [CommonModule, LogisticsRoutingModule, LogisticOperatorModule],
  providers: [LogisticsService],
  exports: [LogisticsComponent],
})
export class LogisticsModule {}
