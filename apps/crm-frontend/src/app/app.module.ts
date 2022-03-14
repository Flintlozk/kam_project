import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { LoginPageModule } from './containers/login-page/login-page.module';
import { SidebarNavModule } from './components/sidebar-nav/sidebar-nav.module';
import { ReloginComponent } from './containers/relogin/relogin.component';

import { AppRoutingModule } from './app.route';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TopToolBarComponentModule } from './components/top-tool-bar-component/top-tool-bar-component.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { MenuProfileModule } from './components/menu-profile/menu-profile.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HotToastModule } from '@ngneat/hot-toast';
export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [{ prefix: '../assets/i18n/common/', suffix: '.json' }]);
}
@NgModule({
  declarations: [AppComponent, ReloginComponent],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    AppRoutingModule,
    LoginPageModule,
    GraphQLModule,
    SidebarNavModule,
    TopToolBarComponentModule,
    NoopAnimationsModule,
    MatTableModule,
    MenuProfileModule,
    HotToastModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  exports: [TranslateModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
