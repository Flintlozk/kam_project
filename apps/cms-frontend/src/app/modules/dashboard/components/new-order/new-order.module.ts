import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewOrderComponent } from './new-order.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [NewOrderComponent],
  imports: [CommonModule, HeadingModule],
  exports: [NewOrderComponent],
})
export class NewOrderModule {}
