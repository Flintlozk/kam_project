import { InjectionToken } from '@angular/core';
import { DropListRef } from '@angular/cdk/drag-drop';

export interface ParentLayoutContainer {
  layoutDropListRef1: DropListRef;
  layoutDropListRef2: DropListRef;
  layoutDropListRef3: DropListRef;
  layoutDropListRef4: DropListRef;
}

export const PARENT_LAYOUT_CONTAINER = new InjectionToken<ParentLayoutContainer>('PARENT_LAYOUT_CONTAINER');
