import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cms-next-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss'],
  animations: [FadeAnimate.iconFade],
})
export class ProfileSettingComponent implements OnInit {
  languageData = [
    {
      code: 'en',
      title: 'English',
      status: true,
      imgUrl: '/assets/images/profile/lang/en.svg',
      imgActiveUrl: '/assets/images/profile/lang/en_active.svg',
    },
    {
      code: 'th',
      title: 'ภาษาไทย',
      status: false,
      imgUrl: '/assets/images/profile/lang/th.svg',
      imgActiveUrl: '/assets/images/profile/lang/th_active.svg',
    },
  ];

  currentLanguageTitle: string;
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadCurrentSettingLanguage();
  }

  loadCurrentSettingLanguage(): void {
    const lang = localStorage.getItem('language') || this.translate.getBrowserLang() || 'en';
    const activeLanguageItem = this.languageData.find((item) => item.code === lang);
    this.languageData.forEach((item) => (item.status = false));
    activeLanguageItem.status = true;
    this.currentLanguageTitle = activeLanguageItem.title;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSelectLanguage(index: number): void {
    this.languageData.forEach((item) => (item.status = false));
    this.languageData[index].status = true;
    this.currentLanguageTitle = this.languageData[index].title;
    this.translate.use(this.languageData[index].code);
    localStorage.setItem('language', this.languageData[index].code);
  }
}
