import { GenericRecursiveMessageType } from '@reactor-room/model-lib';
import { ProductInventoryCronPayload } from '../product/product-inventory.model';

export interface IQueueingAggregation {
  _id: { pageID: number };
  data: IQueueingModel[];
}

// eslint-disable-next-line
export type QueueingPayloadType = ProductInventoryCronPayload | any; // TODO : Defined type

export interface IQueueingPayload {
  _id?: string;
  type: GenericRecursiveMessageType;
  status?: QueueingStatusEnum;
  method?: QueueingMethodEnum;
  options: QueueingPayloadType;
  createdAt?: Date;
  updatedAt?: Date;
  retryAttempt?: number;
}
export interface IQueueingModel {
  _id?: string;
  pageID: number;
  subscriptionID?: string;
  payload: IQueueingPayload[];
  status?: QueueingStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  retryAttempt?: number;
}

export enum QueueingStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  FAILURE = 'FAILURE',
  RETRY = 'RETRY',
  PASS = 'PASS',
  EXCEEDED = 'EXCEEDED',
  FORCE_QUIT = 'FORCE_QUIT',
}

export enum QueueStatus {
  FAIL,
  PASS,
}

export enum QueueingMethodEnum {
  'NONE' = 'NONE',
  'UPDATE_MORE_COMMERCE' = 'UPDATE_MORE_COMMERCE',
  'UPDATE_MARKETPLACE_LAZADA' = 'UPDATE_MARKETPLACE_LAZADA',
  'UPDATE_MARKETPLACE_SHOPEE' = 'UPDATE_MARKETPLACE_SHOPEE',
  'UPDATE_MARKETPLACE_FACEBOOK' = 'UPDATE_MARKETPLACE_FACEBOOK',
}
