import { Injectable } from '@angular/core';
import { AudienceContactStatus, ELocalStorageType } from '@reactor-room/itopplus-model-lib';

interface IGenericLocalSettings {
  CHAT_STATUS: AudienceContactStatus;
}

type LocalStorageValue = AudienceContactStatus;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  defaultSettings: IGenericLocalSettings = {
    CHAT_STATUS: AudienceContactStatus.ACTIVE,
  };
  constructor() {}

  getGenericLocalSettings(): IGenericLocalSettings {
    const setting = JSON.parse(localStorage.getItem('mc-client-setting'));
    if (setting) return setting;
    else return this.defaultSettings;
  }
  getSpecifyGenericLocalSettings(type: ELocalStorageType): LocalStorageValue {
    const settings = this.getGenericLocalSettings();
    return settings[type];
  }

  setGenericLocalSettings(type: ELocalStorageType, value: LocalStorageValue): void {
    const settings = this.getGenericLocalSettings();
    settings[type] = value;
    localStorage.setItem('mc-client-setting', JSON.stringify(settings));
  }
}
