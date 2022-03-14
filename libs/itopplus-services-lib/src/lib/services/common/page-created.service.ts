import { getDateOfPageCreated } from '../../data';
import { PlusmarService } from '../plusmarservice.class';

export class PageCreatedService {
  getDateOfPageCreation = async (ID: number): Promise<string> => {
    const result = await getDateOfPageCreated(PlusmarService.readerClient, ID);
    return result;
  };
}
