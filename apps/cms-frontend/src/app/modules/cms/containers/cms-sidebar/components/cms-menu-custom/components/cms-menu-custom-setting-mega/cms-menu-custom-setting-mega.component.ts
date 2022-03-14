import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fontSizeEm, fontSizePx } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingMega } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-setting-mega',
  templateUrl: './cms-menu-custom-setting-mega.component.html',
  styleUrls: ['./cms-menu-custom-setting-mega.component.scss'],
})
export class CmsMenuCustomSettingMegaComponent implements OnInit, OnDestroy {
  menuSettingMegaForm: FormGroup;
  fontSizeEmData = fontSizeEm;
  fontSizePxData = fontSizePx;
  fontSizeCurrent = 'px';
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuSettingMegaForm = this.getMenuSettingMegaFormGroup();
    this.sidebarService.getMenuSettingMegaFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSettingMega) => {
      if (menuSettingMega) {
        this.menuSettingMegaForm.patchValue(menuSettingMega);
        this.setFontSizeCurrent();
      }
    });
    this.onMenuSettingMegaFormValueChange();
  }

  onMenuSettingMegaFormValueChange(): void {
    this.menuSettingMegaForm.valueChanges
      .pipe(
        startWith(this.menuSettingMegaForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSettingMegaValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSettingMega: MenuRenderingSettingMega = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSettingMega(menuSettingMega);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMenuSettingMegaFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      size: [fontSizePx[5]],
      color: this.getMenuSettingMegaColorFormGroup(),
      component: null,
      menuSettingMega: [''],
    });
    return formGroup;
  }

  getMenuSettingMegaColorFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      value: '',
      opacity: [100],
    });
    return formGroup;
  }

  onSwitchFontSize(): void {
    const fontSizeFormGroup = this.menuSettingMegaForm['controls']['size'];
    this.setFontSizeCurrent();
    switch (this.fontSizeCurrent) {
      case 'px':
        this.fontSizeCurrent = 'em';
        fontSizeFormGroup.patchValue('1em');
        break;
      case 'em':
        this.fontSizeCurrent = 'px';
        fontSizeFormGroup.patchValue('14px');
        break;
      default:
        break;
    }
  }

  setFontSizeCurrent(): void {
    const fontSizeFormGroup = this.menuSettingMegaForm['controls']['size'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes('px')) {
      this.fontSizeCurrent = 'px';
    } else {
      this.fontSizeCurrent = 'em';
    }
  }
}
