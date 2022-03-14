import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-title-underline',
  templateUrl: './title-underline.component.html',
  styleUrls: ['./title-underline.component.scss'],
})
export class TitleUnderlineComponent implements OnInit {
  @Input() title: 'Sample Title';
  constructor() {}

  ngOnInit(): void {}
}
