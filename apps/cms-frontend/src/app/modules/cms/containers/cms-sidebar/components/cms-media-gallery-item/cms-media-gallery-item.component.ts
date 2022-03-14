import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ESidebarMode, ISidebarElement } from '../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-media-gallery-item',
  templateUrl: './cms-media-gallery-item.component.html',
  styleUrls: ['./cms-media-gallery-item.component.scss'],
})
export class CmsMediaGalleryItemComponent implements OnInit {
  mediaGalleryItemForm: FormGroup;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.BACKGROUND,
      status: true,
    },
    {
      title: ESidebarElement.MEDIA_GALLERY_ITEM_LINK,
      status: false,
    },
    {
      title: ESidebarElement.MEDIA_GALLERY_ITEM_TEXT,
      status: false,
    },
  ];
  ESidebarElement = ESidebarElement;
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.mediaGalleryItemForm = this.getMediaGalleryItemFormGroup();
  }

  onDismiss(): void {
    this.cmsSidebarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getMediaGalleryItemFormGroup(): FormGroup {
    const mediaGalleryItemFormGroup = this.fb.group({});
    return mediaGalleryItemFormGroup;
  }
}
