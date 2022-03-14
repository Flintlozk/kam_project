import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AddressComponent],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [AddressComponent],
})
export class AddressModule {}
