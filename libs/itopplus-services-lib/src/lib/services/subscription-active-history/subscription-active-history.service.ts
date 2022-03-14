import { IHTTPResult } from '@reactor-room/model-lib';
import { isAllowCaptureException, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumAuthError, IRequestToken, ISubscription } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Response, Request } from 'express';
import { commitUpdateSubscriptionQueries, getActiveSubscriptions, verifyToken, createRequestToken, createSubscriptionActiveHistory } from '../../data';
import { PlusmarService } from '../plusmarservice.class';
import { AuthError } from '../../errors';

export class SubscriptionActiveHistoryService {
  createDefaultSubscriptionActiveHistory = async (res: Response, req: Request) => {
    try {
      if (!req.headers.authorization) throw new AuthError('INVALID_REQUEST');
      const token: IHTTPResult = await verifyToken(req.headers.authorization, PlusmarService.environment);
      if (!token || token.status !== 200) throw new AuthError(EnumAuthError.INVALID_TOKEN);
      if (token.value.from !== 'itopplus' || token.value.request !== 'CREATE_DEFAULT_SUBSCRIPTION_ACTIVE_HISTORY') throw new AuthError(EnumAuthError.INVALID_TOKEN);
      const subscriptions: ISubscription[] = await getActiveSubscriptions(PlusmarService.readerClient);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await Promise.all(subscriptions.map((subscription) => createSubscriptionActiveHistory(client, subscription.id, subscription.createdAt, subscription.expiredAt)));
      await commitUpdateSubscriptionQueries(client, 'Create default subscription active History successfully!', 'Error in create default subscription active History');
      return { status: 201, value: 'Create default subscription active History' };
    } catch (err) {
      const error = new Error(err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      throw err;
    }
  };

  createSubscriptionActiveHistoryRequestToken = async (res: Response, body: IRequestToken): Promise<IHTTPResult> => {
    try {
      const token = await createRequestToken(body.from, body.request, PlusmarService.environment.tokenKey);
      return token;
    } catch (err) {
      const error = new Error(err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      throw err;
    }
  };
}
