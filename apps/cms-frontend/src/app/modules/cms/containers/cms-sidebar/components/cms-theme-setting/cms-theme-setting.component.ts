import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { ESidebarElement, ESidebarMode, ISidebarElement } from '../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-theme-setting',
  templateUrl: './cms-theme-setting.component.html',
  styleUrls: ['./cms-theme-setting.component.scss'],
})
export class CmsThemeSettingComponent implements OnInit {
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.THEME_SETTING,
      status: true,
    },
    {
      title: ESidebarElement.THEME_DEVICE,
      status: false,
    },
    {
      title: ESidebarElement.THEME_COLOR,
      status: false,
    },
    {
      title: ESidebarElement.THEME_TEXT,
      status: false,
    },
    {
      title: ESidebarElement.THEME_CUSTOMIZE,
      status: false,
    },
  ];
  themeSettingForm: FormGroup;
  constructor(private sideBarService: CmsSidebarService, private fb: FormBuilder) {
    this.sideBarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.sideBarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.themeSettingForm = this.getThemeSettingFormGroup();
  }

  onDismiss(): void {
    this.sideBarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
  }

  onToggleItem(element: ESidebarElement): void {
    this.sideBarService.setSidebarElement(element, false);
  }

  getThemeSettingFormGroup(): FormGroup {
    const themeSettingormGroup = this.fb.group({});
    return themeSettingormGroup;
  }
}
