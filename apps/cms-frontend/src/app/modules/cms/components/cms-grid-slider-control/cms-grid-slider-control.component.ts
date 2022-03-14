import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IPageSliderControl } from '@reactor-room/cms-models-lib';
import { CmsGridControlService } from '../../services/grid-control.service';

@Component({
  selector: 'cms-next-cms-grid-slider-control',
  templateUrl: './cms-grid-slider-control.component.html',
  styleUrls: ['./cms-grid-slider-control.component.scss'],
})
export class CmsGridSliderControlComponent implements OnInit, AfterViewInit {
  currentSlideIndex = 0;
  @Input() loopLength: number;
  @Input() elementRef: ElementRef;
  @Input() pageSliderControl: IPageSliderControl;
  @ViewChild('btnGroup') btnGroup: ElementRef;

  constructor(private cmsGridControlService: CmsGridControlService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onSlide(option: string, currentIndex?: number): void {
    switch (option) {
      case 'prev':
        if (this.currentSlideIndex > 0) this.currentSlideIndex--;
        this.cmsGridControlService.showSlide(this.currentSlideIndex, this.elementRef, this.loopLength);
        break;
      case 'next':
        if (this.currentSlideIndex < this.loopLength - 1) this.currentSlideIndex++;
        this.cmsGridControlService.showSlide(this.currentSlideIndex, this.elementRef, this.loopLength);
        break;
      case 'current':
        this.currentSlideIndex = currentIndex;
        this.cmsGridControlService.showSlide(this.currentSlideIndex, this.elementRef, this.loopLength);
        break;
      default:
        break;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
