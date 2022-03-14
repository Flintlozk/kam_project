import { getTags } from '../../data/tags/tags.data';

export class TagsService {
  static getTags = async (pageID: number): Promise<string[]> => {
    try {
      const { tags } = await getTags(pageID);
      return tags;
    } catch (error) {
      return null;
    }
  };
}
