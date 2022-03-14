import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { generateResponseMessage, seperateCrudData, SHOPEE_REFRESH_EXPIRE_IN_DAYS } from '@reactor-room/itopplus-back-end-helpers';
import { ICatSubCatHolder, IGQLContext, IProductCategoryList, IProductCategoryMappingDB, PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';
import { isEmpty, uniq, xor } from 'lodash';
import { Pool } from 'pg';
import * as productData from '../../data/product';
import { PlusmarService } from '../plusmarservice.class';

interface CrudCategoryItems {
  updateCategoryItem: ICatSubCatHolder[];
  updateSubCategoryItem: ICatSubCatHolder[];
  insertSubCategoryItem: ICatSubCatHolder[];
  deleteCategoryItem: ICatSubCatHolder[];
}
export class ProductCatergoryService {
  getProductCategoryList = async (context: IGQLContext): Promise<IProductCategoryList[]> => {
    return await productData.getProductCategoryList(PlusmarService.readerClient, context);
  };

  getProductCategoryManagement = async (pageID: number, filters: ITableFilter): Promise<IProductCategoryList[]> => {
    const searchBy = ['pc.name', 'p_sc.name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    const searchQuery = search ? ` AND (${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')} )` : '';

    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    const categoryData = await productData.getProductCategoryManagement(PlusmarService.readerClient, pageID, searchQuery, orderQuery, page, pageSize);
    return categoryData.length ? this.filterSubCatInactive(categoryData) : [];
  };

  filterSubCatInactive(categoryData: IProductCategoryList[]): IProductCategoryList[] {
    return categoryData?.map((cat) => ({
      ...cat,
      subCategories: cat.subCategories.filter((subCat) => subCat.subCategoryActive),
    }));
  }

  addProductCategory = async (context: IGQLContext, categoryData: IProductCategoryList[]): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const { pageID } = context.payload;
    try {
      if (client) {
        return await this.processAddCategory(pageID, categoryData, client);
      } else {
        return {
          status: 403,
          value: PRODUCT_TRANSLATE_MSG.cat_save_error,
        };
      }
    } catch (error) {
      return {
        status: 403,
        value: PRODUCT_TRANSLATE_MSG.cat_save_error,
      };
    }
  };

  processAddCategory = async (pageID: number, categoryData: IProductCategoryList[], client: Pool): Promise<IHTTPResult> => {
    try {
      for (let catI = 0; catI < categoryData.length; catI++) {
        const { category } = categoryData[catI];
        const msgCatAlreadyExit = generateResponseMessage(`'${category}'`, PRODUCT_TRANSLATE_MSG.cat_already_exists);
        const msgCatSaveError = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.cat_save_error);
        const categoryResponse = await productData.executeCategoryQuery(pageID, category, msgCatAlreadyExit, msgCatSaveError, client);
        const { id } = categoryResponse;
        for (let subCatI = 0; subCatI < categoryData[catI].subCategories.length; subCatI++) {
          const { subCategory } = categoryData[catI].subCategories[subCatI];
          await productData.executeSubCategoryQuery(pageID, id, subCategory, client);
        }
      }
      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.cat_save_success, PRODUCT_TRANSLATE_MSG.cat_save_error);
      return dataCommited;
    } catch (error) {
      return {
        status: 403,
        value: error.message.toString(),
      };
    }
  };

  getCatAndSubCatIDExtracted = (categoryRemoveData: ICatSubCatHolder[]): { catIDs: number[]; subCatIDs: number[] } => {
    const catIDs = [] as number[];
    const subCatIDs = [] as number[];
    categoryRemoveData.map((cat) => {
      if (cat.subCatID === -1) {
        catIDs.push(cat.id);
      } else {
        subCatIDs.push(cat.subCatID);
      }
    });
    return { catIDs, subCatIDs };
  };

  removeProductCategory = async (pageID: number, categoryRemoveData: ICatSubCatHolder[]): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    if (client) {
      const { catIDs, subCatIDs } = this.getCatAndSubCatIDExtracted(categoryRemoveData);
      const catIDsRemovedDuplicateIDs = uniq(catIDs);
      const subCatIDsRemovedDuplicateIDs = uniq(subCatIDs);
      const catMappingExists = await productData.executeCategoryMappingExists(pageID, catIDsRemovedDuplicateIDs, 'CATEGORY', client);
      const categoryIDExists = catMappingExists ? catMappingExists?.map(({ id }) => +id) : [];
      const categoryNameExists = catMappingExists ? catMappingExists?.map(({ name }) => name) : [];
      const subCatMappingExists = await productData.executeCategoryMappingExists(pageID, subCatIDsRemovedDuplicateIDs, 'SUBCATEGORY', client);
      const subCategoryIDExists = subCatMappingExists ? subCatMappingExists?.map(({ id }) => +id) : [];
      const subCategoryNameExists = subCatMappingExists ? subCatMappingExists?.map(({ name }) => name) : [];
      const subCategoryToBeRemovedIds = xor(subCatIDs, subCategoryIDExists);
      const categoryToBeRemovedIds = xor(catIDs, categoryIDExists);
      const extractCatSubCatToBeRemoved = { catToBeRemoved: categoryToBeRemovedIds, subCatToBeRemoved: subCategoryToBeRemovedIds };
      const removeResponse = await this.processRemovingOfCatSubCat(pageID, extractCatSubCatToBeRemoved, [...subCategoryNameExists, ...categoryNameExists], client);
      return removeResponse;
    } else {
      throw new Error('Error removing product Category, not able to fetch client');
    }
  };

  async processRemovingOfCatSubCat(
    pageID: number,
    extractCatSubCatToBeRemoved: { catToBeRemoved: number[]; subCatToBeRemoved: number[] },
    categoryNameExists: string[],
    client: Pool,
  ): Promise<IHTTPResult> {
    try {
      const catList = categoryNameExists ? categoryNameExists.join(', ') : null;
      let successMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.cat_delete_success);
      const { catToBeRemoved, subCatToBeRemoved } = extractCatSubCatToBeRemoved;
      await productData.executeRemoveProductCategory(pageID, subCatToBeRemoved, catToBeRemoved, client);
      const { message, status } = this.getRemoveCategorySuccessMessage(catList, subCatToBeRemoved, catToBeRemoved);
      successMessage = message;
      const dataCommited = await productData.commitProductQueries(client, successMessage, PRODUCT_TRANSLATE_MSG.cat_delete_error);
      if (status !== 200) {
        dataCommited.status = status;
      }
      return dataCommited;
    } catch (error) {
      return { status: 403, value: generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.cat_delete_error) };
    }
  }

  crudProductCategory = async (pageID: number, editCategoryData: ICatSubCatHolder[]): Promise<IHTTPResult[]> => {
    try {
      const { updateMainItem, updateSubItem, insertSubItem, deleteSubItem } = seperateCrudData(editCategoryData);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const params = { updateCategoryItem: updateMainItem, updateSubCategoryItem: updateSubItem, insertSubCategoryItem: insertSubItem, deleteCategoryItem: deleteSubItem };
      const response = await this.processCrudProductCategory(pageID, client, params);
      await productData.commitProductQueries(client, 'Message', 'Error. Try again later!');
      return response;
    } catch (error) {
      console.log('ProductCatergoryService -> error', error);
      return;
    }
  };

  processCrudProductCategory = async (pageID: number, client: Pool, params: CrudCategoryItems): Promise<IHTTPResult[]> => {
    const responseMessage = [] as IHTTPResult[];
    const updateProductCat = await this.processUpdateProductCategory(pageID, client, params.updateCategoryItem);
    if (updateProductCat?.status) responseMessage.push(updateProductCat);
    const updateProductSubCat = await this.processUpdateSubCategory(pageID, client, params.updateSubCategoryItem);
    if (updateProductSubCat?.status) responseMessage.push(updateProductSubCat);
    const insertProductSubCat = await this.processInsertSubCategory(pageID, client, params.insertSubCategoryItem);
    if (insertProductSubCat?.status) responseMessage.push(insertProductSubCat);
    const deleteProductSubCat = await this.processDeleteSubCategory(pageID, client, params.deleteCategoryItem);
    if (deleteProductSubCat?.status) responseMessage.push(deleteProductSubCat);
    return responseMessage;
  };

  isCatNameExistAndInactive(catData: IProductCategoryMappingDB): boolean {
    if (isEmpty(catData)) return true;
    const { active } = catData;
    if (active === false) {
      throw new Error('CAT_INACTIVATE_STATE');
    }
  }

  respondCatErrorMessage(errMessage: string, catName: string): IHTTPResult {
    let value = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_sub_attr_update_error);
    if (errMessage.includes('product_category_un')) value = generateResponseMessage(`'${catName}'`, PRODUCT_TRANSLATE_MSG.pro_sub_cat_exists_another_name);
    if (errMessage.includes('CAT_INACTIVATE_STATE')) value = generateResponseMessage(`${catName}`, PRODUCT_TRANSLATE_MSG.pro_cat_inactive_state);
    return { status: 403, value };
  }

  async processUpdateProductCategory(pageID: number, client: Pool, updateCategoryItem: ICatSubCatHolder[]): Promise<IHTTPResult> {
    if (updateCategoryItem.length) {
      const { id, name, subCatID } = updateCategoryItem[0];
      try {
        const catData = await productData.getCategoryByName(pageID, client, id, name, subCatID);
        this.isCatNameExistAndInactive(catData);
        const updateProductCat = await productData.executeUpdateCatSubCatName(id, name, subCatID, pageID, client);
        const response = { status: updateProductCat.status, value: generateResponseMessage(null, updateProductCat.value) };
        return response;
      } catch (error) {
        console.log('error', error);
        const errMessage: string = error.message?.toString();
        return this.respondCatErrorMessage(errMessage, name);
      }
    }
  }

  async processUpdateSubCategory(pageID: number, client: Pool, updateSubCategoryItem: ICatSubCatHolder[]): Promise<IHTTPResult> {
    try {
      if (updateSubCategoryItem?.length) {
        for (let i = 0; i < updateSubCategoryItem.length; i++) {
          const { id, name, subCatID } = updateSubCategoryItem[i];
          const catData = await productData.getCategoryByName(pageID, client, subCatID, name, id);
          this.isCatNameExistAndInactive(catData);
          await productData.executeUpdateCatSubCatName(subCatID, name, id, pageID, client);
        }
        return { status: 200, value: generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_sub_attr_update_success) };
      }
    } catch (error) {
      return this.respondSubCatErrorMessage(error?.message);
    }
  }

  respondSubCatErrorMessage(errMessage: string): IHTTPResult {
    if (errMessage.includes('product_category_un')) {
      return { status: 403, value: '' };
    } else if (errMessage.includes('CAT_INACTIVATE_STATE')) {
      const value = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_sub_attr_inactive_state);
      return { status: 403, value };
    } else {
      const isSubAttrName = errMessage.match(/'(.*?)'/);
      const subAttrName = isSubAttrName[1];
      const value = subAttrName
        ? generateResponseMessage(`'${subAttrName}'`, PRODUCT_TRANSLATE_MSG.pro_sub_cat_exists_another_name)
        : generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_cat_update_error);
      return { status: 403, value };
    }
  }

  async processDeleteSubCategory(pageID: number, client: Pool, deleteCategoryItem: ICatSubCatHolder[]): Promise<IHTTPResult> {
    try {
      if (deleteCategoryItem?.length) {
        const subCatExistsName = [] as string[];
        for (let i = 0; i < deleteCategoryItem.length; i++) {
          const subCatID = deleteCategoryItem[i].subCatID;
          const subCatName = deleteCategoryItem[i].name;
          const subCatExists = await productData.executeSubCategoryMappingExists(pageID, subCatID, client);
          subCatExists ? subCatExistsName.push(subCatName) : await productData.executeDeleteSubCategory(subCatID, pageID, client);
        }
        const subCatList = subCatExistsName ? subCatExistsName.join(', ') : null;
        return subCatList
          ? { status: 200, value: generateResponseMessage(`'${subCatList}'`, PRODUCT_TRANSLATE_MSG.pro_sub_cat_associate) }
          : { status: 200, value: generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.sub_cat_delete_success) };
      }
    } catch (error) {
      return { status: 403, value: generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.sub_cat_save_error) };
    }
  }

  async processInsertSubCategory(pageID: number, client: Pool, insertSubCategoryItem: ICatSubCatHolder[]): Promise<IHTTPResult> {
    try {
      if (insertSubCategoryItem?.length) {
        for (let i = 0; i < insertSubCategoryItem.length; i++) {
          const catID = insertSubCategoryItem[i].id;
          const name = insertSubCategoryItem[i].name;
          await productData.executeSubCategoryQuery(pageID, catID, name, client);
        }
        return { status: 200, value: generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.sub_cat_save_success) };
      }
    } catch (error) {
      return { status: 403, value: generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.sub_cat_save_error) };
    }
  }

  getRemoveCategorySuccessMessage(catList: string, subCatIDs: number[], catIDs: number[]): { message: string; status: number } {
    let successMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.cat_delete_success);
    let responseStatus = 200;

    if (catList.length > 0 && subCatIDs.length > 0 && catIDs.length > 0) {
      successMessage = generateResponseMessage(`<b>'${catList}'</b>`, PRODUCT_TRANSLATE_MSG.pro_cat_associate);
      responseStatus = 500;
    } else if (catList.length === 0 && subCatIDs.length > 0 && catIDs.length > 0) {
      successMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_cat_sub_cat_delete_success);
    } else if (catList.length > 0 && subCatIDs.length > 0 && catIDs.length === 0) {
      successMessage = generateResponseMessage(` <b>'${catList}'</b>`, PRODUCT_TRANSLATE_MSG.pro_sub_cat_associate);
      responseStatus = 500;
    } else if (catList.length > 0 && subCatIDs.length === 0 && catIDs.length > 0) {
      successMessage = generateResponseMessage(` <b>'${catList}'</b>`, PRODUCT_TRANSLATE_MSG.pro_cat_associate_success);
    } else if (catList.length > 0 && subCatIDs.length === 0 && catIDs.length === 0) {
      successMessage = generateResponseMessage(` <b>'${catList}'</b> `, PRODUCT_TRANSLATE_MSG.pro_cat_associate);
      responseStatus = 500;
    } else if (catList.length === 0 && subCatIDs.length > 0 && catIDs.length === 0) {
      successMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.sub_cat_delete_success);
    } else {
      successMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_cat_cannot_remove);
      responseStatus = 500;
    }

    const messages = { message: successMessage, status: responseStatus };
    return messages;
  }
}
