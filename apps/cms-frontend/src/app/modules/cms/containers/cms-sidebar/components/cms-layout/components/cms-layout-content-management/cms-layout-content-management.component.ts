import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-content-management',
  templateUrl: './cms-layout-content-management.component.html',
  styleUrls: ['./cms-layout-content-management.component.scss'],
})
export class CmsLayoutContentManagementComponent implements OnInit {
  contentManagementForm: FormGroup;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.CONTENT_MANAGE_GENERAL,
      status: true,
    },
    {
      title: ESidebarElement.CONTENT_MANAGE_CONTENTS,
      status: false,
    },
    {
      title: ESidebarElement.CONTENT_MANAGE_LANDING,
      status: false,
    },
  ];
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.contentManagementForm = this.getContentManagementFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getContentManagementFormGroup(): FormGroup {
    const contentManagementFormGroup = this.fb.group({});
    return contentManagementFormGroup;
  }
}
