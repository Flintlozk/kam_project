import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-menu-custom-setting',
  templateUrl: './cms-menu-custom-setting.component.html',
  styleUrls: ['./cms-menu-custom-setting.component.scss'],
})
export class CmsMenuCustomSettingComponent implements OnInit {
  menuSettingForm: FormGroup;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.MENU_STICKY,
      status: true,
    },
    {
      title: ESidebarElement.MENU_ANIMATION,
      status: false,
    },
    {
      title: ESidebarElement.MENU_TEXT_ALIGNMENT,
      status: false,
    },
    {
      title: ESidebarElement.MENU_STYLE,
      status: false,
    },
    {
      title: ESidebarElement.MENU_ICON,
      status: false,
    },
    {
      title: ESidebarElement.MENU_MEGA,
      status: false,
    },
  ];
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.menuSettingForm = this.getMenuSettingFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getMenuSettingFormGroup(): FormGroup {
    const menuSettingFormGroup = this.fb.group({});
    return menuSettingFormGroup;
  }
}
