import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-setting-button',
  templateUrl: './cms-layout-setting-button.component.html',
  styleUrls: ['./cms-layout-setting-button.component.scss'],
})
export class CmsLayoutSettingButtonComponent implements OnInit {
  buttonForm: FormGroup;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.BUTTON_SETTING,
      status: true,
    },
    {
      title: ESidebarElement.BUTTON_BORDER,
      status: false,
    },
    {
      title: ESidebarElement.BUTTON_TEXT,
      status: false,
    },
    {
      title: ESidebarElement.BUTTON_LINK,
      status: false,
    },
    {
      title: ESidebarElement.BUTTON_HOVER,
      status: false,
    },
  ];
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.buttonForm = this.getButtonFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getButtonFormGroup(): FormGroup {
    const buttonFormGroup = this.fb.group({});
    return buttonFormGroup;
  }
}
