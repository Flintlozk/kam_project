import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EStickyMode } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingSticky } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, startWith, debounceTime, pairwise, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-setting-sticky',
  templateUrl: './cms-menu-custom-setting-sticky.component.html',
  styleUrls: ['./cms-menu-custom-setting-sticky.component.scss'],
})
export class CmsMenuCustomSettingStickyComponent implements OnInit, OnDestroy {
  menuSettingStickyForm: FormGroup;
  EStickyMode = EStickyMode;
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuSettingStickyForm = this.getMenuSettingStickyForm();
    this.sidebarService.getMenuSettingStickyFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSettingSticky) => {
      if (menuSettingSticky) {
        this.menuSettingStickyForm.patchValue(menuSettingSticky);
      }
    });
    this.onMenuSettingStickyFormValueChange();
  }

  getMenuSettingStickyForm(): FormGroup {
    const formGroup = this.fb.group({
      sticky: [EStickyMode.NONE],
      component: null,
      menuSettingSticky: [''],
    });
    return formGroup;
  }

  onMenuSettingStickyFormValueChange(): void {
    this.menuSettingStickyForm.valueChanges
      .pipe(
        startWith(this.menuSettingStickyForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSettingStickyValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSettingSticky: MenuRenderingSettingSticky = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSettingSticky(menuSettingSticky);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onSetSickyMode(mode: EStickyMode): void {
    this.menuSettingStickyForm.get('sticky').patchValue(mode);
  }
}
