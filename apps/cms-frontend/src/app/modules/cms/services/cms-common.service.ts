import { Injectable } from '@angular/core';
import { EnumLanguageCultureUI } from '@reactor-room/cms-models-lib';
import { BehaviorSubject } from 'rxjs';
import { ICmsLanguageSwitch } from '../components/common/cms-language-switch/cms-language-switch.model';

@Injectable({
  providedIn: 'root',
})
export class CmsCommonService {
  defaultCultureUI: EnumLanguageCultureUI;
  private cmsLanguageSwitch = new BehaviorSubject(null);
  getCmsLanguageSwitch = this.cmsLanguageSwitch.asObservable();

  constructor() {}

  setCmsLanguageSwitch(cmsLanguageSwitch: ICmsLanguageSwitch): void {
    this.cmsLanguageSwitch.next(cmsLanguageSwitch);
  }
}
