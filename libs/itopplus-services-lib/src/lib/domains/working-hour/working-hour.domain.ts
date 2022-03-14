import { groupBy, parseTimestampToDayjs, parseTimestampToDayjsWithFormat } from '@reactor-room/itopplus-back-end-helpers';
import {
  ICustomerOffTimeDetail,
  IMessageModel,
  IPageWorkingHoursOptionAdditional,
  IPageWorkingHoursOptionDates,
  IPageWorkingHoursOptionTimes,
  IPageWorkoingHourEmailMessages,
  IPageWorkoingHourEmailShopDetail,
  IUserEmail,
} from '@reactor-room/itopplus-model-lib';
import { Dayjs } from 'dayjs';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

export const setWorkhoursDate = (times: IPageWorkingHoursOptionTimes[], range = 0): IPageWorkingHoursOptionTimes[] => {
  return times.map((time) => {
    const openTime = parseTimestampToDayjs(time.openTime);
    const closeTime = parseTimestampToDayjs(time.closeTime);

    if (range === -1) {
      return {
        openTimeString: time.openTimeString,
        openTime: openTime.subtract(1, 'day').toDate(),
        closeTimeString: time.closeTimeString,
        closeTime: closeTime.subtract(1, 'day').toDate(),
      };
    } else if (range === 1) {
      return {
        openTimeString: time.openTimeString,
        openTime: openTime.add(1, 'day').toDate(),
        closeTimeString: time.closeTimeString,
        closeTime: closeTime.add(1, 'day').toDate(),
      };
    } else {
      return {
        openTimeString: time.openTimeString,
        openTime: openTime.toDate(),
        closeTimeString: time.closeTimeString,
        closeTime: closeTime.toDate(),
      };
    }
  });
};

export const getWorkingTimeInRange = (
  utcIncomimgTime: Dayjs,
  day: IPageWorkingHoursOptionDates,
  isNewAudience: boolean,
  additional: IPageWorkingHoursOptionAdditional,
): IPageWorkingHoursOptionTimes => {
  const { times } = day;
  const { isActive: additionalActive, time: additionalTime } = additional;

  const isFound = times.find((time) => {
    const openString = parseTimestampToDayjsWithFormat(time.openTimeString, 'HH:mm:Z');
    let closeString = parseTimestampToDayjsWithFormat(time.closeTimeString, 'HH:mm:Z');

    if (!isNewAudience && additionalActive) {
      closeString = parseTimestampToDayjsWithFormat(time.closeTimeString, 'HH:mm:Z').add(additionalTime, 'minute');
    }

    return utcIncomimgTime.isAfter(openString) && utcIncomimgTime.isBefore(closeString); // utcIncomimgTime.isAfter(open) && utcIncomimgTime.isBefore(close);
  });
  return isFound;
};

export const onGapYesterdayCloseTimeToCurrentOpen = (utcIncomimgTime: Dayjs, today: IPageWorkingHoursOptionDates, yesterday: IPageWorkingHoursOptionDates): boolean => {
  const { times: todayTimes } = today;
  const todayStartRange = todayTimes[0];
  const { times: yesterdayTimes } = yesterday;
  // const { isActive: yesterdayActive, times: yesterdayTimes, allTimes: isYesterdayAllDay } = yesterday;

  const yesterdayEndRange = yesterdayTimes[yesterdayTimes.length - 1];
  const inRangeOfPreviousCloseTimeToCurrentOpenTime = utcIncomimgTime.isAfter(yesterdayEndRange.closeTime) && utcIncomimgTime.isBefore(todayStartRange.openTime);

  return inRangeOfPreviousCloseTimeToCurrentOpenTime;

  // if (yesterdayActive && !isYesterdayAllDay) {
  //   //  Store opened on yesterday and close by period
  //   if (inRangeOfPreviousCloseTimeToCurrentOpenTime) {
  //     //  Yesterday close gap to Today open
  //     return true;
  //   } else {
  //     return false;
  //   }
  // } else {
  //   //  Store closed on yesterday
  //   const yesterdayMidnight = dayjs().subtract(1, 'd').set('hour', 0).set('minute', 0).set('second', 0);
  //   const inRangeOfPreviousMidnightToCurrentOpenTime = utcIncomimgTime.isAfter(yesterdayMidnight) && utcIncomimgTime.isBefore(todayStartRange.openTime);
  //   if (inRangeOfPreviousMidnightToCurrentOpenTime) {
  //     //  Yesterday close gap to Today open
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
};

export const onGapCurrentCloseTimeToTomorrow = (utcIncomimgTime: Dayjs, today: IPageWorkingHoursOptionDates, tomorrow: IPageWorkingHoursOptionDates): boolean => {
  const { times: todayTimes } = today;
  const todayEndRange = todayTimes[todayTimes.length - 1];
  const { times: tomorrowTimes } = tomorrow;

  const tomorrowStartRange = tomorrowTimes[0];
  const inRangeOfCurrentCloseTimeToNextOpenTime = utcIncomimgTime.isAfter(todayEndRange.closeTime) && utcIncomimgTime.isBefore(tomorrowStartRange.openTime);

  return inRangeOfCurrentCloseTimeToNextOpenTime;

  // if (tomorrowActive && !isTomorrowAllDay) {
  //   //  Store open on tomorrow and open by period
  //   if (inRangeOfCurrentCloseTimeToNextOpenTime && !isTomorrowAllDay) {
  //     // Today close gap to tomorrow Open
  //     return true;
  //   } else {
  //     return false;
  //   }
  // } else {
  //   const tomorrowMidnight = dayjs().add(1, 'd').set('hour', 23).set('minute', 59).set('second', 59);
  //   const inRangeOfPreviousMidnightToCurrentOpenTime = utcIncomimgTime.isAfter(todayEndRange.closeTime) && utcIncomimgTime.isBefore(tomorrowMidnight);
  //   if (inRangeOfPreviousMidnightToCurrentOpenTime) {
  //     //  Store close on tomorrow
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
};

export const combineEachMessagesOfftime = (messages: IMessageModel[], customers: ICustomerOffTimeDetail[], origin: string): IPageWorkoingHourEmailMessages[] => {
  const messageArray = messages.reverse().map((message) => {
    return {
      _id: message._id,
      audienceID: message.audienceID,
      text: message.attachments !== null ? 'Has attachment' : message.text,
      timestamp: message.timestamp,
      link: `${origin}/follows/chat/${message.audienceID}/post`,
      customerDetail: customers.find((x) => x.audienceID === message.audienceID),
    };
  });

  return messageArray;
};

export const getEmailContentOnCaseByCase = (
  messages: IPageWorkoingHourEmailMessages[],
  shopDetail: IPageWorkoingHourEmailShopDetail,
  user: { audienceIDs: number[]; email: string; userID: number },
): string => {
  const filterByAudience = messages.filter((message) => user.audienceIDs.includes(message.audienceID));
  filterByAudience;
  const groupByAudience = groupBy<{ [key: string]: IPageWorkoingHourEmailMessages[] }>(filterByAudience.reverse(), 'audienceID');
  return assemblyHTMLForOfftimeEmail({ messages: groupByAudience, shopDetail });
};
export const getEmailContentOnAllCase = (messages: IPageWorkoingHourEmailMessages[], shopDetail: IPageWorkoingHourEmailShopDetail): string => {
  const groupByAudience = groupBy<{ [key: string]: IPageWorkoingHourEmailMessages[] }>(messages.reverse(), 'audienceID');
  return assemblyHTMLForOfftimeEmail({ messages: groupByAudience, shopDetail });
};

export const assemblyHTMLForOfftimeEmail = (params: { messages: { [key: string]: IPageWorkoingHourEmailMessages[] }; shopDetail: IPageWorkoingHourEmailShopDetail }): string => {
  const filePath = path.join(__dirname, 'assets-html/offtime.ejs');
  const ejsFile = fs.readFileSync(filePath);

  const html = ejs.render(ejsFile.toString(), params);
  return html;
};

export const combineCaseOwner = (caseOwner: IUserEmail[]): { audienceIDs: number[]; email: string; userID: number }[] => {
  const combine = groupBy(caseOwner, 'userID');
  const result = [];
  Object.keys(combine).map((key) => {
    const obj = { audienceIDs: [], email: null, userID: null };
    combine[key].map((value) => {
      if (!obj.audienceIDs.includes(value.audienceID)) {
        obj.audienceIDs.push(value.audienceID);
      }
      obj.userID = value.userID;
      obj.email = value.email;
    });

    result.push(obj);
  });
  return result;
};
