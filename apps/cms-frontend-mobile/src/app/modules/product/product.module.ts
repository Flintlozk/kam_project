import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product.routing';
import { NgModule } from '@angular/core';

import { ProductCategoriesModule } from './components/product-categories/product-categories.module';
import { ProductCategoryModule } from './components/product-category/product-category.module';
import { ProductImagesModule } from './components/product-images/product-images.module';
import { ProductImagesDialogModule } from './components/product-images-dialog/product-images-dialog.module';
import { ProductAttributesModule } from './components/product-attributes/product-attributes.module';
import { ProductDetailsModule } from './components/product-details/product-details.module';

const MODULES = [ProductCategoriesModule, ProductCategoryModule, ProductImagesModule, ProductImagesDialogModule, ProductAttributesModule, ProductDetailsModule];

@NgModule({
  declarations: [ProductComponent],
  imports: [CommonModule, ProductRoutingModule, MODULES],
  providers: [],
  exports: [ProductComponent],
})
export class ProductModule {}
