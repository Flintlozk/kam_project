import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LowStockInventoryComponent } from './low-stock-inventory.component';
import { HeadingModule } from 'apps/cms-frontend/src/app/components/heading/heading.module';
import { PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { RouterModule } from '@angular/router';

//tableme
import { CustomCmsTableModule } from 'libs/cms-cdk/src/lib/custom-cms-table/custom-cms-table.module';
import { ProductLowInventoryService } from 'apps/cms-frontend/src/app/services/product-low-inventory.service';
@NgModule({
  declarations: [LowStockInventoryComponent],
  imports: [CommonModule, HeadingModule, PaginationModule, CustomTableModule, TableActionModule, RouterModule, CustomCmsTableModule, TimeAgoPipeModule],
  providers: [ProductLowInventoryService],
  exports: [LowStockInventoryComponent],
})
export class LowStockInventoryModule {
  // 'assets': ['src/assets'];
}
