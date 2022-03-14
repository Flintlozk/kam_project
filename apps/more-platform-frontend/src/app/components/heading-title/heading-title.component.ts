import { Component, Input, OnInit } from '@angular/core';
import { IHeadingTitle } from './heading-title.model';

@Component({
  selector: 'more-platform-heading-title',
  templateUrl: './heading-title.component.html',
  styleUrls: ['./heading-title.component.scss'],
})
export class HeadingTitleComponent implements OnInit {
  @Input() headingTitle = {
    title: '',
    imgUrl: '',
  } as IHeadingTitle;

  constructor() {}

  ngOnInit(): void {}
}
