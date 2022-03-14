import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { WelcomeIntroComponent } from './components/welcome-intro/welcome-intro.component';
import { WelcomeFeaturesComponent } from './components/welcome-features/welcome-features.component';
import { WelcomeTemplatesComponent } from './components/welcome-templates/welcome-templates.component';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RouteLinkCmsEnum.WELCOME_INTRO,
  },
  {
    path: '',
    component: WelcomeComponent,
    data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.WELCOME_PAGE },
    children: [
      {
        path: RouteLinkCmsEnum.WELCOME_INTRO,
        component: WelcomeIntroComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.WELCOME_INTRO_PAGE },
      },
      {
        path: RouteLinkCmsEnum.WELCOME_FEATURES,
        component: WelcomeFeaturesComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.WELCOME_FEATURES_PAGE },
      },
      {
        path: RouteLinkCmsEnum.WELCOME_TEMPLATES,
        component: WelcomeTemplatesComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.WELCOME_TEMPLATES_PAGE },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
