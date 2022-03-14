import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductManagementComponent],
  imports: [CommonModule, HeadingModule, RouterModule],
  exports: [ProductManagementComponent],
})
export class ProductManagementModule {}
