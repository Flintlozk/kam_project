import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignFormComponent } from './assign-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [AssignFormComponent],
  imports: [CommonModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, ReactiveFormsModule, MatTooltipModule],
  exports: [AssignFormComponent],
})
export class AssignFormModule {}
