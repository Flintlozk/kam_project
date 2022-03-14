import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { HeaderModule } from '../header/header.module';
import { NavModule } from '../nav/nav.module';
import { RouterModule } from '@angular/router';
import { EcosystemDetailsModule } from '../../components/ecosystem-details/ecosystem-details.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, HeaderModule, NavModule, RouterModule, EcosystemDetailsModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
