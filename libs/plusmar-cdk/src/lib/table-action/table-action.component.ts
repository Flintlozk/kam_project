import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-table-action',
  templateUrl: './table-action.component.html',
  styleUrls: ['./table-action.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TableActionComponent {
  constructor(public translate: TranslateService) {}
  @Output() modalClick = new EventEmitter<boolean>();
  @Output() reportPrintClick = new EventEmitter<boolean>();
  @Input() item;
  @Input() isExport;
  @Input() isPrintReport;
}
