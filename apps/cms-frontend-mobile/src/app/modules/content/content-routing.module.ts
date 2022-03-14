import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';

import { ContentDraftComponent } from './components/content-draft/content-draft.component';
import { ContentDraftNewComponent } from './components/content-draft/components/content-draft-new/content-draft-new.component';
import { ContentDraftEditComponent } from './components/content-draft/components/content-draft-edit/content-draft-edit.component';
import { ContentFileManageComponent } from './components/content-file-manage/content-file-manage.component';
import { ContentFileManageDetailComponent } from './components/content-file-manage/components/content-file-manage-detail/content-file-manage-detail.component';
import { ContentContentComponent } from './components/content-content/content-content.component';
import { ContentContentEditComponent } from './components/content-content/components/content-content-edit/content-content-edit.component';
import { RouteAnimateEnum } from '@reactor-room/animation';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_PAGE },
    children: [
      { path: 'draft', component: ContentDraftComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_DRAFT_PAGE } },
      { path: 'draft/new', component: ContentDraftNewComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_DRAFT_NEW_PAGE } },
      { path: 'draft/edit', component: ContentDraftEditComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_CONTENT_EDIT_PAGE } },
      { path: 'content', component: ContentContentComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_CONTENT_PAGE } },
      { path: 'content/edit', component: ContentContentEditComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_CONTENT_EDIT_PAGE } },
      { path: 'file-manage', component: ContentFileManageComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_FILE_MANAGE_PAGE } },
      {
        path: 'file-manage/detail',
        component: ContentFileManageDetailComponent,
        data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.CONTENT_FILE_MANAGE_DETAIL_PAGE },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
