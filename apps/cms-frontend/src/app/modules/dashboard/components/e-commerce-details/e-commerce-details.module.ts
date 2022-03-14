import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECommerceDetailsComponent } from './e-commerce-details.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [ECommerceDetailsComponent],
  imports: [CommonModule, HeadingModule],
  exports: [ECommerceDetailsComponent],
})
export class ECommerceDetailsModule {}
