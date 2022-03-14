import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[reactorRoomComponentLoader]',
})
export class ComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
