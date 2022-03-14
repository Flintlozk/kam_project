import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { SaleChannelComponent } from './sale-channel.component';

@NgModule({
  declarations: [SaleChannelComponent],
  imports: [CommonModule, HeadingModule],
  exports: [SaleChannelComponent],
})
export class SaleChannelModule {}
