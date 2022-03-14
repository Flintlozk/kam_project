import { httpResultValueTranslate, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { generateResponseMessage, seperateCrudData } from '@reactor-room/itopplus-back-end-helpers';
import { ICatSubCatHolder, IGQLContext, IProductAttributeList, IProductCrudItems, PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';
import { isEmpty, uniq, xor } from 'lodash';
import { Pool } from 'pg';
import * as productData from '../../data/product';
import { getAttributesByProductID } from '../../data/product';
import { PlusmarService } from '../plusmarservice.class';

interface IAttributeRemovalFunction {
  nameUpper: string;
  nameLower: string;
  key: string;
  mappingFunction: any;
  removalFunction: any;
  executeRemovalFunction: any;
}
export class ProductAttributeService {
  getAttribSubAttribRemovalObj(type: string): IAttributeRemovalFunction {
    if (type === 'ATTRIBUTE') {
      return {
        nameUpper: 'Attribute',
        nameLower: 'attribute',
        key: 'id',
        mappingFunction: productData.executeAttributeMappingExists,
        removalFunction: this.processRemoveOfAttribute,
        executeRemovalFunction: productData.executeRemoveProductAttrib,
      };
    } else {
      return {
        nameUpper: 'Sub-Attribute',
        nameLower: 'sub attribute',
        key: 'subCatID',
        mappingFunction: productData.executeSubAttributeMappingExists,
        removalFunction: this.processRemoveOfAttribute,
        executeRemovalFunction: productData.executeRemoveProductSubAttrib,
      };
    }
  }

  getProductAttributeList = async (subscriberPageID: number): Promise<IProductAttributeList[]> => {
    return await productData.getProductAttributeList(PlusmarService.readerClient, subscriberPageID);
  };

  addProductAttribute = async (context: IGQLContext, attributeData: string): Promise<IHTTPResult> => {
    return await productData.addProductAttribute(PlusmarService.readerClient, context, attributeData);
  };

  addProductSubAttribute = async (subscriberPageID: number, attributeID: number, subAttributeName: string): Promise<IHTTPResult> => {
    try {
      return await productData.addProductSubAttribute(PlusmarService.readerClient, subscriberPageID, attributeID, subAttributeName);
    } catch (error) {
      return { status: 403, value: error };
    }
  };

  searchProductSKU = async (context: IGQLContext, value: string): Promise<IHTTPResult> => {
    return await productData.searchProductSKU(PlusmarService.readerClient, context, value);
  };

  getProductAttributeManagement = (pageID: number, filters: ITableFilter): Promise<IProductAttributeList[]> => {
    const searchBy = ['pat.name', 'pa.name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    const searchQuery = search ? ` AND ( ${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%')  ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')} )` : '';
    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    return productData.getProductAttributeManagement(PlusmarService.readerClient, pageID, searchQuery, orderQuery, page, pageSize);
  };

  getCatAndSubCatIDExtracted = (attrRemoveData: ICatSubCatHolder[]): { attrIDs: number[]; subAttrIDs: number[] } => {
    const attrIDs = [] as number[];
    const subAttrIDs = [] as number[];
    attrRemoveData.map((cat) => {
      if (cat.subCatID === -1) {
        attrIDs.push(cat.id);
      } else {
        subAttrIDs.push(cat.subCatID);
      }
    });
    return { attrIDs, subAttrIDs };
  };

  findNamesFromID(idArray: number[], mainArray: ICatSubCatHolder[], type: string): string[] {
    return idArray
      .map((id) => {
        const itemFound = mainArray.filter((mainItem) => mainItem[type] === id);
        return itemFound.length && itemFound[0].name;
      })
      .filter((name) => name);
  }

  async processAttribSubAttribRemoval(pageID: number, attrIDs: number[], attrRemoveData: ICatSubCatHolder[], type: string, client: Pool): Promise<IHTTPResult> {
    if (attrIDs?.length) {
      const typeObj = this.getAttribSubAttribRemovalObj(type);
      try {
        const attributeExistIds = await typeObj.mappingFunction(pageID, attrIDs, client);
        const attributeNames = this.findNamesFromID(attributeExistIds, attrRemoveData, typeObj.key);
        const attributeToBeRemovedIds = xor(attrIDs, attributeExistIds);
        const removeAttributeStatus = await typeObj.removalFunction(pageID, attributeToBeRemovedIds, attributeNames, client, typeObj);
        return removeAttributeStatus;
      } catch (error) {
        return { status: 403, value: PRODUCT_TRANSLATE_MSG.process_req_error };
      }
    }
  }

  async processRemoveOfAttribute(
    pageID: number,
    attributeToBeRemovedIds: number[],
    attributeNames: string[],
    client: Pool,
    typeObj: IAttributeRemovalFunction,
  ): Promise<IHTTPResult> {
    let status = 200;
    let attributeExistMessage = httpResultValueTranslate({
      isTranslateKeys: true,
      translateKeys: [typeObj.nameLower, PRODUCT_TRANSLATE_MSG.pro_associate_error],
      noTranslateMessage: attributeNames.join(),
    });
    if (attributeExistMessage) status = 403;
    try {
      if (attributeToBeRemovedIds.length) {
        const transKey = attributeNames.length ? PRODUCT_TRANSLATE_MSG.pro_associate_error : PRODUCT_TRANSLATE_MSG.delete_success;
        await typeObj.executeRemovalFunction(pageID, attributeToBeRemovedIds, client);
        attributeExistMessage = httpResultValueTranslate({
          isTranslateKeys: true,
          translateKeys: [typeObj.nameUpper, transKey],
          noTranslateMessage: attributeNames.join(),
        });
        if (attributeExistMessage) status = 200;
      }
      return { status, value: attributeExistMessage.trim() };
    } catch (error) {
      const value = httpResultValueTranslate({
        isTranslateKeys: false,
        translateKeys: [PRODUCT_TRANSLATE_MSG.process_req_error],
        noTranslateMessage: null,
      });
      return { status: 403, value };
    }
  }

  removeProductAttribute = async (pageID: number, attrRemoveData: ICatSubCatHolder[]): Promise<IHTTPResult[]> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const response = [] as IHTTPResult[];
    if (client) {
      const { attrIDs, subAttrIDs } = this.getCatAndSubCatIDExtracted(attrRemoveData);
      const attrIDsRemovedDuplicateIDs = uniq(attrIDs);
      const subAttrIDsRemovedDuplicateIDs = uniq(subAttrIDs);
      const subAttributesStatus = await this.processAttribSubAttribRemoval(pageID, subAttrIDsRemovedDuplicateIDs, attrRemoveData, 'SUBATTRIBUTE', client);
      const attributesStatus = await this.processAttribSubAttribRemoval(pageID, attrIDsRemovedDuplicateIDs, attrRemoveData, 'ATTRIBUTE', client);
      await productData.commitProductQueries(client, 'Message', 'Error. Try again later!');
      if (!isEmpty(attributesStatus)) response.push(attributesStatus);
      if (!isEmpty(subAttributesStatus)) response.push(subAttributesStatus);
      return response;
    } else {
      throw new Error('Error removing product Attribute, not able to fetch client');
    }
  };

  async addProductAttributeManage(context: IGQLContext, attributeData: IProductAttributeList[]): Promise<IHTTPResult> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      if (client) {
        return await this.processAddAttribute(context, attributeData, client);
      } else {
        throw new Error('Error saving product attribute');
      }
    } catch (error) {
      return {
        status: 403,
        value: PRODUCT_TRANSLATE_MSG.attr_save_error,
      };
    }
  }

  processAddAttribute = async (context: IGQLContext, attributeData: IProductAttributeList[], client: Pool): Promise<IHTTPResult> => {
    try {
      for (let attrI = 0; attrI < attributeData.length; attrI++) {
        const { attributeName } = attributeData[attrI];
        const attrResponse = await productData.addProductAttribute(client, context, attributeName);
        const { status, value } = attrResponse;
        if (status === 200) {
          const attrData = JSON.parse(value);
          for (let subAttrI = 0; subAttrI < attributeData[attrI].subAttributes.length; subAttrI++) {
            const { subAttributeName } = attributeData[attrI].subAttributes[subAttrI];
            const subAttrResponse = await productData.addProductSubAttribute(client, context.payload.pageID, attrData.id, subAttributeName);
            if (subAttrResponse.status !== 200) {
              const transResponse = generateResponseMessage(`'${subAttributeName}'`, subAttrResponse.value);
              return { status: subAttrResponse.status, value: transResponse };
            }
          }
        } else {
          const transResponse = generateResponseMessage(`'${attributeData[attrI].attributeName}'`, attrResponse.value);
          return { status: attrResponse.status, value: transResponse };
        }
      }
      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.attr_save_success, PRODUCT_TRANSLATE_MSG.attr_save_error);
      return dataCommited;
    } catch (error) {
      return {
        status: 403,
        value: error,
      };
    }
  };

  crudProductAttribute = async (pageID: number, editAttributeData: ICatSubCatHolder[]): Promise<IHTTPResult[]> => {
    try {
      const params = seperateCrudData(editAttributeData);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const response = await this.processCrudProductAttribute(pageID, client, params);
      await productData.commitProductQueries(client, 'Message', 'Error. Try again later!');
      return response;
    } catch (error) {
      console.log('ProductCatergoryService -> error', error);
      return;
    }
  };

  async processUpdateAttribute(pageID: number, client: Pool, updateMainItem: ICatSubCatHolder[]): Promise<IHTTPResult> {
    if (updateMainItem?.length) {
      const { id, name } = updateMainItem[0];
      const attrExists = await productData.getAttributeByName(pageID, client, name);
      let status = 200;
      let transKey = PRODUCT_TRANSLATE_MSG.pro_attr_update_success;
      if (isEmpty(attrExists)) {
        const updateProductAttr = await productData.executeUpdateProductAttribName(pageID, id, name, client);
        status = updateProductAttr?.status;
        transKey = updateProductAttr.value;
      } else {
        const { active } = attrExists;
        status = 403;
        transKey = active ? PRODUCT_TRANSLATE_MSG.attr_already_exists : PRODUCT_TRANSLATE_MSG.pro_attr_inactive_state;
      }
      const response = httpResultValueTranslate({
        isTranslateKeys: false,
        translateKeys: [transKey],
        noTranslateMessage: null,
      });
      return { status, value: response };
    }
  }

  processCrudProductAttribute = async (pageID: number, client: Pool, params: IProductCrudItems): Promise<IHTTPResult[]> => {
    let responseMessage = [] as IHTTPResult[];
    try {
      const updateProductAttr = await this.processUpdateAttribute(pageID, client, params?.updateMainItem);
      if (updateProductAttr?.status) responseMessage.push(updateProductAttr);

      const updateProductSubAttr = await this.processUpdateSubAttribute(pageID, client, params.updateSubItem);
      if (updateProductSubAttr?.status) responseMessage.push(updateProductSubAttr);

      const insertProductSubAttr = await this.processInsertSubAttr(pageID, client, params.insertSubItem);
      if (insertProductSubAttr?.status) responseMessage.push(insertProductSubAttr);

      const delIDs = params.deleteSubItem.map(({ subCatID }) => +subCatID);
      const deleteProductSubaAttr = await this.processAttribSubAttribRemoval(pageID, delIDs, params.deleteSubItem, 'SUBATTRIBUTE', client);
      if (deleteProductSubaAttr?.status) responseMessage.push(deleteProductSubaAttr);

      return responseMessage;
    } catch (error) {
      responseMessage = [];
      const errorMessage: IHTTPResult = { status: 403, value: PRODUCT_TRANSLATE_MSG.process_req_error };
      responseMessage.push(errorMessage);
      return responseMessage;
    }
  };

  async processUpdateSubAttribute(pageID: number, client: Pool, updateSubItem: ICatSubCatHolder[]): Promise<IHTTPResult> {
    try {
      if (updateSubItem?.length) {
        for (let i = 0; i < updateSubItem.length; i++) {
          const subAttrID = updateSubItem[i].subCatID;
          const attrID = updateSubItem[i].id;
          const name = updateSubItem[i].name;
          const subAttrExists = await productData.getSubAttributeByName(pageID, client, name, attrID);
          if (subAttrExists && !subAttrExists?.active) throw new Error(PRODUCT_TRANSLATE_MSG.pro_sub_attr_inactive_state);
          await productData.executeUpdateProductSubAttribName(attrID, subAttrID, name, pageID, client);
        }
        const value = httpResultValueTranslate({
          isTranslateKeys: false,
          translateKeys: [PRODUCT_TRANSLATE_MSG.pro_sub_attr_success],
          noTranslateMessage: null,
        });

        return { status: 200, value };
      }
    } catch (error) {
      const value = httpResultValueTranslate({
        isTranslateKeys: false,
        translateKeys: [error.message],
        noTranslateMessage: null,
      });
      return { status: 403, value };
    }
  }

  async processInsertSubAttr(pageID: number, client: Pool, insertSubAttr: ICatSubCatHolder[]): Promise<IHTTPResult> {
    try {
      if (insertSubAttr?.length) {
        for (let i = 0; i < insertSubAttr.length; i++) {
          const attrID = insertSubAttr[i].id;
          const name = insertSubAttr[i].name;
          await productData.executeInsertSubAttribute(pageID, attrID, name, client);
        }
        const value = httpResultValueTranslate({
          isTranslateKeys: false,
          translateKeys: [PRODUCT_TRANSLATE_MSG.pro_sub_attr_success],
          noTranslateMessage: null,
        });
        return { status: 200, value };
      }
    } catch (error) {
      const value = httpResultValueTranslate({
        isTranslateKeys: false,
        translateKeys: [error.message],
        noTranslateMessage: null,
      });
      console.log('{ status: 403, value }', { status: 403, value });
      return { status: 403, value };
    }
  }

  async getAttributesByProductID(pageID: number, productID: number): Promise<IProductAttributeList[]> {
    return await getAttributesByProductID(pageID, productID, PlusmarService.readerClient);
  }
}
