import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomMobileHamburgerComponent } from './cms-menu-custom-mobile-hamburger.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [CmsMenuCustomMobileHamburgerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatMenuModule],
  exports: [CmsMenuCustomMobileHamburgerComponent],
})
export class CmsMenuCustomMobileHamburgerModule {}
