import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ETextAlignment } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingAlignment } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-setting-alignment',
  templateUrl: './cms-menu-custom-setting-alignment.component.html',
  styleUrls: ['./cms-menu-custom-setting-alignment.component.scss'],
})
export class CmsMenuCustomSettingAlignmentComponent implements OnInit, OnDestroy {
  menuSettingAlignmentForm: FormGroup;
  textAlignmentData = [
    {
      value: ETextAlignment.LEFT,
      selected: true,
    },
    {
      value: ETextAlignment.CENTER,
      selected: false,
    },
    {
      value: ETextAlignment.RIGHT,
      selected: false,
    },
    {
      value: ETextAlignment.JUSTIFY,
      selected: false,
    },
  ];
  ETextAlignment = ETextAlignment;
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuSettingAlignmentForm = this.getMenuSettingAlignmentForm();
    this.sidebarService.getMenuSettingAlignmentFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSettingAlignment) => {
      if (menuSettingAlignment) {
        this.menuSettingAlignmentForm.patchValue(menuSettingAlignment);
        this.onActiveCurrentTextAlignment(menuSettingAlignment.alignment);
      }
    });
    this.onMenuSettingAnimationFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onMenuSettingAnimationFormValueChange(): void {
    this.menuSettingAlignmentForm.valueChanges
      .pipe(
        startWith(this.menuSettingAlignmentForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSettingAlignmentValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSettingAlignment: MenuRenderingSettingAlignment = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSettingAlignment(menuSettingAlignment);
          }
        }
      });
  }

  getMenuSettingAlignmentForm(): FormGroup {
    const formGroup = this.fb.group({
      alignment: [ETextAlignment.LEFT],
      component: null,
      menuSettingAlignment: [''],
    });
    return formGroup;
  }

  onTextAlignment(index: number): void {
    this.textAlignmentData.forEach((align) => (align.selected = false));
    this.textAlignmentData[index].selected = true;
    this.menuSettingAlignmentForm.get('alignment').patchValue(this.textAlignmentData[index].value);
  }

  onActiveCurrentTextAlignment(currentTextAlignment: ETextAlignment): void {
    this.textAlignmentData.forEach((style) => (style.selected = false));
    const found = this.textAlignmentData.find((style) => style.value === currentTextAlignment);
    found.selected = true;
  }
}
