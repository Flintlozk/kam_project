import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { FinishOrderComponent } from './finish-order.component';

@NgModule({
  declarations: [FinishOrderComponent],
  imports: [CommonModule, HeadingModule],
  exports: [FinishOrderComponent],
})
export class FinishOrderModule {}
