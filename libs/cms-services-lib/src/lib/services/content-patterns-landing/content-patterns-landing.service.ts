import { IContentManagementLandingPattern } from '@reactor-room/cms-models-lib';
import { getContentPatternLanding, getContentPatternLandings } from '../../data/content-patterns-landing/content-patterns-landing.data';

export class ContentPatternsLandingService {
  static getContentPatternLandings = async (skip: number, limit: number): Promise<IContentManagementLandingPattern[]> => {
    try {
      return await getContentPatternLandings(skip, limit);
    } catch (error) {
      throw new Error(error);
    }
  };

  static getContentPatternLanding = async (_id: string): Promise<IContentManagementLandingPattern> => {
    try {
      return await getContentPatternLanding(_id);
    } catch (error) {
      throw new Error(error);
    }
  };
}
