import { Injectable } from '@angular/core';
import { ViewRefAndElementRefAndComponent } from '../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CmsEditService } from './cms-edit.service';

@Injectable({
  providedIn: 'root',
})
export class CmsMoveUpDownLayoutService {
  constructor(private editService: CmsEditService) {}

  onChangeLayoutIndex(nativeElement: HTMLElement, key: string): void {
    // TODO
    const currentId = nativeElement.getAttribute('id');
    const viewRefAndElementRefs = this.getDropZoneViewRefAndElementRefAndComponents();
    let viewRefAndElementRef: ViewRefAndElementRefAndComponent = null;
    viewRefAndElementRefs.forEach((item) => {
      const nativeElementId = item.component.el.nativeElement.getAttribute('id');
      if (nativeElementId === currentId) {
        viewRefAndElementRef = item;
      }
    });
    const currentIndex = viewRefAndElementRefs.indexOf(viewRefAndElementRef);
    const length = viewRefAndElementRefs.length;
    switch (key) {
      case 'asc':
        if (currentIndex < length - 1) {
          this.editService.contentInsertPointContainer.value.move(viewRefAndElementRef.component.viewRef, currentIndex + 1);
          moveItemInArray(viewRefAndElementRefs, currentIndex, currentIndex + 1);
          viewRefAndElementRefs[currentIndex + 1].component.el.nativeElement.style.animation = 'moveDown 0.3s';
          viewRefAndElementRefs[currentIndex].component.el.nativeElement.style.animation = 'moveUp 0.3s';
          viewRefAndElementRefs[currentIndex].component.dragRef;
        }
        break;
      case 'desc':
        if (currentIndex > 0) {
          this.editService.contentInsertPointContainer.value.move(viewRefAndElementRef.component.viewRef, currentIndex - 1);
          moveItemInArray(viewRefAndElementRefs, currentIndex, currentIndex - 1);
          viewRefAndElementRefs[currentIndex - 1].component.el.nativeElement.style.animation = 'moveUp 0.3s';
          viewRefAndElementRefs[currentIndex].component.el.nativeElement.style.animation = 'moveDown 0.3s';
        }
        break;
      default:
        break;
    }
  }

  getDropZoneViewRefAndElementRefAndComponents(): ViewRefAndElementRefAndComponent[] {
    return this.editService.dropZoneDropListRef.data.viewRefAndElementRefAndComponents;
  }
}
