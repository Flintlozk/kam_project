import { IDObject, ITableFilter } from '@reactor-room/model-lib';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { differenceWith } from 'lodash';

export class TableForProducts {
  isLoading = false;
  isNoData = false;
  isAllchecked = false;
  tableSelectedIDs: string[] = [];
  storedSelectedIDs: string[] = [];
  marketPlaceNotMergedIds = [];
  totalRows = 0;

  productTableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Product', key: 'name' },
    { sort: true, title: 'Variants', key: 'variants' },
    { sort: true, title: 'Sold', key: 'sold' },
    { sort: true, title: 'Inventory', key: 'inventory' },
    { sort: true, title: 'Status', key: 'status' },
    { sort: false, title: 'Action', key: null },
  ];

  productMarketSitesHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Product', key: 'pm.name' },
    { sort: true, title: 'Price', key: 'pmv.unit_price' },
    { sort: false, title: '', key: '' },
  ];

  commonTableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
    dropDownID: null,
  };

  productTableColSpan = this.productTableHeader.length;
  productMarketSitesTableColSpan = this.productMarketSitesHeader.length;

  getTableSelectedID(): string[] {
    return this.tableSelectedIDs;
  }

  clearTableSelectedID(): void {
    this.isAllchecked = false;
    this.tableSelectedIDs = [];
  }

  selectAllHandler(checked: boolean): void {
    if (checked && this.storedSelectedIDs?.length > 0) {
      this.tableSelectedIDs = this.storedSelectedIDs;
      this.tableSelectedIDs.map((id) => this.isIdSelected(String(id)));
      this.tableSelectedIDs = differenceWith(this.tableSelectedIDs, this.marketPlaceNotMergedIds);
      this.isAllchecked = true;
    } else {
      this.tableSelectedIDs = [];
      this.isAllchecked = false;
    }
  }

  isIdSelected(dataId: string): boolean {
    return this.tableSelectedIDs.includes(String(dataId));
  }

  selectRow(id: string, checked: boolean): void {
    checked ? this.addID(String(id)) : this.removeID(String(id));
  }

  addID(id: string): void {
    this.tableSelectedIDs.push(id);
    this.isCheckBoxAllSelected();
  }

  removeID(id: string): void {
    this.tableSelectedIDs = this.tableSelectedIDs.filter((tableID) => tableID !== id);
    this.isCheckBoxAllSelected();
  }

  isCheckBoxAllSelected(): void {
    if (this.storedSelectedIDs.length > 0) {
      this.storedSelectedIDs?.length === this.tableSelectedIDs?.length ? (this.isAllchecked = true) : (this.isAllchecked = false);
    }
  }

  trackBy(index: number, el: IDObject): number {
    return el.id;
  }
}
