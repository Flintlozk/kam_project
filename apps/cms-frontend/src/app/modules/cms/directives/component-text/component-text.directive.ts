import { Directive, ElementRef } from '@angular/core';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

@Directive({
  selector: '[cmsNextComponentText]',
})
export class ComponentTextDirective {
  nativeElement: HTMLElement;

  constructor(public el: ElementRef<HTMLElement>, public sidebarService: CmsSidebarService) {
    this.nativeElement = this.el.nativeElement;
  }
}
