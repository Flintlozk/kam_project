import { Component, OnInit } from '@angular/core';
import { IHeadingTitle } from '../../components/heading-title/heading-title.model';

@Component({
  selector: 'more-platform-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  headingTitle = {
    title: 'Inbox',
    imgUrl: 'assets/img/nav/inbox.svg',
  } as IHeadingTitle;
  constructor() {}

  ngOnInit(): void {}
}
