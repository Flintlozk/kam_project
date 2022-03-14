import { EnumAuthScope, ICustoemrListFilter, ICustomerListAdmin, IGQLContext } from '@reactor-room/itopplus-model-lib';
import { AdminCustomersService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateResponseGetCustomerList } from '../../../schema/admin/customers/customers.schema';
import { graphQLHandler } from '../../graphql-handler';

@requireScope([EnumAuthScope.ADMIN])
class AdminCustomers {
  public static instance: AdminCustomers;
  public static AdminCustomersService: AdminCustomersService;
  public static getInstance(): AdminCustomers {
    if (!AdminCustomers.instance) AdminCustomers.instance = new AdminCustomers();
    return AdminCustomers.instance;
  }

  constructor() {
    AdminCustomers.AdminCustomersService = new AdminCustomersService();
  }
  async getCustomersListAdminHandler(parent, args: { filters: ICustoemrListFilter }, context: IGQLContext): Promise<ICustomerListAdmin[]> {
    const { filters } = args;
    const result = await AdminCustomers.AdminCustomersService.getCustomersListAdmin(filters);
    return result;
  }
}

const adminCustomers: AdminCustomers = AdminCustomers.getInstance();
export const adminCustomersResolver = {
  Query: {
    getCustomersListAdmin: graphQLHandler({
      handler: adminCustomers.getCustomersListAdminHandler,
      validator: validateResponseGetCustomerList,
    }),
  },
};
