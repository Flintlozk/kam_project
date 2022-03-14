import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomMobileComponent } from './cms-menu-custom-mobile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsMenuCustomMobileHamburgerModule } from '../cms-menu-custom-mobile-hamburger/cms-menu-custom-mobile-hamburger.module';
import { CmsMenuCustomMobileIconModule } from '../cms-menu-custom-mobile-icon/cms-menu-custom-mobile-icon.module';

@NgModule({
  declarations: [CmsMenuCustomMobileComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsMenuCustomMobileHamburgerModule, CmsMenuCustomMobileIconModule],
  exports: [CmsMenuCustomMobileComponent],
})
export class CmsMenuCustomMobileModule {}
