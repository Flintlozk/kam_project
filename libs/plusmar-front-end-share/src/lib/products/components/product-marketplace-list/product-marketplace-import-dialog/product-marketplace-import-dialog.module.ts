import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk/custom-dialog/custom-dialog.module';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { PaginationModule } from '@reactor-room/itopplus-cdk/pagination/pagination.module';
import { ProductMarketplaceImportDialogComponent } from './product-marketplace-import-dialog.component';

@NgModule({
  declarations: [ProductMarketplaceImportDialogComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, FormsModule, ReactiveFormsModule, CustomTableModule, PaginationModule, MatFormFieldModule, MatSelectModule],
  exports: [ProductMarketplaceImportDialogComponent],
})
export class ProductMarketplaceImportDialogModule {}
