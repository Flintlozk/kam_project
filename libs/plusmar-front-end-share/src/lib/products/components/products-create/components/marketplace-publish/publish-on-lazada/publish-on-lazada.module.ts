import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { TogglerModule } from '@reactor-room/plusmar-cdk';
import { ToastrModule } from 'ngx-toastr';
import { MarketplaceCategorySelectorModule } from '../marketplace-category-selector/marketplace-category-selector.module';
import { PublishOnLazadaComponent } from './publish-on-lazada.component';
@NgModule({
  declarations: [PublishOnLazadaComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TogglerModule,
    ITOPPLUSCDKModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MarketplaceCategorySelectorModule,
  ],
  exports: [PublishOnLazadaComponent],
})
export class PublishOnLazadaModule {}
