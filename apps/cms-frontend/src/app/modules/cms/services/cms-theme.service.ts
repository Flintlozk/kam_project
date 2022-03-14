import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IThemeDevice, IThemeGeneralInfo, IThemeRenderingSettingColors, IThemeRenderingSettingFont } from '@reactor-room/cms-models-lib';
import { ThemeSettingColor, ThemeSettingDevice, ThemeSettingFont } from '../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';

@Injectable({
  providedIn: 'root',
})
export class CmsEditThemeService {
  private themeFocus = new BehaviorSubject(false);
  getThemeFocus = this.themeFocus.asObservable();

  private themeDevice = new BehaviorSubject(null);
  getThemeDevice = this.themeDevice.asObservable();

  private themeDeviceFormValue = new BehaviorSubject(null);
  getThemeDeviceFormValue = this.themeDeviceFormValue.asObservable();

  private themeColorSetting = new BehaviorSubject(null);
  getThemeColorSetting = this.themeColorSetting.asObservable();

  private themeColorSettingFormValue = new BehaviorSubject(null);
  getThemeColorSettingFormValue = this.themeColorSettingFormValue.asObservable();

  private themeFontSetting = new BehaviorSubject(null);
  getThemeFontSetting = this.themeFontSetting.asObservable();

  private themeFontSettingFormValue = new BehaviorSubject(null);
  getThemeFontSettingFormValue = this.themeFontSettingFormValue.asObservable();

  private themeGeneralSetting = new BehaviorSubject(null);
  getThemeGeneralSetting = this.themeGeneralSetting.asObservable();

  private themeGeneralSettingFormValue = new BehaviorSubject(null);
  getThemeGeneralSettingFormValue = this.themeGeneralSettingFormValue.asObservable();

  constructor() {}

  setThemeFocus(isFocus: boolean): void {
    this.themeFocus.next(isFocus);
  }

  setThemeDeviceSetting(value: IThemeDevice[] | ThemeSettingDevice): void {
    this.themeDevice.next(value);
  }

  setThemeDeviceSettingFormValue(value: IThemeDevice[] | ThemeSettingDevice): void {
    this.themeDeviceFormValue.next(value);
  }

  setThemeColorSetting(value: IThemeRenderingSettingColors[] | ThemeSettingColor): void {
    this.themeColorSetting.next(value);
  }

  setThemeColorSettingFormValue(value: IThemeRenderingSettingColors[] | ThemeSettingColor): void {
    this.themeColorSettingFormValue.next(value);
  }

  setThemeFontSetting(value: IThemeRenderingSettingFont[] | ThemeSettingFont): void {
    this.themeFontSetting.next(value);
  }

  setThemeFontSettingFormValue(value: IThemeRenderingSettingFont[] | ThemeSettingFont): void {
    this.themeFontSettingFormValue.next(value);
  }

  setThemeGeneralSetting(value: IThemeGeneralInfo): void {
    this.themeGeneralSetting.next(value);
  }

  setThemeGeneralSettingFormValue(value: IThemeGeneralInfo): void {
    this.themeGeneralSettingFormValue.next(value);
  }
}
