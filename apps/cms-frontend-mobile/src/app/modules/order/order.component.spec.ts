import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from './order.component';
import { OrderFilterModule } from '../order/components/order-filter/order-filter.module';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    { prefix: '../assets/i18n/content/', suffix: '.json' },
    { prefix: '../assets/i18n/home/', suffix: '.json' },
    { prefix: '../assets/i18n/order/', suffix: '.json' },
    { prefix: '../assets/i18n/product/', suffix: '.json' },
    { prefix: '../assets/i18n/profile/', suffix: '.json' },
  ]);
}
const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: '/login' }];

//TODO: James we nee you help to unskip this test.
describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [OrderComponent],
        imports: [
          OrderFilterModule,
          HttpClientModule,
          BrowserAnimationsModule,
          RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false }),
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient],
            },
          }),
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
