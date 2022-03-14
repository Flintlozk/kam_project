import { createMailOption, createTransporter, getUTCDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { createExpiredDate, getDayTilExpired, renewExpiredDate, renewExpiredDateFreePackage } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumSubscriptionFeatureType,
  EnumSubscriptionPackageTypeID,
  ICreateOrderHistoryResponse,
  IOrderHash,
  IOrderHistory,
  IPayment2C2PResponse,
  IRequestPaymentData,
  ISubscription,
  ISubscriptionContext,
  ISubscriptionOrderInput,
  ISubscriptionPlan,
  ISubscriptionUserDetail,
} from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import {
  commitUpdateSubscriptionQueries,
  createSubscriptionActiveHistory,
  createSubscriptionOrder,
  createSubscriptionOrderHistoryMapping,
  getSubscriptionAndUserDetail,
  getSubscriptionBySubscriptionID,
  getSubscriptionPlan,
  removeSubscriptionActiveHistory,
  sendInvitationEmail,
  updateOrderHistoryFromPaymentResponse,
  updateSubscriptionExpireDate,
  updateSubscriptionStatus,
  updateSubscriptionWithPlan,
} from '../../data';
import { signHmacSha256 } from '../../domains';
import { OrderHistoryError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';

export class OrderHistoryService {
  createOrderHash = (requestPaymentData: IRequestPaymentData): IOrderHash => {
    const today = getUTCDayjs().toDate();
    const tomorrow = new Date(today);
    const tomorrowNextYearFormat = dayjs(tomorrow.setDate(today.getDate() + 1))
      .add(1, 'year')
      .format('DDMMYYYY');
    const url1 = `${PlusmarService.environment.backendUrl}/redirect`;
    const url2 = `${PlusmarService.environment.backendUrl}/subscription-payment`;

    // eslint-disable-next-line max-len
    const rawData = `${PlusmarService.environment.PAYMENT_2C2P_VERSION}${PlusmarService.environment.merchantID}${requestPaymentData.payment_description}${requestPaymentData.order_id}${requestPaymentData.currency}${requestPaymentData.amount}${requestPaymentData.user_defined_1}${url1}${url2}${PlusmarService.environment.PAYMENT_2C2P_REQUEST_3DS}${requestPaymentData.recurring}${requestPaymentData.order_prefix}${requestPaymentData.recurring_amount}${requestPaymentData.allow_accumulate}${requestPaymentData.recurring_interval}${requestPaymentData.recurring_count}${tomorrowNextYearFormat}${requestPaymentData.payment_option}`;
    const result = signHmacSha256(rawData, PlusmarService.environment.MERCHANT_AUTH_KEY);
    const res = {
      version: PlusmarService.environment.PAYMENT_2C2P_VERSION,
      merchant_id: PlusmarService.environment.merchantID,
      result_url_1: url1,
      result_url_2: url2,
      request_3ds: PlusmarService.environment.PAYMENT_2C2P_REQUEST_3DS,
      redirect_api: PlusmarService.environment.PAYMENT_2C2P_REDIRECT_API,
    } as IRequestPaymentData;
    const orderHash = {
      hash_value: result.toUpperCase(),
      charge_next_date: tomorrowNextYearFormat,
      order_detail: res,
    };
    return orderHash;
  };

  createSubscriptionOrder = async (
    subscriptionID: string,
    userID: number,
    subscriptionPlanID: number,
    orderDetails: ISubscriptionOrderInput,
  ): Promise<ICreateOrderHistoryResponse> => {
    const subscription: ISubscription = await getSubscriptionBySubscriptionID(PlusmarService.readerClient, subscriptionID);
    if (!subscription) throw new OrderHistoryError('NO_SUBSCRIPTION_FROM_ID');
    const subscriptionPlan: ISubscriptionPlan = await getSubscriptionPlan(PlusmarService.readerClient, subscriptionPlanID);
    if (!subscriptionPlan) throw new OrderHistoryError('INVALID_SUBSCRIPTION_PLAN_ID');
    if (subscription.planId && subscription.planId !== 1) {
      const isPlanValid = await this.validateSubscriptionPlan(subscription.planId, subscriptionPlan);
      if (!isPlanValid) throw new OrderHistoryError('INVALID_SUBSCRIPTION_PLAN');
    }
    const orderHistoryResponse: ICreateOrderHistoryResponse = await createSubscriptionOrder(PlusmarService.writerClient, subscriptionID, userID, subscriptionPlanID, orderDetails);
    orderHistoryResponse.recurring_amount = orderDetails.price;
    return orderHistoryResponse;
  };

  validateSubscriptionPlan = async (currentSubscriptionPlanID: number, subscriptionPlan: ISubscriptionPlan): Promise<boolean> => {
    const currentPlan = await getSubscriptionPlan(PlusmarService.readerClient, currentSubscriptionPlanID);
    switch (currentPlan.featureType) {
      case EnumSubscriptionFeatureType.COMMERCE:
        if (subscriptionPlan.featureType === EnumSubscriptionFeatureType.BUSINESS) return false;
        if (currentSubscriptionPlanID > subscriptionPlan.id) return false;
        return true;
      case EnumSubscriptionFeatureType.BUSINESS:
        if (subscriptionPlan.featureType === EnumSubscriptionFeatureType.COMMERCE) return false;
        if (currentSubscriptionPlanID > subscriptionPlan.id) return false;
        return true;
      default:
        return false;
    }
  };

  updateSubscriptionOrder = async (res: IPayment2C2PResponse): Promise<IHTTPResult> => {
    try {
      const subscription: ISubscription = await getSubscriptionBySubscriptionID(PlusmarService.readerClient, res.user_defined_1);
      const orderHistory: IOrderHistory = await updateOrderHistoryFromPaymentResponse(PlusmarService.writerClient, res);
      if (!orderHistory) throw new OrderHistoryError('NO_ORDER_FROM_PAYMENT');
      const orderSubscriptionPlan: ISubscriptionPlan = await getSubscriptionPlan(PlusmarService.readerClient, orderHistory.subscription_plan_id);
      if (subscription) {
        if (res.payment_status === '000') {
          if (subscription.planId === orderHistory.subscription_plan_id) {
            return await this.renewSubscription(subscription, orderHistory.id);
          } else {
            await this.updateSubscriptionWithPlan(subscription.id, orderHistory, orderSubscriptionPlan);
            try {
              void this.sendMailOnCreateSubscription(subscription.id, subscription);
            } catch (err) {
              console.log('MAIL SEND FAILED (updateSubscriptionOrder)');
            }
          }
        } else {
          await this.updateFailOrder(subscription.id, orderHistory.id);
        }
      } else {
        return { status: 400, value: 'No subscription from payment response' };
      }
    } catch (err) {
      throw new OrderHistoryError(err);
    }
  };

  updateSubscriptionWithPlan = async (subscriptionID: string, orderHistory: IOrderHistory, subscriptionPlan: ISubscriptionPlan): Promise<IHTTPResult> => {
    try {
      const today = getUTCDayjs().toDate();
      const expireDate = createExpiredDate(orderHistory.subscription_plan_id);
      const dayTilExpired = getDayTilExpired(expireDate) + 1;
      const dailyPrice = Math.round(subscriptionPlan.price / dayTilExpired);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await removeSubscriptionActiveHistory(client, subscriptionID);
      await createSubscriptionActiveHistory(client, subscriptionID, today, expireDate);
      await updateSubscriptionWithPlan(client, subscriptionID, subscriptionPlan, subscriptionPlan.price, dailyPrice);
      await updateSubscriptionExpireDate(client, subscriptionID, expireDate);
      await updateSubscriptionStatus(client, subscriptionID, true);
      await createSubscriptionOrderHistoryMapping(client, subscriptionID, orderHistory.id);
      const dataCommited = await commitUpdateSubscriptionQueries(client, 'Update subscription with plan successfully!', 'Error in update subscription with plan');
      return dataCommited;
    } catch (error) {
      console.log('OrderHistoryService -> updateSubscriptionWithPlan', error);
      return { status: 403, value: 'Error updating subscription with plan. Try again later!' };
    }
  };

  renewSubscription = async (subscription: ISubscription, orderID: number): Promise<IHTTPResult> => {
    try {
      const expireDate = renewExpiredDate(subscription.expiredAt);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await createSubscriptionActiveHistory(client, subscription.id, subscription.expiredAt, expireDate);
      await updateSubscriptionExpireDate(PlusmarService.writerClient, subscription.id, expireDate);
      await createSubscriptionOrderHistoryMapping(PlusmarService.writerClient, subscription.id, orderID);
      const dataCommited = await commitUpdateSubscriptionQueries(client, 'Renew subscription successfully!', 'Error in renew subscription');
      return dataCommited;
    } catch (error) {
      console.log('OrderHistoryService -> renewSubscription', error);
      return { status: 403, value: 'Error renew subscription. Try again later!' };
    }
  };

  renewSubscriptionFreePackage = async (subscription: ISubscriptionContext): Promise<IHTTPResult> => {
    try {
      const expireDate = renewExpiredDateFreePackage();
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await createSubscriptionActiveHistory(client, subscription.id, subscription.expiredAt, expireDate);
      await updateSubscriptionExpireDate(PlusmarService.writerClient, subscription.id, expireDate);
      const dataCommited = await commitUpdateSubscriptionQueries(client, 'Renew subscription successfully!', 'Error in renew subscription');
      return dataCommited;
    } catch (error) {
      console.log('OrderHistoryService -> renewSubscriptionFreePavkage', error);
      return { status: 403, value: 'Error renew subscription. Try again later!' };
    }
  };

  updateFailOrder = async (subscriptionID: string, orderID: number): Promise<void> => {
    try {
      await createSubscriptionOrderHistoryMapping(PlusmarService.writerClient, subscriptionID, orderID);
    } catch (err) {
      throw new OrderHistoryError(err);
    }
  };

  sendMailOnCreateSubscription = async (subscriptionID: string, subscription: ISubscription): Promise<void> => {
    let previousPlan = null;
    if (subscription) previousPlan = subscription.planId;
    const { name, email, tel, plan_id }: ISubscriptionUserDetail = await getSubscriptionAndUserDetail(PlusmarService.readerClient, subscriptionID);

    const to = 'Phol@itopplus.com;worawut@theiconweb.com;apithana@theiconweb.com;sartiya_ning@theiconweb.com;prancharee@plusacademy.online';
    const subject = `More-commerce Subscription ${previousPlan !== null ? 'Upgraded ' : 'Created'} Report`;
    const htmlBody = `
    ชื่อ: ${name} <br />
    email: ${email} <br />
    เบอร์โทรศัพท์: ${tel} <br />
    วันและเวลา: ${new Date()} <br />
    plan: ${previousPlan !== null ? EnumSubscriptionPackageTypeID[1] + ' upgrade to ' + EnumSubscriptionPackageTypeID[plan_id] : EnumSubscriptionPackageTypeID[plan_id]} 
    `;
    const invitationEmail = createMailOption(to, subject, htmlBody, []);
    const transporter = createTransporter(PlusmarService.environment.transporterConfig);
    await sendInvitationEmail(invitationEmail, transporter);
  };
}
