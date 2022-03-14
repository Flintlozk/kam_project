import { ChangeDetectorRef, Component, AfterContentChecked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouteAnimate } from '@reactor-room/animation';
import { quillRegistration } from './modules/cms/services/domain/quill.domain';

@Component({
  selector: 'cms-next-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [RouteAnimate.routeCMSAnimation],
})
export class AppComponent implements AfterContentChecked {
  constructor(private translate: TranslateService, private cdref: ChangeDetectorRef) {
    quillRegistration();
    this.handleLanuages(this.translate);
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  handleLanuages(translate: TranslateService): void {
    const lang = localStorage.getItem('language') || translate.getBrowserLang() || 'en';
    translate.setDefaultLang(lang);
    translate.use(lang);
  }

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
