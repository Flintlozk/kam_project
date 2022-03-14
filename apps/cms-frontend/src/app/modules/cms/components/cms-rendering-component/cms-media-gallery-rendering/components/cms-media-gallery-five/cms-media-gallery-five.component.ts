import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { IGeneralText, IMediaGallery, IGridColumnStyle, IMediaGalleryList, IGridRowStyle, IMediaGalleryListIndex } from '@reactor-room/cms-models-lib';
import { chunk } from 'lodash';
import { Subscription } from 'rxjs';
import { CmsGridControlService } from '../../../../../services/grid-control.service';

@Component({
  selector: 'cms-next-cms-media-gallery-five',
  templateUrl: './cms-media-gallery-five.component.html',
  styleUrls: ['./cms-media-gallery-five.component.scss'],
})
export class CmsMediaGalleryFiveComponent implements OnInit, OnChanges {
  @Input() mediaGalleryInput: IMediaGallery;
  @ViewChild('mediaGallery') mediaGalleryRef: ElementRef;
  @Input() changeDetectorTrigger: boolean;
  @Output() mediaGalleryItemEvent$ = new EventEmitter<IMediaGalleryListIndex>();
  generalTextAllSettingTrigger = false;
  columnStyle: IGridColumnStyle = {
    display: 'grid',
    gap: '0px',
  };
  rowStyle: IGridRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: 'minmax(auto, 150px)',
    gap: '0px',
  };
  maxItemPerRow = 3;
  mediaGalleryLoop: IMediaGalleryList[][];
  subscription: Subscription;
  generalTextAllSetting: IGeneralText;

  constructor(private cmsGridControlService: CmsGridControlService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.mediaGalleryLoop = chunk(this.mediaGalleryInput.gallery.gallleryList, this.maxItemPerRow);
      this.subscription = this.cmsGridControlService.gridNavigationSubscriptionHandler(
        this.mediaGalleryInput.control,
        this.columnStyle,
        this.rowStyle,
        this.mediaGalleryInput.gallery.galleryGap,
        this.mediaGalleryInput.gallery.galleryMaxHeight,
        this.mediaGalleryRef,
        this.subscription,
        this.mediaGalleryLoop.length,
      );
    }, 0);
  }

  ngOnChanges(): void {
    this.mediaGalleryLoop = chunk(this.mediaGalleryInput.gallery.gallleryList, this.maxItemPerRow);
    this.subscription = this.cmsGridControlService.gridNavigationSubscriptionHandler(
      this.mediaGalleryInput.control,
      this.columnStyle,
      this.rowStyle,
      this.mediaGalleryInput.gallery.galleryGap,
      this.mediaGalleryInput.gallery.galleryMaxHeight,
      this.mediaGalleryRef,
      this.subscription,
      this.mediaGalleryLoop.length,
    );
  }

  generalTextSettingEvent(generalTextSetting: IGeneralText): void {
    this.generalTextAllSetting = generalTextSetting;
    this.generalTextAllSettingTrigger = !this.generalTextAllSettingTrigger;
  }

  mediaGalleryItemEvent(event: IMediaGalleryListIndex): void {
    this.mediaGalleryItemEvent$.emit(event);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
