import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { ContentManagementComponent } from './content-management.component';

const routes: Routes = [
  { path: ':tab', component: ContentManagementComponent, data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_CONTENT_MANAGEMENT_PAGE } },
  { path: '**', redirectTo: 'content' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentManagementRoutingModule {}
