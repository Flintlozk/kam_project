import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeECommerceComponent } from './home-e-commerce.component';
import { CurrencyModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [HomeECommerceComponent],
  imports: [CommonModule, CurrencyModule, TranslateModule],
  exports: [HomeECommerceComponent],
})
export class HomeECommerceModule {}
