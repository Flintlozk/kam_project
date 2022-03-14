import { environmentLib } from '@reactor-room/environment-services-backend';
import {
  axiosGetWithHeaderResponseBinary,
  cryptoDecode,
  getDateByUnitStartOrEnd,
  getUTCMongo,
  getUTCTimestamps,
  isEmpty,
  isImageByExtension,
  parseTimestampToDayjs,
  PostgresHelper,
  transformImageURlFormat,
  transformMediaLinkString,
} from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceContactActionMethod,
  AudienceCounter,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceLeadContext,
  AudienceStats,
  AudienceViewType,
  AUDIENCE_REDIS_UPDATE,
  CustomerDomainStatus,
  EnumPurchaseOrderStatus,
  EPageMessageTrackMode,
  FormTemplates,
  IAgent,
  IAliases,
  IAudience,
  IAudienceHistory,
  IAudienceHistorySingleRow,
  IAudienceMessageFilter,
  IAudiencePagination,
  IAudienceStepInput,
  IAudienceWithCustomer,
  IAudienceWithLeads,
  IAudienceWithPurchasing,
  ICustomerTemp,
  IFacebookMessagePayloadTypeEnum,
  IFacebookMessageResponse,
  ILogInput,
  ImageSetTemplate,
  ImageSetTemplateInput,
  IPayload,
  IUploadImageSetResult,
  IUserCredential,
  LeadsDomainStatus,
  LeadsFilters,
  LeadsListStatsInput,
  LogAction,
  LogType,
  Message,
  MessageReferral,
  MessageSentByEnum,
  MessageTemplates,
  MessageTemplatesFilters,
  NotificationStatus,
  PaidFilterEnum,
  Socials,
  UserMadeLastChangesToStatus,
} from '@reactor-room/itopplus-model-lib';
import { EnumFileFolder, IHTTPResult, IHTTPResultMessage, ITableFilter } from '@reactor-room/model-lib';
import { orderBy, sortBy } from 'lodash';
import { Pool } from 'pg';
import {
  activateCustomer,
  addCustomerToAudience,
  addCustomerToAudienceTransaction,
  countAudienceStatus,
  getAudienceAssignee,
  getAudienceByCustomerID,
  getAudienceByID,
  getAudienceFollow,
  getAudienceListStatusFollow,
  getAudienceListTotal,
  getAudienceListWithLeadsFinished,
  getAudienceListWithLeadsFollow,
  getAudienceListWithPurchaseOrderStatusClosed,
  getAudienceListWithPurchaseOrderStatusClosedBySearch,
  getAudienceListWithPurchaseOrderStatusConfirmPayment,
  getAudienceListWithPurchaseOrderStatusFollow,
  getAudienceListWithPurchaseOrderStatusWaitForPayment,
  getAudienceListWithPurchaseOrderStatusWaitForShipment,
  getAudienceNotActive,
  getAudienceStats,
  getAudienceStatusById,
  getCustomerByPSID,
  getLatestMessage,
  getLeadsListTotal,
  getUserByIDAndPageID,
  getUserMadeLastChangesToStatus,
  releaseReservedPurchaseOrderItemBySingleOrderID,
  sendAttachment,
  setLastActivityPlatformDateByAudienceID,
  updateAudienceDomainStatusByID,
  updatePurchasingStatusTransaction,
} from '../../data';
import {
  addImageSets,
  addMessageTemplate,
  deleteImageFromSet,
  deleteImageSets,
  deleteMessageTemplate,
  getAgentsFromRedis,
  getAllAudienceByCustomerID,
  getAssignAudienceSLAList,
  getAudienceAllStats,
  getAudienceAndInsertOnNotExist,
  getAudienceByCustomerIDIncludeChild,
  getAudienceHistoriesData,
  getAudienceHistoryByIDData,
  getAudienceLeadContext,
  getAudienceListWithPurchaseOrder,
  getAudienceSLAList,
  getChildAudienceByAudienceId,
  getChildAudienceStatusById,
  getCustomerByAudienceID,
  getForms,
  getImageSets,
  getImageSetsByShortcut,
  getIsAudienceValidForProductLink,
  getLastAudienceByCustomerID,
  getMessageTemplates,
  getSocials,
  getTemplatesByShortcut,
  setAudienceNotifyOnClosed,
  setAudienceOffTimes,
  setLastIncomingDateByAudienceID,
  updateAudienceDomainStatusByIDTransaction,
  updateAudiencePageIDByID,
  updateAudienceReferral,
  updateAudienceStatusByID,
  updateAudienceUserClose,
  updateAudienceUserOpen,
  updateLatestSentBy,
  updateSocials,
} from '../../data/audience';
import { updateCustomerUpdatedAt } from '../../data/customer/customer.data';
import { deleteReferral } from '../../data/leads';
import {
  getAudienceIDOfOrder,
  getMarketPlacePurchaseOrderStatusWaitForPayment,
  getMarketPlacePurchaseOrderStatusWaitForShipment,
  getPurchasingOrderByPurchasingOrderID,
} from '../../data/purchase-order/get-purchase-order.data';
import { getCustomerNameByPlatform, getLeadSubmissionStatusEnums } from '../../domains';
import { AudienceStepService } from '../audience-step/audience-step.service';
import { CustomerSLAService } from '../customer';
import { FileService } from '../file/file.service';
import { LeadsService } from '../leads/leads.service';
import { LogService } from '../log/log.service';
import { NotificationService } from '../notification/notification.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderPipelineService } from '../purchase-order/purchase-order-pipeline.service';
import { UserService } from '../user/user.service';
import { AudienceContactService } from './audience-contact.service';

export class AudienceService {
  public audienceStepService: AudienceStepService;
  public audienceContactService: AudienceContactService;
  public pipelineService: PipelineService;
  public purchaseOrderPipelineService: PurchaseOrderPipelineService;
  public userService: UserService;
  public customerSLAService: CustomerSLAService;
  public notificationService: NotificationService;
  public fileService: FileService;
  public logService: LogService;
  public leadsService: LeadsService;
  constructor() {
    this.audienceStepService = new AudienceStepService();
    this.audienceContactService = new AudienceContactService();
    this.pipelineService = new PipelineService();
    this.purchaseOrderPipelineService = new PurchaseOrderPipelineService();
    this.customerSLAService = new CustomerSLAService();
    this.userService = new UserService();
    this.notificationService = new NotificationService();
    this.fileService = new FileService();
    this.logService = new LogService();
    this.leadsService = new LeadsService();
  }

  async updateContactOnRejected(pageID: number, audienceID: number, userID: number, method: AudienceContactActionMethod, customerID: number): Promise<void> {
    await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.REJECT, pageID, {
      method,
      audienceID,
      customerID,
      userID,
    });
  }

  async getAudienceAssignee(pageID: number, audienceID: number): Promise<number> {
    return await getAudienceAssignee(PlusmarService.readerClient, pageID, audienceID);
  }
  async upsertAudienceReferral(audience: IAudience, referral: MessageReferral): Promise<boolean> {
    const audienceReferral = await updateAudienceReferral(PlusmarService.writerClient, audience.id, audience.page_id, referral);
    return isEmpty(audienceReferral) ? false : true;
  }

  async getAudienceHistories(pageID: number, filters: ITableFilter, { start: startDate, end: endDate }: { start: string; end: string }): Promise<IAudienceHistory[]> {
    const { search, currentPage, pageSize, reasonID } = filters;

    const searchQuery = search ? `%${search.toLocaleLowerCase()}%` : null;
    const page: number = (currentPage - 1) * pageSize;

    const _startDate = getDateByUnitStartOrEnd(startDate, 'START');
    const _endDate = getDateByUnitStartOrEnd(endDate, 'END');

    const audienceHistories = await getAudienceHistoriesData(PlusmarService.readerClient, pageID, searchQuery, reasonID, page, pageSize, _startDate, _endDate);

    const userList = await this.userService.getUserList(pageID);

    const result = audienceHistories.map((item) => {
      const open = userList.find((user) => user.userID === Number(item.open_by));
      item.open_by = open?.userAlias || open?.userName;

      const close = userList.find((user) => user.userID === Number(item.close_by));
      item.close_by = close?.userAlias || close?.userName;

      const assign = userList.find((user) => user.userID === Number(item.assignee));
      item.assignee = assign?.userAlias || assign?.userName;
      return item;
    });

    if (result.length > 0) return result;
    else {
      return [];
    }
  }

  async getAudienceHistoryByID(pageID: number, audienceID: number): Promise<IAudienceHistorySingleRow> {
    const reason = await getAudienceHistoryByIDData(PlusmarService.readerClient, pageID, audienceID);
    if (reason.length > 0) {
      return reason[0];
    } else {
      return null;
    }
  }

  async getChildAudienceByAudienceId(audienceID: number, pageID: number): Promise<IAudience> {
    if (audienceID) {
      return await getChildAudienceByAudienceId(PlusmarService.readerClient, audienceID, pageID);
    } else {
      return {} as IAudience;
    }
  }

  async updateAudience(PSID: string, pageID: number, domain: AudienceDomainType, status: AudienceDomainStatus, userID: number): Promise<IAudience> {
    // !! HIGH ALERT !!
    const customer = await getCustomerByPSID(PlusmarService.readerClient, PSID, pageID);
    if (customer) {
      let audience = await getAudienceByCustomerID(PlusmarService.readerClient, customer.id, pageID);
      if (!audience) {
        audience = await addCustomerToAudience(PlusmarService.readerClient, customer.id, pageID, domain, status);
        await updateCustomerUpdatedAt(pageID, customer.id, PlusmarService.writerClient);
        await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID: audience.id, currentAudience: null, updatedAudience: audience });
      }
      return audience;
    }
  }

  async getAudienceByCustomerID(pageID: number, customerID: number): Promise<IAudience> {
    return await getAudienceByCustomerID(PlusmarService.readerClient, customerID, pageID);
  }

  async updateAudiencePageIDByID(audienceID: number, pageIDNew: number, pageIDCurrent: number): Promise<IAudience> {
    return await updateAudiencePageIDByID(PlusmarService.writerClient, audienceID, pageIDNew, pageIDCurrent);
  }

  async getCustomerByAudienceID(audienceID: number, pageID: number): Promise<ICustomerTemp> {
    return await getCustomerByAudienceID(PlusmarService.writerClient, audienceID, pageID);
  }

  // * Auto set Audience state with (in-out) message
  async autoSetAudienceStatus(payload: IPayload, audience: IAudience, isInbox: boolean): Promise<void> {
    const allowSetStatus = [AudienceDomainStatus.INBOX.toString(), AudienceDomainStatus.COMMENT.toString(), AudienceDomainStatus.LIVE.toString()];
    if (audience.domain === AudienceDomainType.AUDIENCE && allowSetStatus.includes(audience.status.toString()) && isInbox) {
      const _AUDIENCE = AudienceDomainType.AUDIENCE;
      const _FOLLOW = AudienceDomainStatus.FOLLOW;
      await this.updateAudienceStatus(payload, audience.id, _AUDIENCE, _FOLLOW);
    } else {
      if (!audience.assigneeID && payload.userID) {
        // Assign Assignee to current Audience with or without active messageTrack as Assginee mode
        if (payload.userID !== null) await this.audienceContactService.setAudienceAssignee(payload.pageID, audience.id, payload.userID);
      }

      if (audience.is_notify) {
        const OFF = false;
        audience.page_id = payload.pageID;
        const togglerAudience = await this.notificationService.toggleAudienceNotification(audience, OFF);
        if (togglerAudience.parent_id === null) {
          await this.notificationService.toggleChildAudienceNotification(audience, OFF);
          const { customer_id, page_id } = audience || {};
          await updateCustomerUpdatedAt(page_id, +customer_id, PlusmarService.writerClient);
        } else {
          audience.id = togglerAudience.parent_id;
          await this.notificationService.toggleAudienceNotification(audience, OFF);
        }
      }
    }

    return;
  }

  updateAudienceStatus = async ({ pageID, name, userID }: IPayload, audienceID: number, domain: AudienceDomainType, status: AudienceDomainStatus): Promise<IAudience> => {
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const { domain: previousDomain, status: previousStatus } = audience || {};
    await this.changeStatusLog(audienceID, pageID, `${previousStatus}_TO_${status}`, name, Number(userID), audience.name);
    const turnOffNotify = false;
    const audienceParam = {
      id: audienceID,
      page_id: pageID,
    } as IAudience;

    await this.notificationService.toggleAudienceNotification(audienceParam, turnOffNotify);
    const updatedAudience = await updateAudienceDomainStatusByID(PlusmarService.writerClient, domain, status, pageID, audienceID);

    if (domain === AudienceDomainType.AUDIENCE && status === AudienceDomainStatus.FOLLOW) {
      await updateAudienceUserOpen(PlusmarService.writerClient, pageID, audienceID, userID);

      if (audience.assigneeID === null) {
        if (userID !== null) await this.audienceContactService.setAudienceAssignee(pageID, audienceID, userID);
      }
    }

    await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, PlusmarService.writerClient);
    await this.audienceStepService.logAudienceHistory({ pageID, audienceID: audienceID, userID: userID !== null ? +userID : null, currentAudience: audience, updatedAudience });
    return updatedAudience;
  };

  // Update Purchas Order Step Service -> PurchaseOrderPipelineService
  updateFollowAudienceStatus = async (
    pageID: number,
    userID: number,
    updateToNextStep: boolean,
    orderID: number,
    subscriptionID: string,
    pgClient = PlusmarService.writerClient,
  ): Promise<IAudience> => {
    const { audience_id: audienceID } = await getAudienceIDOfOrder(pgClient, pageID, orderID);
    const audience = await getAudienceFollow(pgClient, pageID, audienceID);

    if (audience) {
      if (updateToNextStep) {
        const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

        await this.purchaseOrderPipelineService.updateNextPurchaseOrderStatus(pageID, audience.id, subscriptionID, client);

        const newAudience = await this.audienceStepService.createOrUpdateStep(
          {
            audience_id: audienceID,
            page_id: pageID,
            user_id: userID,
          } as IAudienceStepInput,
          pgClient,
        );

        await PostgresHelper.execBatchCommitTransaction(client);

        if (!isEmpty(newAudience)) {
          return newAudience;
        } else {
          return await getAudienceFollow(pgClient, pageID, audienceID);
        }
      } else {
        return await this.audienceStepService.backToPreviousStep({
          audience_id: audienceID,
          page_id: pageID,
          user_id: userID,
        });
      }
    }
    return audience;
  };

  createNewAudience = async (
    customerID: number,
    pageID: number,
    domain: AudienceDomainType | string,
    status: AudienceDomainStatus | string,
    readStatus: NotificationStatus,
    userID: number,
  ): Promise<IAudience> => {
    let lastPlatformActivityDate = getUTCTimestamps();
    const audience = await getLastAudienceByCustomerID(pageID, customerID, PlusmarService.readerClient);
    if (!isEmpty(audience)) {
      // Noted : This will give a previous activity time of customer for get the lastest audience (has sort logic for get function)

      const preventStatus = [AudienceDomainStatus.CLOSED, AudienceDomainStatus.REJECT];
      if (!preventStatus.includes(<AudienceDomainStatus>audience[0].status)) {
        throw new Error('AUDIENCE_STILL_INTACT');
      }

      if (!isEmpty(audience)) {
        // add 1 more second to prevent duplicate update time and fetch the wrong index on UI
        lastPlatformActivityDate = parseTimestampToDayjs(audience[0].last_platform_activity_date).add(1, 'second').format();
      }
    }

    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const newAudience = await addCustomerToAudienceTransaction(client, customerID, pageID, domain, status, readStatus, lastPlatformActivityDate);
    if (userID !== null) await this.audienceContactService.setAudienceAssignee(pageID, newAudience.id, userID, client);

    await this.audienceStepService.logAudienceHistory(
      {
        pageID,
        audienceID: newAudience.id,
        userID: userID !== null ? +userID : null,
        currentAudience: audience[0], // GET PREVIOUS AUDIENCE
        updatedAudience: newAudience,
      },
      client,
    );
    await updateAudienceUserOpen(client, pageID, newAudience.id, userID);
    await updateCustomerUpdatedAt(pageID, customerID, client);

    await PostgresHelper.execBatchCommitTransaction(client);

    await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.FOLLOW, pageID, {
      method: AudienceContactActionMethod.TRIGGER_UPDATE,
      audienceID: newAudience.id,
      customerID: newAudience.customer_id,
      userID,
    });

    return newAudience;
  };

  getIsAudienceValidForProductLink = async (audienceID: number, pageID: number): Promise<boolean> => {
    // ! MAY NOT BE USED ANYMORE
    const status = await getIsAudienceValidForProductLink(PlusmarService.readerClient, audienceID, pageID);
    return status;
  };

  getAudienceNotActive = async (ID: number, pageID: number): Promise<IAudience[]> => {
    return await getAudienceNotActive(PlusmarService.readerClient, ID, pageID);
  };
  getAudienceAndInsertOnNotExist = async (
    customerID: number,
    pageID: number,
    domain: AudienceDomainType | string,
    status: AudienceDomainStatus | string,
    readStatus: NotificationStatus,
  ): Promise<IAudience> => {
    return await getAudienceAndInsertOnNotExist(PlusmarService.writerClient, customerID, pageID, domain, status, readStatus);
  };

  /*   getAudienceByCustomerID = async (ID: number): Promise<IAudience> => {
    return await getAudienceByCustomerID(PlusmarService.readerClient, ID);
  }; */

  changeStatusLog = async (
    audience_id: number,
    pageID: number,
    description: string,
    user_name: string,
    user_id: number,
    subject: string,
    type: LogType = 'Read new message',
    action: LogAction = 'Update',
  ): Promise<void> => {
    await this.logService.addLog(
      {
        user_id,
        type,
        action,
        description,
        subject,
        audience_id,
        audience_name: subject,
        user_name,
        created_at: getUTCMongo(),
      } as ILogInput,
      pageID,
    );
  };

  getAudienceByID = async (userID: number, ID: number, { pageID }: IPayload, token: string): Promise<IAudience> => {
    let agentList: IAgent[];
    const audience = await getAudienceByID(PlusmarService.readerClient, ID, pageID);
    const user = await getUserByIDAndPageID(PlusmarService.readerClient, userID, pageID);
    if (token) {
      agentList = await this.getAudienceAgentList(token, pageID, user, ID);
    }

    return { ...audience, agentList: agentList };
  };

  getAudienceAgentList = async (token: string, pageID: number, user: IUserCredential, audienceId: number): Promise<IAgent[]> => {
    const key = `message_active:${pageID}`;
    const agent = {
      user_id: user.id.toString(),
      name: user.alias !== null ? user.alias : user.name,
      // alias: user.alias,
      picture: user.profile_img,
      audience_id: audienceId?.toString(),
      token: token,
      create_at: new Date(),
    } as IAgent;
    await this.audienceContactService.removeExpiredRedis(key);
    const pageAgentList = await getAgentsFromRedis(PlusmarService.redisStoreClient, key);

    const agentInList = sortBy(pageAgentList, 'create_at').find((x) => {
      return x.user_id === user.id.toString() && x.token === token;
    });
    if (agentInList) {
      const isAgentChangeAudience = agentInList.audience_id !== audienceId?.toString();
      if (isAgentChangeAudience) {
        this.agentChangeAudience(pageAgentList, token, key, agent);
      }
    } else {
      PlusmarService.redisStoreClient.LPUSH(key, JSON.stringify(agent));
    }

    PlusmarService.redisStoreClient.LTRIM(key, 0, 19);
    const agentList = await getAgentsFromRedis(PlusmarService.redisStoreClient, key);

    const onAudienceRedisUpdateSubscription = { onAudienceRedisUpdateSubscription: { agentList, pageID } };
    await PlusmarService.pubsub.publish(AUDIENCE_REDIS_UPDATE, onAudienceRedisUpdateSubscription);
    return agentList;
  };

  agentChangeAudience = (pageAgentList: IAgent[], token: string, key: string, agent: IAgent): void => {
    const newAgentList = sortBy(pageAgentList, 'create_at').filter((x) => x.token !== token);
    PlusmarService.redisStoreClient.DEL(key);
    newAgentList.map((x) => {
      PlusmarService.redisStoreClient.LPUSH(key, JSON.stringify(x));
    });
    PlusmarService.redisStoreClient.LPUSH(key, JSON.stringify(agent));
  };

  getSingleAudienceByID = async (ID: number, pageID: number): Promise<IAudience> => {
    return await getAudienceByID(PlusmarService.readerClient, ID, pageID);
  };

  deleteAudienceById = async (audienceIds: number[], pageID: number, userID: number): Promise<IAudience[]> => {
    return await Promise.all(
      audienceIds.map(async (id) => {
        const currentAudience = await getAudienceStatusById(PlusmarService.readerClient, id, pageID);
        const updatedAudience = await updateAudienceStatusByID(PlusmarService.writerClient, id, pageID, AudienceDomainStatus.CLOSED);
        await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, PlusmarService.writerClient);
        await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID: id, currentAudience, updatedAudience });
        return updatedAudience;
      }),
    );
  };

  moveToLeads = async (audienceIds: number[], pageID: number, userID: number): Promise<IAudience[]> => {
    return await Promise.all(
      audienceIds.map(async (id) => {
        const currentAudience = await this.getSingleAudienceByID(id, pageID);
        const updatedAudience = await updateAudienceDomainStatusByID(PlusmarService.writerClient, AudienceDomainType.LEADS, AudienceDomainStatus.FOLLOW, pageID, id);
        await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, PlusmarService.writerClient);
        await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID: id, currentAudience, updatedAudience });
        return updatedAudience;
      }),
    );
  };

  moveToCustomers = async (audienceIds: number[], pageID: number, userID: number): Promise<IAudience[]> => {
    return await Promise.all(
      audienceIds.map(async (id) => {
        const currentAudience = await this.getSingleAudienceByID(id, pageID);
        const updatedAudience = await updateAudienceDomainStatusByID(PlusmarService.writerClient, AudienceDomainType.CUSTOMER, AudienceDomainStatus.FOLLOW, pageID, id);
        await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, PlusmarService.writerClient);
        await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID: id, currentAudience, updatedAudience });
        return updatedAudience;
      }),
    );
  };

  updateIncomingAudienceStatus = async (audienceID: number, pageID: number, status: AudienceDomainStatus): Promise<void> => {
    await updateAudienceDomainStatusByID(PlusmarService.writerClient, AudienceDomainType.AUDIENCE, status, pageID, audienceID);
  };

  getLeadsListTotal = async (filter: LeadsListStatsInput, pageID: number): Promise<{ follow: number; finished: number }> => {
    return await getLeadsListTotal(PlusmarService.readerClient, filter, pageID);
  };

  // number for menu bubble
  getAudienceTotal = async (pageID: number): Promise<{ audience_total: number }> => {
    return await getAudienceListTotal(PlusmarService.readerClient, pageID);
  };

  getAudienceSLAList = async (query: IAliases, pageID: number, type: EPageMessageTrackMode): Promise<IAudienceWithCustomer[]> => {
    query.page = (query.currentPage - 1) * query.pageSize;
    query.pageID = pageID;
    query.tagList = query.tags.length ? PostgresHelper.joinInQueries(query.tags.map((tag) => tag.id)) : null;
    if (query.noTag) query.tagList = null;
    if (query.exceedSla) {
      const { alertSLA, exceedSLA } = await this.customerSLAService.getSLATimes(pageID);
      query.alertTime = alertSLA;
      query.exceedTime = exceedSLA;
    }

    query.search = query.search ? `%${query.search.toLocaleLowerCase()}%` : null;
    let result: IAudienceWithCustomer[] = [];

    switch (type) {
      case EPageMessageTrackMode.TRACK_BY_ASSIGNEE: {
        result = await getAssignAudienceSLAList(PlusmarService.readerClient, query);
        break;
      }
      case EPageMessageTrackMode.TRACK_BY_TAG: {
        result = await getAudienceSLAList(PlusmarService.readerClient, query);
        break;
      }
    }

    return Array.isArray(result) ? result : [];
  };

  getAudienceList = async (query: IAliases, pageID: number): Promise<IAudienceWithCustomer[]> => {
    let fetchLead = false;
    query.page = (query.currentPage - 1) * query.pageSize;
    query.pageID = pageID;
    query.tagList = query.tags.length ? PostgresHelper.joinInQueries(query.tags.map((tag) => tag.id)) : null;
    if (query.noTag) query.tagList = null;
    if (query.exceedSla) {
      query.exceedTime = await this.customerSLAService.getSLAExceedTimes(pageID);
    }

    const domains = PostgresHelper.joinInQueries(query.domain);
    if (query.status === 'orders') query.status = null;
    else if (query.status === 'activity') query.status = 'activity';
    else if (query.status === 'unread') query.status = 'unread';
    else if (query.status === 'lead') {
      fetchLead = true;
      query.status = null;
    } else query.status = query.status ? (query.status.toLowerCase() === 'all' ? null : query.status.toUpperCase()) : null;

    query.search = query.search ? `%${query.search.toLocaleLowerCase()}%` : null;
    const result: IAudienceWithCustomer[] = await getAudienceListStatusFollow(PlusmarService.readerClient, query, domains, fetchLead);
    return Array.isArray(result) ? result : [];
  };

  getAudienceStatsService = async (pageID: number): Promise<AudienceStats> => {
    const result = await getAudienceStats(PlusmarService.readerClient, pageID);
    return result;
  };
  getAudienceAllStatsService = async (pageID: number, { searchText: search, tags, noTag }: IAudienceMessageFilter): Promise<AudienceStats> => {
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    const result = await getAudienceAllStats(PlusmarService.readerClient, pageID, searchText, searchTags, noTag);
    return result;
  };

  getAudienceListWithPurchaseOrder = async (query: IAliases, paidType: PaidFilterEnum, pageID: number): Promise<IAudienceWithPurchasing[]> => {
    if (!isEmpty(query)) {
      if (isEmpty(query.search)) query.search = null;
      query.pageID = pageID;
      let result: IAudienceWithPurchasing[];

      switch (query.status) {
        case CustomerDomainStatus.FOLLOW:
          result = await getAudienceListWithPurchaseOrderStatusFollow(PlusmarService.readerClient, query);
          break;
        case CustomerDomainStatus.WAITING_FOR_PAYMENT:
          {
            const { pageID, status } = query;
            const audienceResult = await getAudienceListWithPurchaseOrderStatusWaitForPayment(PlusmarService.readerClient, query);
            const marketOrderResult = await getMarketPlacePurchaseOrderStatusWaitForPayment(PlusmarService.readerClient, pageID, status);
            let mergeResult = [...audienceResult, ...marketOrderResult];
            mergeResult = orderBy(mergeResult, ['created_at'], ['desc']);
            result = mergeResult;
          }
          break;
        case CustomerDomainStatus.CONFIRM_PAYMENT:
          result = await getAudienceListWithPurchaseOrderStatusConfirmPayment(PlusmarService.readerClient, query);
          break;
        case CustomerDomainStatus.WAITING_FOR_SHIPMENT:
          {
            const { pageID, status } = query;
            const audienceResult = await getAudienceListWithPurchaseOrderStatusWaitForShipment(PlusmarService.readerClient, query);
            const marketOrderResult = await getMarketPlacePurchaseOrderStatusWaitForShipment(PlusmarService.readerClient, pageID, status);
            let mergeResult = [...audienceResult, ...marketOrderResult];
            mergeResult = orderBy(mergeResult, ['created_at'], ['desc']);
            result = mergeResult;
          }
          break;
        case CustomerDomainStatus.CLOSED:
          query.page = (query.currentPage - 1) * query.pageSize;
          if (query.search === null) {
            result = await getAudienceListWithPurchaseOrderStatusClosed(PlusmarService.readerClient, query, paidType);
          } else {
            query.search = `%${query.search.toLowerCase()}%`;
            result = await getAudienceListWithPurchaseOrderStatusClosedBySearch(PlusmarService.readerClient, query, paidType);
          }
          break;
        default:
          result = await getAudienceListWithPurchaseOrder(PlusmarService.readerClient, query);
          break;
      }
      return Array.isArray(result) ? result : [];
    }
    return [];
  };

  getAudienceListWithLeads = async (query: LeadsFilters): Promise<IAudienceWithLeads[]> => {
    if (isEmpty(query.search)) query.search = null;
    let data = [] as IAudienceWithLeads[];
    const skip: number = (query.currentPage - 1) * query.pageSize;
    switch (query.status) {
      case LeadsDomainStatus.FOLLOW:
        data = await getAudienceListWithLeadsFollow(PlusmarService.readerClient, query, skip);
        break;
      case LeadsDomainStatus.FINISHED:
        if (query.search !== null) query.statusBy = getLeadSubmissionStatusEnums(query.search);
        data = await getAudienceListWithLeadsFinished(PlusmarService.readerClient, query, skip);

        break;
    }
    return data;
  };

  getAudienceListCounter = async (pageID: number): Promise<AudienceCounter> => {
    const list = await countAudienceStatus(PlusmarService.readerClient, pageID);
    if (!isEmpty(list)) {
      return list;
    } else {
      return { total: 0, step1: 0, step2: 0, step3: 0, step4: 0, step5: 0 };
    }
  };

  rejectAudience = async (payload: IPayload, audienceID: number, route: AudienceViewType) => {
    const { pageID, name: AdminName, userID: AdminID } = payload;

    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const audience = await getAudienceStatusById(client, audienceID, pageID);

    if (!isEmpty(audience)) {
      await this.leadsService.checkLeadFollowBeforeCloseAudience(pageID, audienceID);

      await setAudienceOffTimes(client, pageID, audience.id, false);
      const { domain } = audience;

      switch (domain) {
        case AudienceDomainType.CUSTOMER: {
          if (route === AudienceViewType.ORDER) {
            await this.rejectOrderAudience(audienceID, pageID, AdminID);
          }
          await this.updateContactOnRejected(pageID, audienceID, AdminID, AudienceContactActionMethod.AUDIENCE_REJECTED, audience.customer_id);
          break;
        }
        case AudienceDomainType.AUDIENCE:
          {
            const currentAudience = await getAudienceStatusById(client, audienceID, pageID);
            const updatedAudience = await updateAudienceDomainStatusByID(
              PlusmarService.writerClient,
              AudienceDomainType.AUDIENCE,
              EnumPurchaseOrderStatus.REJECT,
              pageID,
              audienceID,
            );
            await setAudienceNotifyOnClosed(PlusmarService.writerClient, 'READ', false, pageID, audienceID);
            await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, client);

            await this.audienceStepService.logAudienceHistory({ pageID, userID: AdminID, audienceID, currentAudience, updatedAudience });

            const childAudience = await getChildAudienceStatusById(client, audienceID, pageID);
            if (!isEmpty(childAudience)) {
              await this.updateChildAudience(client, pageID, childAudience, AdminID);
            }

            // fetch new list on AudienceContactComponent
            await this.updateContactOnRejected(pageID, audienceID, AdminID, AudienceContactActionMethod.AUDIENCE_REJECTED, currentAudience.customer_id);
          }
          break;
        default:
          break;
      }

      const audienceParam = {
        id: audienceID,
        page_id: pageID,
      } as IAudience;
      const OFF = false;
      const customer = await getCustomerByAudienceID(client, audienceID, pageID);
      await this.notificationService.toggleAudienceNotification(audienceParam, OFF);

      const subjectName = getCustomerNameByPlatform(customer);
      await this.changeStatusLog(audienceID, pageID, `${domain.toUpperCase()}_TO_REJECTED`, AdminName, Number(AdminID), subjectName, 'Reject audience');

      await updateAudienceUserClose(client, pageID, audienceID, payload.userID);

      if (audience.assigneeID === null) {
        if (AdminID !== null) await this.audienceContactService.setAudienceAssignee(pageID, audienceID, AdminID);
      }

      await PostgresHelper.execBatchCommitTransaction(client);
    }
    return { status: 200, message: 'OK' };
  };

  closeAudience = async ({ pageID, name: AdminName, userID: AdminID }: IPayload, audienceID: number): Promise<IHTTPResultMessage> => {
    const audience = await getAudienceStatusById(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      await this.leadsService.checkLeadFollowBeforeCloseAudience(pageID, audienceID);

      const { domain } = audience;
      const customer = await getCustomerByAudienceID(PlusmarService.readerClient, audienceID, pageID);
      const subjectName = getCustomerNameByPlatform(customer);
      await this.changeStatusLog(audience.id, pageID, `${domain.toUpperCase()}_TO_CLOSE`, AdminName, Number(AdminID), subjectName, 'Close audience');
      switch (domain) {
        case AudienceDomainType.AUDIENCE: {
          const updatedAudience = await updateAudienceDomainStatusByID(PlusmarService.writerClient, AudienceDomainType.AUDIENCE, CustomerDomainStatus.CLOSED, pageID, audienceID);
          await setAudienceNotifyOnClosed(PlusmarService.writerClient, 'READ', false, pageID, audienceID);
          await updateAudienceUserClose(PlusmarService.writerClient, pageID, audienceID, AdminID);
          await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, PlusmarService.readerClient);
          await setAudienceOffTimes(PlusmarService.writerClient, pageID, audience.id, false);
          if (audience.assigneeID === null) {
            if (AdminID !== null) await this.audienceContactService.setAudienceAssignee(pageID, audienceID, AdminID);
          }

          await this.audienceStepService.logAudienceHistory({
            pageID,
            userID: AdminID,
            audienceID: audience.id,
            currentAudience: audience,
            updatedAudience,
          });
          break;
        }
        default:
          break;
      }
    }
    const audienceParam = {
      id: audienceID,
      page_id: pageID,
    } as IAudience;
    const OFF = false;
    await this.notificationService.toggleAudienceNotification(audienceParam, OFF);
    await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.CLOSE, pageID, {
      method: AudienceContactActionMethod.AUDIENCE_CLOSED,
      audienceID: audienceID,
      customerID: audience.customer_id,
      userID: AdminID,
    });
    return { status: 200, message: 'OK' };
  };

  async rejectOrderAudience(audienceID: number, pageID: number, userID: number): Promise<void> {
    // its follow customer
    const pipeline = await this.pipelineService.checkPurchaseOrderPipelineByAudienceID(pageID, audienceID);
    const currentAudience = await getAudienceStatusById(PlusmarService.readerClient, audienceID, pageID);
    const { order_id: orderID } = pipeline;

    const { is_paid: isAlreadyPaid } = await getPurchasingOrderByPurchasingOrderID(PlusmarService.readerClient, orderID);
    if (isAlreadyPaid) throw new Error('CANT_REJECT_AUDIENCE_DUE_TO_PAID_ORDER');

    const rejectType = EnumPurchaseOrderStatus.REJECT;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    await updatePurchasingStatusTransaction(client, rejectType, pageID, audienceID, orderID);

    const updatedAudience = await updateAudienceDomainStatusByIDTransaction(client, AudienceDomainType.CUSTOMER, rejectType, pageID, audienceID);
    await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, client);

    await releaseReservedPurchaseOrderItemBySingleOrderID(client, orderID, pageID);

    await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID, currentAudience, updatedAudience });

    const childAudience = await getChildAudienceStatusById(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(childAudience)) {
      await this.updateChildAudience(client, pageID, childAudience, userID);
    }

    await PostgresHelper.execBatchCommitTransaction(client);
  }

  async updateChildAudience(client: Pool, pageID: number, childAudience: IAudience, userID: number): Promise<void> {
    const rejectType = EnumPurchaseOrderStatus.REJECT;
    const updatedChild = await updateAudienceDomainStatusByID(client, AudienceDomainType.LEADS, rejectType, pageID, childAudience.id);
    await updateAudienceUserClose(client, pageID, childAudience.id, userID);
    await updateCustomerUpdatedAt(pageID, +updatedChild.customer_id, client);
    await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID: childAudience.id, currentAudience: childAudience, updatedAudience: updatedChild });
    await deleteReferral(client, childAudience.id);
  }

  async rejectChildLeadAudience(audienceID: number, pageID: number, userID: number): Promise<void> {
    const rejectType = EnumPurchaseOrderStatus.REJECT;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const childAudience = await getChildAudienceStatusById(PlusmarService.readerClient, audienceID, pageID);

    const updatedChild = await updateAudienceDomainStatusByID(client, AudienceDomainType.LEADS, rejectType, pageID, childAudience.id);
    await updateCustomerUpdatedAt(pageID, +updatedChild.customer_id, PlusmarService.readerClient);
    await this.audienceStepService.logAudienceHistory({ pageID, userID, audienceID: childAudience.id, currentAudience: childAudience, updatedAudience: updatedChild });
    await PostgresHelper.execBatchCommitTransaction(client);
  }

  async activateCustomer(pageID: number, customerID: number): Promise<void> {
    await activateCustomer(PlusmarService.writerClient, pageID, customerID);
  }

  getForms = async (pageID: number, filters: MessageTemplatesFilters): Promise<FormTemplates[]> => {
    const { currentPage = 1, orderBy, orderMethod, search, pageSize = 10 } = filters;

    const page = (currentPage - 1) * pageSize;
    const aliases = {
      pageID,
      orderBy,
      orderMethod,
      currentPage,
      search: search ? `%${search}%` : null,
      pageSize,
      page,
    };

    const searchBy = ['name'];
    const searchQuery = search ? `AND ${searchBy.map((column, i) => 'UPPER(lf.name) LIKE UPPER(:search) ').join(' ')}` : '';

    const orderQuery = Array.isArray(orderBy) ? orderBy.map((i) => `${i} ${orderMethod.toUpperCase()} NULLS LAST`).join(', ') : `${orderBy} ${orderMethod}  NULLS LAST`;

    const list = await getForms(PlusmarService.readerClient, aliases, searchQuery, orderQuery, pageID);
    return !isEmpty(list) ? list : [];
  };

  getSocials = async (pageID: number): Promise<Socials> => {
    const list = await getSocials(PlusmarService.readerClient, pageID);
    return list;
  };

  updateSocials = async (pageID: number, { social_line, social_shopee, social_lazada, social_facebook }: Socials): Promise<IHTTPResult> => {
    const aliases = {
      pageID,
      social_line,
      social_shopee,
      social_lazada,
      social_facebook,
    };
    await updateSocials(PlusmarService.readerClient, aliases);
    return { status: 200, value: '' } as IHTTPResult;
  };

  getUserMadeLastChangesToStatus = async (audienceID: number, pageID: number): Promise<UserMadeLastChangesToStatus> => {
    const aliases = {
      pageID,
      audienceID,
    };
    const result = await getUserMadeLastChangesToStatus(PlusmarService.readerClient, aliases);
    return Array.isArray(result)
      ? result[0]
      : {
          id: null,
          name: null,
          created_at: null,
        };
  };

  // MESSAGE TEMPLATES
  getTemplatesByShortcut = async (shortcut: string, type: string, pageID: number, subscriptionID: string): Promise<Message[]> => {
    const aliases = {
      pageID,
      shortcut: shortcut.length > 1 ? `%${shortcut}%` : null,
    };

    if (type === 'images') {
      const searchQuery = shortcut.length > 1 ? 'AND UPPER(shortcut) LIKE UPPER(:shortcut)' : '';
      const imagesSets = await getImageSetsByShortcut(PlusmarService.readerClient, aliases, searchQuery);
      imagesSets?.map((imageSet) => imageSet.images.map((image) => (image.url = transformMediaLinkString(image.url, environmentLib.filesServer, subscriptionID))));
      return imagesSets;
    }

    if (type === 'messages') {
      const searchQuery = shortcut.length > 1 ? "AND UPPER(messages->>'shortcut') LIKE UPPER(:shortcut)" : '';
      const messageSets = await getTemplatesByShortcut(PlusmarService.readerClient, aliases, searchQuery);
      return messageSets;
    }
  };

  getMessageTemplates = async (pageID: number, filters: MessageTemplatesFilters): Promise<MessageTemplates[]> => {
    const { currentPage = 1, orderBy, orderMethod, search = '', pageSize = 10 } = filters;

    const page = (currentPage - 1) * pageSize;
    const aliases = {
      pageID,
      orderBy,
      orderMethod,
      currentPage,
      search: search ? `%${search}%` : null,
      pageSize,
      page,
    };

    const searchBy = ['text', 'shortcut'];
    const searchQuery = search
      ? `AND (${searchBy.map((column, i) => `UPPER(messages->>'${column}'::text) LIKE UPPER(:search) ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})`
      : '';

    const orderQuery = Array.isArray(orderBy) ? orderBy.map((i) => `${i} ${orderMethod.toUpperCase()} NULLS LAST`).join(', ') : `${orderBy} ${orderMethod}  NULLS LAST`;
    const list = await getMessageTemplates(PlusmarService.readerClient, pageID, aliases, searchQuery, orderQuery);

    return !isEmpty(list) ? list : [];
  };

  addMessageTemplate = async (pageID: number, message: Message): Promise<IHTTPResult> => {
    try {
      const list = await addMessageTemplate(PlusmarService.readerClient, pageID, message);
      return Array.isArray(list) && !list.length
        ? { status: 200, value: message.id ? 'scc_upd_msg_tpl' : 'scc_add_msg_tpl' }
        : { status: 403, value: message.id ? 'err_upd_msg_tpl' : 'err_add_msg_tpl' };
    } catch (error) {
      if (error.toString().includes('err_add_alr_exist_msg_tpl')) return { status: 403, value: 'err_add_alr_exist_msg_tpl' };
      return { status: 403, value: 'err_unknown' };
    }
  };

  deleteMessageTemplate = async (pageID: number, id: number): Promise<IHTTPResult> => {
    const list = await deleteMessageTemplate(PlusmarService.readerClient, pageID, id);
    return Array.isArray(list) && !list.length ? { status: 200, value: 'scc_del_msg_tpl' } : { status: 403, value: 'err_add_msg_tpl' };
  };

  // IMAGE SETS TEMPLATES

  getImageSets = async (pageID: number, filters: MessageTemplatesFilters, subscriptionID: string): Promise<ImageSetTemplate[]> => {
    const { currentPage = 1, orderBy, orderMethod, search = '', pageSize = 10 } = filters;

    const page = (currentPage - 1) * pageSize;
    const aliases = {
      pageID,
      orderBy,
      orderMethod,
      currentPage,
      search: search ? `%${search}%` : null,
      pageSize,
      page,
    };

    const searchBy = ['shortcut'];
    const searchQuery = search ? `AND (${searchBy.map((column, i) => `UPPER(${column}::text) LIKE UPPER( :search ) ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})` : '';

    const list = await getImageSets(PlusmarService.readerClient, pageID, aliases, searchQuery);
    list?.forEach((imageSet) => imageSet?.images?.map((image) => (image.url = transformMediaLinkString(image?.url, environmentLib.filesServer, subscriptionID))));
    return !isEmpty(list) ? list : [];
  };

  /**
   *
   *
   * @param {number} pageID
   * @param {ImageSetTemplateInput} object will be uploaded, then link will be send to Facebook, then attachment_id will be saved to database in order to improve messaging
   * @param {string} bucketName from environment file
   * @param {string} pageUUID from context
   * @param {string} FB access token
   * @param {string} FACEBOOK_MESSAGE_ATTACHMENT_URL from environment file
   * @memberof AudienceService
   */
  addImageSets = async (pageID: number, images_set: ImageSetTemplateInput, pageUUID: string, access_token: string, subscriptionID: string): Promise<IUploadImageSetResult> => {
    const token = cryptoDecode(access_token, PlusmarService.environment?.pageKey);

    const savedSet = await this.fileService.saveImageSetToStorage(pageID, images_set, subscriptionID, pageUUID, EnumFileFolder.IMAGE_SET, pageID.toString());

    try {
      const { failedList, list } = await this.fileService.uploadAttachmentSets(savedSet, token, subscriptionID);
      if (list.length > 0) {
        const imageset = { ...images_set, images: list };
        imageset?.images?.forEach((image) => {
          image.url = transformImageURlFormat(image.url);
        });
        const result = await addImageSets(PlusmarService.readerClient, pageID, imageset);

        return Array.isArray(result) && !result.length
          ? { status: 200, value: images_set.id ? 'img_set_upd_scc' : 'img_set_add_scc', failedList: failedList }
          : { status: 403, value: images_set.id ? 'img_set_upd_err' : 'img_set_add_err', failedList: failedList };
      } else {
        return { status: 403, value: images_set.id ? 'img_set_upd_err' : 'img_set_add_err', failedList: failedList };
      }
    } catch (error) {
      if (error.toString().includes('err_add_alr_exist_msg_tpl')) return { status: 403, value: 'err_add_alr_exist_msg_tpl' };
      return { status: 403, value: 'err_unknown' };
    }
  };

  deleteImageSets = async (pageID: number, id: number): Promise<IHTTPResult> => {
    const list = await deleteImageSets(PlusmarService.readerClient, pageID, id);
    return Array.isArray(list) && !list.length ? { status: 200, value: 'img_set_del_scc' } : { status: 403, value: 'img_set_del_err' };
  };

  deleteImageFromSet = async (pageID: number, set_id: number, image_index: number): Promise<IHTTPResult> => {
    const list = await deleteImageFromSet(PlusmarService.readerClient, pageID, set_id, image_index);
    return Array.isArray(list) && !list.length ? { status: 200, value: 'img_set_del_scc' } : { status: 403, value: 'img_set_del_err' };
  };

  sendImageSetResultHandler = (result): IHTTPResult => {
    const allAdded = Array.isArray(result) && result.every((message) => message.message_id);
    const someFailed = Array.isArray(result) && result.some((message) => !message.message_id);
    const allFailed = Array.isArray(result) && result.every((message) => !message.message_id);

    if (allAdded) return { status: 200, value: 'img_set_send_scc' };
    if (someFailed) return { status: 500, value: 'img_set_add_some_err' };
    if (allFailed) return { status: 500, value: 'img_set_add_all_err' };

    return { status: 500, value: 'unknown_error' };
  };

  /**
   * Sends object with attachment_id to Facebook, messages will apear in chat itself
   *
   * @param {number} pageID
   * @param {{ url: string; attachment_id: string }} image
   * @param {IGQLContext} context
   * @param {string} psid
   * @memberof AudienceService
   */
  sendImageSet = async (
    image: { url: string; attachment_id: string; extension: string; filename: string },
    access_token: string,
    psid: string,
  ): Promise<IHTTPResult | IFacebookMessageResponse[] | any> => {
    const token = cryptoDecode(access_token, PlusmarService.environment?.pageKey);
    const type = (isImageByExtension(image.extension) ? 'image' : 'file') as IFacebookMessagePayloadTypeEnum.IMAGE;

    const buffer = await this.fileService.getBufferFormFileServer(image.url);
    const uploadResult = await this.fileService.uploadAttachmentFacebookFromBuffer(image.filename, image.extension, buffer, token);

    const result = await sendAttachment(token, uploadResult.attachmentID, { psid } as ICustomerTemp, type, image.url, image?.filename);
    return this.sendImageSetResultHandler(result);
  };

  setLastPlatformActivityDate = async (pageID: number, audienceID: number): Promise<IHTTPResult> => {
    try {
      const result = await setLastActivityPlatformDateByAudienceID(PlusmarService.readerClient, pageID, audienceID);
      return Array.isArray(result) && result.length ? { status: 200, value: 'scc_set_last_ac_date' } : { status: 403, value: 'err_set_last_ac_date' };
    } catch (error) {
      return { status: 403, value: 'err_set_lastactivity' };
    }
  };

  updateAudienceLatestSentBy = async (pageID: number, audienceID: number, sentBy: MessageSentByEnum): Promise<boolean> => {
    try {
      const isNotify = MessageSentByEnum[sentBy] === MessageSentByEnum.AUDIENCE;
      const sentByEnum = MessageSentByEnum[sentBy];
      await updateLatestSentBy(PlusmarService.writerClient, audienceID, pageID, isNotify, sentByEnum);
      return true;
    } catch (error) {
      return false;
    }
  };

  getAllAudienceByCustomerID = async (pageID: number, customerID: number, filters: ITableFilter): Promise<IAudience[]> => {
    const searchBy = ['status', 'reason'];
    const { search, currentPage, orderBy, orderMethod, pageSize, reasonID } = filters;
    const searchQuery = search
      ? ` ${searchBy.map((column, i) => `${i > 0 ? '' : 'WHERE'} UPPER(CAST(${column} AS TEXT)) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')}`
      : '';
    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    const result = await getAllAudienceByCustomerID(pageID, customerID, searchQuery, orderQuery, page, pageSize, reasonID, PlusmarService.readerClient);
    return Array.isArray(result) ? result : [];
  };

  getPaginationNumberByAudienceID = async (pageID: number, customerID: number, paginator: number, audienceID: number): Promise<{ pagination: number }> => {
    const pageSize = 10;
    const currentPage = paginator;
    const searchQuery = '';
    const orderQuery = ' last_platform_activity_date DESC NULLS LAST';
    const reasonID = -1;
    let pageNumber: number = (currentPage - 1) * pageSize;
    let results: IAudiencePagination[];
    let result = await getAllAudienceByCustomerID(pageID, customerID, searchQuery, orderQuery, pageNumber, pageSize, reasonID, PlusmarService.readerClient);
    results = result.filter((item) => item.id === audienceID);

    while (result.length > 0 && results.length <= 0) {
      if (results.length <= 0) {
        pageNumber += pageSize;

        result = await getAllAudienceByCustomerID(pageID, customerID, searchQuery, orderQuery, pageNumber, pageSize, reasonID, PlusmarService.readerClient);
        results = result.filter((item) => item.id === audienceID);
      } else {
        results[0].pagination = pageNumber;
      }
    }

    if (pageNumber > 0) results[0].pagination = Math.ceil(pageNumber / pageSize) + 1;
    else results[0].pagination = pageNumber + 1;

    return { pagination: results[0].pagination };
  };

  getLastAudienceByCustomerID = async (pageID: number, customerID: number): Promise<IAudience[]> => {
    const result = await getLastAudienceByCustomerID(pageID, customerID, PlusmarService.readerClient);
    return Array.isArray(result) ? result : [];
  };

  getAudienceLeadContext = async (pageID: number, audienceID: number): Promise<AudienceLeadContext> => {
    const result = await getAudienceLeadContext(PlusmarService.readerClient, pageID, audienceID);
    if (!isEmpty(result)) {
      return result[0];
    } else {
      return null;
      // throw new Error('Lead not found');
    }
  };

  getAudienceByCustomerIDIncludeChild = async (pageID: number, customerID: number, isChild = true): Promise<IAudience[]> => {
    const parentWhereQuery = isChild ? '' : 'AND parent_id IS NULL';
    return await getAudienceByCustomerIDIncludeChild(PlusmarService.readerClient, customerID, pageID, parentWhereQuery);
  };

  triggerAgentChanging = async (pageID: number): Promise<IHTTPResult> => {
    const key = `message_active:${pageID}`;
    await this.audienceContactService.removeExpiredRedis(key);
    const agentList = await getAgentsFromRedis(PlusmarService.redisStoreClient, key);

    const onAudienceRedisUpdateSubscription = { onAudienceRedisUpdateSubscription: { agentList, pageID } };

    await PlusmarService.pubsub.publish(AUDIENCE_REDIS_UPDATE, onAudienceRedisUpdateSubscription);
    return {
      status: 200,
      value: '123',
    } as IHTTPResult;
  };

  setAudienceEncounterTime = async (pageID: number, audienceID: number, lastIncomingDate?: string): Promise<void> => {
    if (lastIncomingDate === null) lastIncomingDate = getUTCTimestamps();
    const message = await getLatestMessage({ audienceID, pageID });
    if (isEmpty(message) || message?.sentBy === MessageSentByEnum.PAGE) {
      await setLastIncomingDateByAudienceID(PlusmarService.writerClient, pageID, audienceID, lastIncomingDate);
    }
  };
}
