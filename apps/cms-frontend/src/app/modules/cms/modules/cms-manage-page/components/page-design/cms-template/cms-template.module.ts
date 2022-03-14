import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsTemplateComponent } from './cms-template.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [CmsTemplateComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [CmsTemplateComponent],
})
export class CmsTemplateModule {}
