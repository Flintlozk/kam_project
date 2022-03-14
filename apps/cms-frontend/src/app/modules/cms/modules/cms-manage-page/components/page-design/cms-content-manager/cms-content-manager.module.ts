import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentManagerComponent } from './cms-content-manager.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CmsLayoutContentManagePatternsModule } from '../../../../../containers/cms-sidebar/components/cms-layout/components/cms-layout-content-management/components/cms-layout-content-manage-patterns/cms-layout-content-manage-patterns.module';
import { QueryRemoverModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [CmsContentManagerComponent],
  imports: [CommonModule, DragDropModule, CmsLayoutContentManagePatternsModule, QueryRemoverModule],
  exports: [CmsContentManagerComponent],
})
export class CmsContentManagerModule {}
