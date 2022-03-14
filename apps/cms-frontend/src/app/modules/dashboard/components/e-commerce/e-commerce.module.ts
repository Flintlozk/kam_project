import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECommerceComponent } from './e-commerce.component';
import { RouterModule } from '@angular/router';
import { ProductLowInventoryService } from 'apps/cms-frontend/src/app/services/product-low-inventory.service';

@NgModule({
  declarations: [ECommerceComponent],
  imports: [CommonModule, RouterModule],
  providers: [ProductLowInventoryService],
  exports: [ECommerceComponent],
})
export class ECommerceModule {}
