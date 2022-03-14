import { IErrorResponse } from '@reactor-room/model-lib';
import { ICatSubCatHolder, IProductCrudItems, PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';

export function seperateCrudData(crudData: ICatSubCatHolder[]): IProductCrudItems {
  const updateMainItem = crudData.filter((cat) => cat.subCatID === -1 && cat.type === 'UPDATE');
  const updateSubItem = crudData.filter((cat) => cat.subCatID !== -1 && cat.type === 'UPDATE');
  const insertSubItem = crudData.filter((cat) => cat.type === 'INSERT');
  const deleteSubItem = crudData.filter((cat) => cat.type === 'DELETE');
  return {
    updateMainItem,
    updateSubItem,
    insertSubItem,
    deleteSubItem,
  };
}

export function generateResponseMessage(result: string, transCode: PRODUCT_TRANSLATE_MSG): string {
  const errMessage: IErrorResponse = {
    result,
    transCode,
  };
  return JSON.stringify(errMessage);
}
