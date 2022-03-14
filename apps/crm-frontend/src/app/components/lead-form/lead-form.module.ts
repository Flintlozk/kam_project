import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormComponent } from './lead-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalErrorModule } from '../modal-error/modal-error.module';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalConfirmDeleteModule } from '../modal-confirm-delete/modal-confirm-delete.module';

@NgModule({
  declarations: [LeadFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    ModalErrorModule,
    TimeAgoPipeModule,
    MatTooltipModule,
    ModalConfirmDeleteModule,
  ],
  exports: [LeadFormComponent],
})
export class LeadFormModule {}
