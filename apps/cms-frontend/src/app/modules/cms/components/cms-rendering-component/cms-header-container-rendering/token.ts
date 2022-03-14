import { DropListRef } from '@angular/cdk/drag-drop';
import { InjectionToken } from '@angular/core';

export interface HeaderContainer {
  headerDropListRef: DropListRef;
}

export const HEADER_CONTAINER = new InjectionToken('HEADER_CONTAINER');
