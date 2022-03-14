import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CmsLayoutTextModule } from '../../../cms-layout-text/cms-layout-text.module';
import { ITOPPLUSCDKModule } from './../../../../../../../../../../../../../../libs/itopplus-cdk/src/lib/itopplus-cdk.module';
import { CmsElementPositionModule } from './../../../../../../../../../../components/cms-element-position/cms-element-position.module';
import { CmsPopoverLayoutModule } from './../../../../../../../../../../components/cms-popover-layout/cms-popover-layout.module';
import { CmsLayoutShoppingCartProductsComponent } from './cms-layout-shopping-cart-products.component';
import { CmsShoppingCartProductAdvanceButtonBuyComponent } from './cms-shopping-cart-product-advance-button-buy/cms-shopping-cart-product-advance-button-buy.component';
import { CmsShoppingCartProductAdvanceButtonFavoriteComponent } from './cms-shopping-cart-product-advance-button-favorite/cms-shopping-cart-product-advance-button-favorite.component';
import { CmsShoppingCartProductAdvanceLabelBestSellerComponent } from './cms-shopping-cart-product-advance-label-best-seller/cms-shopping-cart-product-advance-label-best-seller.component';
import { CmsShoppingCartProductAdvanceLabelNewProductComponent } from './cms-shopping-cart-product-advance-label-new-product/cms-shopping-cart-product-advance-label-new-product.component';
import { CmsShoppingCartProductAdvanceLabelRecommendedComponent } from './cms-shopping-cart-product-advance-label-recommended/cms-shopping-cart-product-advance-label-recommended.component';
import { CmsShoppingCartProductAdvanceShowDescriptionComponent } from './cms-shopping-cart-product-advance-show-description/cms-shopping-cart-product-advance-show-description.component';
import { CmsShoppingCartProductAdvanceShowInventoryComponent } from './cms-shopping-cart-product-advance-show-inventory/cms-shopping-cart-product-advance-show-inventory.component';
import { CmsShoppingCartProductAdvanceShowMediaComponent } from './cms-shopping-cart-product-advance-show-media/cms-shopping-cart-product-advance-show-media.component';
import { CmsShoppingCartProductAdvanceShowPriceComponent } from './cms-shopping-cart-product-advance-show-price/cms-shopping-cart-product-advance-show-price.component';
import { CmsShoppingCartProductAdvanceShowProductNameComponent } from './cms-shopping-cart-product-advance-show-product-name/cms-shopping-cart-product-advance-show-product-name.component';
import { CmsShoppingCartProductAdvanceShowProductSKUComponent } from './cms-shopping-cart-product-advance-show-product-sku/cms-shopping-cart-product-advance-show-product-sku.component';
import { CmsShoppingCartProductAdvanceShowRatingProductsComponent } from './cms-shopping-cart-product-advance-show-rating-products/cms-shopping-cart-product-advance-show-rating-products.component';

@NgModule({
  declarations: [
    CmsLayoutShoppingCartProductsComponent,
    CmsShoppingCartProductAdvanceShowRatingProductsComponent,
    CmsShoppingCartProductAdvanceShowMediaComponent,
    CmsShoppingCartProductAdvanceShowProductNameComponent,
    CmsShoppingCartProductAdvanceShowProductSKUComponent,
    CmsShoppingCartProductAdvanceShowDescriptionComponent,
    CmsShoppingCartProductAdvanceShowPriceComponent,
    CmsShoppingCartProductAdvanceShowInventoryComponent,
    CmsShoppingCartProductAdvanceButtonBuyComponent,
    CmsShoppingCartProductAdvanceButtonFavoriteComponent,
    CmsShoppingCartProductAdvanceLabelNewProductComponent,
    CmsShoppingCartProductAdvanceLabelBestSellerComponent,
    CmsShoppingCartProductAdvanceLabelRecommendedComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    CmsPopoverLayoutModule,
    ITOPPLUSCDKModule,
    MatTabsModule,
    MatRadioModule,
    CmsLayoutTextModule,
    MatCheckboxModule,
    CmsElementPositionModule,
  ],
  exports: [CmsLayoutShoppingCartProductsComponent],
})
export class CmsLayoutShoppingCartProductsModule {}
