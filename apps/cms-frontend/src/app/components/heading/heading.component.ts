import { Component, Input, OnInit } from '@angular/core';
import { IHeading } from './heading.model';

@Component({
  selector: 'cms-next-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
})
export class HeadingComponent implements OnInit {
  @Input() heading: IHeading = {
    title: '',
    subTitle: '',
  };

  constructor() {}

  ngOnInit(): void {}
}
