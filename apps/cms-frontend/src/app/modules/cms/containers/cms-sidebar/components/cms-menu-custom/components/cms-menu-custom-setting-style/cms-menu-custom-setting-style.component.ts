import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EMenuStyle } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingStyle } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, startWith, debounceTime, pairwise, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-setting-style',
  templateUrl: './cms-menu-custom-setting-style.component.html',
  styleUrls: ['./cms-menu-custom-setting-style.component.scss'],
})
export class CmsMenuCustomSettingStyleComponent implements OnInit, OnDestroy {
  menuSettingStyleForm: FormGroup;
  EMenuStyle = EMenuStyle;
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuSettingStyleForm = this.getMenuSettingStyleForm();
    this.sidebarService.getMenuSettingStyleFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSettingStyle) => {
      if (menuSettingStyle) {
        this.menuSettingStyleForm.patchValue(menuSettingStyle);
      }
    });
    this.onMenuSettingStyleFormValueChange();
  }

  onMenuSettingStyleFormValueChange(): void {
    this.menuSettingStyleForm.valueChanges
      .pipe(
        startWith(this.menuSettingStyleForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSettingStyleValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSettingStyle: MenuRenderingSettingStyle = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSettingStyle(menuSettingStyle);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMenuSettingStyleForm(): FormGroup {
    const formGroup = this.fb.group({
      style: [EMenuStyle.HORIZONTAL],
      component: null,
      menuSettingStyle: [''],
    });
    return formGroup;
  }

  onSetMenuStyle(style: EMenuStyle): void {
    this.menuSettingStyleForm.get('style').patchValue(style);
  }
}
