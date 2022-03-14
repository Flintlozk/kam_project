import { Injectable, OnDestroy } from '@angular/core';
import { AudiencePlatformType, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import {
  AudienceCounter,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceStats,
  AudienceViewType,
  EnumPurchaseOrderStatus,
  EPageMessageTrackMode,
  IAudience,
  IAudienceHistory,
  IAudienceHistorySingleRow,
  IAudienceListInput,
  IAudienceMessageFilter,
  IAudienceStep,
  IAudienceWithCustomer,
  IAudienceWithInteractableStatus,
  IAudienceWithLeads,
  IAudienceWithPurchasing,
  ICustomerTemp,
  LeadsFilters,
  multiplePrintingSelected,
  OrderChannelTypes,
  PaidFilterEnum,
  UserMadeLastChangesToStatus,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import {
  CLOSE_AUDIENCE,
  CREATE_NEW_AUDIENCE,
  DELETE_AUDIENCE_BY_ID,
  GET_ALL_AUDIENCE_BY_CUSTOMER_ID,
  GET_AUDIENCES_BY_PAGE_ID_WITH_INTERACTIVE_STATUS,
  GET_AUDIENCE_ALL_STATS,
  GET_AUDIENCE_BY_CUSTOMER_ID_INCLUDE_CHILD,
  GET_AUDIENCE_BY_ID,
  GET_AUDIENCE_HISTORIES,
  GET_AUDIENCE_HISTORY_BY_AUDIENCE_ID,
  GET_AUDIENCE_HISTORY_BY_ID,
  GET_AUDIENCE_LIST,
  GET_AUDIENCE_LIST_COUNT_WATCH_QUERY,
  GET_AUDIENCE_LIST_WITH_LEADS,
  GET_AUDIENCE_LIST_WITH_PURCHASE,
  GET_AUDIENCE_SLA_LIST,
  GET_AUDIENCE_STATS,
  GET_AUDIENCE_TOTAL,
  GET_CHILD_AUDIENCE_BY_AUDIENCE_ID,
  GET_CURRENT_STEP,
  GET_CUSTOMER_BY_AUDIENCE_ID,
  GET_LAST_AUDIENCE_BY_CUSTOMER_ID,
  GET_LEADS_LIST_TOTAL,
  GET_PAGE_NUMBER_BY_AUDIENCE_ID,
  GET_USER_MADE_LAST_CHANGES_TO_STATUS,
  MOVE_AUDIENCE_DOMAIN,
  MOVE_TO_CUSTOMERS_AUDIENCE_BY_ID,
  MOVE_TO_LEADS_AUDIENCE_BY_ID,
  REJECT_AUDIENCE,
  RESOLVE_PURCHASE_ORDER_PAID_TRANSACTION,
  UPDATE_AUDIENCE_STATUS,
  UPDATE_FOLLOW_AUDIENCE_STATUS,
} from './audience-step.query';

@Injectable({
  providedIn: 'root',
})
export class AudienceService implements OnDestroy {
  inboxTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  audienceTotalRows: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  commentTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  guestTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  destroy$: Subject<boolean> = new Subject<boolean>();
  printingSelected: BehaviorSubject<multiplePrintingSelected[]> = new BehaviorSubject<multiplePrintingSelected[]>([{ orderno: 0 }]);
  printingSizeSelected: BehaviorSubject<string> = new BehaviorSubject<string>('');
  printingTypeSelected: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public allAudienceIDList = [] as number[];

  public platformImgsObj = {
    [AudiencePlatformType.FACEBOOKFANPAGE]: 'assets/img/marketplace-indicator/facebook-indicator.svg',
    [AudiencePlatformType.LINEOA]: 'assets/img/marketplace-indicator/line-indicator.svg',
    [OrderChannelTypes.LINE]: 'assets/img/marketplace-indicator/line-indicator.svg',
    [OrderChannelTypes.LAZADA]: 'assets/img/marketplace-indicator/lazada-indicator.svg',
    [OrderChannelTypes.SHOPEE]: 'assets/img/marketplace-indicator/shopee-indicator.svg',
  };

  inbox$: Observable<IAudienceWithCustomer[]> = this.getAudienceList({
    domain: [AudienceDomainType.AUDIENCE],
  }).pipe(
    map((x) => x.filter((i) => i.status === AudienceDomainStatus.INBOX)),
    takeUntil(this.destroy$),
  );

  inboxTotal$: Observable<number> = this.inbox$.pipe(map((x) => x.length));

  comments$: Observable<IAudienceWithCustomer[]> = this.getAudienceList({
    domain: [AudienceDomainType.AUDIENCE],
  }).pipe(
    map((x) => x.filter((i) => i.status === AudienceDomainStatus.COMMENT)),
    takeUntil(this.destroy$),
  );

  commentsTotal$: Observable<number> = this.comments$.pipe(map((x) => x.length));

  guestsTotal$: Observable<number> = combineLatest([this.inboxTotal$, this.commentsTotal$]).pipe(
    map(([inbox, comments]) => inbox + comments),
    takeUntil(this.destroy$),
  );

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);

    this.destroy$.unsubscribe();
  }

  getAudienceHistories(filters: ITableFilter, dateFilter: { start: string; end: string }): Observable<IAudienceHistory[]> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_HISTORIES,
        variables: { filters, dateFilter },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getAudienceHistories']));
  }
  getAudienceHistoryByID(audienceID: number): Observable<IAudienceHistorySingleRow> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_HISTORY_BY_ID,
        variables: { audienceID },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getAudienceHistoryByID']));
  }
  getUserMadeLastChangesToStatus(audienceID: number): Observable<UserMadeLastChangesToStatus> {
    return this.apollo
      .query({
        query: GET_USER_MADE_LAST_CHANGES_TO_STATUS,
        variables: {
          audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getUserMadeLastChangesToStatus']));
  }

  getCustomerByAudienceID(audienceID: number): Observable<ICustomerTemp> {
    return this.apollo
      .query({
        query: GET_CUSTOMER_BY_AUDIENCE_ID,
        variables: {
          audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getCustomerByAudienceID']));
  }

  getAudienceByID(ID: number, token = ''): Observable<IAudienceWithCustomer> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_BY_ID,
        variables: {
          ID: ID,
          token: token,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAudienceByID']),
      );
  }

  getAllAudienceByCustomerID(id: number, filters: ITableFilter): Observable<IAudience[]> {
    return this.apollo
      .query({
        query: GET_ALL_AUDIENCE_BY_CUSTOMER_ID,
        variables: {
          id,
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAllAudienceByCustomerID']),
      );
  }
  getPaginationByAudienceID(id: number, paginator: number, audienceID: number): Observable<{ pagination: number }> {
    return this.apollo
      .query<{ pagination: number }>({
        query: GET_PAGE_NUMBER_BY_AUDIENCE_ID,
        variables: {
          id,
          paginator,
          audienceID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPaginationNumberByAudienceID']),
      );
  }

  getLastAudienceByCustomerID(id: number): Observable<IAudience[]> {
    return this.apollo
      .query({
        query: GET_LAST_AUDIENCE_BY_CUSTOMER_ID,
        variables: {
          id,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLastAudienceByCustomerID']),
      );
  }

  getAudienceByCustomerIDIncludeChild(customerID: number, isChild = true): Observable<IAudience[]> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_BY_CUSTOMER_ID_INCLUDE_CHILD,
        variables: {
          customerID,
          isChild,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAudienceByCustomerIDIncludeChild']),
      );
  }

  getAudienceHistoryByAudienceID(id: number): Observable<IAudienceStep[]> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_HISTORY_BY_AUDIENCE_ID,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getAudienceHistoryByAudienceID']));
  }

  getChildAudienceByAudienceId(id: number): Observable<IAudience> {
    return this.apollo
      .query({
        query: GET_CHILD_AUDIENCE_BY_AUDIENCE_ID,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getChildAudienceByAudienceId']));
  }

  deleteAudienceById(ID: number[]): Observable<IAudienceWithCustomer> {
    return this.apollo
      .query({
        query: DELETE_AUDIENCE_BY_ID,
        variables: {
          ID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteAudienceById']),
      );
  }

  moveToLeads(ID: number[]): Observable<IAudienceWithCustomer> {
    return this.apollo
      .query({
        query: MOVE_TO_LEADS_AUDIENCE_BY_ID,
        variables: {
          ID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['moveToLeads']),
      );
  }

  moveToCustomers(ID: number[]): Observable<IAudienceWithCustomer> {
    return this.apollo
      .query({
        query: MOVE_TO_CUSTOMERS_AUDIENCE_BY_ID,
        variables: {
          ID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['moveToCustomers']),
      );
  }

  getAudienceList(filters: LeadsFilters, refetch = false): Observable<IAudienceWithCustomer[]> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_LIST,
      variables: {
        filters,
      },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());

    return onFetch.pipe(
      take(1),
      takeUntil(this.destroy$),
      map((x) => x.data['getAudienceList']),
    );
  }
  getAudienceSLAList(filters: LeadsFilters, type: EPageMessageTrackMode, refetch = false): Observable<IAudienceWithCustomer[]> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_SLA_LIST,
      variables: {
        filters,
        type,
      },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());

    return onFetch.pipe(
      take(1),
      takeUntil(this.destroy$),
      map((x) => x.data['getAudienceSLAList']),
    );
  }

  getAudienceListWithPurchase(filters: LeadsFilters, paidType: PaidFilterEnum, refetch = false): Observable<IAudienceWithPurchasing[]> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_LIST_WITH_PURCHASE,
      variables: {
        filters: filters,
        paidType: paidType,
      },
      fetchPolicy: 'no-cache',
    });

    let onRefetch = query.valueChanges;
    if (refetch) onRefetch = from(query.refetch());
    return onRefetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getAudienceListWithPurchaseOrder']),
    );
  }
  getAudienceListWithLeads(filters: LeadsFilters, refetch = false): Observable<IAudienceWithLeads[]> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_LIST_WITH_LEADS,
      variables: {
        query: { ...filters },
      },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getAudienceListWithLeads']),
    );
  }

  getAudienceListCount(domain: string, refetch = false): Observable<AudienceCounter> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_LIST_COUNT_WATCH_QUERY,
      variables: {
        query: { domain: domain },
      },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      map((x) => x.data['getAudienceListCounter']),
      takeUntil(this.destroy$),
    );
  }

  getAudiencesByPageIDWithInteractiveStatus(): Observable<IAudienceWithInteractableStatus[]> {
    return this.apollo
      .query({
        query: GET_AUDIENCES_BY_PAGE_ID_WITH_INTERACTIVE_STATUS,
      })
      .pipe(
        map((x) => x.data['getAudiencesByPageIDWithInteractiveStatus']),
        takeUntil(this.destroy$),
      );
  }

  getLeadsListTotal(filter: { start: string; end: string }, refetch = false): Observable<{ follow: number; finished: number }> {
    const query = this.apollo.watchQuery({
      query: GET_LEADS_LIST_TOTAL,
      variables: {
        filter,
      },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      map((x) => x.data['getLeadsListTotal']),
      takeUntil(this.destroy$),
    );
  }

  getAudienceStats(refetch = false): Observable<AudienceStats> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_STATS,
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());

    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getAudienceStats']),
    );
  }

  /**
   *
   * @param refetch
   * @param filter
   * @returns
   */
  getAudienceAllStats(refetch = false, filter: IAudienceMessageFilter): Observable<AudienceStats> {
    const query = this.apollo.watchQuery({
      query: GET_AUDIENCE_ALL_STATS,
      variables: { filter: filter },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());

    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getAudienceAllStats']),
    );
  }

  getAudienceTotal(): Observable<{ audience_total: number }> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_TOTAL,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAudienceTotal']),
      );
  }

  moveAudienceDomain(audienceID: number, domain: AudienceDomainType): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: MOVE_AUDIENCE_DOMAIN,
        variables: {
          domain,
          audienceID,
        },
        refetchQueries: [
          {
            query: GET_CURRENT_STEP,
            variables: {
              audienceID,
            },
          },
          {
            query: GET_AUDIENCE_LIST_COUNT_WATCH_QUERY,
            variables: {
              query: { domain: AudienceDomainType.CUSTOMER },
            },
          },
          {
            query: GET_AUDIENCE_LIST_WITH_PURCHASE,
            variables: {
              filters: {
                domain: AudienceDomainType.CUSTOMER,
                status: EnumPurchaseOrderStatus.FOLLOW,
              },
            },
          },
        ],
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['moveAudienceDomain']),
      );
  }

  updateAudienceStatus(PSID: string, audienceID: number, domain: AudienceDomainType, status: AudienceDomainStatus): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: UPDATE_AUDIENCE_STATUS,
        variables: {
          audienceID,
          domain,
          status,
        },
        refetchQueries: [
          {
            query: GET_CURRENT_STEP,
            variables: {
              audienceID: audienceID,
            },
          },
        ],
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => {
          return x.data['updateAudienceStatus'];
        }),
      );
  }

  rejectAudience(PSID: string, audienceID: number, route: AudienceViewType): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: REJECT_AUDIENCE,
        variables: {
          PSID: PSID,
          audienceID: audienceID,
          route: route,
        },
        refetchQueries: [
          {
            query: GET_CURRENT_STEP,
            variables: {
              audienceID: audienceID,
            },
          },
          {
            query: GET_AUDIENCES_BY_PAGE_ID_WITH_INTERACTIVE_STATUS,
          },
        ],
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['rejectAudience']),
      );
  }
  rejectPurchaseOrder(audienceID: number, query: IAudienceListInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: REJECT_AUDIENCE,
        variables: {
          audienceID: audienceID,
          route: AudienceViewType.ORDER,
        },
        refetchQueries: [
          {
            query: GET_CURRENT_STEP,
            variables: {
              audienceID: audienceID,
            },
          },
          {
            query: GET_AUDIENCE_LIST_COUNT_WATCH_QUERY,
            variables: {
              query: { domain: AudienceDomainType.CUSTOMER },
            },
          },
          {
            query: GET_AUDIENCE_LIST_WITH_PURCHASE,
            variables: {
              query,
            },
          },
        ],
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['rejectAudience']),
      );
  }

  closeAudience(PSID: string, audienceID: number): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: CLOSE_AUDIENCE,
        variables: {
          audienceID: audienceID,
        },
        refetchQueries: [
          {
            query: GET_CURRENT_STEP,
            variables: {
              audienceID: audienceID,
            },
          },
          {
            query: GET_AUDIENCES_BY_PAGE_ID_WITH_INTERACTIVE_STATUS,
          },
        ],
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['closeAudience']),
      );
  }

  updateFollowAudienceStatus(audienceID: number, domain: AudienceDomainType, update: boolean, orderId: number): Observable<IAudience> {
    const valriables = {
      status: AudienceDomainStatus.INBOX,
      domain,
      update,
      orderId,
    };

    return this.apollo
      .mutate({
        mutation: UPDATE_FOLLOW_AUDIENCE_STATUS,
        variables: valriables,
        // ? Note : initAudiencesOrder will handle the data
        // refetchQueries: [
        //   {
        //     query: GET_CURRENT_STEP,
        //     variables: {
        //       audienceID: audienceID,
        //     },
        //   },
        // ],
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => {
          return x.data['updateFollowAudienceStatus'];
        }),
      );
  }
  resolvePurchaseOrderPaidTransaction(orderId: number): Observable<IAudience> {
    const valriables = {
      orderId,
    };
    return this.apollo
      .mutate({
        mutation: RESOLVE_PURCHASE_ORDER_PAID_TRANSACTION,
        variables: valriables,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['resolvePurchaseOrderPaidTransaction']),
      );
  }

  createNewAudience(customerID: number, domain = 'AUDIENCE', status = 'FOLLOW'): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: CREATE_NEW_AUDIENCE,
        variables: {
          customerID,
          domain,
          status,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createNewAudience']),
      );
  }

  openNewChat(customerID: number): Observable<number> {
    return new Observable<number>((observer) => {
      this.createNewAudience(Number(customerID), AudienceDomainType.AUDIENCE, AudienceDomainStatus.FOLLOW).subscribe(
        (audience) => {
          const { id: newAudienceID } = audience;
          if (newAudienceID) {
            observer.next(newAudienceID);
          } else {
            observer.next(null);
          }
        },
        (ex) => {
          observer.error(ex);
        },
      );
    });
  }
}
