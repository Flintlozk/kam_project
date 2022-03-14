import { ICategory, ICategoryWithLength } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { ITableFilter } from '@reactor-room/model-lib';
import { getAllCategories, getAllSubCategories, getCategoriesByIds } from '../../data/category/category.data';

export class CategoryService {
  static getAllCategories = async (pageID: number, tableFilter: ITableFilter): Promise<ICategoryWithLength> => {
    try {
      const orderBy = tableFilter.orderBy?.length > 0 ? tableFilter.orderBy[0] : '_id';
      const orderMethod = tableFilter.orderMethod || 'desc';
      const search = tableFilter.search ?? '';
      const pageSize = tableFilter.pageSize || environmentLib.mongoReturnLimit;
      const currentPage = tableFilter.currentPage ?? 0;
      const limitData = pageSize;
      const skipData = pageSize * currentPage;
      let parentCaterogies = await getAllCategories(pageID, limitData, skipData, orderBy, orderMethod, search);
      const parentIDs = parentCaterogies ? parentCaterogies.categories?.map((x) => x._id) : [];
      const childCaterogies = await getAllSubCategories(pageID, parentIDs);
      parentCaterogies?.categories?.forEach((parent) => {
        parent.subCategories = childCaterogies
          ? childCaterogies.filter((x) => {
              return String(x.parentId) === String(parent._id);
            })
          : [];
      });
      if (!parentCaterogies?.categories) parentCaterogies = { categories: [], total_rows: 0 };
      return parentCaterogies || { categories: [], total_rows: 0 };
    } catch (error) {
      throw new Error(error);
    }
  };

  static getCategoriesByIds = async (pageID: number, _ids: string[]): Promise<ICategory[]> => {
    try {
      const result = await getCategoriesByIds(pageID, _ids);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };
}
