import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomDesignLevelComponent } from './cms-menu-custom-design-level.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsMenuCustomDesignLevelComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  exports: [CmsMenuCustomDesignLevelComponent],
})
export class CmsMenuCustomDesignLevelModule {}
