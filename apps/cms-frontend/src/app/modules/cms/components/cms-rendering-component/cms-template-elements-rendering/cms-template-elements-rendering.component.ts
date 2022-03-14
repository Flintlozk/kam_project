import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ThemeElementsType } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-template-elements-rendering',
  templateUrl: './cms-template-elements-rendering.component.html',
  styleUrls: ['./cms-template-elements-rendering.component.scss'],
})
export class CmsThemeElementsRenderingComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public type: ThemeElementsType;
  ThemeElementsType = ThemeElementsType;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}
}
