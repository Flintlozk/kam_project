import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EBackground, EBackgroundPosition, EBackgroundSize, IDialogData, ILayoutSettingBackgroundImage } from '@reactor-room/cms-models-lib';
import { IFile } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CmsMediaModalComponent } from '../../../../../../../cms-media-management/cms-media-modal/cms-media-modal.component';
import { backgroundSize } from '../../../../../../cms-layout.list';
@Component({
  selector: 'cms-next-cms-layout-setting-background-image',
  templateUrl: './cms-layout-setting-background-image.component.html',
  styleUrls: ['./cms-layout-setting-background-image.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingBackgroundImageComponent implements OnInit {
  layoutSettingBackgroundImageForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
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
  backgroundSize = backgroundSize;
  constructor(private fb: FormBuilder, private parentFormDirective: FormGroupDirective, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.layoutSettingBackgroundImageForm = this.getLayoutSettingBackgroundImageFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingBackgroundImageForm', this.layoutSettingBackgroundImageForm);
    this.onLayoutSettingBackgroundImageFormValueChange();
  }

  onLayoutSettingBackgroundImageFormValueChange(): void {
    this.layoutSettingBackgroundImageForm.valueChanges.subscribe((value: ILayoutSettingBackgroundImage) => {
      this.setSelectedBackgroundPosition(value.position as EBackgroundPosition);
    });
  }
  getLayoutSettingBackgroundImageFormGroup(): FormGroup {
    const layoutSettingBackgroundImageFormGroup = this.fb.group({
      imgUrl: [''],
      position: [EBackgroundPosition.CENTER_CENTER],
      imageScale: [EBackgroundSize.UNSET],
      opacity: [100],
      colorOverlay: [''],
      colorOverlayOpacity: [100],
      width: [],
      height: [],
      repeat: [false],
    });
    return layoutSettingBackgroundImageFormGroup;
  }

  onSelectedBackgroundPostion(index: number): void {
    this.backgroundPosition.forEach((postion) => (postion.selected = false));
    this.backgroundPosition[index].selected = true;
    this.layoutSettingBackgroundImageForm.get('position').patchValue(this.backgroundPosition[index].postion);
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
        message: EBackground.IMAGE,
      } as IDialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((file: IFile) => {
        if (file) {
          this.layoutSettingBackgroundImageForm.get('imgUrl').patchValue(file.path);
        }
      });
  }

  onIncrease(formControlName: string): void {
    const formGroup = this.layoutSettingBackgroundImageForm.get(formControlName);
    formGroup.patchValue(formGroup.value + 1);
  }

  onDecrease(formControlName: string): void {
    const formGroup = this.layoutSettingBackgroundImageForm.get(formControlName);
    if (formGroup.value !== 0 && formGroup.value) formGroup.patchValue(formGroup.value - 1);
  }

  onRemoveColorProperty(): void {
    this.layoutSettingBackgroundImageForm.get('colorOverlay').patchValue('');
  }
}
