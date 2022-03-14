import { DropListRef } from '@angular/cdk/drag-drop';
import { InjectionToken } from '@angular/core';

export interface ContentContainer {
  dropZoneDropListRef: DropListRef;
}

export const CONTENT_CONTAINER = new InjectionToken('CONTENT_CONTAINER');
