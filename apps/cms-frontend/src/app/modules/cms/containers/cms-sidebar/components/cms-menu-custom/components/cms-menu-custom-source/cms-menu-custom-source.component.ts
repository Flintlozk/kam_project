import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMenuSourceType, IMenuRenderingSettingSource } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingSource } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { CmsMenuCustomService } from 'apps/cms-frontend/src/app/modules/cms/services/menu-custom.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-source',
  templateUrl: './cms-menu-custom-source.component.html',
  styleUrls: ['./cms-menu-custom-source.component.scss'],
})
export class CmsMenuCustomSourceComponent implements OnInit, AfterViewInit, OnDestroy {
  menuSourceOption = [
    {
      value: EMenuSourceType.ROOT_MENU,
      title: 'Root Menu',
    },
    {
      value: EMenuSourceType.CHILD_MENU,
      title: 'Child Menu',
    },
    {
      value: EMenuSourceType.CUSTOM_MENU,
      title: 'Custom Menu',
    },
  ];

  menuGroupOption = [];
  EMenuSourceType = EMenuSourceType;
  menuSourceForm: FormGroup;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private cmsMenuCustomService: CmsMenuCustomService,
    private snackBar: MatSnackBar,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.menuSourceForm = this.getMenuSourceForm();
    this.onGetMenuGroup();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getMenuSourceFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSource: IMenuRenderingSettingSource) => {
      if (menuSource) {
        this.menuSourceForm.patchValue(menuSource);
      }
    });
    this.onMenuSourceFormValueChange();
  }

  onMenuSourceFormValueChange(): void {
    this.menuSourceForm.valueChanges
      .pipe(
        startWith(this.menuSourceForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSourceValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSource: MenuRenderingSettingSource = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSource(menuSource);
          }
        }
      });
  }

  onGetMenuGroup(): void {
    this.cmsMenuCustomService
      .getMenuGroup()
      .pipe(
        takeUntil(this.destroy$),
        tap((menuGroup) => {
          if (menuGroup) this.menuGroupOption = menuGroup;
          if (menuGroup.length) this.menuSourceForm.get('menuGroupId').patchValue(menuGroup[0]._id);
        }),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => getMenuGroup :>> ', e);
          return EMPTY;
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMenuSourceForm(): FormGroup {
    const menuSourceForm = this.fb.group({
      sourceType: [EMenuSourceType.ROOT_MENU],
      menuGroupId: [''],
      parentMenuId: [''],
      menuSource: [''],
      component: null,
    });
    return menuSourceForm;
  }

  parentMenuIdEvent(event: string): void {
    this.menuSourceForm.get('parentMenuId').patchValue(event);
  }
}
