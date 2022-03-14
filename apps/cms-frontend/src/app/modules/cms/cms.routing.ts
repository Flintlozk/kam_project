import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { CmsComponent } from './cms.component';
import { CmsEditModeComponent } from './modules/cms-edit-mode/cms-edit-mode.component';
import { CmsEditRenderingContentComponent } from './modules/cms-edit-mode/components/cms-edit-rendering-content/cms-edit-rendering-content.component';
import { CmsEditRenderingComponent } from './modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.component';

const routes: Routes = [
  {
    path: '',
    component: CmsComponent,
    data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.CMS_PAGE },
    children: [
      {
        path: RouteLinkCmsEnum.CMS_EDIT_MODE,
        component: CmsEditModeComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.CMS_EDIT_MODE_PAGE },
        children: [
          {
            path: `${RouteLinkCmsEnum.CMS_SITE_MANAGE}/:webPageId`,
            component: CmsEditRenderingComponent,
          },
          {
            path: `${RouteLinkCmsEnum.CMS_SITE_MANAGE}/:webPageId/:prevWebPageId/:componentId/:contentId`,
            component: CmsEditRenderingComponent,
          },
          {
            path: `${RouteLinkCmsEnum.CMS_SITE_MANAGE}/new`,
            component: CmsEditRenderingComponent,
          },
          {
            path: `${RouteLinkCmsEnum.CMS_CONTENT_MANAGE}/:type`,
            component: CmsEditRenderingContentComponent,
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {}
