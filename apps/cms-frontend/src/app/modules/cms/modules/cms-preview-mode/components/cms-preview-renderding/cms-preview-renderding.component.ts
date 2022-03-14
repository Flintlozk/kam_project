import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CmsPreviewService } from '../../../../services/cms-preview.service';

@Component({
  selector: 'cms-next-cms-preview-renderding',
  templateUrl: './cms-preview-renderding.component.html',
  styleUrls: ['./cms-preview-renderding.component.scss'],
})
export class CmsPreviewRenderdingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewRendering') public previewRendering: ViewContainerRef;
  innerHTML: SafeHtml;
  nativeElement: HTMLElement;
  constructor(private cmsPreviewService: CmsPreviewService, private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.onResumeNativeElement(this.nativeElement);
  }

  ngAfterViewInit(): void {
    this.cmsPreviewService.getPreviewElementRef.subscribe((elementRef: ElementRef) => {
      this.nativeElement = this.onCleanUpNativeElement(elementRef.nativeElement);
      this.innerHTML = this.domSanitizer.bypassSecurityTrustHtml(this.nativeElement.innerHTML);
    });
  }

  onCleanUpNativeElement(nativeElement: HTMLElement): HTMLElement {
    const nodeGuidelineList = nativeElement.querySelectorAll('.guideline') as NodeList;
    nodeGuidelineList.forEach((node: HTMLElement) => {
      node.classList.add('hidden');
    });
    return nativeElement;
  }

  onResumeNativeElement(nativeElement: HTMLElement): HTMLElement {
    const nodeGuidelineList = nativeElement.querySelectorAll('.guideline') as NodeList;
    nodeGuidelineList.forEach((node: HTMLElement) => {
      node.classList.remove('hidden');
    });
    return nativeElement;
  }
}
