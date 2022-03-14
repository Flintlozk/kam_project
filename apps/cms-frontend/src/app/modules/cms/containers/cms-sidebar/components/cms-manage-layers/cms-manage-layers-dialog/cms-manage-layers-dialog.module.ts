import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsManageLayersDialogComponent } from './cms-manage-layers-dialog.component';
import { ComponentGetNamePipePipeModule } from '@reactor-room/cms-frontend-helpers-lib';

@NgModule({
  declarations: [CmsManageLayersDialogComponent],
  imports: [CommonModule, ComponentGetNamePipePipeModule],
  exports: [CmsManageLayersDialogComponent],
})
export class CmsManageLayersDialogModule {}
