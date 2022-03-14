import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  ChatboxView,
  IAudienceWithCustomer,
  ICustomerLead,
  ILeadsFormWithComponentsSelected,
} from '@reactor-room/itopplus-model-lib';
import { FocusModeService } from '@reactor-room/plusmar-front-end-share/services/focusmode.service';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { slideInOutAnimation } from '../../../animation';

@Component({
  selector: 'reactor-room-form-submission',
  templateUrl: './form-submission.component.html',
  styleUrls: ['./form-submission.component.scss'],
  animations: [slideInOutAnimation],
})
export class FormSubmissionComponent implements OnInit, OnDestroy {
  @Input() audience: IAudienceWithCustomer;
  audienceID: number;

  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  childRouteResolver$ = this.route.data as Observable<AudienceChatResolver>;

  available = true;
  form: ILeadsFormWithComponentsSelected;
  chatViewMode: ChatboxView = ChatboxView.ORDER;
  routeResolver$ = this.route.data;

  formID: number;
  isSave = false;
  isReady = false;
  toggleForm = false as boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Output() closeLead = new EventEmitter<boolean>();
  @Output() cancelSelection = new EventEmitter<void>();
  @Output() showClosedLead: Subject<ICustomerLead> = new Subject<ICustomerLead>();

  constructor(private leadService: LeadsService, private route: ActivatedRoute, private router: Router, private mode: FocusModeService) {}

  getSidebarDataEvent(form: ILeadsFormWithComponentsSelected): void {
    this.form = form;
    this.formID = form.id;
    this.isReady = true;
  }

  ngOnInit(): void {
    this.audienceID = this.audience.id;
    this.mode.setFocusMode(false);
    this.getLeadOfAudience(this.audience.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.closeLead.unsubscribe();
    this.cancelSelection.unsubscribe();
    this.showClosedLead.unsubscribe();
  }

  getLeadOfAudience(audienceID: number): void {
    this.leadService
      .getAudienceLeadContext(audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((leadSubmission) => {
        if (leadSubmission !== null) {
          this.formID = leadSubmission.formID;
          this.toggleForm = true;

          if (leadSubmission.submissionID !== null) {
            this.isSave = true;
            this.onShowClosedLead();
          }
        } else {
          this.toggleForm = false;
          this.isSave = false;
        }
      });
  }

  onShowClosedLead() {
    this.leadService
      .getLeadFormOfCustomer(this.audience.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((lead) => {
        this.showClosedLead.next(lead);
      });
  }

  back(): void {
    this.cancelSelection.next(null);
  }

  selectForm(): void {
    if (this.audience.id) this.toggleForm = true;
  }
}
