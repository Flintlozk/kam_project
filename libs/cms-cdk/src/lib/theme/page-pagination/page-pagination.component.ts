import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cms-next-page-pagination',
  templateUrl: './page-pagination.component.html',
  styleUrls: ['./page-pagination.component.scss'],
})
export class PagePaginationComponent implements OnInit {
  @Input() itemsPerPage: number;
  @Input() itemsNumber: number;
  @Input() allPagesNumber: number;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  private _currentPage = 1;
  constructor() {}

  ngOnInit(): void {}

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
    this.changePage.emit(this.currentPage);
  }

  onSetPage(value: number): void {
    this.currentPage = value;
  }

  onFirstPage(): void {
    this.currentPage = 1;
  }

  onLastPage(): void {
    this.currentPage = this.allPagesNumber;
  }

  onNextPage(): void {
    if (this.currentPage !== this.allPagesNumber) {
      this.currentPage += 1;
    }
  }

  onPreviousPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
    }
  }
}
