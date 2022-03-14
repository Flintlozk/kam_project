import { DropListRef } from '@angular/cdk/drag-drop';
import { InjectionToken } from '@angular/core';

export interface FooterContainer {
  footerDropListRef: DropListRef;
}

export const FOOTER_CONTAINER = new InjectionToken('FOOTER_CONTAINER');
