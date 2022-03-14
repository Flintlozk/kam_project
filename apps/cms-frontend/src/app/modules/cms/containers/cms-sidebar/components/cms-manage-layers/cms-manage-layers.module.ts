import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsManageLayersComponent } from './cms-manage-layers.component';
import { CmsManageLayersDialogModule } from './cms-manage-layers-dialog/cms-manage-layers-dialog.module';

@NgModule({
  declarations: [CmsManageLayersComponent],
  imports: [CommonModule, CmsManageLayersDialogModule],
  exports: [CmsManageLayersComponent],
})
export class CmsManageLayersModule {}
