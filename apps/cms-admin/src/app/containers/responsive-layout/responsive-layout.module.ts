import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveLayoutComponent } from './responsive-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ResponsiveLayoutComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatMenuModule, MatSelectModule, MatFormFieldModule],
  exports: [ResponsiveLayoutComponent],
})
export class ResponsiveLayoutModule {}
