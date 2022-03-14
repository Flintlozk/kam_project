import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumLogDescription, logActionEnum } from '@reactor-room/itopplus-model-lib';

@Pipe({ name: 'logDescriptionTranslate' })
export class LogDescriptionTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(action: string, description: string): string {
    if (action === logActionEnum.LOGIN) {
      return this.translateService.instant('Login By');
    } else if (!EnumLogDescription[description]) {
      return description;
    } else {
      return this.translateService.instant(description);
    }
  }
}
