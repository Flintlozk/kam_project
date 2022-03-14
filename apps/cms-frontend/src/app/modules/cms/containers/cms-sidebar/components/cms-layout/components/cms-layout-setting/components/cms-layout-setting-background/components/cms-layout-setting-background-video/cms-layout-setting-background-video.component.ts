import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  EBackground,
  EBackgroundPosition,
  EBackgroundSize,
  EBackgroundSizeTitle,
  EVideoSPeedPlay,
  EVideoSPeedPlayTitle,
  IDialogData,
  ILayoutSettingBackgroundVideo,
  IMediaGalleryList,
} from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CmsMediaModalComponent } from '../../../../../../../cms-media-management/cms-media-modal/cms-media-modal.component';
@Component({
  selector: 'cms-next-cms-layout-setting-background-video',
  templateUrl: './cms-layout-setting-background-video.component.html',
  styleUrls: ['./cms-layout-setting-background-video.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingBackgroundVideoComponent implements OnInit {
  layoutSettingBackgroundVideoForm: FormGroup;
  destroy$ = new Subject();
  parentForm: FormGroup;
  backgroundPosition = [
    {
      postion: EBackgroundPosition.LEFT_TOP,
      selected: false,
    },
    {
      postion: EBackgroundPosition.CENTER_TOP,
      selected: false,
    },
    {
      postion: EBackgroundPosition.RIGHT_TOP,
      selected: false,
    },
    {
      postion: EBackgroundPosition.LEFT_CENTER,
      selected: false,
    },
    {
      postion: EBackgroundPosition.CENTER_CENTER,
      selected: true,
    },
    {
      postion: EBackgroundPosition.RIGHT_CENTER,
      selected: false,
    },
    {
      postion: EBackgroundPosition.LEFT_BOTTOM,
      selected: false,
    },
    {
      postion: EBackgroundPosition.CENTER_BOTTOM,
      selected: false,
    },
    {
      postion: EBackgroundPosition.RIGHT_BOTTOM,
      selected: false,
    },
  ];
  backgroundSize = [
    {
      value: EBackgroundSize.UNSET,
      title: EBackgroundSizeTitle.UNSET,
    },
    {
      value: EBackgroundSize.CONTAIN,
      title: EBackgroundSizeTitle.CONTAIN,
    },
    {
      value: EBackgroundSize.COVER,
      title: EBackgroundSizeTitle.COVER,
    },
    {
      value: EBackgroundSize.AUTO,
      title: EBackgroundSizeTitle.AUTO,
    },
  ];
  videoSpeed = [
    {
      value: EVideoSPeedPlay.NORMAL,
      title: EVideoSPeedPlayTitle.NORMAL,
    },
    {
      value: EVideoSPeedPlay.X05,
      title: EVideoSPeedPlayTitle.X05,
    },
    {
      value: EVideoSPeedPlay.X075,
      title: EVideoSPeedPlayTitle.X075,
    },
    {
      value: EVideoSPeedPlay.X125,
      title: EVideoSPeedPlayTitle.X125,
    },
    {
      value: EVideoSPeedPlay.X15,
      title: EVideoSPeedPlayTitle.X15,
    },
    {
      value: EVideoSPeedPlay.X2,
      title: EVideoSPeedPlayTitle.X2,
    },
  ];
  constructor(private fb: FormBuilder, private parentFormDirective: FormGroupDirective, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.layoutSettingBackgroundVideoForm = this.getLayoutSettingBackgroundVideoFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingBackgroundVideoForm', this.layoutSettingBackgroundVideoForm);
    this.onLayoutSettingBackgroundVideoFormValueChange();
  }

  onLayoutSettingBackgroundVideoFormValueChange(): void {
    this.layoutSettingBackgroundVideoForm.valueChanges.subscribe((value: ILayoutSettingBackgroundVideo) => {
      this.setSelectedBackgroundPosition(value.position as EBackgroundPosition);
    });
  }

  getLayoutSettingBackgroundVideoFormGroup(): FormGroup {
    const layoutSettingBackgroundVideoFormGroup = this.fb.group({
      videoUrl: [''],
      position: [EBackgroundPosition.CENTER_CENTER],
      playInLoop: [false],
      videoSpeed: [EVideoSPeedPlay.NORMAL],
      videoScale: [EBackgroundSize.UNSET],
      opacity: [100],
      colorOverlay: [''],
      colorOverlayOpacity: [100],
      width: [],
      height: [],
    });
    return layoutSettingBackgroundVideoFormGroup;
  }

  onSelectedBackgroundPostion(index: number): void {
    this.backgroundPosition.forEach((postion) => (postion.selected = false));
    this.backgroundPosition[index].selected = true;
    this.layoutSettingBackgroundVideoForm.get('position').patchValue(this.backgroundPosition[index].postion);
  }

  setSelectedBackgroundPosition(position: EBackgroundPosition): void {
    this.backgroundPosition.forEach((postion) => (postion.selected = false));
    const found = this.backgroundPosition.find((item) => item.postion === position);
    found.selected = true;
  }

  onMediaGalleryDialog(): void {
    const dialogRef = this.dialog.open(CmsMediaModalComponent, {
      height: '90%',
      data: {
        message: EBackground.VIDEO,
      } as IDialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mediaGalleryList: IMediaGalleryList) => {
        if (mediaGalleryList) {
          this.layoutSettingBackgroundVideoForm.get('videoUrl').patchValue(mediaGalleryList.url);
        }
      });
  }

  onIncrease(formControlName: string): void {
    const formGroup = this.layoutSettingBackgroundVideoForm.get(formControlName);
    formGroup.patchValue(formGroup.value + 1);
  }

  onDecrease(formControlName: string): void {
    const formGroup = this.layoutSettingBackgroundVideoForm.get(formControlName);
    if (formGroup.value !== 0 && formGroup.value) formGroup.patchValue(formGroup.value - 1);
  }

  onRemoveColorProperty(): void {
    this.layoutSettingBackgroundVideoForm.get('colorOverlay').patchValue('');
  }
}
