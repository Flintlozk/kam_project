import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-cms-preview-tablet',
  templateUrl: './cms-preview-tablet.component.html',
  styleUrls: ['./cms-preview-tablet.component.scss'],
})
export class CmsPreviewTabletComponent implements OnInit {
  tabletSize = {
    width: 609,
    height: 812,
  };
  constructor() {}

  ngOnInit(): void {}
}
