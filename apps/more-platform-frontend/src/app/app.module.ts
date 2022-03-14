import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { StatusDialogModule } from '@reactor-room/itopplus-cdk';

import { LayoutModule } from './containers/layout/layout.module';
import { HeadingTitleModule } from './components/heading-title/heading-title.module';
import { EcosystemDetailsModule } from './components/ecosystem-details/ecosystem-details.module';

const APP_MODULES = [BrowserModule, BrowserAnimationsModule, AppRoutingModule, StatusDialogModule];
const CONTAINER_MODULES = [LayoutModule];
const COMPONENT_MODULES = [HeadingTitleModule, EcosystemDetailsModule];

@NgModule({
  declarations: [AppComponent],
  imports: [APP_MODULES, CONTAINER_MODULES, COMPONENT_MODULES],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
