export interface ICmsSiteFilter {
  icon: string;
  iconActive: string;
  title: string;
  filterKey: string;
  isActive: boolean;
}

export enum ECmsSiteTypes {
  PAGE = 'page',
  POPUP = 'popup',
}

export interface ICmsSite {
  title: string;
  isHide: boolean;
  isDraggable: boolean;
  isHomePage: boolean;
  currentLevel: number;
  nestedLevel: number;
  siteId: string;
  child: ICmsSite[];
  isToggleStatus: boolean;
  parentId: string;
  isActive: boolean;
  isChildSelected?: boolean;
}

export interface ISiteDropInfo {
  targetId: string;
  action?: string;
}

export enum EDropPostion {
  BEFORE = 'before',
  AFTER = 'after',
  INSIDE = 'inside',
  INSIDE_MAX_LEVEL = 'inside-max-level',
  BEFORE_MAX_LEVEL = 'before-max-level',
  AFTER_MAX_LEVEL = 'after-max-level',
}
