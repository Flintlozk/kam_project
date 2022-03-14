import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoriesComponent } from './product-categories.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ProductCategoriesComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [ProductCategoriesComponent],
})
export class ProductCategoriesModule {}
