import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule, FormatCurrencyModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { UiBlockLoaderModule } from '@reactor-room/plusmar-front-end-share/components/ui-block-loader/ui-block-loader.module';
import { PromotionsProductDialogModule } from '@reactor-room/plusmar-front-end-share/promotions/components/promotions-product-dialog/promotions-product-dialog.module';
import { CartCautionComponent } from './cart-caution/cart-caution.component';
import { CartErrorsComponent } from './cart-errors/cart-errors.component';
import { OpenReportModule } from './open-report/open-report.module';
import { PurchaseCartComponent } from './purchase-cart.component';

@NgModule({
  declarations: [PurchaseCartComponent, CartCautionComponent, CartErrorsComponent],
  exports: [PurchaseCartComponent],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    CommonModule,
    OpenReportModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardModule,
    UiBlockLoaderModule,
    LoaderModule,
    FormatCurrencyModule,
    PromotionsProductDialogModule,
  ],
})
export class PurchaseCartModule {}
