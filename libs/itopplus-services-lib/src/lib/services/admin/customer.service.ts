import { ICustoemrListFilter, ICustomerListAdmin } from '@reactor-room/itopplus-model-lib';
import { isArray } from 'lodash';
import { getCustomersListAdmin, getCustomersListAdminBySearch } from '../../data';
import { PlusmarService } from '../plusmarservice.class';

export class AdminCustomersService {
  constructor() {}

  async getCustomersListAdmin(query: ICustoemrListFilter): Promise<ICustomerListAdmin[]> {
    query.page = (query.currentPage - 1) * query.pageSize;
    query.search = query.search ? `%${query.search.toLocaleLowerCase()}%` : null;
    if (query.search !== null) {
      const result = await getCustomersListAdminBySearch(PlusmarService.readerClient, query);
      return isArray(result) ? result : [];
    } else {
      const result = await getCustomersListAdmin(PlusmarService.readerClient, query);
      return isArray(result) ? result : [];
    }
  }
}
