import { IContentEditor, IContentEditorWithLength } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { getCategoriesByIds } from '../../data/category/category.data';
import { addContents, getContents, getContentsByCategories, getContentsByLimit, getContentsList, updateContents, updateContentsCSS } from '../../data/contents/contents.data';
import { contentEditorToAngularHTML, getContentsCustomCSS } from '../../domains';

export class ContentsService {
  static addContents = async (pageID: number, contents: IContentEditor): Promise<IHTTPResult> => {
    try {
      for (let index = 0; index < contents.sections.length; index++) {
        const section = contents.sections[index];
        for (let index = 0; index < section.columns.length; index++) {
          const column = section.columns[index];
          const stringVal = column.components as string;
          column.components = JSON.parse(stringVal);
        }
      }
      for (let index = 0; index < contents.draftSections.length; index++) {
        const section = contents.draftSections[index];
        for (let index = 0; index < section.columns.length; index++) {
          const column = section.columns[index];
          const stringVal = column.components as string;
          column.components = JSON.parse(stringVal);
        }
      }
      const result = await addContents(pageID, contents);
      const customCSS = getContentsCustomCSS(result._id, contents.customCSS);
      await updateContentsCSS(pageID, result._id, customCSS);
      return { status: 200, value: result._id };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static updateContents = async (pageID: number, _id: string, contents: IContentEditor, isSaveAsDraft: boolean): Promise<IHTTPResult> => {
    try {
      if (isSaveAsDraft) {
        const result = await getContents(pageID, _id);
        contents.sections = result.sections;
      } else {
        for (let index = 0; index < contents.sections.length; index++) {
          const section = contents.sections[index];
          for (let index = 0; index < section.columns.length; index++) {
            const column = section.columns[index];
            const stringVal = column.components as string;
            column.components = JSON.parse(stringVal);
          }
        }
      }
      for (let index = 0; index < contents.draftSections.length; index++) {
        const section = contents.draftSections[index];
        for (let index = 0; index < section.columns.length; index++) {
          const column = section.columns[index];
          const stringVal = column.components as string;
          column.components = JSON.parse(stringVal);
        }
      }
      await updateContents(pageID, _id, contents);
      return { status: 200, value: true };
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static getContentsByCategories = async (pageID: number, categories: string[], limit: number): Promise<IContentEditor[]> => {
    try {
      if (!categories?.length) {
        return await getContentsByLimit(pageID, 0, limit);
      } else {
        return await getContentsByCategories(pageID, categories, limit);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  static getContentsList = async (pageID: number, tableFilter: ITableFilter): Promise<IContentEditorWithLength> => {
    try {
      const orderBy = tableFilter.orderBy?.length > 0 ? tableFilter.orderBy[0] : '_id';
      const orderMethod = tableFilter.orderMethod || 'desc';
      const search = tableFilter.search ?? '';
      const pageSize = tableFilter.pageSize || environmentLib.mongoReturnLimit;
      const currentPage = tableFilter.currentPage ?? 0;
      const limitData = pageSize;
      const skipData = pageSize * currentPage;
      const contentsResult = await getContentsList(pageID, limitData, skipData, orderBy, orderMethod, search);
      const contents = contentsResult?.contents;
      for (let index = 0; index < contents?.length; index++) {
        const categoryIds = contents[index].categories;
        contents[index].displayCategories = await ContentsService.getDisplayCategories(pageID, categoryIds);
      }
      return contentsResult;
    } catch (error) {
      return null;
    }
  };

  static getDisplayCategories = async (pageID: number, categoryIds: string[]): Promise<string> => {
    try {
      let displayCategories = ['All Categories'];
      if (!categoryIds.length) return displayCategories.join(', ');
      else {
        displayCategories = [];
        const categories = await getCategoriesByIds(pageID, categoryIds);
        for (let index = 0; index < categories.length; index++) {
          const category = categories[index];
          displayCategories.push(category?.name);
        }
        return displayCategories.join(', ');
      }
    } catch (error) {
      return '';
    }
  };

  static getContents = async (pageID: number, _id: string): Promise<IContentEditor> => {
    try {
      return await getContents(pageID, _id);
    } catch (error) {
      return null;
    }
  };

  static getContentsHTML = async (pageID: number, _id: string): Promise<string> => {
    try {
      const result = await getContents(pageID, _id);
      return contentEditorToAngularHTML(result);
    } catch (error) {
      return contentEditorToAngularHTML(null);
    }
  };
}
