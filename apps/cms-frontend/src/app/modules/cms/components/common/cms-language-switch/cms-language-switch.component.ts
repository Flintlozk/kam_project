import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FadeAnimate } from '@reactor-room/animation';
import { ILanguage, IWebsiteConfigGeneralLanguage } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { LanguageService } from 'apps/cms-frontend/src/app/services/language.service';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CmsCommonService } from '../../../services/cms-common.service';
import { ICmsLanguageSwitch } from './cms-language-switch.model';

@Component({
  selector: 'cms-next-cms-language-switch',
  templateUrl: './cms-language-switch.component.html',
  styleUrls: ['./cms-language-switch.component.scss'],
  animations: [FadeAnimate.fadeInOutYAnimation],
})
export class CmsLanguageSwitchComponent implements OnInit, OnDestroy {
  currentLanguage: ICmsLanguageSwitch;
  toggleStatus = false;
  destroy$ = new Subject();
  languageSwitch: ICmsLanguageSwitch[] = [];
  configGeneralLanguage: IWebsiteConfigGeneralLanguage;
  lauguageList: ILanguage[] = [];
  @Input() languageTemplate = 1;

  constructor(
    private cmsCommonService: CmsCommonService,
    private settingWebsiteService: SettingWebsiteService,
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.onInitLanguageSwitch();
  }

  onInitLanguageSwitch(): void {
    this.settingWebsiteService
      .getConfigGeneralLanguage()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((configGeneralLanguage) => {
          if (configGeneralLanguage) {
            this.configGeneralLanguage = configGeneralLanguage;
            return this.languageService.getLanguages();
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Not Find Any Language ConFig Setting!',
              } as StatusSnackbarModel,
            });
            return EMPTY;
          }
        }),
        tap((languages) => {
          if (languages) {
            this.lauguageList = languages;
            this.languageSwitch = this.languageSwitchMappingData();
            this.currentLanguage = this.getCurrentLanguage();
            this.cmsCommonService.setCmsLanguageSwitch(this.currentLanguage);
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Not Find Any Languages!',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onInitLanguageSwitch :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  languageSwitchMappingData(): ICmsLanguageSwitch[] {
    const languageSwitch: ICmsLanguageSwitch[] = [];
    this.lauguageList.forEach((language) => {
      let languageSwitchItem: ICmsLanguageSwitch;
      const isDefault = language.cultureUI === this.configGeneralLanguage.defaultCultureUI;
      if (this.configGeneralLanguage.selectedCultureUIs.includes(language.cultureUI) || isDefault) {
        languageSwitchItem = { ...language, activeStatus: isDefault, default: isDefault };
        if (isDefault) this.cmsCommonService.defaultCultureUI = languageSwitchItem.cultureUI;
        languageSwitch.push(languageSwitchItem);
      }
    });
    return languageSwitch;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
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
    this.cmsCommonService.setCmsLanguageSwitch(this.currentLanguage);
    this.toggleStatus = false;
  }

  getCurrentLanguage(): ICmsLanguageSwitch {
    const found = this.languageSwitch.find((element) => element.activeStatus === true);
    return found;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
