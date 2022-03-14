import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-content-management-landing',
  templateUrl: './cms-layout-content-management-landing.component.html',
  styleUrls: ['./cms-layout-content-management-landing.component.scss'],
})
export class CmsLayoutContentManagementLandingComponent implements OnInit {
  contentManagementLandingForm: FormGroup;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.CONTENT_MANAGE_LANDING,
      status: true,
    },
  ];
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.contentManagementLandingForm = this.getContentManagementFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getContentManagementFormGroup(): FormGroup {
    const contentManagementFormGroup = this.fb.group({});
    return contentManagementFormGroup;
  }
}
