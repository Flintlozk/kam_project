import { NgModule } from '@angular/core';
import { DateToUnixPipe } from './date-to-unix.pipe';

@NgModule({
  declarations: [DateToUnixPipe],
  exports: [DateToUnixPipe],
})
export class DateToUnixModule {}
