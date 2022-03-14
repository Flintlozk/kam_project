import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceUpdateOperation,
  AudienceViewType,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceWithCustomer,
  ILeadsFormSubmission,
  IPagesContext,
  LeadsDomainStatus,
  LeadViewMode,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeadsFormService } from '../../services/leads-form.service';

@Component({
  selector: 'reactor-room-leads-action',
  templateUrl: './leads-action.component.html',
  styleUrls: ['./leads-action.component.scss'],
})
export class LeadsActionComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() selector: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  routeResolver$ = this.route.data as Observable<AudienceChatResolver>;

  //variables
  enumLeadViewMode = LeadViewMode;
  leadViewMode: LeadViewMode;
  title = '';
  formSubmission$: ILeadsFormSubmission = this.leadsFormService.formSubmission$;
  gridAlign = 2;

  audience$: IAudienceWithCustomer;
  audienceID: number;
  originRoute: AudienceViewType;
  isAudienceFinished = false;
  isProcessing = false;
  currentPage: IPagesContext;
  constructor(
    private dialogService: DialogService,
    private audienceService: AudienceService,
    private audienceContactService: AudienceContactService,
    private route: ActivatedRoute,
    private router: Router,
    public leadsFormService: LeadsFormService,
    private cd: ChangeDetectorRef,
    public layoutCommonService: LayoutCommonService,
    private pagesService: PagesService,
    private routeService: RouteService,
  ) {}

  ngOnInit(): void {
    this.pagesService.currentPage$.subscribe((page) => {
      this.currentPage = page;
    });
    zip(this.parentRouteResolver$, this.routeResolver$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.handleData(Object.assign(...val) as AudienceChatResolver);
      });
  }

  ngOnChanges(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cd.detectChanges();
    }, 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  view(): void {
    switch (this.leadViewMode) {
      case LeadViewMode.CREATE: {
        this.title = 'Create New Lead';
        break;
      }
      case LeadViewMode.FILL_FORM: {
        this.title = 'Fill Lead Info';
        break;
      }
      case LeadViewMode.EDIT: {
        this.title = 'Edit Lead Detail';
        break;
      }
      case LeadViewMode.READONLY:
      default: {
        this.title = 'Leads Detail';
        break;
      }
    }
  }

  handleData({ audience, route }: AudienceChatResolver): void {
    this.originRoute = route;
    audience.status === LeadsDomainStatus.FINISHED ? (this.isAudienceFinished = true) : (this.isAudienceFinished = false);
    if (audience) {
      this.audience$ = audience;
      this.audienceID = audience.parent_id !== null ? audience.parent_id : audience.id;
    }

    // this.leadViewMode = LeadViewMode.EDIT;
    this.leadViewMode = LeadViewMode.READONLY;

    this.view();
    if (!audience) {
      this.leadsFormService.disableSaving = true;
    }

    this.gridAlign += 1;

    if (!this.leadsFormService.disableSaving) {
      this.gridAlign += 1;
    }
  }

  onSave(): void {
    const text = 'Please confirm to save current form ?';
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.leadsFormService.saveForm();
      }
    });
  }

  onClickCancel(): void {
    this.audienceContactService
      .removeTokenFromAudienceContactList(this.audience$.token, this.currentPage.pageId, false)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          console.log('success');
        },
        (err) => console.log('removeTokenFromAudienceContactList err ===> : ', err),
      );

    if (this.route?.snapshot?.data?.route === AudienceViewType.FOLLOW) {
      const routeHistory = this.routeService.routeHistory.getValue();
      if (routeHistory === '/') {
        this.routeService.routeHistory.next('/');
        void this.router.navigate(['/follows/list/all/1']);
      } else {
        void this.router.navigate([routeHistory]);
      }
    } else {
      if (this.audience$.status === AudienceDomainStatus.LEAD || this.audience$.status === LeadsDomainStatus.FOLLOW) {
        void this.router.navigate(['leads/follow/1']); // dymamic go back have to keep reference somewhere..
      } else {
        void this.router.navigate(['leads/finished/1']); // dymamic go back have to keep reference somewhere..
      }
    }
  }

  rejectAudience(): void {
    const text = 'Are you sure you want to reject this lead ?';
    this.dialogService.openDialog(text, GenericDialogMode.REJECT, GenericButtonMode.CONFIRM, false, true).subscribe((confirm) => {
      if (confirm) {
        this.setProcess(true);

        this.audienceService.rejectAudience(this.leadsFormService.audience$.psid, this.leadsFormService.audience$.id, this.originRoute).subscribe(() => {
          this.setProcess(false);

          this.audienceContactService.updateSingleAudience.next({ audienceID: this.leadsFormService.audience$.id, operation: AudienceUpdateOperation.REMOVE });
          this.audience$.status = AudienceDomainStatus.REJECT;

          if (this.originRoute === AudienceViewType.LEAD) {
            void this.router.navigate(['/leads/info/' + this.audience$.id + '/lead']);
          } else {
            void this.router.navigate(['/follows/chat/' + this.audience$.id + '/post']);
          }
        });
      }
    });
  }

  backToFollows(): void {
    this.setProcess(true);

    this.audienceService.updateAudienceStatus(this.audience$.psid, this.audience$.id, AudienceDomainType.AUDIENCE, AudienceDomainStatus.FOLLOW).subscribe(() => {
      this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience$.id, operation: AudienceUpdateOperation.UPDATE });
      this.setProcess(false);
      void this.router.navigate([`/follows/chat/${this.leadsFormService.audienceID}/post`]);
    });
  }

  setProcess(bool: boolean): void {
    this.isProcessing = bool;
    this.layoutCommonService.toggleUILoader.next(this.isProcessing);
  }
}
