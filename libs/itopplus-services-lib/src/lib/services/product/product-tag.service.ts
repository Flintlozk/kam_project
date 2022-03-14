import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IDObject, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { generateResponseMessage } from '@reactor-room/itopplus-back-end-helpers';
import { IGQLContext, IProductTag, PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';
import { isEmpty, xor } from 'lodash';
import { Pool } from 'pg';
import * as productData from '../../data/product';
import { PlusmarService } from '../plusmarservice.class';

export class ProductTagService {
  getProductTagManagement = (pageID: number, filters: ITableFilter): Promise<IProductTag[]> => {
    const searchBy = ['name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    const searchQuery = search ? ` AND ${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')}` : '';

    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    return productData.getProductTagManagement(PlusmarService.readerClient, pageID, searchQuery, orderQuery, page, pageSize);
  };

  getProductTag = async (pageID: number): Promise<IProductTag[]> => {
    return await productData.getProductTag(PlusmarService.readerClient, pageID);
  };

  getProductTagSearch = async (pageID: number, searchString: string): Promise<IProductTag[]> => {
    return await productData.getProductTagSearch(PlusmarService.readerClient, pageID, searchString);
  };

  addProductTag = async (pageID: number, name: string): Promise<IProductTag> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      if (client) {
        const tagData = await productData.addProductTag(pageID, name, client);
        await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_tag_save_success, PRODUCT_TRANSLATE_MSG.pro_tag_save_error);
        return tagData;
      } else {
        throw new Error('Error saving product tags, not able to fetch client');
      }
    } catch (error) {
      throw new Error('Error saving Product Tags');
    }
  };

  removeProductTags = async (context: IGQLContext, tagIds: IDObject[]): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.readerClient);
    const { pageID } = context.payload;
    if (client) {
      const ids = tagIds.map(({ id }) => id);
      const tagMappingExistsIds = await productData.executeTagMappingExists(pageID, ids, client);
      const tagIDExists = tagMappingExistsIds ? tagMappingExistsIds?.map(({ id }) => id) : [];
      const tagNameExists = tagMappingExistsIds ? tagMappingExistsIds?.map(({ name }) => name) : [];
      const tagToBeRemoved = xor(ids, tagIDExists);
      const removeResponse = await this.processRemovingOfTags(pageID, tagToBeRemoved, tagNameExists, client);
      return removeResponse;
    } else {
      throw new Error('Error removing product Tags, not able to fetch client');
    }
  };

  processRemovingOfTags = async (pageID: number, tagIds: number[], tagNameExists: string[], client: Pool): Promise<IHTTPResult> => {
    try {
      const tagList = tagNameExists ? tagNameExists.join(', ') : null;
      if (tagIds?.length) {
        for (let i = 0; i < tagIds.length; i++) {
          const tagID = tagIds[i];
          await productData.executeRemoveProductTags(pageID, tagID, client);
        }
        let successMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_tag_remove_success);
        if (tagList) successMessage = generateResponseMessage(`'${tagList}'`, PRODUCT_TRANSLATE_MSG.pro_tag_associate_success);
        const dataCommited = await productData.commitProductQueries(client, successMessage, PRODUCT_TRANSLATE_MSG.pro_tag_remove_error);
        return dataCommited;
      } else {
        let successMessage = ' ';
        if (tagList) successMessage = generateResponseMessage(`'${tagList}'`, PRODUCT_TRANSLATE_MSG.pro_tag_associate_error);
        return { status: 403, value: successMessage };
      }
    } catch (error) {
      const errMessage = generateResponseMessage(null, PRODUCT_TRANSLATE_MSG.pro_tag_remove_error);
      return { status: 403, value: errMessage };
    }
  };

  editProductTag = async (id: number, name: string, pageID: number): Promise<IHTTPResult> => {
    try {
      const tagByName = await productData.getTagByName(name, pageID, PlusmarService.readerClient);
      this.isTagNameExistAndInactive(tagByName);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await productData.executeEditProductTag(id, name, pageID, client);
      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_tag_update_success, PRODUCT_TRANSLATE_MSG.pro_tag_update_error);
      return dataCommited;
    } catch (error) {
      const errMessage: string = error.message?.toString();
      return this.respondTagErrorMessage(errMessage);
    }
  };

  respondTagErrorMessage(errMessage: string): IHTTPResult {
    let value = PRODUCT_TRANSLATE_MSG.pro_tag_update_error;
    if (errMessage.includes('product_tags_un')) value = PRODUCT_TRANSLATE_MSG.pro_tag_already_exits;
    if (errMessage.includes('TAG_INACTIVATE_STATE')) value = PRODUCT_TRANSLATE_MSG.pro_tag_inactive_state;
    return { status: 403, value };
  }

  isTagNameExistAndInactive(tagByName: IProductTag): boolean {
    if (isEmpty(tagByName)) return true;
    const { active } = tagByName;
    if (active === false) {
      throw new Error('TAG_INACTIVATE_STATE');
    }
  }

  addProductMultipleTag = async (pageID: number, name: string[]): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      if (client) {
        for (let i = 0; i < name.length; i++) {
          const tagName = name[i];
          await productData.addProductTag(pageID, tagName, client);
        }
        const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_tag_save_success, PRODUCT_TRANSLATE_MSG.pro_tag_save_error);
        return dataCommited;
      } else {
        console.log('Error saving product tags, not able to fetch client');
        return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_tag_save_error };
      }
    } catch (error) {
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_tag_save_error };
    }
  };
}
