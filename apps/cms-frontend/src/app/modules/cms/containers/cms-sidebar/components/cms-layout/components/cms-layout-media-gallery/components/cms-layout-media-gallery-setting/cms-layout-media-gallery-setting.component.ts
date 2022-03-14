import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EBackground, IMediaGallery, IMediaGallerySetting, MediaGalleryType } from '@reactor-room/cms-models-lib';
import { transformResizeImageURLToNormalUrl } from '@reactor-room/itopplus-helpers';
import { IFile } from '@reactor-room/itopplus-model-lib';
// eslint-disable-next-line max-len
import { CmsMediaGalleryRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { MediaGallerySetting } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsMediaModalComponent } from '../../../../../cms-media-management/cms-media-modal/cms-media-modal.component';
import { CmsLayoutMediaGalleryModalComponent } from '../cms-layout-media-gallery-modal/cms-layout-media-gallery-modal.component';

@Component({
  selector: 'cms-next-cms-layout-media-gallery-setting',
  templateUrl: './cms-layout-media-gallery-setting.component.html',
  styleUrls: ['./cms-layout-media-gallery-setting.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutMediaGallerySettingComponent implements OnInit, AfterViewInit, OnDestroy {
  mediaGallerySettingForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  EFileType = EBackground;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private dialog: MatDialog,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.mediaGallerySettingForm = this.getMediaGallerySettingFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('setting', this.mediaGallerySettingForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getMediaGallerySettingFormValue.pipe(distinctUntilChanged()).subscribe((mediaGallerySettingValue: IMediaGallerySetting) => {
      if (mediaGallerySettingValue) {
        this.mediaGallerySettingForm.patchValue(mediaGallerySettingValue);
        const gallleryListFormArray = this.mediaGallerySettingForm.get('gallleryList') as FormArray;
        gallleryListFormArray.clear();
        mediaGallerySettingValue.gallleryList.forEach((item) => {
          const galleryListItem = this.getMediaGalleryListFormGroup();
          galleryListItem.patchValue(item);
          gallleryListFormArray.push(galleryListItem);
        });
      }
    });
    this.onMediaGallerySettingFormValueChange();
  }

  onMediaGallerySettingFormValueChange(): void {
    this.mediaGallerySettingForm.valueChanges
      .pipe(
        startWith(this.mediaGallerySettingForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setMediaGallerySettingValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const mediaGallerySetting: MediaGallerySetting = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMediaGalleryRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutMediaGallerySetting(mediaGallerySetting);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMediaGallerySettingFormGroup(): FormGroup {
    const mediaGallerySettingFormGroup = this.fb.group({
      galleryPatternId: [MediaGalleryType.GALLERY_1],
      galleryPatternUrl: ['assets/cms/media-style/gallery/gallery-1.png'],
      galleryGap: [0],
      galleryMaxHeight: [250],
      isChangePattern: [true],
      gallleryList: this.getMediaGalleryListFormArray(),
      component: null,
    });
    return mediaGallerySettingFormGroup;
  }

  getMediaGalleryListFormArray(): FormArray {
    const mediaGalleryListFormArray = this.fb.array([]);
    return mediaGalleryListFormArray;
  }

  getMediaGalleryListFormGroup(): FormGroup {
    const mediaGalleryListFormGroup = this.fb.group({
      url: [''],
      fileType: [''],
      title: [''],
      description: [''],
    });
    return mediaGalleryListFormGroup;
  }

  onPushMediaGalleryListFormArray(): void {
    const gallleryListFormArray = this.mediaGallerySettingForm.get('gallleryList') as FormArray;
    const dialogRef = this.dialog.open(CmsMediaModalComponent, {
      height: '90%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((files: IFile[]) => {
        if (files) {
          files.forEach((file: IFile) => {
            const mediaGalleryListFormGroup = this.getMediaGalleryListFormGroup();
            file.path = transformResizeImageURLToNormalUrl(file.path);
            mediaGalleryListFormGroup.patchValue({
              url: file.path,
              fileType: this.getEBackGround(file.extension),
              title: file.name,
              description: file.description,
            });
            gallleryListFormArray.push(mediaGalleryListFormGroup);
          });
        }
      });
  }

  getEBackGround(extension: string): EBackground {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return EBackground.IMAGE;
      case 'mp4':
        return EBackground.VIDEO;
      default:
        return EBackground.COLOR;
    }
  }

  onRemoveMediaGalleryListFormArray(index: number): void {
    const gallleryListFormArray = this.mediaGallerySettingForm.get('gallleryList') as FormArray;
    gallleryListFormArray.removeAt(index);
  }

  onMediaGalleryDialog(): void {
    const dialogRef = this.dialog.open(CmsLayoutMediaGalleryModalComponent, {
      height: '90%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mediaGalleryData: IMediaGallery) => {
        if (mediaGalleryData) this.mediaGallerySettingForm.patchValue(mediaGalleryData.gallery);
      });
  }

  onIncrease(formControlName: string): void {
    const formGroup = this.mediaGallerySettingForm.get(formControlName);
    formGroup.patchValue(formGroup.value + 1);
  }
  onDecrease(formControlName: string): void {
    const formGroup = this.mediaGallerySettingForm.get(formControlName);
    if (formGroup.value !== 0 && formGroup.value) formGroup.patchValue(formGroup.value - 1);
  }
}
