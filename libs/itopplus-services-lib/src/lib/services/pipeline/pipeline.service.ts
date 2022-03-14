import { EnumHandleResponseMessageType, EnumPurchasingPayloadType, IFacebookPipelineModel } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { getAudienceStatusById, getPurchaseOrderPipelineDataByOrderID, getPurchaseOrderPipelineData, getCompletePurchaseOrderPipelineData } from '../../data';
import {
  allowPipelineActionOnStep,
  allowPostbackButton,
  allowPostbackMessage,
  isAudienceAllowed,
  isCurrentTemplateAllowed,
} from '../../domains/pipeline/pipeline-prevention-overlapping.domain';
import { PipelineException, PipelineRejected } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';
import * as Sentry from '@sentry/node';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
export class PipelineService {
  async checkPurchaseOrderPipelineByAudienceID(pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    try {
      const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
      if (pipeline === null) {
        throw new PipelineException('PIPELINE_NOT_FOUND');
      } else {
        return pipeline;
      }
    } catch (err) {
      throw new PipelineException(`PURCHASE_PIPELINE_EXCEPTION_AUDIENCE:${audienceID}`);
    }
  }
  async checkPurchaseOrderPipelineByOrderID(pageID: number, orderID: number): Promise<IFacebookPipelineModel> {
    try {
      const pipeline = await getPurchaseOrderPipelineDataByOrderID(PlusmarService.readerClient, pageID, orderID);
      if (pipeline === null) {
        throw new PipelineException('PIPELINE_NOT_FOUND');
      } else {
        return pipeline;
      }
    } catch (err) {
      throw new PipelineException(`PURCHASE_PIPELINE_EXCEPTION_ORDER:${orderID}`);
    }
  }

  async getPurchaseOrderPipeline(eventType: EnumPurchasingPayloadType, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    try {
      const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);

      if (isEmpty(pipeline)) {
        // TODO :  HANDLE CASE OF NULL
        return null;
      }

      const currentPipeline = pipeline.pipeline;
      if (allowPipelineActionOnStep(eventType, currentPipeline)) {
        const audienceStatus = await getAudienceStatusById(PlusmarService.readerClient, pipeline.audience_id, pipeline.page_id);
        if (isAudienceAllowed(audienceStatus.status)) {
          return pipeline;
        } else throw new PipelineRejected(`PURCHASE_${eventType}_AUDIENCE_REJECTED_${audienceID}`);
      } else throw new PipelineRejected(`PURCHASE_${eventType}_PIPELINE_REJECTED_${audienceID}`);
    } catch (err) {
      console.log('getPurchaseOrderPipeline err ::::::::::>>> ', err);
      // throw new PipelineException(`PURCHASE_${eventType}_PIPELINE_EXCEPTION${audienceID}`);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  }

  async getPipelineOnPostbackButton(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    try {
      const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
      if (isEmpty(pipeline)) {
        // TODO :  HANDLE CASE OF NULL
        return null;
      }

      const currentPipeline = pipeline.pipeline;
      if (allowPostbackButton(eventType, currentPipeline)) {
        const audienceStatus = await getAudienceStatusById(PlusmarService.readerClient, pipeline.audience_id, pipeline.page_id);
        if (isAudienceAllowed(audienceStatus.status)) {
          return pipeline;
        } else throw new PipelineRejected(`POSTBACK_BUTTON_${eventType}_AUDIENCE_REJECTED_${audienceID}`);
      } else throw new PipelineRejected(`POSTBACK_BUTTON_${eventType}_PIPELINE_REJECTED_${audienceID}`);
    } catch (err) {
      console.log('getPipelineOnPostbackButton err ::::::::::>>> ', err);
      // throw new PipelineException(`POSTBACK_BUTTON_${eventType}_PIPELINE_EXCEPTION${audienceID}`);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  }

  async getPipelineOnPostbackMessage(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    try {
      const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
      if (isEmpty(pipeline)) {
        // TODO :  HANDLE CASE OF NULL
        return null;
      }

      const currentPipeline = pipeline.pipeline;
      if (allowPostbackMessage(eventType, currentPipeline)) {
        const audienceStatus = await getAudienceStatusById(PlusmarService.readerClient, pipeline.audience_id, pipeline.page_id);
        if (isAudienceAllowed(audienceStatus.status)) {
          return pipeline;
        } else throw new PipelineRejected(`POSTBACK_MESSAGE_${eventType}_AUDIENCE_REJECTED_${audienceID}`);
      } else throw new PipelineRejected(`POSTBACK_MESSAGE_${eventType}_PIPELINE_REJECTED_${audienceID}`);
    } catch (err) {
      console.log('getPipelineOnPostbackMessage err ::::::::::>>> ', err);
      // throw new PipelineException(`POSTBACK_MESSAGE_${eventType}_PIPELINE_EXCEPTION${audienceID}`);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  }

  async getPipelineOnHandleTemplate(eventType: EnumPurchasingPayloadType, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    try {
      const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
      if (isEmpty(pipeline)) {
        const completePipeline = await getCompletePurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
        if (isEmpty(pipeline)) {
          return null;
        } else {
          return completePipeline;
        }
      }
      const currentPipeline = pipeline.pipeline;
      if (isCurrentTemplateAllowed(eventType, currentPipeline)) {
        const audienceStatus = await getAudienceStatusById(PlusmarService.readerClient, pipeline.audience_id, pipeline.page_id);

        if (isAudienceAllowed(audienceStatus.status)) {
          return pipeline;
        } else throw new PipelineRejected(`TEMPLATE_${eventType}_AUDIENCE_REJECTED_${audienceID}`);
      } else throw new PipelineRejected(`TEMPLATE_${eventType}_PIPELINE_REJECTED_${audienceID}`);
    } catch (err) {
      console.log('getPipelineOnHandleTemplate err ::::::::::>>> ', err);
      // throw new PipelineException(`TEMPLATE_${eventType}_PIPELINE_EXCEPTION${audienceID}`);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  }
}
