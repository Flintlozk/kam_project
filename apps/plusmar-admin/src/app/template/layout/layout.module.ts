import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLinkActiveMatchModule } from '@reactor-room/itopplus-cdk';
import { HeaderComponent } from '../../components/header/header.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout.routing';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SideMenuComponent],
  imports: [LayoutRoutingModule, CommonModule, RouterModule, RouterLinkActiveMatchModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
