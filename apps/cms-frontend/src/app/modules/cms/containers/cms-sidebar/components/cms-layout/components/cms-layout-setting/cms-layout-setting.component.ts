import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ESidebarMode, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-setting',
  templateUrl: './cms-layout-setting.component.html',
  styleUrls: ['./cms-layout-setting.component.scss'],
})
export class CmsLayoutSettingComponent implements OnInit {
  @Input() settingLayout: ESidebarMode;
  ESidebarMode = ESidebarMode;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.ADVANCE,
      status: true,
      belongTo: null,
    },
    {
      title: ESidebarElement.BORDER,
      status: false,
      belongTo: null,
    },
    {
      title: ESidebarElement.SHADOW,
      status: false,
      belongTo: null,
    },
    {
      title: ESidebarElement.HOVER,
      status: false,
      belongTo: null,
    },
    // {
    //   title: ESidebarElement.EFFECT,
    //   status: false,
    //   belongTo: null,
    // },
    {
      title: ESidebarElement.BACKGROUND,
      status: false,
      belongTo: null,
    },
    {
      title: ESidebarElement.CUSTOMIZE,
      status: false,
      belongTo: null,
    },
  ];
  layoutSettingForm: FormGroup;
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.layoutSettingForm = this.getLayoutSettingFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getLayoutSettingFormGroup(): FormGroup {
    const layoutSettingormGroup = this.fb.group({});
    return layoutSettingormGroup;
  }
}
