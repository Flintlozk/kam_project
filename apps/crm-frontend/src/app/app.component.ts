import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'crm-frontend';
  rates: any[];
  loading = true;
  error: any;

  constructor(translate: TranslateService) {
    translate.setDefaultLang('th');
  }
}
