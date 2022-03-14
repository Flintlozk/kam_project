import { ICategory, ICategoryWithLength } from '@reactor-room/cms-models-lib';
import { CategoryService } from '@reactor-room/cms-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateDefaultRequest, validateRequestPageID } from '../../schema';

@requireScope([EnumAuthScope.CMS])
class Category {
  public static instance: Category;
  public static categoryService: CategoryService;

  public static getInstance() {
    if (!Category.instance) Category.instance = new Category();
    return Category.instance;
  }

  constructor() {}

  async getAllCategoriesHandler(parent, args: { tableFilter: ITableFilter }, context: IGQLContext): Promise<ICategoryWithLength> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await CategoryService.getAllCategories(pageID, args.tableFilter);
    return result;
  }
  async getCategoriesByIdsHandler(parent, args: { _ids: string[] }, context: IGQLContext): Promise<ICategory[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await CategoryService.getCategoriesByIds(pageID, args._ids);
    return result;
  }
}

const category: Category = Category.getInstance();
export const categoryResolver = {
  Query: {
    getAllCategories: graphQLHandler({
      handler: category.getAllCategoriesHandler,
      validator: validateDefaultRequest,
    }),
    getCategoriesByIds: graphQLHandler({
      handler: category.getCategoriesByIdsHandler,
      validator: validateDefaultRequest,
    }),
  },
  Mutation: {},
};
