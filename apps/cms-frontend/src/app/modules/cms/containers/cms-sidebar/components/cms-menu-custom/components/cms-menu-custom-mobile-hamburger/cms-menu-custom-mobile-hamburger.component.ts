import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EMenuHamburgerGroup, ETextPosition, IMenuRenderingSettingMobileHamburger } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingMobileHamburger } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-mobile-hamburger',
  templateUrl: './cms-menu-custom-mobile-hamburger.component.html',
  styleUrls: ['./cms-menu-custom-mobile-hamburger.component.scss'],
})
export class CmsMenuCustomMobileHamburgerComponent implements OnInit, OnDestroy {
  menuMobileHamburgerForm: FormGroup;
  EMenuHamburgerGroup = EMenuHamburgerGroup;
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
  destroy$ = new Subject();

  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuMobileHamburgerForm = this.getMenuMobileHamburgerForm();
    this.sidebarService.getMenuMobileHamburgerFormValue
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((menuMobileHamburger: IMenuRenderingSettingMobileHamburger) => {
        if (menuMobileHamburger) {
          this.menuMobileHamburgerForm.patchValue(menuMobileHamburger);
          this.onSetCurrentPostion(menuMobileHamburger.position);
        }
      });
    this.onMenuMobileHamburgerFormValueChange();
  }

  onMenuMobileHamburgerFormValueChange(): void {
    this.menuMobileHamburgerForm.valueChanges
      .pipe(
        startWith(this.menuMobileHamburgerForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuMobileHamburgerValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuMobileHamburger: MenuRenderingSettingMobileHamburger = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuMobileHamburger(menuMobileHamburger);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMenuMobileHamburgerForm(): FormGroup {
    const formGroup = this.fb.group({
      icon: this.getMenuMobileHamburgerIconForm(),
      isText: [false],
      text: [''],
      position: [ETextPosition.LEFT],
      component: [null],
      menuMobileHamburger: [''],
    });
    return formGroup;
  }

  getMenuMobileHamburgerIconForm(): FormGroup {
    const formGroup = this.fb.group({
      iconGroup: [EMenuHamburgerGroup.GROUP_1],
      activeIcon: ['fas fa-bars'],
      inactiveIcon: ['fas fa-times'],
    });
    return formGroup;
  }

  onActiveIconGroup(group: EMenuHamburgerGroup, isFromMenu: boolean): void {
    if (!isFromMenu) return;
    this.menuMobileHamburgerForm.get('icon').get('iconGroup').patchValue(group);
  }

  onActiveMenuAppearanceText(status: boolean): void {
    this.menuMobileHamburgerForm.get('isText').patchValue(status);
  }

  onPosition(index: number): void {
    this.positionData.forEach((item) => (item.selected = false));
    this.positionData[index].selected = true;
    const positionFormGroup = this.menuMobileHamburgerForm.get('position');
    positionFormGroup.patchValue(this.positionData[index].value);
  }

  onSetCurrentPostion(position: ETextPosition): void {
    this.positionData.forEach((item) => (item.selected = false));
    const found = this.positionData.find((item) => item.value === position);
    found.selected = true;
  }
}
