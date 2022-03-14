import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { TogglerModule } from '@reactor-room/plusmar-cdk';
import { MarketplaceCategorySelectorModule } from '../marketplace-category-selector/marketplace-category-selector.module';
import { PublishOnShopeeComponent } from './publish-on-shopee.component';

@NgModule({
  declarations: [PublishOnShopeeComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ITOPPLUSCDKModule,
    TogglerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MarketplaceCategorySelectorModule,
    MatDatepickerModule,
  ],
  exports: [PublishOnShopeeComponent],
})
export class PublishOnShopeeModule {}
