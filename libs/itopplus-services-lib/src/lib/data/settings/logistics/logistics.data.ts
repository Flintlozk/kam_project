import {
  ILogisticModelInput,
  ILogisticModel,
  IPageFeeInfo,
  ILogisticLabelsBuffer,
  IPurchasingOrderTrackingInfo,
  ThaiPostConfig,
  FlashExpressConfig,
  ILogisticLabels,
  IThaiPostShippingPriceChart,
  EnumTrackingType,
  EnumLogisticDeliveryProviderType,
  JAndTExpressConfig,
} from '@reactor-room/itopplus-model-lib';
import { logisticLabelSchemaModel as LogisticLabelModel, thaiPostShippingPriceSchemaModel as ThaiPostShippingPriceModel } from '@reactor-room/plusmar-model-mongo-lib';

import { getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';

export const getThaiPostShippingPrice = async (): Promise<IThaiPostShippingPriceChart> => {
  const result = await ThaiPostShippingPriceModel.findOne({ chartType: 'SHIPPING' }).lean();
  return result;
};

export async function getLogisticLabels(orderID: number, pageID: number, trackIDs: number[]): Promise<ILogisticLabels[]> {
  // FOR PRINTING STUFF
  try {
    const filter = { orderID: orderID, pageID: pageID, trackID: { $in: trackIDs } };
    const result = await LogisticLabelModel.find(filter);
    return result;
  } catch (err) {
    console.log('err ::::::::::>>> ', err);
    throw new Error(err);
  }
}

export async function updateOrderLabels(orderID: number, pageID: number, tracking: IPurchasingOrderTrackingInfo, label: ILogisticLabelsBuffer): Promise<ILogisticLabels> {
  try {
    const filter: ILogisticLabels = {
      orderID: orderID,
      pageID: pageID,
      trackID: tracking.id,
    };
    const update: ILogisticLabels = {
      orderID: orderID,
      trackID: tracking.id,
      pageID: pageID,
      label1: label.label1,
      label2: label.label2,
      label3: label.label3,
      label4: label.label4,
    };

    const result = await LogisticLabelModel.findOneAndUpdate(filter, update, { new: true, upsert: true });
    return result;
  } catch (err) {
    throw new Error(err);
  }
}

export async function createLogistic(client: Pool, pageID: number, logisticInputData: ILogisticModelInput): Promise<IHTTPResult> {
  try {
    const { name, type, feeType, deliveryType, codStatus, deliveryFee, image, trackingUrl, deliveryDays, status } = logisticInputData;
    const bindings = { pageID, name, type, feeType, deliveryType, codStatus, deliveryFee, image, trackingUrl, deliveryDays, status };
    const SQL = `
          INSERT INTO logistics ( 
            page_id,
            name,
            type,
            fee_type,
            delivery_type,
            cod_status,
            delivery_fee,
            image,
            tracking_url,
            delivery_days,
            status
            )
            VALUES (:pageID, :name, :type, :feeType, :deliveryType, :codStatus, :deliveryFee, :image, :trackingUrl, :deliveryDays, :status)
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 201,
      value: 'Create logistic successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLogistic(client: Pool, id: number, logisticInputData: ILogisticModelInput, pageID: number): Promise<IHTTPResult> {
  try {
    const { name, type, feeType, deliveryType, codStatus, walletId, deliveryFee, image, trackingUrl, trackingType, deliveryDays, status, option, subSystem } = logisticInputData;
    const bindings = {
      id,
      name,
      type,
      feeType,
      deliveryType,
      codStatus,
      walletId,
      deliveryFee,
      image,
      trackingType,
      trackingUrl,
      deliveryDays,
      status,
      pageID,
      option,
      updatedAt: getUTCDayjs(),
      subSystem,
    };

    const SQL = `
          UPDATE logistics 
          SET  
            name = :name,
            type = :type,
            fee_type = :feeType,
            cod_status = :codStatus,
            wallet_id = :walletId,
            delivery_fee = :deliveryFee,
            image = :image,
            tracking_url = :trackingUrl,
            delivery_days = :deliveryDays,
            tracking_type = :trackingType,
            status = :status,
            option = :option,
            updated_at = :updatedAt,
            sub_system = :subSystem
          WHERE id = :id AND page_id = :pageID
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update logistic type custom successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function updateLogisticOption(client: Pool, id: number, option: ThaiPostConfig | FlashExpressConfig | JAndTExpressConfig, pageID: number): Promise<IHTTPResult> {
  try {
    const bindings = { id, option, pageID, updatedAt: getUTCDayjs() };
    const SQL = `
          UPDATE logistics 
          SET  
            option = :option,
            updated_at =  :updatedAt
          WHERE id = :id AND page_id = :pageID
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update logistic type custom successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLogisticStatus(client: Pool, id: number, status: boolean): Promise<IHTTPResult> {
  try {
    const bindings = { id, status };
    const SQL = 'UPDATE logistics SET status = :status WHERE id = :id';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update logistic status successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePageFlatStatus(client: Pool, pageID: number, status: boolean): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, status };
    const SQL = 'UPDATE pages SET flat_status = :status WHERE id = :pageID';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update shop flat status successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePageDeliveryFee(client: Pool, pageID: number, fee: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageID, fee };
    const SQL = 'UPDATE pages SET delivery_fee = :fee WHERE id = :pageID';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Update shop flat delivery fee successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLogisticByID(client: Pool, logisticID: number, pageID: number): Promise<ILogisticModel> {
  try {
    const bindings = { pageID, logisticID };
    const SQL = 'SELECT * FROM logistics WHERE id = :logisticID AND page_id = :pageID';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILogisticModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLogisticByPageID(client: Pool, id: number): Promise<ILogisticModel[]> {
  try {
    const bindings = { id, is_deleted: false };
    const SQL = 'SELECT * FROM logistics WHERE page_id = :id AND is_deleted = :is_deleted ORDER BY id ASC';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILogisticModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getLogisticDetail(client: Pool, pageID: number, logisticID: number): Promise<ILogisticModel[]> {
  try {
    const bindings = { pageID, logisticID };
    const SQL = 'SELECT * FROM logistics WHERE page_id = :pageID AND id = :logisticID';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILogisticModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLogisticPageLogisticSettings(client: Pool, pageID: number): Promise<ILogisticModel[]> {
  try {
    const bindings = { pageID };
    const SQL = 'SELECT * FROM logistics WHERE page_id = :pageID AND status = true AND is_deleted = false';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<ILogisticModel[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPageFeeInfo(client: Pool, pageID: number): Promise<IPageFeeInfo> {
  try {
    const bindings = { pageID };
    const SQL = 'SELECT * from pages WHERE id = :pageID';
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const data = await PostgresHelper.execQuery<IPageFeeInfo[]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteLogistic(client: Pool, id: number): Promise<IHTTPResult> {
  try {
    const bindings = { is_deleted: true, id };
    const SQL = `
          UPDATE logistics 
          SET is_deleted = :is_deleted 
          WHERE id = :id
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execQuery(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete logistic successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePageLogistics(client: Pool, pageId: number): Promise<IHTTPResult> {
  try {
    const bindings = { pageId };
    const SQL = `
          DELETE
          FROM logistics 
          WHERE page_id = :pageId
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: 'Delete logistic successfully!',
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createDefaultLogistic(client: Pool, pageID: number, logisticInputData: ILogisticModelInput): Promise<ILogisticModel> {
  try {
    const { name, type, feeType, deliveryType, codStatus, deliveryFee, image, trackingUrl, deliveryDays, status, trackingType, walletId, option, subSystem } = logisticInputData;
    const bindings = { pageID, name, type, feeType, deliveryType, codStatus, deliveryFee, image, trackingUrl, deliveryDays, status, trackingType, walletId, option, subSystem };
    const SQL = `
            INSERT INTO logistics ( 
              page_id,
              name,
              type,
              fee_type,
              delivery_type,
              cod_status,
              delivery_fee,
              image,
              tracking_url,
              delivery_days,
              status,
              tracking_type,
              wallet_id,
              option,
              sub_system
              )
              SELECT :pageID, :name, :type, :feeType, :deliveryType, :codStatus, :deliveryFee, :image, :trackingUrl, :deliveryDays, :status, :trackingType, :walletId, :option, :subSystem
              WHERE 
                NOT EXISTS ( SELECT * FROM logistics
                              WHERE page_id =  :pageID
                              AND delivery_type = :deliveryType
                )
              RETURNING * 
          `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    const result = await PostgresHelper.execBatchTransaction<ILogisticModel>(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteLogisticFromDeliveryType(client: Pool, type: EnumLogisticDeliveryProviderType): Promise<IHTTPResult> {
  try {
    const bindings = { type, isDeleted: true };
    const SQL = `
        UPDATE logistics 
        SET is_deleted = :isDeleted 
        WHERE delivery_type = :type
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: `Delete logistic type ${type} successfully!`,
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function activeLogisticFromDeliveryType(client: Pool, type: EnumLogisticDeliveryProviderType, trackingType: EnumTrackingType): Promise<IHTTPResult> {
  try {
    const bindings = { type, trackingType, status: true, codStatus: false };
    const SQL = `
        UPDATE logistics 
        SET status = :status,
            tracking_type = :trackingType,
            cod_status = :codStatus
        WHERE delivery_type = :type
        `;
    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);
    await PostgresHelper.execBatchTransaction(client, returnSQLBindings.sql, returnSQLBindings.bindings);
    const response: IHTTPResult = {
      status: 200,
      value: `Delete logistic type ${type} with tracking type  ${trackingType} successfully!`,
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
