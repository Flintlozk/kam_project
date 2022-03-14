import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IErrorResponse, IHTTPResultValueTranslate } from '@reactor-room/model-lib';
import { IDropDown, INameIDPair, ITransformDropdown } from '@reactor-room/plusmar-front-end-share/app.model';

@Injectable({
  providedIn: 'root',
})
export class CommonMethodsService {
  constructor(public translate: TranslateService) {}

  getTranslatedResponse(response: string): string {
    if (response) {
      const responseJSON: IHTTPResultValueTranslate = JSON.parse(response);
      if (responseJSON.isTranslateKeys) {
        const { noTranslateMessage, translateKeys } = responseJSON;
        const message = noTranslateMessage;
        const translateMsg: string[] = translateKeys.map((key) => this.translate.instant(key));
        const textTranslate = translateMsg.join(' ');
        return `${message} ${textTranslate}`;
      } else {
        const { translateKeys } = responseJSON;
        return this.translate.instant(translateKeys[0]);
      }
    } else {
      return this.translate.instant('Error in getting response');
    }
  }

  convertToDropDown(dropDownData, inputKeys: ITransformDropdown): IDropDown[] {
    const value = inputKeys.valueKey;
    const label = inputKeys.labelKey;
    const color = inputKeys.colorKey;
    return dropDownData.map((item) => {
      return {
        label: item[label],
        value: item[value],
        color: item[color],
      };
    });
  }

  convertToNameID(id: number, name: string): INameIDPair {
    const nameIDObj: INameIDPair = {
      id,
      name,
    };
    return nameIDObj;
  }

  extractResponseMessage(errorData: string): string {
    const errorJson: IErrorResponse = JSON.parse(errorData);
    const { result, transCode } = errorJson;
    const translateText = this.translate.instant(transCode);
    return result ? `${result} ${translateText}` : translateText;
  }
}
