export interface IWelcomeMenu {
  title: string;
  route: string;
  subMenuStatus: boolean;
  subMenu: ISubWelcomeMenu[];
}
export interface ISubWelcomeMenu {
  title: string;
  route: string;
}
