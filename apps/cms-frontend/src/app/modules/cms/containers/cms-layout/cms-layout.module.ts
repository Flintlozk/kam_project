import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutComponent } from './cms-layout.component';
import { CmsHeaderModule } from '../cms-header/cms-header.module';
import { CmsSidebarModule } from '../cms-sidebar/cms-sidebar.module';
import { RouterModule } from '@angular/router';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CmsLayoutComponent],
  imports: [CommonModule, CmsHeaderModule, CmsSidebarModule, RouterModule],
  exports: [CmsLayoutComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class CmsLayoutModule {}
