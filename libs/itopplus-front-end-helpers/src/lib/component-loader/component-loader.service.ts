/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ComponentLoaderDirective } from './component-loader.directive';

@Injectable()
export class ComponentLoaderService {
  private componentLoaderRef: ViewContainerRef;
  constructor(private _resolver: ComponentFactoryResolver) {}

  loadComponent(component: any, viewRef: ComponentLoaderDirective): ComponentRef<any> {
    const componentFactory = this._resolver.resolveComponentFactory(component);

    this.componentLoaderRef = viewRef.viewContainerRef;
    this.clearComponent();

    const componentRef = this.componentLoaderRef.createComponent<any>(componentFactory);
    return componentRef;
  }

  clearComponent() {
    if (this.componentLoaderRef) this.componentLoaderRef.clear();
  }
}
