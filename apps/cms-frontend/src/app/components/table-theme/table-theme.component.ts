import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableHeader, ITablePage } from './table-theme.model';

@Component({
  selector: 'cms-next-table-theme',
  templateUrl: './table-theme.component.html',
  styleUrls: ['./table-theme.component.scss'],
})
export class TableThemeComponent implements OnInit {
  @Input() tableHeader: ITableHeader[] = [];
  @Input() tableData = [];
  @Input() isCheckAll = false;
  @Output() changedParams = new EventEmitter<ITablePage>();
  colSpan: number;
  constructor() {}

  ngOnInit(): void {
    this.colSpan = this.tableHeader.length;
  }
  trackByIndex(index: number): number {
    return index;
  }
  emitValueChange(event: ITablePage) {
    this.changedParams.emit(event);
  }
}
