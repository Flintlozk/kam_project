import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ElinkType, ElinkTypeTitle, IGeneralLink } from '@reactor-room/cms-models-lib';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { ComponentTypeWithLink, GeneralLink } from '../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-general-link-setting',
  templateUrl: './cms-general-link-setting.component.html',
  styleUrls: ['./cms-general-link-setting.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsGeneralLinkSettingComponent implements OnInit, AfterViewInit, OnDestroy {
  generalLinkSettingForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  currentLinkType: ElinkType = ElinkType.URL;
  ElinkType = ElinkType;
  linkTypeData = [
    {
      value: ElinkType.URL,
      title: ElinkTypeTitle.URL,
    },
    {
      value: ElinkType.PAGE,
      title: ElinkTypeTitle.PAGE,
    },
    {
      value: ElinkType.PRODUCT,
      title: ElinkTypeTitle.PRODUCT,
    },
    {
      value: ElinkType.CONTENT,
      title: ElinkTypeTitle.CONTENT,
    },
    {
      value: ElinkType.POPUP,
      title: ElinkTypeTitle.POPUP,
    },
    {
      value: ElinkType.ANCHOR,
      title: ElinkTypeTitle.ANCHOR,
    },
    {
      value: ElinkType.EMAIL,
      title: ElinkTypeTitle.EMAIL,
    },
  ];
  pageData = [
    {
      value: 'Home',
      title: 'Home',
    },
    {
      value: 'Contact us',
      title: 'Contact us',
    },
    {
      value: 'About us',
      title: 'About us',
    },
  ];
  productPageData = [
    {
      value: 'Product Home',
      title: 'Product Home',
    },
    {
      value: 'Product 1',
      title: 'Product 1',
    },
    {
      value: 'Product 2',
      title: 'Product 2',
    },
  ];
  contentPageData = [
    {
      value: 'Content 1',
      title: 'Content 1',
    },
    {
      value: 'Content 2',
      title: 'Content 2',
    },
    {
      value: 'Content 3',
      title: 'Content 3',
    },
  ];
  popupPageData = [
    {
      value: 'Popup 1',
      title: 'Popup 1',
    },
    {
      value: 'Popup 2',
      title: 'Popup 2',
    },
    {
      value: 'Popup 3',
      title: 'Popup 3',
    },
  ];
  anchorData = [
    {
      value: 'Anchor 1',
      title: 'Anchor 1',
    },
    {
      value: 'Anchor 2',
      title: 'Anchor 2',
    },
    {
      value: 'Anchor 3',
      title: 'Anchor 3',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.generalLinkSettingForm = this.getGeneralLinkSettingFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('generalLinkSetting', this.generalLinkSettingForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getGeneralLinkSettingFormValue.pipe(distinctUntilChanged()).subscribe((generalLinkSettingValue: IGeneralLink) => {
      if (generalLinkSettingValue) this.generalLinkSettingForm.patchValue(generalLinkSettingValue);
    });
    this.onGeneralLinkSettingFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onGeneralLinkSettingFormValueChange(): void {
    this.generalLinkSettingForm.valueChanges
      .pipe(
        startWith(this.generalLinkSettingForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setGeneralLinkSettingValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const generalLinkSetting: GeneralLink = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithLink,
          };
          if (!newValue.component) {
            this.undoRedoService.addGeneralLinkSetting(generalLinkSetting);
          }
        }
      });
  }

  getGeneralLinkSettingFormGroup(): FormGroup {
    const generalLinkSettingFormGroup = this.fb.group({
      linkType: [ElinkType.URL],
      linkValue: [],
      parentID: [],
      component: null,
    });
    return generalLinkSettingFormGroup;
  }

  onLinkTypeChange(event: MatSelectChange): void {
    this.currentLinkType = event.value;
    this.generalLinkSettingForm.get('linkValue').patchValue('');
  }
}
