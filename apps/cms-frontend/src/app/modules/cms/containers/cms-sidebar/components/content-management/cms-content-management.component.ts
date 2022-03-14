import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EBackground, EnumLanguageCultureUI, IContentEditor, IContentEditorLanguage, IDialogData, ILanguage } from '@reactor-room/cms-models-lib';
import { IFile } from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { isValidMonacco } from '../../../../services/domain/common.domain';
import { ESidebarMode } from '../../cms-sidebar.model';
import { CmsMediaModalComponent } from '../cms-media-management/cms-media-modal/cms-media-modal.component';

@Component({
  selector: 'cms-next-cms-content-management',
  templateUrl: './cms-content-management.component.html',
  styleUrls: ['./cms-content-management.component.scss'],
})
export class CmsContentManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  contentManage: IContentEditor;
  contentManageForm: FormGroup;
  isDetailToggle = false;
  isSEOToggle = false;
  isCSSToggle = false;
  ESidebarMode = ESidebarMode;
  sidebarLayoutMode: ESidebarMode;
  sidebarMode: ESidebarMode;
  currentLang: EnumLanguageCultureUI;
  destroy$ = new Subject();
  editorOptions = { theme: 'vs-dark', language: 'css', minimap: { enabled: false } };
  @ViewChild('monacoContainer') monacoContainer: ElementRef;
  safeCSS: SafeHtml = null;
  constructor(
    private fb: FormBuilder,
    private sideBarService: CmsSidebarService,
    private cmsContentEditService: CmsContentEditService,
    private commonService: CmsCommonService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) {
    this.sideBarService.getSidebarMode.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((mode) => {
      this.sidebarMode = mode;
    });
    this.sideBarService.getSidebarLayoutMode.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((mode) => {
      this.sidebarLayoutMode = mode;
    });
    this.contentManageForm = this.getContentManageFormGroup();
    this.initLanguageValue();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cmsContentEditService.$contents.pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged()).subscribe((contents: IContentEditor) => {
      if (contents?._id) {
        contents.startDate = dayjs(new Date(+contents.startDate)).toJSON();
        contents.endDate = dayjs(new Date(+contents.endDate)).toJSON();
        this.contentManage = contents;
        this.contentManageForm.patchValue(contents);
        const languageFormArray = this.contentManageForm.get('language') as FormArray;
        languageFormArray.clear();
        contents.language.forEach((lang) => {
          const languageForm = this.getContentManageLanguageFormGroup();
          languageForm.patchValue(lang);
          languageFormArray.push(languageForm);
        });

        const categoryFormArray = this.contentManageForm.get('categories') as FormArray;
        categoryFormArray.clear();
        contents.categories.forEach((category) => {
          const categoryForm = new FormControl(category);
          categoryFormArray.push(categoryForm);
        });

        const tagFormArray = this.contentManageForm.get('tags') as FormArray;
        tagFormArray.clear();
        contents.tags.forEach((tag) => {
          const tagForm = new FormControl(tag);
          tagFormArray.push(tagForm);
        });

        const authorFormArray = this.contentManageForm.get('authors') as FormArray;
        authorFormArray.clear();
        contents.authors.forEach((author) => {
          const authorForm = new FormControl(author);
          authorFormArray.push(authorForm);
        });
      }
    });
    this.onContentManageFormValueChange();
  }

  initLanguageValue() {
    const languageFormArray = this.contentManageForm.get('language') as FormArray;
    this.commonService.getCmsLanguageSwitch
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        tap((language: ILanguage) => {
          if (!language) return;
          this.currentLang = language.cultureUI;
          if (!languageFormArray.controls.length) {
            const languageForm = this.getContentManageLanguageFormGroup();
            languageForm.get('cultureUI').patchValue(this.commonService.defaultCultureUI);
            languageFormArray.push(languageForm);
          }
          const foundLang = languageFormArray.value.find((lang: IContentEditorLanguage) => lang.cultureUI === language.cultureUI);
          if (!foundLang) {
            const languageForm = this.getContentManageLanguageFormGroup();
            languageForm.get('cultureUI').patchValue(language.cultureUI);
            languageFormArray.push(languageForm);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onContentManageFormValueChange() {
    this.contentManageForm.valueChanges.pipe(startWith(this.contentManageForm.value)).subscribe(async (value) => {
      const css = this.contentManageForm.get('customCSS').value;
      this.safeCSS = this.getSafeCSSRendering(css);
      const validMonacco = await isValidMonacco(this.monacoContainer);
      if (validMonacco && this.contentManageForm.valid) {
        this.cmsContentEditService.contentsForm = value;
      } else {
        this.cmsContentEditService.contentsForm = null;
      }
    });
  }

  getSafeCSSRendering(css: string): SafeHtml {
    const type = `<style>${css}</style>`;
    return this.sanitizer.bypassSecurityTrustHtml(type) as SafeHtml;
  }

  getContentManageFormGroup(): FormGroup {
    const contentManageFormGroup = this.fb.group({
      _id: [''],
      name: ['Default Content Name', Validators.required],
      language: this.fb.array([]),
      categories: this.fb.array([]),
      tags: this.fb.array([]),
      authors: this.fb.array([]),
      isPin: [false],
      priority: [0],
      startDate: [new Date().toISOString()],
      isEndDate: [false],
      endDate: [],
      views: [0],
      coverImage: [''],
      isPublish: [true],
      customCSS: ['#tempContentId{}'],
    });
    return contentManageFormGroup;
  }

  getContentManageLanguageFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      cultureUI: [''],
      title: ['Sample Title', Validators.required],
      subTitle: [''],
      keyword: [''],
    });
    return formGroup;
  }

  onToggleDetail(): void {
    this.isDetailToggle = !this.isDetailToggle;
    this.isSEOToggle = false;
  }

  onToggleSEO(): void {
    this.isSEOToggle = !this.isSEOToggle;
    this.isDetailToggle = false;
  }

  onToggleCSS(): void {
    this.isCSSToggle = !this.isCSSToggle;
    this.isDetailToggle = false;
  }

  categoryIdsEvent(event: string[]) {
    const categoriesFormArray = this.contentManageForm.get('categories') as FormArray;
    categoriesFormArray.clear();
    event.forEach((categoryId) => {
      const formControl = new FormControl(categoryId);
      categoriesFormArray.push(formControl);
    });
  }

  tagsEvent(event: string[]): void {
    const tagsFormArray = this.contentManageForm.get('tags') as FormArray;
    tagsFormArray.clear();
    event.forEach((tag) => {
      const formControl = new FormControl(tag);
      tagsFormArray.push(formControl);
    });
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
          this.contentManageForm.get('coverImage').patchValue(file.path);
        }
      });
  }
}
