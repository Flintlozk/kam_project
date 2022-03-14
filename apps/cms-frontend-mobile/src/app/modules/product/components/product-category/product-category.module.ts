import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryComponent } from './product-category.component';
import { RouterModule } from '@angular/router';
import { CurrencyModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ProductCategoryComponent],
  imports: [CommonModule, RouterModule, CurrencyModule, TranslateModule],
  exports: [ProductCategoryComponent],
})
export class ProductCategoryModule {}
