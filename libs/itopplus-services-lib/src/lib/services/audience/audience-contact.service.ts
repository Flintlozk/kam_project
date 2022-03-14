import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  AudienceContactAction,
  AudienceContactActionMethod,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceStepType,
  AudienceViewType,
  AUDIENCE_REDIS_UPDATE,
  CONTACT_UPDATE,
  IAudience,
  IAudienceContacts,
  IAudienceMessageFilter,
  MessageSentByEnum,
  NotificationStatus,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { isEmpty, sortBy } from 'lodash';
import {
  getAgentsFromRedis,
  getAudienceByID,
  getAudienceContactFollowDomain,
  getAudienceContactLeadDomain,
  getAudienceContactListByFollowDomain,
  getAudienceContactListByLeadDomain,
  getAudienceContactListByOrderDomain,
  getAudienceContactOrderDomain,
  getAudienceContactsOffTimes,
  removeAudienceAssignee,
  setAudienceAssignee,
  getCustomerContactList,
  getCustomerContacts,
  getCustomerContactsOffTimes,
} from '../../data';
import { PageSettingsService } from '../../services/page-settings/page-settings.service';
import { PlusmarService } from '../plusmarservice.class';

import * as Sentry from '@sentry/node';
import { mapCustomerAudienceData } from '../../domains/audience/audience.domain';
import { NotificationService } from '../../services/notification/notification.service';
export class AudienceContactService {
  public pageSettingsService: PageSettingsService;
  public notificationService: NotificationService;
  constructor() {
    this.pageSettingsService = new PageSettingsService();
    this.notificationService = new NotificationService();
  }

  async setAudienceAssignee(pageID: number, audienceID: number, userID: number, client = PlusmarService.writerClient): Promise<IHTTPResult> {
    try {
      const isUnassign = userID === -1;
      let audience: IAudience;
      if (isUnassign) {
        audience = await removeAudienceAssignee(client, pageID, audienceID);
      } else {
        audience = await setAudienceAssignee(client, pageID, { audienceID, userID });
      }

      await this.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, pageID, {
        method: AudienceContactActionMethod.AUDIENCE_SET_ASSIGNEE,
        audienceID: audienceID,
        assigneeID: userID,
        customerID: audience.customer_id,
      });

      return {
        status: 200,
        value: 'OK',
      };
    } catch (ex) {
      Sentry.captureEvent(ex);
      return {
        status: 400,
        value: 'FAIL',
      };
    }
  }

  async getAudienceContact(pageID: number, audienceID: number, domain: AudienceViewType, { searchText: search, tags, noTag }: IAudienceMessageFilter): Promise<IAudienceContacts> {
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    if (domain === AudienceViewType.FOLLOW || domain === AudienceViewType.MESSAGE) {
      return await getAudienceContactFollowDomain(PlusmarService.readerClient, pageID, audienceID, searchText, searchTags, noTag);
    } else if (domain === AudienceViewType.ORDER) {
      return await getAudienceContactOrderDomain(PlusmarService.readerClient, pageID, audienceID, searchText, searchTags, noTag);
    } else if (domain === AudienceViewType.LEAD) {
      return await getAudienceContactLeadDomain(PlusmarService.readerClient, pageID, audienceID, searchText, searchTags, noTag);
    } else {
      throw new Error('CANT_GET_AUDIENCE_BY_THIS_TYPE');
    }
  }

  async getAudienceContacts(
    pageID: number,
    audienceIDs: number[],
    domain: AudienceViewType,
    { searchText: search, tags, noTag, contactStatus }: IAudienceMessageFilter,
  ): Promise<IAudienceContacts[]> {
    // DO UPDATE AFTER RECEIVED HOOK FROM UI
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    const IDs = PostgresHelper.joinInQueries(audienceIDs);

    const filterParams = { search: searchText, searchTags, noTag, contactStatus, groupDomainType: null, groupDomainStatus: null };

    const customerContacts = await getCustomerContacts(PlusmarService.readerClient, pageID, IDs, filterParams);
    return mapCustomerAudienceData(customerContacts);
  }

  async getAudienceContactsWithOfftimes(pageID: number, { searchText: search, tags, noTag }: IAudienceMessageFilter): Promise<IAudienceContacts[]> {
    const config = await this.pageSettingsService.getPageSetting(pageID, PageSettingType.WORKING_HOURS);
    let isOfftimeEnabled = false;
    if (!isEmpty(config)) isOfftimeEnabled = config.status;

    if (isOfftimeEnabled) {
      const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
      let searchTags = null;

      if (!noTag) {
        if (tags.length) {
          searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
        }
      }

      return await getAudienceContactsOffTimes(PlusmarService.readerClient, pageID, searchText, searchTags, noTag);
    } else {
      return [];
    }
  }

  async getAudienceContactListByFollowDomain(
    pageID: number,
    listIndex: number,
    skip: number,
    { searchText: search, tags, noTag, contactStatus }: IAudienceMessageFilter,
  ): Promise<IAudienceContacts[]> {
    // ! Marked for delete
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;
    const groupDomainType = null;
    const groupDomainStatus = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }
    const customerMode = true;
    let contacts = [];
    if (customerMode) {
      const customerContacts = await getCustomerContactList(PlusmarService.readerClient, pageID, {
        listIndex,
        skip,
        search: searchText,
        searchTags,
        noTag,
        contactStatus,
        groupDomainType,
        groupDomainStatus,
      });
      contacts = mapCustomerAudienceData(customerContacts);
    } else {
      contacts = await getAudienceContactListByFollowDomain(PlusmarService.readerClient, pageID, listIndex, skip, searchText, searchTags, noTag);
    }

    const empty = isEmpty(contacts);
    return empty ? [] : contacts;
  }

  // ! Marked for delete
  async getAudienceContactListByOrderDomain(
    pageID: number,
    listIndex: number,
    skip: number,
    { searchText: search, tags, noTag }: IAudienceMessageFilter,
  ): Promise<IAudienceContacts[]> {
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    const contacts = await getAudienceContactListByOrderDomain(PlusmarService.readerClient, pageID, listIndex, skip, searchText, searchTags, noTag);
    const empty = isEmpty(contacts);
    return empty ? [] : contacts;
  }

  // ! Marked for delete
  async getAudienceContactListByLeadDomain(
    pageID: number,
    listIndex: number,
    skip: number,
    { searchText: search, tags, noTag }: IAudienceMessageFilter,
  ): Promise<IAudienceContacts[]> {
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    const contacts = await getAudienceContactListByLeadDomain(PlusmarService.readerClient, pageID, listIndex, skip, searchText, searchTags, noTag);
    const empty = isEmpty(contacts);
    return empty ? [] : contacts;
  }

  async removeTokenFromAudienceContactList(pageID: number, token: string, isAdd: boolean): Promise<IHTTPResult> {
    try {
      const key = `message_active:${pageID}`;
      await this.removeExpiredRedis(key);

      const oldAgentList = await getAgentsFromRedis(PlusmarService.redisStoreClient, key);

      const newAgentList = sortBy(oldAgentList, 'create_at').filter((x) => x.token !== token);
      PlusmarService.redisStoreClient.DEL(key);
      const agent = oldAgentList.find((x) => x.token === token);
      newAgentList.map((x) => {
        PlusmarService.redisStoreClient.LPUSH(key, JSON.stringify(x));
      });

      if (isAdd) {
        const key = `message_active:${pageID}`;
        PlusmarService.redisStoreClient.LPUSH(key, JSON.stringify({ ...agent, create_at: new Date() }));
      }

      PlusmarService.redisStoreClient.LTRIM(key, 0, 19);

      const agentList = await getAgentsFromRedis(PlusmarService.redisStoreClient, key);
      const onAudienceRedisUpdateSubscription = { onAudienceRedisUpdateSubscription: { agentList, pageID } };
      await PlusmarService.pubsub.publish(AUDIENCE_REDIS_UPDATE, onAudienceRedisUpdateSubscription);
      return {
        status: 200,
      } as IHTTPResult;
    } catch (err) {
      console.log('removeTokenFromAudienceContactList err ===> : ', err);
      throw err;
    }
  }

  async setAudienceUnread(pageID: number, audienceID: number): Promise<IHTTPResult> {
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    if (!audience) return { status: 400, value: 'AUDIENCE_NOT_FOUND' };

    if (audience.latest_sent_by === MessageSentByEnum.AUDIENCE) {
      await this.notificationService.setStatusNotifyByStatus(audienceID, pageID, NotificationStatus.UNREAD);
      await this.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, pageID, {
        method: AudienceContactActionMethod.AUDIENCE_SET_UNREAD,
        audienceID: audienceID,
        customerID: audience.customer_id,
        sentBy: MessageSentByEnum.AUDIENCE,
      });
      return { status: 200, value: 'OK' };
    } else {
      return { status: 400, value: 'PAGE_SENT_STATUS' };
    }
  }

  async removeExpiredRedis(key: string): Promise<void> {
    try {
      const oldAgentList = await getAgentsFromRedis(PlusmarService.redisStoreClient, key);
      const newAgentList = sortBy(oldAgentList, 'create_at').filter((x) => {
        const datenow = dayjs();
        const dateJs = dayjs(x.create_at);
        const diff = datenow.diff(dateJs, 'hour', true);
        return diff <= 2;
      });

      PlusmarService.redisStoreClient.DEL(key);
      newAgentList.map((x) => {
        PlusmarService.redisStoreClient.LPUSH(key, JSON.stringify(x));
      });
    } catch (err) {
      console.log('removeExpiredRedis :', err);
      throw err;
    }
  }

  async publishOnContactUpdateSubscription(
    route: AudienceViewType,
    pageID: number,
    action: AudienceContactAction = { method: AudienceContactActionMethod.TRIGGER_UPDATE, customerID: null, audienceID: null /* just trigger update if audienceID is null */ },
  ): Promise<void> {
    const onContactUpdateSubscription = { onContactUpdateSubscription: { isFetch: true, action, route, pageID } };
    await PlusmarService.pubsub.publish(CONTACT_UPDATE, onContactUpdateSubscription);
  }

  // NEW
  async getCustomerContactList(pageID: number, listIndex: number, skip: number, filters: IAudienceMessageFilter): Promise<IAudienceContacts[]> {
    const { searchText: search, tags, noTag, contactStatus, domainType, domainStatus } = filters;
    const fetchLeads = domainType?.includes(AudienceDomainType.LEADS) && domainStatus?.includes(AudienceDomainStatus.LEAD);
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;
    let groupDomainType = null;
    let groupDomainStatus = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    if (!fetchLeads) {
      if (domainType && domainType.length) {
        groupDomainType = PostgresHelper.joinInQueries(domainType);
      }
      if (domainStatus && domainStatus.length) {
        groupDomainStatus = PostgresHelper.joinInQueries(domainStatus);
      }
    }

    let contacts = [];
    const filterParams = {
      listIndex,
      skip,
      search: searchText,
      searchTags,
      noTag,
      contactStatus,
      groupDomainType,
      groupDomainStatus,
      fetchLeads,
    };
    const customerContacts = await getCustomerContactList(PlusmarService.readerClient, pageID, filterParams);
    contacts = mapCustomerAudienceData(customerContacts);

    const empty = isEmpty(contacts);
    return empty ? [] : contacts;
  }

  async getCustomerContacts(pageID: number, audienceIDs: number[], domain: AudienceViewType, filters: IAudienceMessageFilter): Promise<IAudienceContacts[]> {
    // ? DO UPDATE AFTER RECEIVED HOOK FROM UI
    const { searchText: search, tags, noTag, contactStatus, domainType, domainStatus } = filters;
    const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
    let searchTags = null;

    if (!noTag) {
      if (tags.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    let groupDomainType = null;
    let groupDomainStatus = null;

    if (domainType && domainType.length) {
      groupDomainType = PostgresHelper.joinInQueries(domainType);
    }
    if (domainStatus && domainStatus.length) {
      groupDomainStatus = PostgresHelper.joinInQueries(domainStatus);
    }

    const IDs = PostgresHelper.joinInQueries(audienceIDs);
    const filterParams = {
      search: searchText,
      searchTags,
      noTag,
      contactStatus,
      groupDomainType,
      groupDomainStatus,
    };

    const customerContacts = await getCustomerContacts(PlusmarService.readerClient, pageID, IDs, filterParams);

    const mapWithAudienceData = mapCustomerAudienceData(customerContacts);
    return mapWithAudienceData;
  }

  async getCustomerContactsWithOfftimes(pageID: number, filters: IAudienceMessageFilter): Promise<IAudienceContacts[]> {
    const { searchText: search, tags, noTag, contactStatus, domainType, domainStatus } = filters;

    const config = await this.pageSettingsService.getPageSetting(pageID, PageSettingType.WORKING_HOURS);
    let isOfftimeEnabled = false;
    if (!isEmpty(config)) isOfftimeEnabled = config.status;

    if (isOfftimeEnabled) {
      const searchText = search ? `%${search.toLocaleLowerCase()}%` : null;
      let searchTags = null;
      let groupDomainType = null;
      let groupDomainStatus = null;

      if (!noTag) {
        if (tags.length) {
          searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
        }
      }

      if (domainType && domainType.length) {
        groupDomainType = PostgresHelper.joinInQueries(domainType);
      }
      if (domainStatus && domainStatus.length) {
        groupDomainStatus = PostgresHelper.joinInQueries(domainStatus);
      }

      const filterParams = {
        search: searchText,
        searchTags,
        noTag,
        contactStatus,
        groupDomainType,
        groupDomainStatus,
      };

      const offtimeCunstomers = await getCustomerContactsOffTimes(PlusmarService.readerClient, pageID, filterParams);
      return mapCustomerAudienceData(offtimeCunstomers);
    } else {
      return [];
    }
  }
}
