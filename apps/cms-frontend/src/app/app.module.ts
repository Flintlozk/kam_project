import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import { MonacoEditorModule, NgxMonacoEditorConfig } from '@reactor-room/itopplus-front-end-helpers';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { HeaderModule } from './containers/header/header.module';
import { LayoutModule } from './containers/layout/layout.module';
import { SidebarModule } from './containers/sidebar/sidebar.module';
import { GraphQLModule } from './graphql.module';
import { ToastrModule } from 'ngx-toastr';
import { TokenGeneratorService } from '@reactor-room/plusmar-front-end-share/services/token-generater.service';

export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    { prefix: '../assets/i18n/common/', suffix: '.json' },
    { prefix: '../assets/i18n/settings/', suffix: '.json' },
  ]);
}

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: { scrollBeyondLastLine: true },
};

const CONTAINER_MODULES = [LayoutModule, HeaderModule, SidebarModule];

const APP_MODULES = [
  BrowserModule,
  HttpClientModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  FormsModule,
  GraphQLModule,
  MatDialogModule,
  MonacoEditorModule.forRoot(monacoConfig),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
  ToastrModule.forRoot({
    timeOut: 6000,
    enableHtml: true,
    positionClass: 'toast-bottom-right',
  }),
];

@NgModule({
  declarations: [AppComponent],
  imports: [...APP_MODULES, ...CONTAINER_MODULES, MatSnackBarModule],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    TokenGeneratorService,
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule {
  // constructor(library: FaIconLibrary) {
  //   library.addIconPacks(fas);
  // }
}
