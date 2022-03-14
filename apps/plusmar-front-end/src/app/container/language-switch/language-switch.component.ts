import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss'],
})
export class LanguageSwitchComponent implements OnInit {
  languageHover = false;

  constructor(public translate: TranslateService) {}

  toogleLanguageHover(): void {
    this.languageHover = !this.languageHover;
  }
  ngOnInit(): void {}

  switchLang(lang: string): void {
    this.languageHover = !this.languageHover;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
