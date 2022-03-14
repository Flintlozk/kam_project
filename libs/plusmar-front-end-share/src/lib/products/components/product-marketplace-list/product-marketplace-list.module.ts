import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { PagesThirdPartyReconnectDialogModule } from './pages-third-party-reconnect-dialog/pages-third-party-reconnect-dialog.module';
import { ProductMarketplaceImportDialogModule } from './product-marketplace-import-dialog/product-marketplace-import-dialog.module';
import { ProductMarketplaceListComponent } from './product-marketplace-list.component';

@NgModule({
  declarations: [ProductMarketplaceListComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ITOPPLUSCDKModule,
    ProductMarketplaceImportDialogModule,
    MatDialogModule,
    CustomTableModule,
    PagesThirdPartyReconnectDialogModule,
  ],
  exports: [ProductMarketplaceListComponent],
})
export class ProductMarketplaceListModule {}
