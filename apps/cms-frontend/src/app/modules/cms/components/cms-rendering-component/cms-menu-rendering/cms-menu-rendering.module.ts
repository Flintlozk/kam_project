import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuRenderingComponent } from './cms-menu-rendering.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CmsMenuRenderingComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [CmsMenuRenderingComponent],
})
export class CmsMenuRenderingModule {}
