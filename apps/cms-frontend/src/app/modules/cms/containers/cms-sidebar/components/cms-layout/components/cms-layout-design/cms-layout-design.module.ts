import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutDesignComponent } from './cms-layout-design.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutDesignComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutDesignComponent],
})
export class CmsLayoutDesignModule {}
