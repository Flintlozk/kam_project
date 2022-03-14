import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less'],
})
export class LoaderComponent implements OnInit {
  @Input() block = false;
  @Input() text = 'Loading...';

  constructor() {}

  ngOnInit(): void {}
}
