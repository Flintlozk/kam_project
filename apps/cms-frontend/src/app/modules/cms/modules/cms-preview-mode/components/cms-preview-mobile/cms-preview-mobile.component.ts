import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-cms-preview-mobile',
  templateUrl: './cms-preview-mobile.component.html',
  styleUrls: ['./cms-preview-mobile.component.scss'],
})
export class CmsPreviewMobileComponent implements OnInit {
  mobileSize = {
    width: 375,
    height: 812,
  };
  constructor() {}

  ngOnInit(): void {}
}
