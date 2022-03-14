import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFilterComponent } from './order-filter.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderFilterComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [OrderFilterComponent],
})
export class OrderFilterModule {}
