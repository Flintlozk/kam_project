import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { EPageMessageTrackMode, IPageMessageTrackMode, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-message-track-mode',
  templateUrl: './setting-message-track-mode.component.html',
  styleUrls: ['./setting-message-track-mode.component.scss'],
})
export class SettingMessageTrackModeComponent implements OnInit, OnDestroy {
  settingType = PageSettingType.MESSAGE_TRACK;
  @Input() isAllowed: boolean;
  messageTrackModeForm: FormGroup;
  EPageMessageTrackMode = EPageMessageTrackMode;

  destroy$: Subject<void> = new Subject<void>();
  constructor(public formBuilder: FormBuilder, private settingService: SettingsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getSettingMessageTrackMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getSettingMessageTrackMode(): void {
    this.settingService
      .getPageSetting(this.settingType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const configs = <IPageMessageTrackMode>val.options;
          if (configs?.trackMode) {
            this.initMessageTrackMode(configs?.trackMode);
          }
        }
      });
  }

  initMessageTrackMode(value: EPageMessageTrackMode): void {
    this.messageTrackModeForm = this.formBuilder.group({
      trackMode: [{ value, disabled: !this.isAllowed }],
    });

    this.onModeChanged();
  }

  setValue(mode: EPageMessageTrackMode): void {
    this.messageTrackModeForm.controls['trackMode'].patchValue(mode);
  }

  onModeChanged(): void {
    this.messageTrackModeForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: IPageMessageTrackMode) => {
      this.settingService.setMessageTrackMode(value).subscribe(
        () => {
          const text = `Changed to ${value.trackMode === EPageMessageTrackMode.TRACK_BY_TAG ? 'track by "Tags"' : 'track by "Assignee"'}`;
          this.toastr.success(text, 'Message Track Mode', {
            positionClass: 'toast-bottom-right',
          });
        },
        (err) => {
          this.toastr.error('Please try again', 'Message Track Mode', { positionClass: 'toast-bottom-right' });
        },
      );
    });
  }
}
