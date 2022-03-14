export interface ITableHeader {
  sort: boolean;
  title: string;
  key: string;
  dataType?: string;
  orderBy?: string;
  isSelectAll?: boolean;
  infoboxId?: string;
  align?: string;
}

export interface IDropDown {
  value: string | number;
  label: string;
}

export interface ITransformDropdown {
  valueKey: string | number;
  labelKey: string | number;
  colorKey?: string | number;
}

export interface INameIDPair {
  mainID?: number;
  id: number;
  name: string;
  currentIndex?: number;
  type?: string;
}

export interface IAttribSubAttribHolder {
  id: number;
  name: string;
  subAttrib?: INameIDPair[];
  type?: string;
  currentIndex?: number;
}
