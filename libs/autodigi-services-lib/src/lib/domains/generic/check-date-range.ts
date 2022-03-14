import { DateData } from '@reactor-room/autodigi-models-lib';
import dayjs from 'dayjs';

export const checking_date_range = (date_range: string, custom_date_from: string, custom_date_to: string) => {
  let return_condition: DateData = {
    start_date: '',
    end_date: '',
  };
  switch (date_range) {
    case 'last30days':
      return_condition = {
        start_date: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        end_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      };
      break;
    case 'last7days':
      return_condition = {
        start_date: dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
      break;
    case 'last14days':
      return_condition = {
        start_date: dayjs().subtract(14, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
      break;
    case 'today':
      return_condition = {
        start_date: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
      break;

    case 'yesterday':
      return_condition = {
        start_date: dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
      break;
    case 'custom':
      return_condition = {
        start_date: dayjs(custom_date_from).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: dayjs(custom_date_to).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
      break;
    default:
      return_condition = {
        start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
        end_date: dayjs().endOf('month').format('YYYY-MM-DD'),
      };
  }
  return return_condition;
};
