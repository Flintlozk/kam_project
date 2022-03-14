import { NgModule } from '@angular/core';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { CommonModule } from '@angular/common';
import { ContentManagementComponent } from './content-management.component';
import { RouterModule } from '@angular/router';
import { ContentListModule } from './components/content-list/content-list.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ContentManagementRoutingModule } from './content-management.routing';
import { ContentCategoryModule } from './components/content-category/content-category.module';
@NgModule({
  declarations: [ContentManagementComponent],
  imports: [CommonModule, HeadingModule, RouterModule, ContentListModule, MatTabsModule, TranslateModule, ContentManagementRoutingModule, ContentCategoryModule],
  exports: [ContentManagementComponent],
})
export class ContentManagementModule {}
