import { DragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IMediaGallery, mediaGalleryList, MediaSliderType, MenuGenericType } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-media',
  templateUrl: './cms-media.component.html',
  styleUrls: ['./cms-media.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export default class CmsMediaComponent implements OnInit, OnDestroy {
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/media.svg',
    activeIcon: 'assets/design-sections/media-a.svg',
    title: 'Media',
    isActive: false,
  };
  @ViewChild('image', { static: true }) image: ElementRef<HTMLImageElement>;
  @ViewChild('video', { static: true }) video: ElementRef<HTMLImageElement>;
  @ViewChild('slider', { static: true }) slider: ElementRef<HTMLImageElement>;
  destroy$ = new Subject();
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop) {}

  mediaItem1: IMediaGallery = mediaGalleryList[0];
  mediaItem2: IMediaGallery = mediaGalleryList[1];

  ngOnInit(): void {
    const dragRef1 = this.dragDrop.createDrag<DragRefData>(this.image);
    dragRef1.data = { dropListRef: null, type: this.mediaItem1.gallery.galleryPatternId, genericType: MenuGenericType.MEDIA_GALLERY };
    this.cmsEditService.dragHandler(dragRef1, this.destroy$);
    const dragRef2 = this.dragDrop.createDrag<DragRefData>(this.video);
    dragRef2.data = { dropListRef: null, type: this.mediaItem2.gallery.galleryPatternId, genericType: MenuGenericType.MEDIA_GALLERY };
    this.cmsEditService.dragHandler(dragRef2, this.destroy$);
    const dragRef3 = this.dragDrop.createDrag<DragRefData>(this.slider);
    dragRef3.data = { dropListRef: null, type: MediaSliderType.SLIDER_1, genericType: MenuGenericType.MEDIA_SLIDER };
    this.cmsEditService.dragHandler(dragRef3, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef1);
    this.cmsEditService.addMenuDragRef(dragRef2);
    this.cmsEditService.addMenuDragRef(dragRef3);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }
}
