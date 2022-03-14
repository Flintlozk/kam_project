import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AudienceDomainStatus, IAudienceWithCustomer, ICustomerLead } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';

type IDisplay = 'LIST' | 'SUBMISSION' | 'FORM' | 'CLOSED';
@Component({
  selector: 'reactor-room-customer-lead',
  templateUrl: './customer-lead.component.html',
  styleUrls: ['./customer-lead.component.scss'],
})
export class CustomerLeadComponent implements OnInit, OnChanges, OnDestroy {
  display: IDisplay = 'LIST';
  @Input() audience: IAudienceWithCustomer;
  searchField = new FormControl();
  isLeadDisabled = false;
  isAllow = true;
  totalRows: number;

  leadDetail: ICustomerLead;

  destroy$: Subject<void> = new Subject<void>();

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.checkAllowToCreateNewLead();
    const isShowLead = this.route.snapshot.queryParams['show-lead'];
    if (isShowLead === 'true') {
      this.showFollowLead();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentID = changes.audience.currentValue.id;
    const previousID = changes.audience?.previousValue?.id;
    if (currentID !== previousID) this.cancelSelection();

    this.checkAllowToCreateNewLead();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  checkAllowToCreateNewLead(): void {
    this.isAllow = ![AudienceDomainStatus.CLOSED, AudienceDomainStatus.REJECT].includes(<AudienceDomainStatus>this.audience.status);
  }
  showClosedLead(lead: ICustomerLead): void {
    this.leadDetail = lead;
    this.switchView('CLOSED');
  }
  showFollowLead(): void {
    this.switchView('SUBMISSION');
  }

  switchView(view: IDisplay): void {
    this.display = view;
  }

  updateTotalRow(totalRows: number): void {
    this.totalRows = totalRows;
  }

  cancelSelection(): void {
    this.switchView('LIST');
  }
}
