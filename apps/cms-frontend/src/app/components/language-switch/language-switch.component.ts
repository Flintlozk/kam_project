import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FadeAnimate } from '@reactor-room/animation';
import { ILanguageSwitch } from './language-switch.model';

@Component({
  selector: 'cms-next-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss'],
  animations: [FadeAnimate.fadeInOutYAnimation],
})
export class LanguageSwitchComponent implements OnInit {
  currentLanguage: ILanguageSwitch;
  toggleStatus = false;

  languageSwitch = [
    {
      code: 'en',
      activeStatus: true,
      title: 'English',
      imgUrl: 'assets/lang/en.svg',
    },
    {
      code: 'th',
      activeStatus: false,
      title: 'Thai',
      imgUrl: 'assets/lang/th.svg',
    },
  ] as ILanguageSwitch[];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.currentLanguage = this.getCurrentLanguage();
  }

  onToggleStatus(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  onOutsideLanguageSwitcher(event: boolean): void {
    if (event) this.toggleStatus = false;
  }

  onSelectCurrentLanguage(index: number): void {
    this.languageSwitch.forEach((item) => (item.activeStatus = false));
    this.languageSwitch[index].activeStatus = true;
    this.currentLanguage = this.getCurrentLanguage();
    this.translate.use(this.currentLanguage.code);
    localStorage.setItem('language', this.currentLanguage.code);
    this.toggleStatus = false;
  }

  getCurrentLanguage(): ILanguageSwitch {
    const found = this.languageSwitch.find((element) => element.activeStatus === true);
    return found;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
