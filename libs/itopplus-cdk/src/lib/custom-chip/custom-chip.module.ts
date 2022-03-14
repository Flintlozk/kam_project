import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomChipComponent } from './custom-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [CustomChipComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatChipsModule, MatFormFieldModule],
  exports: [CustomChipComponent],
})
export class CustomChipModule {}
