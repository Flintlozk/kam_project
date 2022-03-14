import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'reactor-room-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.less'],
})
export class HeadingComponent implements OnInit {
  @Input() headingTitle: string;
  @Input() Route: string;

  constructor(private _location: Location) {}

  ngOnInit(): void {}

  backClicked(): void {
    this._location.back();
  }
}
