import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContentEditorComponentImageCaptionType, EBackground, IContentEditorComponentImageOption, IDialogData, IDropDown } from '@reactor-room/cms-models-lib';
import { IFile } from '@reactor-room/itopplus-model-lib';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { startWith, takeUntil, debounceTime, tap } from 'rxjs/operators';
import { ESidebarMode } from '../../../../cms-sidebar.model';
import { CmsMediaModalComponent } from '../../../cms-media-management/cms-media-modal/cms-media-modal.component';

@Component({
  selector: 'cms-next-cms-layout-image',
  templateUrl: './cms-layout-image.component.html',
  styleUrls: ['./cms-layout-image.component.scss'],
})
export class CmsLayoutImageComponent implements OnInit, OnDestroy {
  @Input() isContentEditor = false;
  destroy$ = new Subject();
  layoutImageForm: FormGroup;
  captionType: IDropDown[] = [
    {
      title: 'Bottom',
      value: ContentEditorComponentImageCaptionType.TYPE_1,
    },
    {
      title: 'Overlay',
      value: ContentEditorComponentImageCaptionType.TYPE_2,
    },
  ];
  constructor(private sidebarService: CmsSidebarService, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.layoutImageForm = this.getLayoutImageFormGroup();
    this.sidebarService.getLayoutImageFormValue.pipe().subscribe((layoutImage: IContentEditorComponentImageOption) => {
      if (layoutImage) {
        this.layoutImageForm.patchValue(layoutImage);
      }
    });
    this.onLayoutImageFormValueChange();
  }

  onLayoutImageFormValueChange() {
    this.layoutImageForm.valueChanges
      .pipe(
        startWith(this.layoutImageForm.value),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setLayoutImageValue(value);
          }
        }),
      )
      .subscribe();
  }
  getLayoutImageFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      imgUrl: [''],
      isCaption: [false],
      captionType: [ContentEditorComponentImageCaptionType.TYPE_1],
      language: this.getLayoutImageFormLanguageFormGroup(),
    });
    return formGroup;
  }

  getLayoutImageFormLanguageFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      cultureUI: [''],
      caption: [''],
      alt: [''],
      title: [''],
    });
    return formGroup;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onDismissContentEditor(): void {
    this.sidebarService.setSidebarMode(ESidebarMode.CONTENT_MANAGE);
    this.sidebarService.setSidebarLayoutMode(null);
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
        if (file && file?.path) {
          this.layoutImageForm.get('imgUrl').patchValue(file.path);
        }
      });
  }
}
