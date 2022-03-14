import { Component, OnInit } from '@angular/core';
import { RouteAnimate } from '@reactor-room/animation';
@Component({
  selector: 'cms-next-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [RouteAnimate.routeCMSAnimation],
})
export class LayoutComponent implements OnInit {
  maxContentWidth = 1440;
  constructor() {}

  ngOnInit(): void {}
}
