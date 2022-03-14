import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { FillterAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-custom-cms-table',
  templateUrl: './custom-cms-table.component.html',
  styleUrls: ['./custom-cms-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [FillterAnimate.filterAnimation],
})
export class CustomCmsTableComponent implements OnInit {
  @Input() tableData = [];
  @Input() tableHeader = [];
  @Input() isNoData = false as boolean;
  @Input() isLoading = false as boolean;
  @Input() tableColSpan: number;
  @Output() sortTableMetaData = new EventEmitter();
  @Output() infoboxHandler = new EventEmitter();
  @Input() infoboxHTML: string;
  @Input() tableWidth = 'auto';
  @Input() tableHeight = 'auto' as string;
  @Input() tableMinHeight: string;
  @Input() isNoVerticalScroll: boolean;
  @Input() orderMethod = 'desc';
  @Input() currentIndex: string | number;
  @Input() isAllchecked = false;
  @Input() noDataMessage = 'No data available!';
  @Input() bgHeaderColorClass = '';
  @Input() templateStyle: '' | 'bg-white' = '';
  @Input() additionHead = false as boolean;
  @Input() container: HTMLElement;
  constructor(private render: Renderer2) {}

  @Output() selectAll = new EventEmitter<boolean>();

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth <= 992) {
      this.tableWidth = window.innerWidth - 40 + 'px';
    } else {
      this.tableWidth = 'unset';
    }
  }

  ngOnInit(): void {
    const containerHeight = this.container?.offsetHeight;
    const height = containerHeight ? containerHeight : window.innerHeight;
    if (!this.isNoVerticalScroll && !this.tableHeight) this.tableHeight = height - 300 + 'px';

    if (window.innerWidth <= 992) {
      this.tableWidth = window.innerWidth - 40 + 'px';
    } else {
      this.tableWidth = 'unset';
    }
  }

  onSelectAll(e: Event): void {
    this.selectAll.emit((e.target as HTMLInputElement).checked);
  }

  getOrderMethod(i: number): string {
    if (String(i) === String(this.currentIndex)) {
      return this.orderMethod === 'asc' ? 'desc' : 'asc';
    } else {
      return this.orderMethod;
    }
  }

  sortTableData(element: Element, index: number, type: string): void {
    if (this.orderMethod !== type || String(this.currentIndex) !== String(index)) {
      this.currentIndex = String(index);
      this.sortTableMetaData.emit({
        index,
        type,
      });
    }
  }
}
