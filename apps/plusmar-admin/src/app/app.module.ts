import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { GraphQLModule } from './graphql.module';
import { ToastrModule } from 'ngx-toastr';

// import { LoginModule } from './modules/login/login.module';

export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [{ prefix: '../assets/i18n/admin/', suffix: '.json' }]);
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    ToastrModule.forRoot({
      timeOut: 6000,
      enableHtml: true,
      positionClass: 'toast-bottom-right',
    }),
    MatDialogModule,
    BrowserModule,
    GraphQLModule,
    // LoginModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule {}
