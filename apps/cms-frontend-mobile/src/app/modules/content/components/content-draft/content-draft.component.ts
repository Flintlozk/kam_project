import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'cms-next-content-draft',
  templateUrl: './content-draft.component.html',
  styleUrls: ['./content-draft.component.scss'],
})
export class ContentDraftComponent implements OnInit, AfterViewInit {
  @ViewChildren('titleDraft') titleDraft: QueryList<ElementRef>;

  orginalContentDraftData = [
    {
      content: '1Lorem Ipsum is simply dummy text of th',
      imgUrl: '/assets/images/shared/sample.jpg',
      date: '09/09/2020 10:20',
      pin: false,
      toggleStatus: false,
    },
    {
      content: '3 Lorem Ipsum is simply dummy text of the pri',
      imgUrl: null,
      date: '09/09/2020 10:20',
      pin: false,
      toggleStatus: false,
    },
    {
      content: '3 Lorem Ipsum is simply dummy text of the pri',
      imgUrl: null,
      date: '09/09/2020 10:20',
      pin: false,
      toggleStatus: false,
    },
    {
      content: '4Lorem Ipsum is simply dummy text of th',
      imgUrl: '/assets/images/shared/sample.jpg',
      date: '09/09/2020 10:20',
      pin: false,
      toggleStatus: false,
    },
    {
      content: '5Lorem Ipsum is simply dummy text o',
      imgUrl: '/assets/images/shared/sample.jpg',
      date: '09/09/2020 10:20',
      pin: false,
      toggleStatus: false,
    },
  ];

  contentDraftData = [];

  constructor(private _ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.contentDraftData = this.orginalContentDraftData;
    this._ref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.wrapDraftItemTitle();
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(): void {
    this.wrapDraftItemTitle();
  }

  onActiveToggleLayout(index: number): void {
    this.contentDraftData[index].toggleStatus = true;
  }

  optionToggleLayoutStatusEvent(event: boolean, index: number): void {
    this.contentDraftData[index].toggleStatus = event;
  }

  onPinDraftItem(index: number): void {
    this.contentDraftData[index].pin = !this.contentDraftData[index].pin;
    this.contentDraftData[index].toggleStatus = false;
    this.updateOriginalContentDraftData();
  }

  onDuplicateDraftItem(index: number): void {
    this.contentDraftData.splice(index, 0, this.contentDraftData[index]);
    this._ref.detectChanges();
    this.wrapDraftItemTitle();
    this.contentDraftData.forEach((item) => (item.toggleStatus = false));
    this.updateOriginalContentDraftData();
  }
  onRemoveDraftItem(index: number): void {
    this.contentDraftData.splice(index, 1);
    this.updateOriginalContentDraftData();
  }

  trackByIndex(index: number): number {
    return index;
  }

  updateOriginalContentDraftData(): void {
    this.orginalContentDraftData = this.contentDraftData;
  }

  wrapDraftItemTitle(): void {
    this.titleDraft.forEach((item) => {
      item.nativeElement.style.maxWidth = window.innerWidth - 170 + 'px';
    });
  }
}
