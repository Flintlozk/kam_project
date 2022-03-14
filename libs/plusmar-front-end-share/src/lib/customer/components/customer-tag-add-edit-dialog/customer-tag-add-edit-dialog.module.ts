import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTagAddEditDialogComponent } from './customer-tag-add-edit-dialog.component';
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
import { CustomerNotesModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-notes/customer-notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { TagColorSelectorModule } from '@reactor-room/plusmar-front-end-share/components/tag-color-selector/tag-color-selector.module';
import { CustomTableModule, FilterModule, TableActionModule } from '@reactor-room/plusmar-cdk';

@NgModule({
  declarations: [CustomerTagAddEditDialogComponent],
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
    CustomerNotesModule,
    TranslateModule,
    TagColorSelectorModule,
    AddressModule,
    CustomTableModule,
    TableActionModule,
    FilterModule,
  ],
  exports: [CustomerTagAddEditDialogComponent],
})
export class CustomerTagAddEditDialogModule {}
