import { IDynamicSubscriptionQuery, SLAFilterType } from '@reactor-room/itopplus-model-lib';

export const buildSLAQueryOnCaseStatement = (
  settings: { pageID: number; alertSLA: string; exceedSLA: string }[],
  tableIdentifier: 'psm' | 'upm' | 'a' | 'a2',
  pageID: number,
): IDynamicSubscriptionQuery => {
  const pageIDs = [];
  const params = {};
  const statementAlmost = [];
  const statementOver = [];
  if (settings !== null) {
    if (pageID !== SLAFilterType.TAG && pageID !== SLAFilterType.ASSIGNEE) settings = settings.filter((setting) => setting.pageID === pageID);

    settings.map((setting, index) => {
      pageIDs.push(setting.pageID);
      params['almostTime' + index] = setting.alertSLA;
      params['exceedTime' + index] = setting.exceedSLA;
      params['page' + index] = setting.pageID;
      statementAlmost.push(
        `\nWHEN ${tableIdentifier}.page_id = :page${index} THEN ( a2.last_incoming_date < :almostTime${index} 
          AND a2.last_incoming_date > :exceedTime${index} AND a2.page_id = :page${index} )`,
      );
      statementOver.push(
        `\nWHEN ${tableIdentifier}.page_id = :page${index} THEN ( a2.last_incoming_date < :almostTime${index} 
          AND a2.last_incoming_date < :exceedTime${index} AND a2.page_id = :page${index} )`,
      );
    });
    return {
      dynamicParams: params,
      statementAlmost: statementAlmost.join(''),
      statementOver: statementOver.join(''),
      isActiveSLA: true,
      pageIDs,
    };
  } else {
    return { dynamicParams: null, statementAlmost: null, statementOver: null, isActiveSLA: false, pageIDs: [] };
  }
};
