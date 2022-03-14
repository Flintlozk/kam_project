import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ESidebarMode, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-design',
  templateUrl: './cms-layout-design.component.html',
  styleUrls: ['./cms-layout-design.component.scss'],
})
export class CmsLayoutDesignComponent implements OnInit {
  @Input() designLayout: ESidebarMode;
  ESidebarMode = ESidebarMode;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [];
  layoutDesignForm: FormGroup;
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.layoutDesignForm = this.getLayoutDesignFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getLayoutDesignFormGroup(): FormGroup {
    const layoutDesignFormGroup = this.fb.group({});
    return layoutDesignFormGroup;
  }
}
