import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ProductStatusLinkedToMarketPlacePipeModule } from './pipes/product-status-liked-to-marketplace-pipe.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomChipsModule, CustomTableModule, QuillEditorModule } from '@reactor-room/plusmar-cdk';
import { QuillModule } from 'ngx-quill';
import { ProductMarketplaceListModule } from './components/product-marketplace-list/product-marketplace-list.module';
import { PublishOnLazadaModule } from './components/products-create/components/marketplace-publish/publish-on-lazada/publish-on-lazada.module';
import { PublishOnShopeeModule } from './components/products-create/components/marketplace-publish/publish-on-shopee/publish-on-shopee.module';
import { VariantImageDialogComponent } from './components/products-create/components/product-create-variants/variant-image-dialog/variant-image-dialog.component';
import { ProductListModule } from './components/products-list/product-list.module';
import { productsComponents, ProductsRoutingModule } from './products.routing';
import { ProductAddVariantsComponent } from './components/products-create/components/product-add-variants/product-add-variants.component';

registerLocaleData(localePt, 'th-TH');
@NgModule({
  declarations: [...productsComponents, VariantImageDialogComponent, ProductAddVariantsComponent],
  imports: [
    CommonModule,
    ITOPPLUSCDKModule,
    ProductsRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ProductListModule,
    TranslateModule,
    QuillEditorModule,
    MatMenuModule,
    MatTooltipModule,
    ProductMarketplaceListModule,
    CustomTableModule,
    CustomChipsModule,
    PublishOnShopeeModule,
    PublishOnLazadaModule,
    ProductStatusLinkedToMarketPlacePipeModule,
  ],
  exports: [],
})
export class ProductsModule {}
