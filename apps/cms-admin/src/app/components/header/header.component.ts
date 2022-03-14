import { Component, EventEmitter, OnInit, Output, Input, OnChanges } from '@angular/core';
import { IHeadervariable } from '../../type/headerType';
@Component({
  selector: 'reactor-room-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() parentHandler = new EventEmitter();
  @Input() Topic: IHeadervariable;
  @Output() searchHandler = new EventEmitter();

  childHanlder(e: Event): void {
    this.parentHandler.emit(e);
  }
  constructor() {}
  ngOnChanges(): void {}
  ngOnInit(): void {}
}
