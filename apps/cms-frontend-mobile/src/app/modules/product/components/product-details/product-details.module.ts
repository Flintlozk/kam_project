import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductImagesModule } from '../product-images/product-images.module';
import { ProductAttributesModule } from '../product-attributes/product-attributes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProductImagesModule, ProductAttributesModule, TranslateModule],
  exports: [ProductDetailsComponent],
})
export class ProductDetailsModule {}
