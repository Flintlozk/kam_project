import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPageAdvancedSettings, IAdvancedPageSettingsDirectMessageSteps, PipelineStepTypeEnum } from '@reactor-room/itopplus-model-lib';
import { first } from 'lodash';

@Component({
  selector: 'reactor-room-setting-direct-message-order-dialog',
  templateUrl: './setting-direct-message-order-dialog.component.html',
  styleUrls: ['./setting-direct-message-order-dialog.component.scss'],
})
export class SettingDirectMessageOrderDialogComponent implements OnInit {
  currentSetting: IAdvancedPageSettingsDirectMessageSteps = null;
  constructor(
    public dialogRef: MatDialogRef<SettingDirectMessageOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: PipelineStepTypeEnum;
      settings: IPageAdvancedSettings;
    },
  ) {}

  ngOnInit(): void {
    if (this?.data?.settings) {
      const { type, settings } = this.data;
      this.currentSetting = first(settings.direct_message.filter((s) => s.type === type));
    }
  }

  onNoClick(): void {
    this.dialogRef.close({
      setting: null,
    });
  }

  onSave(): void {
    this.dialogRef.close({
      setting: this.currentSetting,
    });
  }

  reset(): void {
    this.currentSetting.title = this.currentSetting.defaultTitle;
    this.currentSetting.label = this.currentSetting.defaultLabel;
  }
}
