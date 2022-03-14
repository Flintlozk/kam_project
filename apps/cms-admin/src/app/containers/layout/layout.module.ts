import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { SidebarModule } from '../../components/sidebar/sidebar.module';
import { PlusModule } from '../../components/icon/plus/plus.module';
@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    NavbarModule,
    SidebarModule,
    PlusModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: 'user-management',
            loadChildren: () => import('../../modules/user-management/user-management.module').then((m) => m.UserManagementModule),
          },
          {
            path: 'theme',
            loadChildren: () => import('../../modules/theme/theme.module').then((m) => m.ThemeModule),
          },
          {
            path: 'hosting',
            loadChildren: () => import('../../modules/hosting/hosting.module').then((m) => m.HostingModule),
          },
          {
            path: 'template',
            loadChildren: () => import('../../modules/template/template.module').then((m) => m.TemplateModule),
          },
          {
            path: 'content-manager',
            loadChildren: () => import('../../modules/content-manager/content-manager.module').then((m) => m.ContentManagerModule),
          },
          {
            path: 'content-manager/:type',
            loadChildren: () => import('../../modules/content-manager/content-manage-pattern/content-manage-pattern.module').then((m) => m.ContentManagePatternModule),
          },
        ],
      },
    ]),
  ],
})
export class LayoutModule {}
