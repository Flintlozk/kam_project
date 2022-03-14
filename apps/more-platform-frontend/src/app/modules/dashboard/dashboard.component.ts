import { Component, OnInit } from '@angular/core';
import { IHeadingTitle } from '../../components/heading-title/heading-title.model';

@Component({
  selector: 'more-platform-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  headingTitle = {
    title: 'Dashboard',
    imgUrl: 'assets/img/nav/dashboard.svg',
  } as IHeadingTitle;

  constructor() {}

  ngOnInit(): void {}
}
