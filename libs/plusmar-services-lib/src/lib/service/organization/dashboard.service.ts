import { getDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  EPageMessageTrackMode,
  IAllSubscriptionClosedReason,
  IAllSubscriptionFilter,
  IAllSubscriptionSLAAllSatff,
  IAllSubscriptionSLAAllSatffUser,
  IAllSubscriptionSLAStatisitic,
  IPageListOnMessageTrackMode,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import {
  getAllSubscriptionClosedReasonData,
  getAllSubscriptionSLAAllSatff,
  getAllSubscriptionSLAAllSatffByAssigneeData,
  getAllSubscriptionSLAStatisiticByAssigneeData,
  getAllSubscriptionSLAStatisiticData,
  getAllSubscriptionUnassignedSLAAllStaff,
  getPageListOnMessageTrackModeData,
} from '../../data/organization/organization.data';
import { buildSLAQueryOnCaseStatement } from '../../domains/organization';
import { CustomerSLAService } from '@reactor-room/itopplus-services-lib';
import { PageSettingsService } from '@reactor-room/itopplus-services-lib';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';

export class OrganizationDashboardService {
  public pageSettingsService: PageSettingsService;
  public customerSLAService: CustomerSLAService;
  constructor() {
    this.pageSettingsService = new PageSettingsService();
    this.customerSLAService = new CustomerSLAService();
  }

  async getPageListOnMessageTrackMode({ subscriptionID }: { subscriptionID: string }): Promise<IPageListOnMessageTrackMode[]> {
    const pageMessageTrackSettiings = await getPageListOnMessageTrackModeData(PlusmarService.readerClient, { subscriptionID, settingType: PageSettingType.MESSAGE_TRACK });
    pageMessageTrackSettiings.map((item) => {
      if (!item.pageMessageMode) item.pageMessageMode = EPageMessageTrackMode.TRACK_BY_TAG;
      return item;
    });
    return pageMessageTrackSettiings as IPageListOnMessageTrackMode[];
  }

  async getAllSubscriptionSLAStatisitic({ subscriptionID, filters }: { filters: IAllSubscriptionFilter; subscriptionID: string }): Promise<IAllSubscriptionSLAStatisitic> {
    const queriesByEachPage = await this.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });
    const filterMessageTrackType = queriesByEachPage.filter((page) => page.messageTrack !== EPageMessageTrackMode.TRACK_BY_ASSIGNEE);

    if (isEmpty(filterMessageTrackType)) return {} as IAllSubscriptionSLAStatisitic;

    const { dynamicParams, statementOver, isActiveSLA, pageIDs } = buildSLAQueryOnCaseStatement(filterMessageTrackType, 'psm', filters.pageID);

    if (isEmpty(pageIDs)) return {} as IAllSubscriptionSLAStatisitic;

    const startDate = getDayjs().startOf('day').toDate();
    const endDate = getDayjs().endOf('day').toDate();

    const resultFirstSection = await getAllSubscriptionSLAStatisiticData(
      PlusmarService.readerClient,
      {
        subscriptionID,
        startDate,
        endDate,
        dynamicParams,
        statementOver,
        isActiveSLA,
      },
      filters,
      PostgresHelper.joinInQueries(pageIDs),
    );

    return { ...resultFirstSection, onProcessSla: resultFirstSection.totalCase - resultFirstSection.onProcessOverSla, onProcessSlaTier2: 0, onProcessOverSlaTier2: 0 };
  }

  async getAllSubscriptionClosedReason({ subscriptionID, filters }: { filters: IAllSubscriptionFilter; subscriptionID: string }): Promise<IAllSubscriptionClosedReason[]> {
    const queriesByEachPage = await this.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });
    const filterMessageTrackType = queriesByEachPage.filter((page) => page.messageTrack !== EPageMessageTrackMode.TRACK_BY_ASSIGNEE);

    const pageIDs = filterMessageTrackType.map((item) => item.pageID);
    if (isEmpty(pageIDs)) return [];

    const startDate = getDayjs().startOf('day').toDate();
    const endDate = getDayjs().endOf('day').toDate();
    return await getAllSubscriptionClosedReasonData(PlusmarService.readerClient, { subscriptionID, startDate, endDate }, filters, PostgresHelper.joinInQueries(pageIDs));
  }
  async getAllSubscriptionClosedReasonByAssignee({
    subscriptionID,
    filters,
  }: {
    filters: IAllSubscriptionFilter;
    subscriptionID: string;
  }): Promise<IAllSubscriptionClosedReason[]> {
    const queriesByEachPage = await this.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });
    const filterMessageTrackType = queriesByEachPage.filter((page) => page.messageTrack === EPageMessageTrackMode.TRACK_BY_ASSIGNEE);

    const pageIDs = filterMessageTrackType.map((item) => item.pageID);
    if (isEmpty(pageIDs)) return [];

    const startDate = getDayjs().startOf('day').toDate();
    const endDate = getDayjs().endOf('day').toDate();

    return await getAllSubscriptionClosedReasonData(PlusmarService.readerClient, { subscriptionID, startDate, endDate }, filters, PostgresHelper.joinInQueries(pageIDs));
  }

  async getAllSubscriptionSLAAllStaff({
    filters,
    subscriptionID,
  }: {
    filters: IAllSubscriptionFilter;
    subscriptionID: string;
    isDigest: boolean;
  }): Promise<IAllSubscriptionSLAAllSatff[]> {
    const queriesByEachPage = await this.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });
    const filterMessageTrackType = queriesByEachPage.filter((page) => page.messageTrack !== EPageMessageTrackMode.TRACK_BY_ASSIGNEE);
    if (isEmpty(filterMessageTrackType)) return [];

    const statement = buildSLAQueryOnCaseStatement(filterMessageTrackType, 'psm', filters.pageID);
    const { dynamicParams, statementAlmost, statementOver, isActiveSLA, pageIDs } = statement;
    if (isEmpty(pageIDs)) return [];

    const startDate = getDayjs().startOf('day').toDate();
    const endDate = getDayjs().endOf('day').toDate();

    const params = {
      subscriptionID,
      startDate,
      endDate,
      dynamicParams,
      statementAlmost,
      statementOver,
      isActiveSLA,
    };

    const result = await getAllSubscriptionSLAAllSatff(PlusmarService.readerClient, params, filters, PostgresHelper.joinInQueries(pageIDs));
    const resultUnassigned = await getAllSubscriptionUnassignedSLAAllStaff(PlusmarService.readerClient, params, filters, PostgresHelper.joinInQueries(pageIDs));

    const unassigned = {
      tagID: -1,
      tagName: 'Unassigned',
      pageID: -1,
      totalOnProcess: 0,
      todayClosed: 0,
      almostSLA: 0,
      overSLA: 0,
      users: null,
    };

    resultUnassigned.map((item) => {
      unassigned.totalOnProcess += Number(item.totalOnProcess);
      unassigned.todayClosed += Number(item.todayClosed);
      unassigned.almostSLA += Number(item.almostSLA);
      unassigned.overSLA += Number(item.overSLA);
    });

    const returnResult = [unassigned, ...result];
    return returnResult;
  }

  async getAllSubscriptionSLAStatisiticByAssignee({
    subscriptionID,
    filters,
  }: {
    filters: IAllSubscriptionFilter;
    subscriptionID: string;
  }): Promise<IAllSubscriptionSLAStatisitic> {
    const queriesByEachPage = await this.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });
    const filterMessageTrackType = queriesByEachPage.filter((page) => page.messageTrack === EPageMessageTrackMode.TRACK_BY_ASSIGNEE);

    if (isEmpty(filterMessageTrackType)) return {} as IAllSubscriptionSLAStatisitic;
    const { dynamicParams, statementAlmost, statementOver, isActiveSLA, pageIDs } = buildSLAQueryOnCaseStatement(filterMessageTrackType, 'psm', filters.pageID);

    const startDate = getDayjs().startOf('day').toDate();
    const endDate = getDayjs().endOf('day').toDate();

    const resultFirstSection = await getAllSubscriptionSLAStatisiticByAssigneeData(
      PlusmarService.readerClient,
      {
        subscriptionID,
        startDate,
        endDate,
        dynamicParams,
        statementAlmost,
        statementOver,
        isActiveSLA,
      },
      filters,
      PostgresHelper.joinInQueries(pageIDs),
    );
    return { ...resultFirstSection, onProcessSla: resultFirstSection.totalCase - resultFirstSection.onProcessOverSla, onProcessSlaTier2: 0, onProcessOverSlaTier2: 0 };
  }

  async getAllSubscriptionSLAAllStaffByAssignee({
    filters,
    subscriptionID,
    isDigest,
  }: {
    filters: IAllSubscriptionFilter;
    subscriptionID: string;
    isDigest: boolean;
  }): Promise<IAllSubscriptionSLAAllSatff[]> {
    const queriesByEachPage = await this.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });

    const filterMessageTrackType = queriesByEachPage.filter((page) => page.messageTrack === EPageMessageTrackMode.TRACK_BY_ASSIGNEE);
    if (isEmpty(filterMessageTrackType)) return [];

    const statement = buildSLAQueryOnCaseStatement(filterMessageTrackType, 'a2', filters.pageID);
    const { dynamicParams, statementAlmost, statementOver, isActiveSLA, pageIDs } = statement;
    if (isEmpty(pageIDs)) return [];

    const startDate = getDayjs().startOf('day').toDate();
    const endDate = getDayjs().endOf('day').toDate();

    const params = {
      subscriptionID,
      startDate,
      endDate,
      dynamicParams,
      statementAlmost,
      statementOver,
      isActiveSLA,
    };

    const result = await getAllSubscriptionSLAAllSatffByAssigneeData(PlusmarService.readerClient, params, filters, PostgresHelper.joinInQueries(pageIDs));
    const mapUser = result.map((item) => {
      if (item.users !== null) item.users = [item.users as IAllSubscriptionSLAAllSatffUser];
      else item.users = [];
      return item;
    });
    if (isDigest) {
      return mapUser;
    } else {
      if (isEmpty(result)) return [];
      const filterAssigned = mapUser.filter((x) => x.users !== null);
      return filterAssigned;
    }
  }
}
