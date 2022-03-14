import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ICustomerLead } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';

@Component({
  selector: 'reactor-room-closed-lead-detail',
  templateUrl: './closed-lead-detail.component.html',
  styleUrls: ['./closed-lead-detail.component.scss'],
})
export class ClosedLeadDetailComponent implements OnInit, OnDestroy {
  @Input() leadDetail: ICustomerLead;
  @Output() back: Subject<void> = new Subject<void>();
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.back.unsubscribe();
  }

  onClickClose(): void {
    this.back.next(null);
  }
}
