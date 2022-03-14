import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EFeatureIcon, IMenuRenderingSettingMobileIcon } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingMobileIcon } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-mobile-icon',
  templateUrl: './cms-menu-custom-mobile-icon.component.html',
  styleUrls: ['./cms-menu-custom-mobile-icon.component.scss'],
})
export class CmsMenuCustomMobileIconComponent implements OnInit, OnDestroy {
  menuMobileIconForm: FormGroup;
  contactIconData = [
    {
      selected: true,
      icon: 'assets/contact/facebook.svg',
      iconActive: 'assets/contact/facebook-a.svg',
      value: EFeatureIcon.FACEBOOK,
    },
    {
      selected: false,
      icon: 'assets/contact/line.svg',
      iconActive: 'assets/contact/line-a.svg',
      value: EFeatureIcon.LINE,
    },
    {
      selected: false,
      icon: 'assets/contact/phone.svg',
      iconActive: 'assets/contact/phone-a.svg',
      value: EFeatureIcon.MOBILE,
    },
    {
      selected: false,
      icon: 'assets/contact/wechat.svg',
      iconActive: 'assets/contact/wechat-a.svg',
      value: EFeatureIcon.WE_CHAT,
    },
  ];
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuMobileIconForm = this.getMenuMobileIconForm();
    this.sidebarService.getMenuMobileIconFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuMobileIcon: IMenuRenderingSettingMobileIcon) => {
      if (menuMobileIcon) {
        this.menuMobileIconForm.patchValue(menuMobileIcon);
        const contactListFormArray = this.menuMobileIconForm.get('icons') as FormArray;
        contactListFormArray.clear();
        this.contactIconData.forEach((item) => (item.selected = false));
        menuMobileIcon.icons.forEach((item) => {
          const formControl = new FormControl(item);
          contactListFormArray.push(formControl);
          const foundList = this.contactIconData.find((itemList) => itemList.value === item);
          foundList.selected = true;
        });
      }
    });
    this.onMenuMobileIconFormValueChange();
  }

  onMenuMobileIconFormValueChange(): void {
    this.menuMobileIconForm.valueChanges
      .pipe(
        startWith(this.menuMobileIconForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuMobileIconValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuMobileIcon: MenuRenderingSettingMobileIcon = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuMobileIcon(menuMobileIcon);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMenuMobileIconForm(): FormGroup {
    const formGroup = this.fb.group({
      icons: this.fb.array([new FormControl(EFeatureIcon.FACEBOOK)]),
      isSearch: [false],
      isLanguage: [false],
      component: [null],
      menuMobileIcon: [''],
    });
    return formGroup;
  }

  onSetContactListToForm(index: number): void {
    this.contactIconData[index].selected = !this.contactIconData[index].selected;
    const contactListFormArray = this.menuMobileIconForm.get('icons') as FormArray;
    contactListFormArray.clear();
    const foundList = this.contactIconData.filter((item) => item.selected === true);
    foundList.forEach((item) => {
      const formControl = new FormControl(item.value);
      contactListFormArray.push(formControl);
    });
  }
}
