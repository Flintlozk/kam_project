import { IPageWorkingHoursOptionTimes, IUserEmail } from '@reactor-room/itopplus-model-lib';
import { setWorkhoursDate, combineCaseOwner } from './working-hour.domain';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
jest.genMockFromModule('dayjs');

describe('Working hour Domain', () => {
  test('combineCaseOwner() | result must be the same as expected', () => {
    const mockParams: IUserEmail[] = [
      { userID: 35, audienceID: 5747, email: 'apithana@theiconweb.com' },
      { userID: 187, audienceID: 5747, email: 'tonmanna@gmail.com' },
      { userID: 35, audienceID: 5729, email: 'apithana@theiconweb.com' },
      { userID: 35, audienceID: 5729, email: 'apithana@theiconweb.com' },
      { userID: 187, audienceID: 5729, email: 'tonmanna@gmail.com' },
      { userID: 187, audienceID: 5630, email: 'tonmanna@gmail.com' },
    ];
    const result = combineCaseOwner(mockParams);
    const mockResult = [
      {
        audienceIDs: [5747, 5729],
        userID: 35,
        email: 'apithana@theiconweb.com',
      },
      {
        audienceIDs: [5747, 5729, 5630],
        userID: 187,
        email: 'tonmanna@gmail.com',
      },
    ];
    expect(result).toEqual(mockResult);
  });

  xtest('setWorkhoursDate() | result must be the same as expected', () => {
    const mockTimes = [
      {
        openTime: new Date('2021-08-27T02:00:00.000Z'),
        openTimeString: '09:00:+07:00',
        closeTime: new Date('2021-08-27T10:00:00.000Z'),
        closeTimeString: '18:00:+07:00',
      },
    ] as IPageWorkingHoursOptionTimes[];

    const options = setWorkhoursDate(mockTimes, 1);
    const mockResult = {
      openTimeString: '09:00:+07:00',
      closeTimeString: '18:00:+07:00',
    };
    expect(options[0].openTimeString).toEqual(dayjs(mockResult.openTimeString));
    expect(options[0].closeTimeString).toEqual(dayjs(mockResult.closeTimeString));
  });

  xtest('setWorkhoursDate() range 1  | each day in mock must be the same as current day', () => {
    const currentDay = dayjs();

    const mockTimes = [
      {
        openTime: new Date('2021-08-27T02:00:00.000Z'),
        closeTime: new Date('2021-08-27T10:00:00.000Z'),
      },
      {
        openTime: new Date('2021-08-27T10:00:00.000Z'),
        closeTime: new Date('2021-08-27T11:00:00.000Z'),
      },
    ] as IPageWorkingHoursOptionTimes[];

    const options = setWorkhoursDate(mockTimes, 1);
    options.forEach((day) => {
      expect(dayjs(day.openTime).get('date')).toEqual(currentDay.get('date') + 1);
      expect(dayjs(day.closeTime).get('date')).toEqual(currentDay.get('date') + 1);
    });
  });

  test('setWorkhoursDate() range 0  | each day in mock must be the same as current day', () => {
    // const currentDay = dayjs();

    const mockTimes = [
      {
        openTime: new Date('2021-08-27T02:00:00.000Z'),
        openTimeString: '09:00:+07:00',
        closeTime: new Date('2021-08-27T10:00:00.000Z'),
        closeTimeString: '18:00:+07:00',
      },
      {
        openTime: new Date('2021-08-27T10:00:00.000Z'),
        openTimeString: '07:00:+07:00',
        closeTime: new Date('2021-08-27T11:00:00.000Z'),
        closeTimeString: '10:00:+07:00',
      },
    ] as IPageWorkingHoursOptionTimes[];

    const mockResult = [
      {
        openTimeString: '09:00:+07:00',
        closeTimeString: '18:00:+07:00',
      },
      {
        openTimeString: '07:00:+07:00',
        closeTimeString: '10:00:+07:00',
      },
    ];

    const options = setWorkhoursDate(mockTimes, 0);
    options.forEach((day, index) => {
      expect(day.openTimeString).toEqual(mockResult[index].openTimeString);
      expect(day.closeTimeString).toEqual(mockResult[index].closeTimeString);

      // expect(dayjs(day.openTime).get('date')).toEqual(currentDay.get('date'));
      // expect(dayjs(day.closeTime).get('date')).toEqual(currentDay.get('date'));
    });
  });

  xtest('setWorkhoursDate() range -1 | each day in mock must be the same as current day', () => {
    const currentDay = dayjs();

    const mockTimes = [
      {
        openTime: new Date('2021-08-22T02:00:00.000Z'),
        closeTime: new Date('2021-08-22T10:00:00.000Z'),
      },
      {
        openTime: new Date('2021-08-22T10:00:00.000Z'),
        closeTime: new Date('2021-08-22T11:00:00.000Z'),
      },
    ] as IPageWorkingHoursOptionTimes[];

    const options = setWorkhoursDate(mockTimes, -1);
    options.forEach((day) => {
      expect(dayjs(day.openTime).get('date')).toEqual(currentDay.get('date') - 1);
      expect(dayjs(day.closeTime).get('date')).toEqual(currentDay.get('date') - 1);
    });
  });
});
