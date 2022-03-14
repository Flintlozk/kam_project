import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartErrorsComponent } from './cart-errors.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CartErrorsComponent],
  imports: [CommonModule, TranslateModule],
  exports: [CartErrorsComponent],
})
export class CartErrorsModule {}
