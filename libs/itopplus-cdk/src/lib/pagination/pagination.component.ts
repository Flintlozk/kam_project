import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class PaginationComponent implements OnInit {
  @Input() pageSizeOptions: number;
  @Input() pageSize = 10;
  @Input() length = 0;
  @Input() pageIndex = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  constructor(public translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  ngOnInit(): void {
    this.setLabels();
  }

  public change(event?: PageEvent): void {
    this.changePage.emit(event);
  }

  setLabels(): void {}
}

export function remainItemOnNextPage(totalItem: number, currentPage: number, pageSize: number): boolean {
  if ((currentPage + 1) * pageSize < totalItem) {
    return true;
  } else {
    return false;
  }
}
