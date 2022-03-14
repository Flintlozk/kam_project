import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceChatResolver, AudienceContactResolver, AudienceViewType, GenericButtonMode, GenericDialogMode, LeadViewMode } from '@reactor-room/itopplus-model-lib';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { PageMemberService } from '@reactor-room/plusmar-front-end-share/services/settings/page-member.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LeadsFormService } from '../../services/leads-form.service';

@Component({
  selector: 'reactor-room-leads-info-close',
  templateUrl: './leads-info-close.component.html',
  styleUrls: ['./leads-info-close.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideBox', [
      state(
        'active',
        style({
          bottom: '*',
        }),
      ),
      state(
        'inactive',
        style({
          bottom: '-100%',
        }),
      ),
      transition('inactive => active', [animate('0.3s')]),
      transition('active => inactive', [animate('0.1s')]),
    ]),
  ],
})
export class LeadsInfoCloseComponent implements OnInit, OnChanges, OnDestroy {
  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  routeResolver$ = this.route.data as Observable<AudienceChatResolver>;

  enumLeadViewMode = LeadViewMode;
  leadViewMode: LeadViewMode;
  subscriptions: Subscription[] = [];
  messageForm: FormGroup;
  loadingText: '';
  isLoad = false;
  buttonGroupStatus = false;
  pageUsersCount: number;
  chatBoxStatus = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isShowEditOptions = true;
  isProcessing = false;

  originRoute: AudienceViewType;

  constructor(
    private dialogService: DialogService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private pageMembers: PageMemberService,
    public leadsFormService: LeadsFormService,
    public leadService: LeadsService,
  ) {}

  view(viewEnum: LeadViewMode): boolean {
    return this.leadsFormService.leadViewMode === this.enumLeadViewMode[viewEnum];
  }

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.destroy$.subscribe();

    this.leadsFormService.destroy$ = new Subject<boolean>();
    this.leadsFormService.destroy$.subscribe();

    this.parentRouteResolver$.pipe(takeUntil(this.destroy$), takeUntil(this.leadsFormService.destroy$)).subscribe((val) => {
      this.handleData(val as AudienceChatResolver);

      this.getPageUsers();
      this.leadFormSubmitSubscription();
    });
  }

  handleData({ audience, route }: AudienceChatResolver): void {
    this.originRoute = route;
    // if (this.leadsFormService.leadForm) {
    this.leadsFormService.leadForm?.reset();
    this.leadsFormService.formSubmission$ = undefined;
    this.leadsFormService.isCustomerFilled = false;
    // }
    if (this.leadsFormService.isManualInput) {
      this.leadsFormService.isManualInput = false;
    }

    if (audience) {
      this.leadsFormService.audience$ = audience;
      this.leadsFormService.audienceID = audience.parent_id || audience.id;

      this.leadsFormService.getLeadContext();
    }
  }

  leadFormSubmitSubscription(): void {
    // const childAudience$ = this.audienceService.getChildAudienceByAudienceId(this.leadsFormService.audienceID);
    const leadFormSubs$ = of(true).pipe(switchMap(() => this.leadService.onLeadFormSubmitSubscription(this.leadsFormService.audienceID)));
    leadFormSubs$.pipe(takeUntil(this.destroy$)).subscribe((leadSubmitData) => {
      this.leadsFormService.getFormSubmission(leadSubmitData.id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();

    this.leadsFormService.destroy$.next(null);
    this.leadsFormService.destroy$.unsubscribe();
  }

  ngOnChanges(): void {}

  getPageUsers(): void {
    this.pageMembers
      .getPageMembersAmountByPageID()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.pageUsersCount = result.amount_of_users));
  }

  chatBoxStatusEvent(event: boolean): void {
    this.chatBoxStatus = event;
  }

  activeButtonGroup(): void {
    if (!this.buttonGroupStatus) this.buttonGroupStatus = true;
  }

  deactiveButtonGroup(): void {
    this.buttonGroupStatus = false;
  }

  isDisabled(): boolean {
    return Boolean(this.leadsFormService.isManualInput === false);
  }

  onClickCancel(): void {
    const text = 'Are you sure you want to cancel?';
    this.dialogService.openDialog(text, GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM, false, true).subscribe((confirm) => {
      if (confirm) {
        this.isProcessing = true;
        this.leadService.cancelCustomerLead(this.leadsFormService.audienceID).subscribe(() => {
          this.isProcessing = false;
        });
      }
    });
  }
}
