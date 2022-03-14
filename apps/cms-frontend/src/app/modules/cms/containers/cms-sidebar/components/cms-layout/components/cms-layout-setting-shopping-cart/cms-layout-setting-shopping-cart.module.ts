import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutSettingShoppingCartComponent } from './cms-layout-setting-shopping-cart.component';
import { CmsLayoutShoppingCartLandingPageModule } from './components/cms-layout-shopping-cart-landing-page/cms-layout-shopping-cart-landing-page.module';
import { CmsLayoutShoppingCartPatternModule } from './components/cms-layout-shopping-cart-pattern/cms-layout-shopping-cart-pattern.module';
import { CmsLayoutShoppingCartProductsModule } from './components/cms-layout-shopping-cart-products/cms-layout-shopping-cart-products.module';

@NgModule({
  declarations: [CmsLayoutSettingShoppingCartComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutShoppingCartPatternModule, CmsLayoutShoppingCartProductsModule, CmsLayoutShoppingCartLandingPageModule],
  exports: [CmsLayoutSettingShoppingCartComponent],
})
export class CmsLayoutSettingShoppingCartModule {}
