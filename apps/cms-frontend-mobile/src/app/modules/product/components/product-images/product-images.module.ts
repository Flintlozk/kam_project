import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImagesComponent } from './product-images.component';
import { OptionToggleLayoutModule } from '../../../../components/option-toggle-layout/option-toogle-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ProductImagesComponent],
  imports: [CommonModule, OptionToggleLayoutModule, FormsModule, ReactiveFormsModule],
  exports: [ProductImagesComponent],
})
export class ProductImagesModule {}
