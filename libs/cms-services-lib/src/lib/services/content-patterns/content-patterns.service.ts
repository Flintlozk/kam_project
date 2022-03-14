import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { addContentPattern, getContentPattern, getContentPatterns, getTotalPattern, updateContentPattern } from '../../data/content-patterns/content-patterns.data';
import { updatePatternCSS } from '../../domains';

export class ContentPatternsService {
  static getTotalPattern = async (): Promise<number> => {
    try {
      return await getTotalPattern();
    } catch (error) {
      throw new Error(error);
    }
  };

  static getContentPatterns = async (skip: number, limit: number): Promise<IContentManagementGeneralPattern[]> => {
    try {
      return await getContentPatterns(skip, limit);
    } catch (error) {
      throw new Error(error);
    }
  };

  static getContentPattern = async (_id: string): Promise<IContentManagementGeneralPattern> => {
    try {
      return await getContentPattern(_id);
    } catch (error) {
      throw new Error(error);
    }
  };

  static addContentPattern = async (pattern: IContentManagementGeneralPattern): Promise<IHTTPResult> => {
    try {
      const result = await addContentPattern(pattern);
      const updateResult = updatePatternCSS(result);
      await updateContentPattern(updateResult._id, updateResult);
      return { status: 200, value: result._id };
    } catch (error) {
      throw new Error(error);
    }
  };

  static updateContentPattern = async (pattern: IContentManagementGeneralPattern): Promise<IHTTPResult> => {
    try {
      await updateContentPattern(pattern._id, pattern);
      return { status: 200, value: true };
    } catch (error) {
      throw new Error(error);
    }
  };
}
