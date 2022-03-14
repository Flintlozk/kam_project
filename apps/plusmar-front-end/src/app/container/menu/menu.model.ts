import { Observable } from 'rxjs';

export interface Menu {
  id: string;
  label: string;
  routerLink: string;
  routeNode: string;
  imgUrl: string;
  isActive: boolean;
  subMenu: SubMenu[];
  param: number;
  total?: Observable<number> | number;
  isHiddenInBusiness: boolean;
}

export interface SubMenu {
  id: string;
  label: string;
  routerLink: string;
}
