import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { CustomerNotesModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-notes/customer-notes.module';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { TokenGeneratorService } from '@reactor-room/plusmar-front-end-share/services/token-generater.service';
import * as Sentry from '@sentry/angular';
import { FacebookModule } from '@reactor-room/itopplus-front-end-helpers/ngx-facebook';
import { ToastrModule } from 'ngx-toastr';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { InvitedUserLoginModule } from './container/invited-user-login/invited-user-login.module';
import { LayoutModule } from './container/layout/layout.module';
import { LoginTestModule } from './container/login-test/login-test.module';
import { LoginModule } from './container/login/login.module';
import { GraphQLModule } from './graphql.module';
import { ManualModule, OwnerModule, PaymentModule, PromotionsModule, PurchaseOrderModule, RegisterModule, ReportModule } from './modules';
import { PagesModule } from '@reactor-room/plusmar-front-end-share/pages/pages.module';
export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    { prefix: '../assets/i18n/audience/', suffix: '.json' },
    { prefix: '../assets/i18n/cdk/', suffix: '.json' },
    { prefix: '../assets/i18n/customer/', suffix: '.json' },
    { prefix: '../assets/i18n/dashboard/', suffix: '.json' },
    { prefix: '../assets/i18n/etc/', suffix: '.json' },
    { prefix: '../assets/i18n/leads/', suffix: '.json' },
    { prefix: '../assets/i18n/login/', suffix: '.json' },
    { prefix: '../assets/i18n/products/', suffix: '.json' },
    { prefix: '../assets/i18n/purchase-order/', suffix: '.json' },
    { prefix: '../assets/i18n/settings/', suffix: '.json' },
    { prefix: '../assets/i18n/subscriptions/', suffix: '.json' },
    { prefix: '../assets/i18n/register/', suffix: '.json' },
    { prefix: '../assets/i18n/notification/', suffix: '.json' },
    { prefix: '../assets/i18n/follow-customer/', suffix: '.json' },
  ]);
}

const COMPONENTS = [AppComponent];
const MODULES = [
  ComponentModule,
  BrowserModule,
  AppRoutingModule,
  FacebookModule.forRoot(),
  FormsModule,
  HttpClientModule,
  ReactiveFormsModule,
  ITOPPLUSCDKModule,
  OwnerModule,
  GraphQLModule,
  PagesModule,
  PurchaseOrderModule,
  PaymentModule,
  ReportModule,
  PromotionsModule,
  RegisterModule,
  ManualModule,
  BrowserAnimationsModule,
  MatTooltipModule,
  LayoutModule,
  LoginModule,
  LoginTestModule,
  InvitedUserLoginModule,
  CustomerNotesModule,
  ToastrModule.forRoot({
    timeOut: 6000,
    enableHtml: true,
    positionClass: 'toast-bottom-right',
  }),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
  ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
];

@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
  bootstrap: [AppComponent],
  exports: [TranslateModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'th-TH' },
    TokenGeneratorService,
    RouteService,
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
  ],
})
export class AppModule {}
