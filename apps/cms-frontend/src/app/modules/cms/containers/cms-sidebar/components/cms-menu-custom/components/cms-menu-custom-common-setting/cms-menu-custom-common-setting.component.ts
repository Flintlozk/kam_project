import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-menu-custom-common-setting',
  templateUrl: './cms-menu-custom-common-setting.component.html',
  styleUrls: ['./cms-menu-custom-common-setting.component.scss'],
})
export class CmsMenuCustomCommonSettingComponent implements OnInit {
  menuSettingCommonForm: FormGroup;
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
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.menuSettingCommonForm = this.getMenuSettingFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getMenuSettingFormGroup(): FormGroup {
    const menuSettingFormGroup = this.fb.group({});
    return menuSettingFormGroup;
  }
}
