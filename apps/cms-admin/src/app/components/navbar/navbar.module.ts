import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { LogoModule } from '../icon/logo/logo.module';
@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, LogoModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
