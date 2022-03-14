import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTagsDialogComponent } from './customer-tags-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AddressModule, ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { TagColorSelectorModule } from '@reactor-room/plusmar-front-end-share/components/tag-color-selector/tag-color-selector.module';
import { UserTagModule } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.module';

@NgModule({
  declarations: [CustomerTagsDialogComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatIconModule,
    ITOPPLUSCDKModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    TranslateModule,
    TagColorSelectorModule,
    AddressModule,
    UserTagModule,
  ],
  exports: [CustomerTagsDialogComponent],
})
export class CustomerTagsDialogModule {}
