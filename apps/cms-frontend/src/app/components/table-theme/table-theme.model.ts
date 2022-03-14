export interface ITableHeader {
  title: string;
  sort: boolean;
  key: string;
  asc: boolean;
  isSorted: boolean;
}
export interface ITablePage {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
}
