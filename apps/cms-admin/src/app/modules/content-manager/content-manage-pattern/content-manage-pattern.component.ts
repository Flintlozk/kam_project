import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ResponsiveLayoutComponent } from '../../../containers/responsive-layout/responsive-layout.component';
import { ContentPatternsService } from '../../cms-admin/services/content-patterns.service';
import { isValidMonacco } from '../../cms-admin/services/domain/common.domain';
import { ThemeService } from '../../cms-admin/services/theme.service';
import { contentCategoryData, gridTemplateColumns, patternCSS } from './content-manage-pattern.model';

@Component({
  selector: 'reactor-room-content-manage-pattern',
  templateUrl: './content-manage-pattern.component.html',
  styleUrls: ['./content-manage-pattern.component.scss'],
})
export class ContentManagePatternComponent implements OnInit, AfterViewInit {
  destroy$ = new Subject();
  patternId: string;
  isNewPattern: boolean;
  patternForm: FormGroup;
  fileToUpload;
  editorOptions = { theme: 'vs-dark', language: 'css', minimap: { enabled: false } };
  @ViewChild('monacoContainer') monacoContainer: ElementRef;
  @ViewChild('preview') preview: ElementRef;
  errorMessage: string;
  gridTemplateColumns = gridTemplateColumns;
  contentCategoryData = contentCategoryData;
  changeDetectorTrigger: boolean;
  changeDetectorPatternTrigger: boolean;
  pattern: IContentManagementGeneralPattern;

  constructor(
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private contentPatternService: ContentPatternsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.patternForm = this.getPatternFormGroup();
    this.pattern = this.patternForm.value;
    this.onPatternFormValueChange();
  }

  onPatternFormValueChange() {
    this.patternForm.valueChanges
      .pipe(
        startWith(this.patternForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentManagementGeneralPattern, IContentManagementGeneralPattern]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.pattern = newVaLue;
            if (!this.pattern.patternStyle.secondary.status) {
              this.pattern.patternStyle.secondary.maxContent = 0;
            }
            const maxPrimaryContent = this.pattern.patternStyle?.primary?.maxContent ? this.pattern.patternStyle?.primary?.maxContent : 0;
            const maxSecondaryContent = this.pattern.patternStyle?.secondary?.maxContent ? this.pattern.patternStyle?.secondary?.maxContent : 0;
            const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
            this.getCategoryContentsData(maxItemPerRow);
            this.changeDetectorPatternTrigger = !this.changeDetectorPatternTrigger;
          }
        }),
      )
      .subscribe();
  }

  getCategoryContentsData(maxItemPerRow: number) {
    this.contentCategoryData = deepCopy(contentCategoryData);
    this.contentCategoryData = this.contentCategoryData.slice(0, maxItemPerRow);
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((param) => {
          this.patternId = param?.type;
          if (this.patternId && !this.patternId.includes('new')) {
            this.isNewPattern = false;
            return this.contentPatternService.getContentPattern(this.patternId);
          } else {
            this.isNewPattern = true;
            return EMPTY;
          }
        }),
        tap((pattern: IContentManagementGeneralPattern) => {
          if (pattern) {
            this.patternForm.patchValue(pattern);
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          void this.router.navigate(['/layout/content-manager/new']);
          throw e;
        }),
      )
      .subscribe();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  getPatternFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      _id: ['tempPattern'],
      patternName: ['Sample Name', [Validators.required]],
      patternUrl: [''],
      patternStyle: this.getPatternStyleFormGroup(),
    });
    return formGroup;
  }

  getPatternStyleFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      container: this.getPatternGridFormGroup(),
      primary: this.getPatternItemFormGroup(),
      secondary: this.getPatternItemFormGroup(),
      css: [patternCSS, [Validators.required]],
    });
    return formGroup;
  }

  getPatternItemFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      maxContent: [0, [Validators.required]],
      grid: this.getPatternGridFormGroup(),
      status: [true],
    });
    return formGroup;
  }

  getPatternGridFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      gridTemplateColumns: ['1fr', [Validators.required]],
      gridTemplateRows: [''],
      gridGap: ['10px', [Validators.required]],
    });
    return formGroup;
  }

  async onPatternAction() {
    const valid = this.patternForm.valid;
    const cssValid = await isValidMonacco(this.monacoContainer);
    if (valid && cssValid) {
      this.errorMessage = '';
      this.themeService
        .updateThumnail(this.fileToUpload)
        .pipe(
          takeUntil(this.destroy$),
          switchMap((result: IHTTPResult) => {
            if (result.status === 200) {
              this.patternForm.get('patternUrl').patchValue(result.value);
              this.fileToUpload = null;
            }
            if (this.isNewPattern) {
              return this.contentPatternService.addContentPattern(this.patternForm.value);
            } else {
              return this.contentPatternService.updateContentPattern(this.patternForm.value);
            }
          }),
          tap((result: IHTTPResult) => {
            if (result.status === 200) {
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.SUCCESS,
                  message: 'Successfully!!!',
                } as StatusSnackbarModel,
              });
              if (this.isNewPattern) void this.router.navigate([`/layout/content-manager/${result.value}`]);
            }
          }),
          catchError((e) => {
            this.showUnexpectedError();
            throw e;
          }),
        )
        .subscribe();
    } else {
      this.errorMessage = 'Patterns Not Valid...Please re-check all Inputs!!!';
    }
  }

  onSetGridTemplateColumns(template: string, formControlName: string): void {
    if (formControlName === 'container') {
      const form = this.patternForm.get('patternStyle').get(formControlName).get('gridTemplateColumns');
      form.patchValue(template);
    } else {
      const form = this.patternForm.get('patternStyle').get(formControlName).get('grid').get('gridTemplateColumns');
      form.patchValue(template);
    }
  }

  onSetMaxContent(formControlName: string, control: string): void {
    const maxContentForm = this.patternForm.get('patternStyle').get(formControlName).get('maxContent');
    const maxContent = maxContentForm.value;
    switch (control) {
      case 'add':
        maxContentForm.patchValue(maxContent + 1);
        break;
      default:
        if (maxContent > 0) maxContentForm.patchValue(maxContent - 1);
        break;
    }
  }

  onResponsivePreviewLayout(): void {
    const dialogRef = this.dialog.open(ResponsiveLayoutComponent, {
      data: this.preview.nativeElement.innerHTML,
      width: '100%',
      height: '100%',
      maxWidth: 'unset',
      panelClass: 'no-padding',
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
  }

  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.patternForm.get('patternUrl').patchValue(reader.result);
        this.fileToUpload = file;
      };
      reader.readAsDataURL(file);
    }
  }
}
