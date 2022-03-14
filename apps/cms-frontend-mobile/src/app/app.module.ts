import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { OptionToggleLayoutModule } from './components/option-toggle-layout/option-toogle-layout.module';
import { StatusDialogModule, ConfirmDialogModule, StatusSnackbarModule } from '@reactor-room/itopplus-cdk';
import { NotFoundModule } from './containers/not-found/not-found.module';
import { FirstGuideModule } from './containers/first-guide/first-guide.module';
import { FooterModule } from './containers/footer/footer.module';
import { HeaderModule } from './containers/header/header.module';
import { PwaCardModule } from './containers/pwa-card/pwa-card.module';
import { LayoutModule } from './containers/layout/layout.module';

export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    { prefix: '../assets/i18n/content/', suffix: '.json' },
    { prefix: '../assets/i18n/home/', suffix: '.json' },
    { prefix: '../assets/i18n/order/', suffix: '.json' },
    { prefix: '../assets/i18n/product/', suffix: '.json' },
    { prefix: '../assets/i18n/profile/', suffix: '.json' },
  ]);
}

const COMPONENT_MODULES = [OptionToggleLayoutModule];
const CONTAINER_MODULES = [
  LayoutModule,
  PwaCardModule,
  FirstGuideModule,
  FooterModule,
  HeaderModule,
  StatusDialogModule,
  ConfirmDialogModule,
  StatusSnackbarModule,
  NotFoundModule,
];
const APP_MODULES = [
  BrowserModule,
  GraphQLModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
];

@NgModule({
  declarations: [AppComponent],
  imports: [COMPONENT_MODULES, CONTAINER_MODULES, APP_MODULES],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule {}
