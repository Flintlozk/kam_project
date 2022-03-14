import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceStepStatusOrNull,
  CustomerDomainStatus,
  EnumPageMemberType,
  EnumPaymentType,
  IAudience,
  IAudienceDomainStatus,
  IAudienceHistoryParams,
  IAudienceStep,
  IAudienceStepExtraData,
  IAudienceStepInput,
  IDomainAndStatus,
  LeadsDomainStatus,
  UserMemberType,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { getPageByID, getPageMappingData, getPaymentById, getPurchasingOrder, updateCustomerUpdatedAt, updatePurchasingStatus } from '../../data';
import { createAudienceHistoryTransaction, getAudienceHistoryByAudienceID, getStep, updateAudience } from '../../data/audience-history';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderTrackingInfoService } from '../purchase-order/purchase-order-tracking-info.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';

export class AudienceStepService {
  STEP_ENUM = {
    FORWARD: true,
    REVERSE: false,
  };
  purchaseOrderTrackingInfoService: PurchaseOrderTrackingInfoService;
  purchaseOrderService: PurchaseOrderService;
  pipelineService: PipelineService;
  constructor() {
    this.purchaseOrderTrackingInfoService = new PurchaseOrderTrackingInfoService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.pipelineService = new PipelineService();
  }

  getAudienceHistoryExtraData = (
    user_id: number,
    user_type: UserMemberType,
    current_domain: AudienceDomainType,
    current_status: AudienceStepStatusOrNull,
    previous_domain: AudienceDomainType,
    previous_status: AudienceStepStatusOrNull,
    parent_id = null,
    date_current: Date = null,
    date_previous: Date = null,
  ): IAudienceStepExtraData => {
    return {
      user_id,
      user_type,
      current_domain,
      current_status,
      previous_domain,
      previous_status,
      parent_id: parent_id ? parent_id : null,
      date_current,
      date_previous,
    };
  };

  getSteps = async (audienceID: number, pageID: number): Promise<IAudience> => {
    if (audienceID) {
      const step = await getStep(PlusmarService.readerClient, audienceID, pageID);
      return step;
    } else {
      throw new Error('AUDIENCE_NOT_FOUND');
    }
  };

  createOrUpdateStep = async ({ audience_id: audienceID, page_id: pageID, user_id: userID }: IAudienceStepInput, pgClient = PlusmarService.writerClient): Promise<IAudience> => {
    const step = await this.getStepStatus(audienceID, pageID, this.STEP_ENUM.FORWARD, pgClient);
    const extraAudienceHistoryForStep = await this.getAudienceHistoryExtraDataForStep(pageID, userID, step, pgClient);
    const currentStep = await this.createAudienceHistory(audienceID, pageID, extraAudienceHistoryForStep, pgClient);
    if (currentStep) {
      if (currentStep.domain === AudienceDomainType.CUSTOMER && currentStep.status === CustomerDomainStatus.FOLLOW) {
        const page = await getPageByID(pgClient, pageID);
        await this.purchaseOrderService.createPurchasingOrder(pageID, audienceID, page, pgClient);
      }

      const update = await updateAudience(pgClient, currentStep, pageID);
      await updateCustomerUpdatedAt(pageID, update.customer_id, pgClient);
      return update;
    }
  };

  backToPreviousStep = async (input: IAudienceStepInput): Promise<IAudience> => {
    const { audience_id: audienceID, page_id: pageID, user_id: userID } = input || {};
    const purchaseOrder = await getPurchasingOrder(PlusmarService.readerClient, pageID, audienceID);
    const { payment_id } = purchaseOrder[0];
    const payment = await getPaymentById(PlusmarService.readerClient, pageID, payment_id);

    switch (payment.type) {
      case EnumPaymentType.BANK_ACCOUNT:
      case EnumPaymentType.CASH_ON_DELIVERY: {
        const step = await this.getStepStatus(audienceID, pageID, this.STEP_ENUM.REVERSE);
        const updatedAudience = { domain: step?.domain, status: step?.status } as IAudience;
        const currentAudience = { domain: step?.previous_domain, status: step?.previous_status } as IAudience;
        const currentStep = await this.logAudienceHistory({ pageID, userID, audienceID: audienceID, currentAudience, updatedAudience });
        if (currentStep) {
          const pipeline = await this.pipelineService.checkPurchaseOrderPipelineByAudienceID(pageID, audienceID);
          await this.purchaseOrderTrackingInfoService.cancelCourierTracking(pageID, Number(pipeline.order_id), audienceID);
          await updatePurchasingStatus(PlusmarService.writerClient, step.status, pageID, audienceID, Number(pipeline.order_id));
          const update = await updateAudience(PlusmarService.readerClient, currentStep, pageID);
          await updateCustomerUpdatedAt(pageID, update.customer_id, PlusmarService.readerClient);
          return update;
        }
        break;
      }
      default:
        throw new Error('ACTION_NOT_PERMITTED');
        break;
    }
  };

  updateAudiencePurchaseStep = async (audienceId: number, pageID: number, userID: number, client: Pool): Promise<IAudienceStep> => {
    const step = await this.getStepStatus(audienceId, pageID, this.STEP_ENUM.FORWARD, client);

    const extraAudienceHistoryForStep = await this.getAudienceHistoryExtraDataForStep(pageID, userID, step, client);
    const currentStep = await this.createAudienceHistory(audienceId, pageID, extraAudienceHistoryForStep, client);

    const audience = await updateAudience(client, currentStep, pageID);

    await updateCustomerUpdatedAt(pageID, audience.customer_id, client);

    return currentStep;
  };

  async getStepStatus(audienceID: number, pageID: number, isForward: boolean, client: Pool = PlusmarService.readerClient): Promise<IAudienceDomainStatus> {
    const step = await getStep(client, audienceID, pageID);

    if (step) {
      return this.handleDomains(step, isForward);
    } else {
      return {
        domain: AudienceDomainType.CUSTOMER,
        status: CustomerDomainStatus.FOLLOW,
        previous_status: CustomerDomainStatus.FOLLOW,
      } as IAudienceDomainStatus;
    }
  }

  handleDomains = (audience: IDomainAndStatus, isForward: boolean): IAudienceDomainStatus => {
    switch (audience.domain) {
      case AudienceDomainType.AUDIENCE:
        return this.handleAudienceDomain(audience);
      case AudienceDomainType.LEADS:
        return this.handleLeadsDomain(audience);
      case AudienceDomainType.CUSTOMER:
        if (isForward) {
          return this.handleCustomerDomain(audience);
        } else {
          return this.handleReverseCustomerDomain(audience);
        }
    }
  };

  handleAudienceDomain = (audience: IDomainAndStatus): IAudienceDomainStatus => {
    switch (audience?.status) {
      case AudienceDomainStatus.INBOX:
        return { domain: AudienceDomainType.CUSTOMER, status: CustomerDomainStatus.FOLLOW, previous_status: AudienceDomainStatus.INBOX };
      case AudienceDomainStatus.COMMENT:
        return { domain: AudienceDomainType.AUDIENCE, status: AudienceDomainStatus.COMMENT, previous_status: AudienceDomainStatus.COMMENT };
    }
  };

  handleLeadsDomain = (audience: IDomainAndStatus): IAudienceDomainStatus => {
    const domain = audience?.domain;
    switch (audience?.status) {
      case LeadsDomainStatus.FOLLOW:
        return { domain, status: LeadsDomainStatus.FINISHED, previous_status: LeadsDomainStatus.FOLLOW };
      case LeadsDomainStatus.FINISHED:
        return { domain, status: LeadsDomainStatus.FINISHED, previous_status: LeadsDomainStatus.FINISHED };
    }
  };

  handleCustomerDomain = (audience: IDomainAndStatus): IAudienceDomainStatus => {
    const domain = audience?.domain;
    switch (audience?.status) {
      case CustomerDomainStatus.FOLLOW:
        return {
          domain,
          status: CustomerDomainStatus.WAITING_FOR_PAYMENT,
          previous_status: CustomerDomainStatus.FOLLOW,
          previous_domain: domain,
        };
      case CustomerDomainStatus.WAITING_FOR_PAYMENT:
        return {
          domain,
          status: CustomerDomainStatus.CONFIRM_PAYMENT,
          previous_status: CustomerDomainStatus.WAITING_FOR_PAYMENT,
          previous_domain: domain,
        };
      case CustomerDomainStatus.CONFIRM_PAYMENT:
        return {
          domain,
          status: CustomerDomainStatus.WAITING_FOR_SHIPMENT,
          previous_status: CustomerDomainStatus.CONFIRM_PAYMENT,
          previous_domain: domain,
        };
      case CustomerDomainStatus.WAITING_FOR_SHIPMENT:
        return {
          domain,
          status: CustomerDomainStatus.CLOSED,
          previous_status: CustomerDomainStatus.WAITING_FOR_SHIPMENT,
          previous_domain: domain,
        };
      case CustomerDomainStatus.CLOSED: {
        return {
          domain,
          status: CustomerDomainStatus.CLOSED,
          previous_status: CustomerDomainStatus.CLOSED,
          previous_domain: domain,
        };
      }
    }
  };

  handleReverseCustomerDomain = (audience: IDomainAndStatus): IAudienceDomainStatus => {
    const domain = audience?.domain;
    switch (audience?.status) {
      // case CustomerDomainStatus.WAITING_FOR_PAYMENT:
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   return {
      //     domain,
      //     previous_domain: AudienceDomainType.CUSTOMER,
      //     status: CustomerDomainStatus.FOLLOW,
      //     previous_status: CustomerDomainStatus.WAITING_FOR_PAYMENT,
      //   };
      // case CustomerDomainStatus.CONFIRM_PAYMENT:
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   return {
      //     domain,
      //     previous_domain: AudienceDomainType.CUSTOMER,
      //     status: CustomerDomainStatus.WAITING_FOR_PAYMENT,
      //     previous_status: CustomerDomainStatus.CONFIRM_PAYMENT,
      //   };
      case CustomerDomainStatus.WAITING_FOR_SHIPMENT:
        return {
          domain,
          status: CustomerDomainStatus.CONFIRM_PAYMENT,
          previous_domain: AudienceDomainType.CUSTOMER,
          previous_status: CustomerDomainStatus.WAITING_FOR_SHIPMENT,
        };
      // case CustomerDomainStatus.CLOSED:
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   // ! DEBUG ONLY DO NOT FORGET TO COMMENT IT
      //   return {
      //     domain,
      //     previous_domain: AudienceDomainType.CUSTOMER,
      //     status: CustomerDomainStatus.WAITING_FOR_SHIPMENT,
      //     previous_status: CustomerDomainStatus.CLOSED,
      //   };
      default: {
        throw new Error('CAN_NOT_UNDO_FROM_CURRENT_STEP');
      }
    }
  };

  async getAudienceHistoryExtraDataForStep(
    pageID: number,
    user_id: number,
    domainData: IAudienceDomainStatus,
    Client: Pool = PlusmarService.readerClient,
  ): Promise<IAudienceStepExtraData> {
    const user_type = await this.getUserType(pageID, user_id, Client);
    const { domain: current_domain, status: current_status, previous_domain, previous_status } = domainData || {};
    return {
      user_id,
      user_type,
      current_domain,
      current_status,
      previous_domain,
      previous_status,
    };
  }

  async getUserType(pageID: number, userID: number, client: Pool): Promise<UserMemberType> {
    try {
      if (!userID) return UserMemberType.CUSTOMER;
      const userPageMapping = await getPageMappingData(pageID, userID, client);
      if (isEmpty(userPageMapping)) return null;

      const { role } = userPageMapping || {};
      switch (role) {
        case EnumPageMemberType.OWNER:
          return UserMemberType.OWNER;
        case EnumPageMemberType.ADMIN:
          return UserMemberType.MEMBER_ADMIN;
        case EnumPageMemberType.STAFF:
          return UserMemberType.MEMBER_STAFF;
        default:
          return UserMemberType.SYSTEM;
      }
    } catch (error) {
      console.log('AudienceStepService -> error', error);
      throw new Error('Error in getting user type');
    }
  }

  async createAudienceHistory(audienceID: number, pageID: number, audienceHistoryData: IAudienceStepExtraData, client: Pool = PlusmarService.writerClient): Promise<IAudienceStep> {
    return await createAudienceHistoryTransaction(audienceID, pageID, audienceHistoryData, client);
  }

  async logAudienceHistory(params: IAudienceHistoryParams, client = PlusmarService.writerClient): Promise<IAudienceStep> {
    const { pageID, userID, audienceID, currentAudience, updatedAudience, userIsSystem = false } = params;
    const { domain: previousDomain, status: previousStatus } = currentAudience || {};
    const { domain: currentDomain, status: currentStatus, parent_id } = updatedAudience || {};
    const userType = userIsSystem ? UserMemberType.SYSTEM : await this.getUserType(pageID, userID, client);
    const extraAudienceHistoryData = this.getAudienceHistoryExtraData(
      userID || null,
      userType,
      currentDomain,
      currentStatus,
      previousDomain || null,
      previousStatus || null,
      parent_id || null,
    );

    return await this.createAudienceHistory(audienceID, pageID, extraAudienceHistoryData, client);
  }

  async logNewAudienceHistory(client = PlusmarService.writerClient, audienceID: number, pageID: number, status: AudienceDomainStatus): Promise<IAudienceStep> {
    const extraAudienceHistoryData = {
      user_id: null,
      user_type: UserMemberType.SYSTEM,
      current_domain: AudienceDomainType.AUDIENCE,
      current_status: status,
      previous_domain: null,
      previous_status: null,
      parent_id: null,
      date_current: null,
      date_previous: null,
    } as IAudienceStepExtraData;

    return await this.createAudienceHistory(audienceID, pageID, extraAudienceHistoryData, client);
  }

  async getAudienceHistoryByAudienceID(audienceID: number, pageID: number): Promise<IAudienceStep[]> {
    try {
      const histories = await getAudienceHistoryByAudienceID(PlusmarService.readerClient, pageID, audienceID);
      return histories;
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  }
}
