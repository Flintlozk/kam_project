export interface IMainMenu {
  icon: string;
  iconActive: string;
  title: string;
  route: string;
  child: TChildNode[];
}

export type TChildNode = Pick<IMainMenu, 'title' | 'route'>;
