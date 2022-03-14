import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-confirm-pending',
  templateUrl: './confirm-pending.component.html',
  styleUrls: ['./confirm-pending.component.scss'],
})
export class ConfirmPendingComponent implements OnInit {
  heading: IHeading = {
    title: 'Confirm Pending',
    subTitle: 'Dashboard / Confirm Pending',
  };
  constructor() {}

  ngOnInit(): void {}
}
