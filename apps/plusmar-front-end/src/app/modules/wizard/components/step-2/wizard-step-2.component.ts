import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SocialModeTypes } from '@reactor-room/itopplus-model-lib';

import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';

@Component({
  selector: 'reactor-room-wizard-step-2',
  templateUrl: './wizard-step-2.component.html',
  styleUrls: ['wizard-step-2.component.scss'],
})
export class WizardStepTwoComponent implements OnInit {
  constructor(public translate: TranslateService, public settingService: SettingsService) {}
  @Output() cancel = new EventEmitter<boolean>();
  SocialModeTypes = SocialModeTypes;

  ngOnInit(): void {}

  onCancel(): void {
    this.cancel.emit(true);
  }
}
