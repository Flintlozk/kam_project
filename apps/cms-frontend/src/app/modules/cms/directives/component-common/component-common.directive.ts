import { Directive, ElementRef } from '@angular/core';
import { CmsPublishService } from '../../services/cms-publish.service';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

@Directive({
  selector: '[cmsNextComponentCommon]',
})
export class ComponentCommonDirective {
  nativeElement: HTMLElement;
  isActive: boolean;
  constructor(public el: ElementRef<HTMLElement>, public sidebarService: CmsSidebarService, public cmsPublicService: CmsPublishService) {
    this.initCommonStyle();
  }

  initCommonStyle(): void {
    this.nativeElement = this.el.nativeElement;
    this.isActive = true;
  }
}
