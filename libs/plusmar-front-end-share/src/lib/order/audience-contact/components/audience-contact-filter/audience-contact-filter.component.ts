import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/order/animation';
import { CustomerTagsDialogComponent } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tags-dialog/customer-tags-dialog.component';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import {
  AudienceContactStatus,
  CUSTOMER_TAG_COLOR,
  ELocalStorageType,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceMessageFilter,
  IAudienceTagsFilter,
  IAudienceTagsFilterLocalStorage,
  ICustomerTagCRUD,
} from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '@reactor-room/plusmar-front-end-share/services/local-storage.service';

@Component({
  selector: 'reactor-room-audience-contact-filter',
  templateUrl: './audience-contact-filter.component.html',
  styleUrls: ['./audience-contact-filter.component.scss'],
  animations: [slideInOutAnimation],
})
export class AudienceContactFilterComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren('tagCheckboxes') tagsElementRef: QueryList<ElementRef>;
  @Input() triggerReady: boolean;
  // @Input() triggerReady: Subject<boolean>;

  /* toggler */

  // Noted : Please make sure that component you used, had implemented filters below
  @Input() forceGetLocal = false;
  @Input() enableLocalStorage = false;
  @Input() enabledSearch = false;
  @Input() enabledFilter = false;
  @Input() enabledOfftime = false;
  @Input() enabledTagFilter = false;
  @Input() enabledStatusFilter = false;
  @Input() showOfftime = false;
  /* toggler */

  @Output() filtersSubmit: Subject<IAudienceMessageFilter> = new Subject<IAudienceMessageFilter>();
  @Output() toggleOfftimeOutput: Subject<boolean> = new Subject<boolean>();
  selectUntag = false;
  @Input() filters = {
    searchText: '',
    tags: [],
    noTag: false,
    contactStatus: AudienceContactStatus.ACTIVE,
  };
  selectTag = new Subject();
  showFilter = false;
  searchField: FormControl = new FormControl('');
  tagSearchField: FormControl = new FormControl('');
  tagSearchCollapsed = false;
  tags: ICustomerTagCRUD[];
  destroy$ = new Subject();

  pageIndex: number;
  subIndex: number;
  customerTagEnum = CUSTOMER_TAG_COLOR;
  audienceContactStatus = AudienceContactStatus;

  totalTagCheck = 0;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
  ) {}

  // Component Life Cycle Section : Start
  ngOnInit(): void {
    this.getRouteParams();

    if (this.triggerReady === undefined) {
      this.initSearch();
      this.initTagSerach();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.triggerReady !== undefined) {
      if (this.triggerReady === true) {
        this.initSearch();
        this.initTagSerach();
      }
    }
  }

  // Component Life Cycle Section : End

  getRouteParams(): void {
    this.route.queryParams.subscribe((params: { offTime: boolean }) => {
      if (params?.offTime) {
        this.showOfftime = true;
        this.toggleOfftimeOutput.next(true);

        this.toastr.success(this.translate.instant('Pin off-time enabled'), this.translate.instant('Off time'));
      }
    });
  }

  getPageIndex(): void {
    this.pageIndex = Number(getCookie('page_index') || 0);
    this.subIndex = Number(getCookie('subscription_index') || 0);
    this.getLocalStorageCustomerTags();
  }

  initSearch(): void {
    this.searchField.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500)).subscribe((value) => {
      this.filters.searchText = value;
      this.getTotalTagCheck();
      this.filtersSubmit.next(this.filters);
    });
  }

  initTagSerach(): void {
    this.getAllCustomerTags();
  }

  getAllCustomerTags(): void {
    this.customerService
      .getCustomerAllTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags) => {
        if (tags.length > 0) {
          this.tags = tags;
          this.triggerTagFilter();
          if (this.enableLocalStorage || this.forceGetLocal) this.getPageIndex();
        }
      });
  }

  tagsInputSearch(tagName: string): boolean {
    return tagName.toLocaleLowerCase().indexOf(this.tagSearchField.value?.toLocaleLowerCase()) !== -1;
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    setTimeout(() => {
      if (this.filters.tags.length) {
        const tagIDs = this.filters.tags.map((tag) => tag.id);
        this.mapTaggedToView(tagIDs);
      }
    }, 1);
  }

  toggleOfftime(): void {
    this.toggleOfftimeOutput.next(true);
  }

  clickOutsideEvent(isOutside: boolean): void {
    if (isOutside) {
      this.showFilter = false;
    }
  }

  onSelectTag(event: InputEvent, tag: IAudienceTagsFilter): void {
    this.selectUntag = false;
    this.filters.noTag = false;
    const isCheck = (<HTMLInputElement>event.target).checked;
    if (isCheck) {
      this.filters.tags.push({ id: tag.id, name: tag.name });
    } else {
      this.filters.tags = this.filters.tags.filter((_tag) => _tag.id !== tag.id);
    }
    if (this.enableLocalStorage || this.forceGetLocal) this.setLocalTags();
    this.selectTag.next(null);
  }

  onSelectUntagged(): void {
    this.selectUntag = !this.selectUntag;
    if (this.selectUntag === true) {
      this.filters.tags = [];
      this.filters.noTag = true;
      this.unCheckAll();
      if (this.enableLocalStorage || this.forceGetLocal) this.setLocalTags();

      this.selectTag.next(null);
    } else {
      this.filters.noTag = false;
      if (this.enableLocalStorage || this.forceGetLocal) this.setLocalTags();

      this.selectTag.next(null);
    }
  }

  onDoSelectStatus(contactStatus: AudienceContactStatus): void {
    this.localStorageService.setGenericLocalSettings(ELocalStorageType.CHAT_STATUS, contactStatus);
    this.filters.contactStatus = contactStatus;
    this.filtersSubmit.next(this.filters);
  }

  triggerTagFilter(): void {
    this.selectTag.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe(() => {
      this.getTotalTagCheck();
      this.filtersSubmit.next(this.filters);
    });
  }

  openTagManageDialog(): void {
    const dialogRef = this.dialog.open(CustomerTagsDialogComponent, {
      width: '100%',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) this.getAllCustomerTags();
    });
  }

  getLocalStorageCustomerTags(): void {
    const tagStorage = JSON.parse(localStorage.getItem('tags-filter')) as IAudienceTagsFilterLocalStorage[];
    if (tagStorage) {
      const tagFilters: IAudienceTagsFilterLocalStorage = tagStorage.find((x) => x.pageIndex === this.pageIndex && x.subscriptionIndex === this.subIndex);
      if (tagFilters) {
        const { tags, noTag } = tagFilters;
        if (tags.length > 0 || noTag) {
          if (this.forceGetLocal) {
            this.setTagsFromLocal(tags, noTag);
          } else {
            this.dialogService.openDialog(this.translate.instant('Use previous tags filter'), GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((yes) => {
              if (yes) {
                this.setTagsFromLocal(tags, noTag);
              } else {
                this.filters.noTag = false;
                this.filters.tags = [];
                this.setLocalTags();
              }
            });
          }
        }
      }
    }
  }

  setTagsFromLocal(tags: IAudienceTagsFilter[], noTag: boolean): void {
    this.selectUntag = noTag;
    if (noTag) {
      this.filters.noTag = noTag;
    } else {
      this.filters.tags = tags;
      const tagIDs = tags.map((tag) => tag.id);
      this.mapTaggedToView(tagIDs);
    }

    this.getTotalTagCheck();
    this.filtersSubmit.next(this.filters);
  }

  getTotalTagCheck(): void {
    if (this.filters.noTag) this.totalTagCheck = 1;
    else {
      this.totalTagCheck = this.filters.tags.length;
    }
  }

  mapTaggedToView(tagIDs: number[]): void {
    this.tagsElementRef.map((element: ElementRef) => {
      const tagID = element.nativeElement.value;
      if (tagIDs.includes(Number(tagID))) {
        element.nativeElement.checked = true;
      }
    });
  }
  unCheckAll(): void {
    this.tagsElementRef.map((element: ElementRef) => {
      element.nativeElement.checked = false;
    });
  }

  setLocalTags(): void {
    try {
      const tagStorage = JSON.parse(localStorage.getItem('tags-filter')) as IAudienceTagsFilterLocalStorage[];
      const tagFilters = tagStorage.filter((x) => x.pageIndex !== this.pageIndex || x.subscriptionIndex !== this.subIndex);
      const payload: IAudienceTagsFilterLocalStorage[] = [
        ...tagFilters,
        { pageIndex: this.pageIndex, subscriptionIndex: this.subIndex, tags: this.filters.tags, noTag: this.filters.noTag },
      ];
      localStorage.setItem('tags-filter', JSON.stringify(payload));
    } catch (err) {
      console.log('err [LOG]:--> ', err);
      const payload: IAudienceTagsFilterLocalStorage[] = [{ pageIndex: this.pageIndex, subscriptionIndex: this.subIndex, tags: this.filters.tags, noTag: this.filters.noTag }];
      localStorage.setItem('tags-filter', JSON.stringify(payload));
    }
  }
}
