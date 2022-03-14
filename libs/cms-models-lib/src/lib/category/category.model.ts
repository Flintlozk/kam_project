import { EnumLanguageCultureUI } from '../language';
export interface ICategoryWithLength {
  categories: ICategory[];
  total_rows: number;
}
export interface ICategory {
  _id: string;
  pageID: number;
  name: string;
  featuredImg: string;
  language: ICategoryCulture[];
  parentId: string;
  status: boolean;
  subCategories?: ICategory[];
  checked?: boolean;
  createdAt?: number;
  updatedAt?: number;
}
export interface ICategoryCulture {
  cultureUI: EnumLanguageCultureUI;
  name: string;
  slug: string;
  description: string;
}
export interface ICategoryName {
  _id: string;
  name: string;
}
