import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomChipsModule, CustomTableModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { QuillModule } from 'ngx-quill';
import { ProductStatusLinkedToMarketPlacePipeModule } from '../../pipes/product-status-liked-to-marketplace-pipe.module';
import { ProductMergeDialogComponent } from './product-merge-dialog/product-merge-dialog.component';
import { ProductUnmergeDialogComponent } from './product-unmerge-dialog/product-unmerge-dialog.component';
import { ProductVariantMergeDialogComponent } from './product-variant-merge-dialog/product-variant-merge-dialog.component';
import { ProductsListComponent } from './products-list.component';

@NgModule({
  declarations: [ProductMergeDialogComponent, ProductsListComponent, ProductVariantMergeDialogComponent, ProductUnmergeDialogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ITOPPLUSCDKModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    QuillModule,
    MatSelectModule,
    CustomTableModule,
    TableActionModule,
    CustomChipsModule,
    ProductStatusLinkedToMarketPlacePipeModule,
  ],
  exports: [ProductMergeDialogComponent, ProductsListComponent],
})
export class ProductListModule {}
