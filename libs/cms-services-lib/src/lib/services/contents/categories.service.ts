import { ICategory } from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  addContentCategory,
  updateCategoryNameByID,
  deleteCategoryByID,
  deleteCategoriesByID,
  checkCategoryNameExist,
  updateParentModified,
} from '../../data/contents/categories.data';

export class CategoriesService {
  static addContentCategory = async (pageID: number, category: ICategory): Promise<IHTTPResult> => {
    try {
      const result = await addContentCategory(pageID, category);
      return { status: 200, value: result._id };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static checkCategoryNameExist = async (pageID: number, name: string, id: string): Promise<IHTTPResult> => {
    try {
      const result = await checkCategoryNameExist(pageID, name, id);
      let returnValue;
      if (result !== null && result !== undefined) returnValue = true;
      else returnValue = false;
      return { status: 200, value: returnValue };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static updateCategoryNameByID = async (pageID: number, category: ICategory): Promise<IHTTPResult> => {
    try {
      await updateCategoryNameByID(pageID, category);
      if (category.parentId) await updateParentModified(pageID, category.parentId);
      return { status: 200, value: true };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static deleteCategoryByID = async (pageID: number, _id: string): Promise<IHTTPResult> => {
    try {
      await deleteCategoryByID(pageID, _id);
      return { status: 200, value: true };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static deleteCategoriesByID = async (pageID: number, _ids: string[]): Promise<IHTTPResult> => {
    try {
      await deleteCategoriesByID(pageID, _ids);
      return { status: 200, value: true };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };
}
