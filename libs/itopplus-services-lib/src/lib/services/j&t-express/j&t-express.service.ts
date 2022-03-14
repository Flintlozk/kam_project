import {
  CustomerShippingAddress,
  EnumLogisticDeliveryProviderType,
  IJAndTExpressResponseData,
  IJAndTItem,
  IJAndTPickUpDate,
  IJAndTSenderAndRecieverInfo,
  ILogisterInterface,
  ILogisticModel,
  IPages,
  IPurchasingOrderTrackingInfo,
  JAndTExpressConfig,
  PurchaseOrderProducts,
  ShippingAddressLocation,
} from '@reactor-room/itopplus-model-lib';
import {
  getPurchasingOrderItems,
  getPurchasingOrderTrackingInfo,
  updateOrderLabels,
  getCustomerShippingAddressByOrder,
  getPageAddress,
  updateCourierTracking,
  getLogisticByID,
  getCustomerAudienceByID,
  getLogisticByPageID,
  updateLogisticOption,
} from '../../data';
import { JAndTExpressAddressError, JAndTExpressOrderError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';
import * as md5 from 'md5';
import querystring from 'querystring';
import { createJAndTOrderID, mapJTExpressAddressForCreateOrder, validateAddress } from '../../domains';
import {
  cancelOrderJAndTExpress,
  createOrderJAndTExpress,
  getJAndTExpressLabel,
  getJAndTExpressOrderTracking,
  getJTExpressAddresses,
} from '../../data/j&t-express/j&t-express.data';
import { getDayjs, getJAndTDateTimeForPickup, parseTimestampToDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { getLogisitcTrackingURL } from '../../domains/logistic/get-tracking-url.domain';
import { isEmpty } from 'lodash';
import { IHTTPResult } from '@reactor-room/model-lib';

export class JAndTExpressService {
  createJTExpressOrder = async (
    pageID: number,
    orderID: number,
    audienceID: number,
    customerID: number,
    logisticDetail: ILogisticModel,
    Client: Pool = PlusmarService.readerClient,
  ): Promise<void> => {
    const typeNotMatch = logisticDetail.delivery_type !== EnumLogisticDeliveryProviderType.J_AND_T;
    if (typeNotMatch) throw new Error('LOGISTIC_TYPE_MISMATCH');
    const promiseResult = (await Promise.all([getPageAddress(Client, pageID), getCustomerShippingAddressByOrder(Client, customerID, pageID, orderID)])) as [
      IPages,
      CustomerShippingAddress[],
    ];

    const items = await getPurchasingOrderItems(Client, pageID, audienceID, orderID);
    const shopAddress = promiseResult[0] as IPages;
    const customerAddress = promiseResult[1] as CustomerShippingAddress[];
    const logisiticJTExpressAddress = await getJTExpressAddresses();
    const address = mapJTExpressAddressForCreateOrder(logisiticJTExpressAddress, shopAddress, customerAddress[0]);
    const jAndTItems = this.toJAndTExpressItems(items);
    const poTrackingInfo = await getPurchasingOrderTrackingInfo(Client, orderID, pageID);
    const param = await this.createOrderParam(orderID, poTrackingInfo.version, logisticDetail.option as JAndTExpressConfig, jAndTItems, address);
    const order = await createOrderJAndTExpress(param);

    if (order.responseitems[0].success !== 'true') {
      throw new JAndTExpressOrderError(order.responseitems[0].reason);
    }
    await this.createJAndTLabel(orderID, pageID, logisticDetail, order, Client);
  };

  createJAndTLabel = async (orderID: number, pageID: number, logisticDetail: ILogisticModel, order: IJAndTExpressResponseData, Client: Pool): Promise<void> => {
    const tracking = await this.updateTrackingFromJAndTExpress(orderID, logisticDetail, order, Client);
    const param1 = this.createReportParam(logisticDetail.option as JAndTExpressConfig, order.responseitems[0].mailno, 1);
    const param2 = this.createReportParam(logisticDetail.option as JAndTExpressConfig, order.responseitems[0].mailno, 2);
    const param3 = this.createReportParam(logisticDetail.option as JAndTExpressConfig, order.responseitems[0].mailno, 3);
    const param4 = this.createReportParam(logisticDetail.option as JAndTExpressConfig, order.responseitems[0].mailno, 4);
    await this.createOrderLabels(orderID, pageID, tracking, param1, param2, param3, param4);
  };

  updateTrackingFromJAndTExpress = async (
    orderID: number,
    logisticDetail: ILogisticModel,
    jAndTOrder: IJAndTExpressResponseData,
    Client = PlusmarService.writerClient,
  ): Promise<IPurchasingOrderTrackingInfo> => {
    const activateTrack = true;
    const trackingNo = jAndTOrder.responseitems[0].mailno;
    const trackingURL = getLogisitcTrackingURL(logisticDetail.delivery_type, trackingNo);
    return await updateCourierTracking(Client, orderID, trackingNo, trackingURL, JSON.stringify(jAndTOrder), activateTrack);
  };

  cancelOrderJAndTExpress = async (orderID: number, version: number, logisticDetail: ILogisticModel, reason: string): Promise<void> => {
    const txlogisticid = createJAndTOrderID(orderID, version);
    const param = this.cancelOrderParam(logisticDetail.option as JAndTExpressConfig, txlogisticid, reason);
    await cancelOrderJAndTExpress(param);
  };

  createOrderLabels = async (
    orderID: number,
    pageID: number,
    tracking: IPurchasingOrderTrackingInfo,
    param1: string,
    param2: string,
    param3: string,
    param4: string,
  ): Promise<void> => {
    // TODO : Implement Bank's report
    const labelOne = await getJAndTExpressLabel(param1);
    const labelTwo = await getJAndTExpressLabel(param2);
    const labelThree = await getJAndTExpressLabel(param3);
    const labelFour = await getJAndTExpressLabel(param4);

    const labels = {
      label1: labelOne.responseitems[0].reportUrl,
      label2: labelTwo.responseitems[0].reportUrl,
      label3: labelThree.responseitems[0].reportUrl,
      label4: labelFour.responseitems[0].reportUrl,
    };
    await updateOrderLabels(orderID, pageID, tracking, labels);
  };

  checkDeliveryInfo = async (param: string): Promise<IJAndTExpressResponseData> => {
    return await getJAndTExpressOrderTracking(param);
  };

  toJAndTExpressItems = (items: PurchaseOrderProducts[]): IJAndTItem[] => {
    return items.map((item) => {
      return {
        itemname: item.productName,
        number: item.quantity,
        itemvalue: Number(item.unitPrice),
        desc: '-',
      } as IJAndTItem;
    });
  };

  createOrderParam = (orderId: number, version: number, logistic: JAndTExpressConfig, jAndTItems: IJAndTItem[], address: IJAndTSenderAndRecieverInfo): string => {
    const logisticsInterface = this.getLogisticInterfaceForCreateOrder(orderId, version, logistic, jAndTItems, address);

    const dataDigest = this.digestJson(logisticsInterface, PlusmarService.environment.jAndTKey);
    const form = {
      logistics_interface: JSON.stringify(logisticsInterface),
      data_digest: dataDigest,
      msg_type: 'ORDERCREATE',
      eccompanyid: PlusmarService.environment.jAndTEECCompantId,
    };
    return querystring.stringify(form);
  };

  createReportParam = (logistic: JAndTExpressConfig, mailNo: string, reportType: number): string => {
    const logisticsInterface = {
      mailNo: mailNo,
      type: reportType,
    };

    const dataDigest = this.digestJson(logisticsInterface, PlusmarService.environment.jAndTKey);
    const form = {
      logistics_interface: JSON.stringify(logisticsInterface),
      data_digest: dataDigest,
      msg_type: 'GETREPORTURL',
      eccompanyid: PlusmarService.environment.jAndTEECCompantId,
    };
    return querystring.stringify(form);
  };

  createTrackingOrderParam = (logistic: JAndTExpressConfig, billcode: string, querytype: number): string => {
    const logisticsInterface = {
      billcode: billcode,
      type: querytype, //Normally it should be 1
      lang: 'th',
    };
    const dataDigest = this.digestJson(logisticsInterface, PlusmarService.environment.jAndTKey);
    const form = {
      logistics_interface: JSON.stringify(logisticsInterface),
      data_digest: dataDigest,
      msg_type: 'TRACKQUERY',
      eccompanyid: PlusmarService.environment.jAndTEECCompantId,
    };
    return querystring.stringify(form);
  };

  cancelOrderParam = (logistic: JAndTExpressConfig, txlogisticid: string, reason: string): string => {
    const logisticsInterface = {
      eccompanyid: PlusmarService.environment.jAndTEECCompantId,
      customerid: PlusmarService.environment.jAndTCustomerId,
      txlogisticid: txlogisticid,
      reason: reason,
    };
    const dataDigest = this.digestJson(logisticsInterface, PlusmarService.environment.jAndTKey);
    const form = {
      logistics_interface: JSON.stringify(logisticsInterface),
      data_digest: dataDigest,
      msg_type: 'ORDERCANCEL',
      eccompanyid: PlusmarService.environment.jAndTEECCompantId,
    };
    return querystring.stringify(form);
  };

  getLogisticInterfaceForCreateOrder = (
    orderId: number,
    version: number,
    logistic: JAndTExpressConfig,
    jAndTItems: IJAndTItem[],
    address: IJAndTSenderAndRecieverInfo,
  ): ILogisterInterface => {
    const txlogisticid = createJAndTOrderID(orderId, version);
    const pickUpDate = getJAndTDateTimeForPickup(3) as IJAndTPickUpDate;
    return {
      actiontype: 'add',
      customerid: PlusmarService.environment.jAndTCustomerId,
      txlogisticid: txlogisticid,
      ordertype: 1,
      servicetype: '1',
      deliverytype: 1,
      sender: address.sender,
      receiver: address.receiver,
      createordertime: pickUpDate.createordertime,
      sendstarttime: pickUpDate.sendstarttime, //Need to implemet pick-up date&time - for now use today
      sendendtime: pickUpDate.sendendtime, //Need to implemet pick-up date&time - for now add 3 days
      paytype: 1,
      isinsured: 0,
      shopid: logistic.shop_id,
      items: jAndTItems,
    };
  };

  digestJson = (logistics_interface, key) => {
    return Buffer.from(md5(JSON.stringify(logistics_interface) + key)).toString('base64');
  };

  validateAddress = async (customerId: number, pageId: number, orderId: number, logisticId: number, audienceId?: number, client = PlusmarService.readerClient): Promise<void> => {
    const logistic = await getLogisticByID(client, logisticId, pageId);
    let shippingAddress: ShippingAddressLocation;
    const customerAddress = await getCustomerShippingAddressByOrder(client, customerId, pageId, orderId);

    if (isEmpty(customerAddress)) {
      const customerDetail = await getCustomerAudienceByID(client, audienceId, pageId);
      shippingAddress = customerDetail.location;
    } else {
      shippingAddress = customerAddress[0].location;
    }

    if (logistic.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T) {
      const logisiticJTExpressAddress = await getJTExpressAddresses();
      const address = validateAddress(shippingAddress, logisiticJTExpressAddress);
      if (!address) {
        throw new JAndTExpressAddressError('J_AND_T_NOT_SUPPORT_ADDRESS');
      }
    }
  };

  async verifyJAndTExpress(pageID: number): Promise<IHTTPResult> {
    const logistics = await getLogisticByPageID(PlusmarService.readerClient, pageID);

    const expressObject = logistics.find((x) => x.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T);

    if (isEmpty(expressObject)) return { value: 'NO_LOGISTIC_PROVIDED', status: 400 };

    const option = <JAndTExpressConfig>expressObject.option;
    if (option.registered) {
      return { value: 'OK', status: 200 };
    } else {
      const shopAddress = await getPageAddress(PlusmarService.readerClient, pageID);
      const logisiticJTExpressAddress = await getJTExpressAddresses();
      const customerAddress = {
        name: 'TEST CUSTOMER',
        phone_number: '0611111111',
        location: { address: '555', province: 'กรุงเทพมหานคร', district: 'วังทองหลาง', post_code: '10310', city: 'วังทองหลาง' },
      } as CustomerShippingAddress;
      const address = mapJTExpressAddressForCreateOrder(logisiticJTExpressAddress, shopAddress, customerAddress);
      const mockItems = [
        {
          itemname: 'TestProduct',
          number: 1,
          itemvalue: 1,
          desc: '-',
        },
      ];

      const orderID = getDayjs().unix();
      const version = 0;
      const param = await this.createOrderParam(orderID, version, option as JAndTExpressConfig, mockItems, address);
      const order = await createOrderJAndTExpress(param);

      if (order.responseitems[0].success !== 'true') {
        return {
          value: 'NO',
          status: 500,
        };
      } else {
        await this.cancelOrderJAndTExpress(orderID, version, expressObject, 'CANCEL');
        const params = { ...option, registered: true };
        await updateLogisticOption(PlusmarService.writerClient, expressObject.id, params, pageID);

        return {
          value: 'OK',
          status: 200,
        };
      }
    }
  }
}
