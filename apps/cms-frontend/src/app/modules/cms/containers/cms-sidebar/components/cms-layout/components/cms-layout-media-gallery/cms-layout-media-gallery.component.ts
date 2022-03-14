import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-media-gallery',
  templateUrl: './cms-layout-media-gallery.component.html',
  styleUrls: ['./cms-layout-media-gallery.component.scss'],
})
export class CmsLayoutMediaGalleryComponent implements OnInit {
  mediaGalleryForm: FormGroup;
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = [
    {
      title: ESidebarElement.MEDIA_GALLERY_SETTING,
      status: true,
    },
    {
      title: ESidebarElement.MEDIA_GALLERY_CONTROL,
      status: false,
    },
  ];
  constructor(private fb: FormBuilder, private cmsSidebarService: CmsSidebarService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.mediaGalleryForm = this.getMediaGalleryFormGroup();
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }

  getMediaGalleryFormGroup(): FormGroup {
    const mediaGalleryFormGroup = this.fb.group({});
    return mediaGalleryFormGroup;
  }
}
