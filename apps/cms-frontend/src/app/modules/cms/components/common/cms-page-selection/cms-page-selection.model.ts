export enum EPageIcons {
  HOME_ICON = 'assets/page-icons/home.svg',
  HOME_ACTIVE_ICON = 'assets/page-icons/home-a.svg',
  PAGE_ICON = 'assets/page-icons/page.svg',
  PAGE_ACTIVE_ICON = 'assets/page-icons/page-a.svg',
}

export interface IPageSelection {
  pageId: string;
  title: string;
  icon: string;
  iconActive: string;
  isHomePage: boolean;
}
