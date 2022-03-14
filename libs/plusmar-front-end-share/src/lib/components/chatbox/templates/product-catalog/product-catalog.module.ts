import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCatalogComponent } from './product-catalog.component';

@NgModule({
  declarations: [ProductCatalogComponent],
  imports: [CommonModule, TranslateModule],
  exports: [ProductCatalogComponent],
})
export class ProductCatalogModule {}
