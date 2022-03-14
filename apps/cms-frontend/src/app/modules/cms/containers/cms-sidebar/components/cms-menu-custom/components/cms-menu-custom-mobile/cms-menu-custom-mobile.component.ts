import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-menu-custom-mobile',
  templateUrl: './cms-menu-custom-mobile.component.html',
  styleUrls: ['./cms-menu-custom-mobile.component.scss'],
})
export class CmsMenuCustomMobileComponent implements OnInit {
  menuMobileForm: FormGroup;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.MENU_HAMBURGER,
      status: true,
    },
    {
      title: ESidebarElement.MENU_ICON_FEATURE,
      status: false,
    },
  ];
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.menuMobileForm = this.getMenuMobileFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getMenuMobileFormGroup(): FormGroup {
    const menuMobileFormGroup = this.fb.group({});
    return menuMobileFormGroup;
  }
}
