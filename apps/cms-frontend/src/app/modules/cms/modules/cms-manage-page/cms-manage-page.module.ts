import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsManagePageComponent } from './cms-manage-page.component';
import { CmsPageSelectionModule } from '../../components/common/cms-page-selection/cms-page-selection.module';
import { CmsPageDesignContainerModule } from './components/cms-page-design-container/cms-page-design-container.module';

@NgModule({
  declarations: [CmsManagePageComponent],
  imports: [CommonModule, CmsPageSelectionModule, CmsPageDesignContainerModule],
  exports: [CmsManagePageComponent],
})
export class CmsManagePageModule {}
