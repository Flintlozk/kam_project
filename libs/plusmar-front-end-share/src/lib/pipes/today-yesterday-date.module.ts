import { NgModule } from '@angular/core';
import { TodayYesterdayDatePipe } from './today-yesterday-date.pipe';

@NgModule({
  declarations: [TodayYesterdayDatePipe],
  exports: [TodayYesterdayDatePipe],
})
export class TodayYesterdayDateModule {}
