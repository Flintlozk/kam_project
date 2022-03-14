import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { IMediaGalleryControl } from '@reactor-room/cms-models-lib';
// eslint-disable-next-line max-len
import { CmsMediaGalleryRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { MediaGalleryControl } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-layout-media-gallery-control',
  templateUrl: './cms-layout-media-gallery-control.component.html',
  styleUrls: ['./cms-layout-media-gallery-control.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutMediaGalleryControlComponent implements OnInit, AfterViewInit, OnDestroy {
  mediaGalleryControlForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.mediaGalleryControlForm = this.getMediaGalleryControlFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('control', this.mediaGalleryControlForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getMediaGalleryControlFormValue.pipe(distinctUntilChanged()).subscribe((mediaGalleryControlValue: IMediaGalleryControl) => {
      if (mediaGalleryControlValue) {
        this.mediaGalleryControlForm.patchValue(mediaGalleryControlValue);
      }
    });
    this.onMediaGalleryControlFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onMediaGalleryControlFormValueChange(): void {
    this.mediaGalleryControlForm.valueChanges
      .pipe(
        startWith(this.mediaGalleryControlForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setMediaGalleryControlValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const mediaGalleryControl: MediaGalleryControl = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMediaGalleryRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutMediaGalleryControl(mediaGalleryControl);
          }
        }
      });
  }

  getMediaGalleryControlFormGroup(): FormGroup {
    const mediaGalleryControlFormGroup = this.fb.group({
      isPageSlide: [false],
      isAutoSlide: [false],
      slideSpeed: [1000],
      isPageButton: [false],
      pageButtonSize: [30],
      pageButtonOffset: [0],
      isPageArrow: [false],
      pageArrowSize: [30],
      pageArrowOffset: [0],
      mediaGalleryControl: [''],
      component: null,
    });
    return mediaGalleryControlFormGroup;
  }
}
