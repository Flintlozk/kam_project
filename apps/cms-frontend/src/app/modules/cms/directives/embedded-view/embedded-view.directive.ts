import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cmsNextEmbeddedView]',
})
export class EmbeddedViewDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
