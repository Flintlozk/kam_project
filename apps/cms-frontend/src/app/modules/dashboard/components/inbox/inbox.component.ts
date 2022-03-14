import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  heading: IHeading = {
    title: 'Inbox',
    subTitle: 'Dashboard / Inbox',
  };
  constructor() {}

  ngOnInit(): void {}
}
