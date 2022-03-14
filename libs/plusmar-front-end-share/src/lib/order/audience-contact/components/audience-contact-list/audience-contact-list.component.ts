import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { fadeInOutFastestAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { LocalStorageService } from '@reactor-room/plusmar-front-end-share/services/local-storage.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  AudienceChatResolver,
  AudienceContactActionMethod,
  AudienceContactStatus,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceUpdateOperation,
  AudienceViewType,
  CustomerDomainStatus,
  CUSTOMER_TAG_COLOR,
  ELocalStorageType,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceContacts,
  IAudienceContactUpdate,
  IAudienceMessageFilter,
  IAudienceWithCustomer,
  IPagesContext,
  IUserContext,
  LeadsDomainStatus,
  NotificationStatus,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { AudienceContactListConfig } from './audience-contact-list.config';

@Component({
  selector: 'reactor-room-audience-contact-list',
  templateUrl: './audience-contact-list.component.html',
  styleUrls: ['./audience-contact-list.component.scss'],
  providers: [AudienceContactListConfig],
  animations: [fadeInOutFastestAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudienceContactListComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Output() changingAudience: Subject<number> = new Subject<number>();
  @ViewChildren('audienceElem') audienceElem: ElementRef[];
  @ViewChild('contacts') contacts: ElementRef;
  statusDropDownData = this.audienceContactListConfig.statusDropDownData;
  statusDropDownDataDefault = this.statusDropDownData[0].value;
  isChatboxCreated$: Subscription;
  chatBoxLayoutActive: boolean;
  contactList: IAudienceContacts[] = [];
  agentList = [];
  EAudiencePlatformType = AudiencePlatformType;
  currentPage: IPagesContext;
  checkAgentListInterval;

  routeResolver$ = this.route.data as Observable<AudienceChatResolver>;
  audience: IAudienceWithCustomer;
  originRoute: AudienceViewType;
  destroy$ = new Subject();

  showOfftime = false;

  // pagination
  // page = 10;
  page = screen?.height > 1080 ? 18 : 15;
  skip = 0;
  listIndex = this.page;
  loadMore = false;
  contactListLayoutStatus = false;
  searchField: FormControl;

  filters: IAudienceMessageFilter = {
    searchText: '',
    tags: [],
    noTag: false,
    contactStatus: AudienceContactStatus.ACTIVE,
  };

  rejectAudienceID: number;
  loadReady = false;
  triggerReady = false;
  getAudienceContactDebounce: Subject<number> = new Subject<number>();

  runner = 1;
  preparedIds = { 1: [], 2: [] };

  filterFeature = { enableLocalStorage: true, enabledOfftime: true, enabledFilter: true, enabledSearch: true, enabledTagFilter: true, enabledStatusFilter: true } as {
    enableLocalStorage: boolean;
    enabledOfftime: boolean;
    enabledFilter: boolean;
    enabledSearch: boolean;
    enabledTagFilter: boolean;
    enabledStatusFilter: boolean;
  };

  userID: number;
  customerTagEnum = CUSTOMER_TAG_COLOR;

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event): void {
    this.removeAgentFromResis(false);
  }

  constructor(
    private audienceContactListConfig: AudienceContactListConfig,
    private audienceContactService: AudienceContactService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private pagesService: PagesService,
    private dialogService: DialogService,
    public userService: UserService,
    private localStorageService: LocalStorageService,
  ) {}

  readLocalValue(): void {
    const chatStatus = this.localStorageService.getSpecifyGenericLocalSettings(ELocalStorageType.CHAT_STATUS);
    this.filters.contactStatus = chatStatus;
  }

  listScrolling(e: Event): void {
    const target = e.target as HTMLElement;
    if (Math.ceil(target.offsetHeight + target.scrollTop) >= target.scrollHeight) {
      this.loadMoreList();
    }
  }
  // Component Life Cycle Section : Start
  ngOnInit(): void {
    this.readLocalValue();
    this.getUserContext();
    this.getAudienceContactDebouncer();
    this.onAudienceRedisUpdateSubscription();

    this.routeResolver$.pipe(takeUntil(this.destroy$)).subscribe((resolved) => {
      this.routeResolveHandler(resolved);
    });
    this.pagesService.currentPage$.subscribe((page) => {
      this.currentPage = page;
    });
    this.checkAgentActive();
  }

  ngAfterViewChecked(): void {
    // this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.checkAgentListInterval) {
      clearInterval(this.checkAgentListInterval);
    }
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.isChatboxCreated$?.unsubscribe();
  }

  // Component Life Cycle Section : End

  onFilterSubmit(filters: IAudienceMessageFilter): void {
    this.filters = filters;
    const forceNew = true,
      loadmore = false,
      repeat = false;
    this.getAudienceContactList(this.originRoute, forceNew, loadmore, repeat);
  }

  onContactListLayoutStatusToggle(): void {
    this.contactListLayoutStatus = !this.contactListLayoutStatus;
  }

  routeResolveHandler({ audience, route }: AudienceChatResolver): void {
    // * route resolver wrapper
    this.updateAudienceState(audience, route);
  }

  updateAudienceState(audience: IAudienceWithCustomer, route: AudienceViewType): void {
    this.audience = audience as IAudienceWithCustomer;
    this.mapAgentList(audience.agentList);
    this.toggleFeatureByViewType(route);

    if (this.originRoute !== route) {
      this.originRoute = route;
      this.manaulTriggerUpdateAudience();
      this.onUpdateAudienceIdentityEmitted();
      this.onUpdateContactTagEmitted();
      this.onUpdateAudienceSetNotifyStatusEmiited();

      const forceNew = false,
        loadmore = false,
        repeat = false;
      this.getAudienceContactDebounce.next(this.audience.id); // Show selected audience (if exist)
      this.getAudienceContactList(route, forceNew, loadmore, repeat);
      this.onContactUpdateSubscription(route);
    }
  }

  loadMoreList(repeat = false): void {
    this.skip = this.skip + this.page;
    const force = false;
    const loadmore = true;
    this.getAudienceContactList(this.originRoute, force, loadmore, repeat);
  }

  onUpdateAudienceIdentityEmitted(): void {
    this.audienceContactService.updateAudienceIdentity.pipe(takeUntil(this.destroy$)).subscribe(({ audience }) => {
      this.audience = audience;
      const force = true;
      const loadmore = false;
      const repeat = false;
      this.getAudienceContactList(this.originRoute, force, loadmore, repeat);
    });
  }

  onUpdateContactTagEmitted(): void {
    this.audienceContactService.updateContactTag.pipe(takeUntil(this.destroy$)).subscribe(({ customerID, audienceID }) => {
      this.customerService
        .getCustomerTagByPageByID(customerID)
        .pipe(takeUntil(this.destroy$))
        .subscribe((tags) => {
          if (tags.length > 0) {
            this.contactList.map((contact) => {
              if (contact.id === audienceID) {
                const newTags = tags.filter((tag) => tag.tagMappingID !== -1);
                contact.tags = newTags;
                this.cd.detectChanges();
              }
            });
          }
        });
    });
  }

  onUpdateAudienceSetNotifyStatusEmiited(): void {
    this.audienceContactService.updateAudienceSetNotifyStatus = new Subject<{ audienceID: number; domain: AudienceDomainType; notify_status: string }>();
    this.audienceContactService.updateAudienceSetNotifyStatus.pipe(takeUntil(this.destroy$)).subscribe(({ audienceID, domain, notify_status }) => {
      this.setNotifyStatus(audienceID, domain, notify_status);
    });
  }

  setNotifyStatus(audienceID: number, domain: AudienceDomainType, notify_status: string): void {
    this.contactList.filter((contact) => {
      if (contact.id === audienceID) {
        if (domain !== undefined) contact.domain = domain;
        if (notify_status !== undefined) {
          contact.notify_status = notify_status;
        }
        return true;
      }
    });

    this.cd.detectChanges();
  }

  onAudienceRedisUpdateSubscription(): void {
    this.audienceContactService
      .onAudienceRedisUpdateSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.mapAgentList(result.agentList);
        },
        (err) => {
          console.log('onAudienceRedisUpdateSubscription err: ', err);
        },
      );
  }

  //#region conditionOnFetchingData
  onContactUpdateSubscription(route: AudienceViewType): void {
    this.audienceContactService
      .onContactUpdateSubscription(route)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (fetch: IAudienceContactUpdate) => {
          this.conditionOnFetchingData(fetch, route);
        },
        (err) => {
          console.error('socket hang up', err);
        },
      );
  }
  conditionOnFetchingData(fetch: IAudienceContactUpdate, route: AudienceViewType): void {
    const METHOD = fetch?.action?.method;

    const ignoreSetUnread = [AudienceContactActionMethod.AUDIENCE_SET_ASSIGNEE, AudienceContactActionMethod.AUDIENCE_REJECTED, AudienceContactActionMethod.AUDIENCE_CLOSED];
    const targetAudienceID = fetch?.action?.audienceID;
    if (!ignoreSetUnread.includes(METHOD) && targetAudienceID) {
      this.setUnread(targetAudienceID);
    }

    switch (METHOD) {
      case AudienceContactActionMethod.MOVE_TO_LEAD: {
        this.onFetchMoveToLead(fetch);
        break;
      }
      case AudienceContactActionMethod.CANCEL_LEAD:
        this.onFetchCancelLead(fetch);
        break;
      case AudienceContactActionMethod.MOVE_TO_ORDER: {
        this.onFetchMoveToOrder(fetch);
        break;
      }
      case AudienceContactActionMethod.AUDIENCE_SET_ASSIGNEE:
        this.onFetchSetAssignee(fetch);
        break;
      case AudienceContactActionMethod.AUDIENCE_REJECTED:
      case AudienceContactActionMethod.AUDIENCE_CLOSED:
        this.onFetchRejectAndClosed(fetch);
        break;
      case AudienceContactActionMethod.AUDIENCE_SET_UNREAD:
        this.onFetchSetUnread(fetch);
        break;
      case AudienceContactActionMethod.TRIGGER_UPDATE:
        this.onFetchTriggerUpdate(fetch);
        break;

      default: {
        this.onFetchDefaultCase(fetch, route);
        break;
      }
    }
  }
  onFetchMoveToLead(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    this.getAudienceContactDebounce.next(targetAudienceID);
    const matchID = fetch.action.audienceID === this.audience.id;
    if (matchID) {
      if (this.originRoute === AudienceViewType.FOLLOW) {
        void this.router.navigate([`/follows/chat/${this.audience.id}/lead`]);
      } else {
        void this.router.navigate([`/leads/info/${this.audience.id}/lead`]);
      }
    }
  }

  onFetchCancelLead(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    const matchID = fetch.action.audienceID === this.audience.id;
    if (matchID) {
      this.audienceContactService.updateSingleAudience.next({ audienceID: targetAudienceID, operation: AudienceUpdateOperation.UPDATE });
      void this.router.navigate([`/follows/chat/${targetAudienceID}/post`]);
    }
  }

  onFetchMoveToOrder(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    if (targetAudienceID) {
      this.setUnread(targetAudienceID);
    }
    const matchID = fetch.action.audienceID === this.audience.id;
    const isAudienceDomain = this.audience.domain === AudienceDomainType.AUDIENCE;
    if (matchID && isAudienceDomain) {
      this.getAudienceContactDebounce.next(targetAudienceID);
      void this.router.navigate([`/follows/chat/${this.audience.id}/cart`]);
    }
  }

  onFetchSetAssignee(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    const subsciption = this.audienceContactService.updateAudienceAssignee;
    if (subsciption) subsciption.next({ audienceID: targetAudienceID, assigneeID: fetch?.action?.assigneeID });
  }

  onFetchRejectAndClosed(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    const userID = fetch?.action?.userID;

    this.getAudienceContactDebounce.next(targetAudienceID);
    if (this.audience.id === targetAudienceID) {
      if (this.userID !== userID) {
        this.dialogService.openDialog('Current contact has been archived.', GenericDialogMode.CAUTION, GenericButtonMode.OK).subscribe();
      }
    }
  }

  onFetchSetUnread(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    this.setNotifyStatus(targetAudienceID, undefined, 'UNREAD');
  }

  onFetchTriggerUpdate(fetch: IAudienceContactUpdate): void {
    const targetAudienceID = fetch?.action?.audienceID;
    if (targetAudienceID) {
      this.setUnread(targetAudienceID);
    }
    this.getAudienceContactDebounce.next(targetAudienceID);
  }

  onFetchDefaultCase(fetch: IAudienceContactUpdate, route: AudienceViewType): void {
    const forceNew = false,
      loadmore = false,
      repeat = false;
    this.getAudienceContactList(route, forceNew, loadmore, repeat);
  }
  //#endregion

  manaulTriggerUpdateAudience(): void {
    this.audienceContactService.updateSingleAudience.pipe(takeUntil(this.destroy$)).subscribe(({ audienceID, operation }) => {
      if (operation === 'REMOVE' && this.filters.contactStatus === AudienceContactStatus.ACTIVE) {
        this.contactList = this.contactList.filter((x) => x.id !== audienceID);
        if (isEmpty(this.contactList)) {
          void this.router.navigate(['follows/list/all/1']);
        } else {
          this.onSelectAudience(this.contactList[0]);
        }
        this.setToReadyState('manaulTriggerUpdateAudience');
      } else {
        this.getAudienceContactDebounce.next(audienceID);
      }
    });
  }
  getAudienceContactDebouncer(): void {
    this.getAudienceContactDebounce
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        tap((audienceID: number) => {
          if (audienceID !== null) {
            this.preparedIds[this.runner].map((id, index) => {
              if (id === audienceID) {
                this.preparedIds[this.runner].splice(index, 1);
              }
            });
            this.preparedIds[this.runner].unshift(audienceID);
          }
        }),
      )
      .subscribe((audienceID) => {
        if (audienceID !== null) {
          this.getAudienceContacts(this.preparedIds[this.runner], this.runner);
          this.runner === 1 ? (this.runner = 2) : (this.runner = 1);
        }
      });
  }

  getAudienceContacts(audienceIDs: number[], currentRunner: number): void {
    if (audienceIDs.length < 1) return;
    this.audienceContactService
      .getCustomerContacts(audienceIDs, this.originRoute, this.filters)
      .pipe(
        takeUntil(this.destroy$),
        map((contacts) => {
          return contacts.map((contact) => {
            if (contact !== null) {
              contact.tags = contact.tags.filter((tag) => tag.tagMappingID !== -1);
              return contact;
            } else return contact;
          });
        }),
      )
      .subscribe((audiences) => {
        audiences.map((audience) => {
          if (audience !== null) {
            if (this.contactList[0]?.id !== audience.id) {
              this.filterOutNonExistAudience(audience);
              this.contactList.unshift(audience);
              this.cd.detectChanges();
            } else {
              this.contactList[0] = audience;
              this.cd.detectChanges();
            }

            this.sortContactListWithLatestActivityTime();
          }
        });

        this.preparedIds[currentRunner] = [];
      });
  }

  getAudienceContactList(route: AudienceViewType, forceNew = false, loadmore = false, repeat = false): void {
    if (forceNew) {
      this.skip = 0;
    }
    this.getAudienceContactListByRoute(route, loadmore, this.filters)
      .pipe(
        takeUntil(this.destroy$),
        map((contacts) => {
          return contacts.map((contact) => {
            contact.tags = contact.tags.filter((tag) => tag.tagMappingID !== -1);
            return contact;
          });
        }),
      )
      .subscribe((contacts: IAudienceContacts[]) => {
        if (loadmore) {
          this.processAudienceContactListOnLoadMore(contacts, repeat);
        } else {
          if (this.contactList.length && forceNew === false) {
            // only update changed audience
            this.compareChanges(contacts);
          } else {
            this.processAudienceContactListOnInitateState(contacts, forceNew);
          }
        }
      });
  }

  setToReadyState(method: string): void {
    if (!this.loadReady) {
      this.loadReady = true;
      console.log('set loadReady by method:', method);
    }
    if (!this.triggerReady) {
      this.triggerReady = true;
      console.log('set triggerReady by method:', method);
    }
  }

  processAudienceContactListOnInitateState(contacts: IAudienceContacts[], forceNew: boolean): void {
    if (contacts.length >= this.page) {
      this.loadMore = true;
    }
    this.contactList = contacts;
    this.setToReadyState('processAudienceContactListOnInitateState');

    this.cd.detectChanges(); // Update view

    if (this.audience?.notify_status === NotificationStatus.UNREAD) this.setRead(this.audience?.id);

    if (forceNew) {
      this.reOrderingAudience();
    } else {
      // new incoming
      if (contacts.length > 0) {
        const audienceNotFound = !contacts.find((x) => x.id === this.audience.id);
        if (audienceNotFound) {
          this.loadMoreList(true);
        }
      } else {
        this.navigatePageInCaseOfEmpty();
      }
    }
  }

  processAudienceContactListOnLoadMore(contacts: IAudienceContacts[], repeat: boolean): void {
    // This case will append to last index
    if (contacts.length < this.page) {
      this.loadMore = false; // this will stop recursive when last result return emptry
    }
    contacts = contacts.filter((audience) => {
      const found = this.contactList.find((list) => list.id === audience.id);
      return !found;
    });

    this.contactList = this.contactList.concat(contacts);
    this.setToReadyState('processAudienceContactListOnLoadMore');
    this.sortContactListWithLatestActivityTime();

    if (this.audience.id === null) {
      this.onSelectAudience(this.contactList[0]);
    }

    if (repeat) {
      if (contacts.length > 0) {
        const audienceNotFound = !contacts.find((x) => x.id === this.audience.id);
        if (audienceNotFound) {
          // this.loadMoreList(true);
        } else {
          this.scrollToActiveElement();
        }
      }
    }
  }

  reOrderingAudience(): void {
    if (this.filters.searchText !== '' || this.filters.tags.length > 0) {
      // DO NOTHING
    } else if (this.contactList.length) {
      if (this.audience) {
        const contact = this.contactList.find((contact) => contact.id === this.audience.id);
        if (contact) {
          this.onSelectAudience(contact);
        } else {
          this.onSelectAudience(this.contactList[0]);
        }
      } else {
        this.onSelectAudience(this.contactList[0]);
      }
    } else {
      this.navigatePageInCaseOfEmpty();
    }
  }

  navigatePageInCaseOfEmpty(): void {
    switch (this.audience.domain) {
      case AudienceDomainType.CUSTOMER:
        void this.router.navigate([`/order/order-info/${this.audience.id}/cart`]);
        break;
      case AudienceDomainType.AUDIENCE:
        if (this.audience.status === AudienceDomainStatus.FOLLOW) {
          void this.router.navigate([`follows/chat/${this.audience.id}/post`]);
        } else {
          void this.router.navigate(['follows/list/all/1']);
        }
        break;
      default:
        void this.router.navigate(['follows/list/all/1']);
        break;
    }
  }

  compareChanges(contacts: IAudienceContacts[]): void {
    contacts.forEach((newContact) => {
      const found = this.contactList.find((currentContact) => {
        if (newContact.id === currentContact.id) {
          // update contact property
          currentContact.last_platform_activity_date = newContact.last_platform_activity_date;
          currentContact.is_notify = newContact.is_notify;

          if (currentContact.id === this.audience.id) currentContact.notify_status = 'READ';
          else currentContact.notify_status = newContact.notify_status;
          return true;
        } else {
          return false;
        }
      });

      if (!found) {
        this.contactList.unshift(newContact); // append new contact on top
      }

      this.removeDuplicateAudiences();
    });
    this.sortContactListWithLatestActivityTime();
  }

  removeDuplicateAudiences(): void {
    const unique = [];
    const duplicate = this.contactList.filter((contact) => {
      if (unique.includes(contact.id)) return true;
      unique.push(contact.id);
      return false;
    });

    if (duplicate.length) {
      const lastIdx = duplicate.length - 1;
      duplicate.map((dup, index) => {
        this.filterOutNonExistAudience(dup);

        if (index === lastIdx) {
          this.onSelectAudience(this.contactList[0]);
        }
      });
    }
  }
  removeDuplicateCustomer(): void {}

  filterOutNonExistAudience(targetAudience: IAudienceContacts): void {
    let triggerChanged = false;
    let tempAudience: IAudienceContacts;
    const filterStatus = [AudienceDomainStatus.REJECT, AudienceDomainStatus.CLOSED, AudienceDomainStatus.EXPIRED];
    this.contactList = this.contactList.filter((list) => {
      // this condition will remove complete audience
      if (list.customer_id === targetAudience.customer_id && filterStatus.includes(list.status as AudienceDomainStatus)) {
        tempAudience = list;
        list = targetAudience;
        triggerChanged = true;
      }
      return list.id !== targetAudience.id;
    });
    this.setToReadyState('filterOutNonExistAudience');

    // navigate to new audience if current audience are the same ID
    if (this.audience.id === tempAudience?.id && triggerChanged) {
      this.onSelectAudience(targetAudience);
    }
    this.cd.detectChanges();
  }

  toggleFeatureByViewType(viewType: AudienceViewType): void {
    switch (viewType) {
      case AudienceViewType.FOLLOW:
      case AudienceViewType.MESSAGE:
        this.filterFeature.enabledStatusFilter = true;
        break;
      case AudienceViewType.ORDER:
      case AudienceViewType.LEAD:
      default:
        this.filterFeature.enabledStatusFilter = false;
        break;
    }
  }

  getAudienceContactListByRoute(route: AudienceViewType, loadmore: boolean, filters: IAudienceMessageFilter): Observable<IAudienceContacts[]> {
    const indexController = {
      index: this.listIndex,
      skip: this.skip,
    };

    if (!loadmore) {
      indexController.index = this.page;
      indexController.skip = 0;
    }

    switch (route) {
      case AudienceViewType.MESSAGE:
      case AudienceViewType.FOLLOW: {
        const joinFilter = {
          ...filters,
          domainStatus: [AudienceDomainStatus.CLOSED, AudienceDomainStatus.REJECT, AudienceDomainStatus.EXPIRED, LeadsDomainStatus.FINISHED],
        };
        return this.audienceContactService.getCustomerContactList(indexController.index, indexController.skip, joinFilter);
      }
      case AudienceViewType.ORDER: {
        const joinFilter = {
          ...filters,
          domainType: [AudienceDomainType.CUSTOMER],
          contactStatus: AudienceContactStatus.INACTIVE, // WILL RETURN Audience match with domainStatus filter
          domainStatus: [CustomerDomainStatus.FOLLOW, CustomerDomainStatus.WAITING_FOR_PAYMENT, CustomerDomainStatus.CONFIRM_PAYMENT, CustomerDomainStatus.WAITING_FOR_SHIPMENT],
        };
        return this.audienceContactService.getCustomerContactList(indexController.index, indexController.skip, joinFilter);
      }
      case AudienceViewType.LEAD: {
        const joinFilter = {
          ...filters,
          contactStatus: AudienceContactStatus.INACTIVE, // WILL RETURN Audience match with domainStatus filter
          domainType: [AudienceDomainType.LEADS],
          domainStatus: [AudienceDomainStatus.LEAD],
        };
        return this.audienceContactService.getCustomerContactList(indexController.index, indexController.skip, joinFilter);
      }
      default:
        return of([]);
    }
  }

  onSelectAudience(audience: IAudienceContacts): void {
    if (audience && this.audience.id !== audience.id) {
      this.changingAudience.next(audience.id);
      this.setRead(audience.id);
    }
    if (this.audience.id !== audience.id) {
      switch (this.originRoute) {
        case AudienceViewType.MESSAGE: {
          let cmp = 'post';
          switch (audience.domain) {
            case AudienceDomainType.AUDIENCE:
              if (audience.status === AudienceDomainStatus.LEAD) {
                cmp = 'lead';
              } else {
                cmp = 'post';
              }
              break;
            case AudienceDomainType.LEADS:
              cmp = 'lead';
              break;
            case AudienceDomainType.CUSTOMER:
              cmp = 'cart';
              break;
            default:
              cmp = 'post';
              break;
          }
          void this.router.navigate([`/messages/chat/${audience.id}/${cmp}`]);
          break;
        }
        case AudienceViewType.FOLLOW: {
          let cmp = 'post';
          switch (audience.domain) {
            case AudienceDomainType.AUDIENCE:
              if (audience.status === AudienceDomainStatus.LEAD) {
                cmp = 'lead';
              } else {
                cmp = 'post';
              }
              break;
            case AudienceDomainType.CUSTOMER:
              cmp = 'cart';
              break;
            case AudienceDomainType.LEADS:
              cmp = 'lead';
              break;
            default:
              break;
          }
          void this.router.navigate([`/follows/chat/${audience.id}/${cmp}`]);
          break;
        }
        case AudienceViewType.ORDER:
          void this.router.navigate([`/order/order-info/${audience.id}/cart`]);
          break;
        case AudienceViewType.LEAD:
          void this.router.navigate([`/leads/info/${audience.id}/lead`]);
          break;
        default:
          break;
      }
    }
    this.onContactListLayoutStatusToggle();
  }

  scrollToActiveElement(): void {
    setTimeout(() => {
      const activeElement: ElementRef = this.audienceElem.find((element) => {
        return element?.nativeElement.classList.contains('active');
      });
      if (activeElement) activeElement.nativeElement.scrollIntoView({});
    }, 1);
  }

  mapAgentList(list: any[]): void {
    this.agentList = [];
    const mapAgenets = list.map((x) => {
      return {
        ...x,
        audience_id: Number(x.audience_id),
      };
    });
    mapAgenets.map((x) => {
      const agentsAtAudience = mapAgenets.filter((t) => t.audience_id === x.audience_id);
      this.agentList[x.audience_id.toString()] = agentsAtAudience.filter((item, index, self) => self.findIndex((t) => t.user_id === item.user_id) === index);
      this.cd.markForCheck();
    });
  }

  trackByAudienceId(index: number, audience: { audience_id: number }): number {
    return audience.audience_id;
  }

  checkAgentActive(): void {
    this.checkAgentListInterval = setInterval(() => {
      this.removeAgentFromResis(true);
    }, 6600000);
  }

  removeAgentFromResis(test: boolean): void {
    this.audienceContactService
      .removeTokenFromAudienceContactList(this.audience.token, this.currentPage.pageId, test)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.cd.detectChanges();
        },
        (err) => console.log('removeTokenFromAudienceContactList err ===> : ', err),
      );
  }

  getUserContext(): void {
    this.userService.$userContext.subscribe((user: IUserContext) => {
      this.userID = user.id;
    });
  }

  setRead(id: number): void {
    this.contactList.map((item) => {
      if (item.id === id) {
        item.notify_status = 'READ';
        this.cd.markForCheck();
      }
    });
  }
  setUnread(id: number): void {
    this.contactList.map((item) => {
      if (item.id === id) {
        item.notify_status = 'UNREAD';
        this.cd.markForCheck();
      }
    });
  }

  toggleOfftime(bool: boolean): void {
    if (bool) {
      this.showOfftime = !this.showOfftime;

      if (this.showOfftime === true) {
        this.audienceContactService
          .getCustomerContactsWithOfftimes(this.filters)
          .pipe(
            takeUntil(this.destroy$),
            map((contacts) => {
              if (contacts !== null) {
                return contacts.map((contact) => {
                  contact.tags = contact.tags.filter((tag) => tag.tagMappingID !== -1);
                  return contact;
                });
              } else {
                return contacts;
              }
            }),
          )
          .subscribe(
            (offTimesAudience) => {
              if (offTimesAudience.length > 0) {
                this.compareChanges(offTimesAudience);
                this.onSelectAudience(offTimesAudience[0]);
                this.cd.detectChanges();
              }
            },
            (err) => {
              console.log('getCustomerContactsWithOfftimes err [LOG]:--> ', err);
            },
          );
      } else {
        this.sortContactListWithLatestActivityTime();
      }
    }
  }

  sortContactListWithLatestActivityTime(): void {
    this.contactList.sort((a, b) => new Date(b.last_platform_activity_date).getTime() - new Date(a.last_platform_activity_date).getTime());
    this.setToReadyState('sortContactListWithLatestActivityTime');
    this.cd.detectChanges();
  }
}
