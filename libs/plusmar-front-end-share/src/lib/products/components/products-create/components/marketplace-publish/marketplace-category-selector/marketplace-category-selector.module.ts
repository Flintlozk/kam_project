import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MarketplaceCategorySelectorComponent } from './marketplace-category-selector.component';
@NgModule({
  declarations: [MarketplaceCategorySelectorComponent],
  imports: [CommonModule, TranslateModule],
  exports: [MarketplaceCategorySelectorComponent],
})
export class MarketplaceCategorySelectorModule {}
