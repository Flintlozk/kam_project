import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ETextPosition, fontSizeEm, fontSizePx } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingIcon } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-setting-icon',
  templateUrl: './cms-menu-custom-setting-icon.component.html',
  styleUrls: ['./cms-menu-custom-setting-icon.component.scss'],
})
export class CmsMenuCustomSettingIconComponent implements OnInit, OnDestroy {
  menuSettingIconForm: FormGroup;
  fontSizeEmData = fontSizeEm;
  fontSizePxData = fontSizePx;
  positionData = [
    {
      value: ETextPosition.LEFT,
      selected: true,
    },
    {
      value: ETextPosition.RIGHT,
      selected: false,
    },
  ];
  EPosition = ETextPosition;
  fontSizeCurrent = 'px';
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuSettingIconForm = this.getMenuSettingIconFormGroup();
    this.sidebarService.getMenuSettingIconFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSettingIcon) => {
      if (menuSettingIcon) {
        this.menuSettingIconForm.patchValue(menuSettingIcon);
        this.setFontSizeCurrent();
        this.onSetCurrentPostion(menuSettingIcon.position);
      }
    });
    this.onMenuSettingIconFormValueChange();
  }

  onMenuSettingIconFormValueChange(): void {
    this.menuSettingIconForm.valueChanges
      .pipe(
        startWith(this.menuSettingIconForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSettingIconValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSettingIcon: MenuRenderingSettingIcon = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSettingIcon(menuSettingIcon);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMenuSettingIconFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      isIcon: [false],
      size: [fontSizePx[5]],
      color: this.getMenuSettingIconColorFormGroup(),
      position: [ETextPosition.LEFT],
      component: null,
      menuSettingIcon: [''],
    });
    return formGroup;
  }

  getMenuSettingIconColorFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      value: '',
      opacity: [100],
    });
    return formGroup;
  }

  onSwitchFontSize(): void {
    const fontSizeFormGroup = this.menuSettingIconForm['controls']['size'];
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
    const fontSizeFormGroup = this.menuSettingIconForm['controls']['size'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes('px')) {
      this.fontSizeCurrent = 'px';
    } else {
      this.fontSizeCurrent = 'em';
    }
  }

  onPosition(index: number): void {
    this.positionData.forEach((item) => (item.selected = false));
    this.positionData[index].selected = true;
    const positionFormGroup = this.menuSettingIconForm.get('position');
    positionFormGroup.patchValue(this.positionData[index].value);
  }

  onSetCurrentPostion(position: ETextPosition): void {
    this.positionData.forEach((item) => (item.selected = false));
    const found = this.positionData.find((item) => item.value === position);
    found.selected = true;
  }
}
