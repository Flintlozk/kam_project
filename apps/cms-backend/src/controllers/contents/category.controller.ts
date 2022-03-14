import { ICategory } from '@reactor-room/cms-models-lib';
import { EnumAuthScope, IGQLContext, IPayload } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { validateRequestPageID, validateResponseHTTPObject } from '../../schema';
import { CategoriesService } from '@reactor-room/cms-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateContentCategoriesRequest } from '../../schema/contents/contents.schema';

@requireScope([EnumAuthScope.CMS])
class Categories {
  public static instance: Categories;
  public static categoriesService: CategoriesService;

  public static getInstance() {
    if (!Categories.instance) Categories.instance = new Categories();
    return Categories.instance;
  }

  constructor() {}
  async addContentCategoryHandler(parent, args: { categoryData: ICategory }, context: IGQLContext): Promise<IHTTPResult> {
    const categoryData = validateContentCategoriesRequest<ICategory>(args.categoryData);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await CategoriesService.addContentCategory(pageID, categoryData);
  }
  async checkCategoryNameExistHandler(parent, args: { name: string; id: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await CategoriesService.checkCategoryNameExist(pageID, args.name, args.id);
  }
  async updateCategoryNameByIDHandler(parent, args: { categoryData: ICategory }, context: IGQLContext): Promise<IHTTPResult> {
    const categoryData = validateContentCategoriesRequest<ICategory>(args.categoryData);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await CategoriesService.updateCategoryNameByID(pageID, categoryData);
  }
  async deleteCategoryByIDHandler(parent, args: { id: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await CategoriesService.deleteCategoryByID(pageID, args.id);
  }
  async deleteCategoriesByIDHandler(parent, args: { ids: string[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await CategoriesService.deleteCategoriesByID(pageID, args.ids);
  }
}
const categories: Categories = Categories.getInstance();
export const contentCategoryResolver = {
  Query: {
    checkCategoryNameExist: graphQLHandler({
      handler: categories.checkCategoryNameExistHandler,
      validator: validateResponseHTTPObject,
    }),
  },
  Mutation: {
    addContentCategory: graphQLHandler({
      handler: categories.addContentCategoryHandler,
      validator: validateResponseHTTPObject,
    }),
    updateCategoryNameByID: graphQLHandler({
      handler: categories.updateCategoryNameByIDHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteCategoryByID: graphQLHandler({
      handler: categories.deleteCategoryByIDHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteCategoriesByID: graphQLHandler({
      handler: categories.deleteCategoriesByIDHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
