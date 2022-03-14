import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CmsPopoverLayoutComponent } from './cms-popover-layout.component';
@NgModule({
  declarations: [CmsPopoverLayoutComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [CmsPopoverLayoutComponent],
})
export class CmsPopoverLayoutModule {}
