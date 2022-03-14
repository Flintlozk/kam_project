import { Component, OnInit } from '@angular/core';
import { IHeadingTitle } from '../../components/heading-title/heading-title.model';

@Component({
  selector: 'more-platform-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  headingTitle = {
    title: 'Notification',
    imgUrl: 'assets/img/nav/notification.svg',
  } as IHeadingTitle;
  constructor() {}

  ngOnInit(): void {}
}
