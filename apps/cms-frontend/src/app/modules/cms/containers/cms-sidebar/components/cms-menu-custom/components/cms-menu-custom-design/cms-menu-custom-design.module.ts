import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomDesignComponent } from './cms-menu-custom-design.component';
import { CmsMenuCustomDesignLevelModule } from '../cms-menu-custom-design-level/cms-menu-custom-design-level.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [CmsMenuCustomDesignComponent],
  imports: [CommonModule, CmsMenuCustomDesignLevelModule, MatTabsModule],
  exports: [CmsMenuCustomDesignComponent],
})
export class CmsMenuCustomDesignModule {}
