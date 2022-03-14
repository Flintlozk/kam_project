import { getUTCDayjs } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumLogisticDeliveryProviderType,
  EnumLogisticSystemType,
  EPageMessageTrackMode,
  IPageCloseCustomerOptions,
  IPageCustomerSlaTimeOptions,
  IPageLogisticSystemOptionFixedRate,
  IPageLogisticSystemOptionFlatRate,
  IPageLogisticSystemOptionPricingTable,
  IPageLogisticSystemOptions,
  IPageMessageTrackMode,
  IPageQuickpayWebhookOptions,
  IPageTermsAndConditionOptions,
  IPageWorkingHoursOptionAdditional,
  IPageWorkingHoursOptionDates,
  IPageWorkingHoursOptionNotifyList,
  IPageWorkingHoursOptionOffTime,
  IPageWorkingHoursOptions,
  IPageWorkingHoursOptionTimes,
  PageSettingOptionType,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { getTermsAndConditionDefault } from '../../domains/settings/pdpa.domain';

export function getPageSettingDefaultOption(type: PageSettingType): PageSettingOptionType {
  switch (type) {
    case PageSettingType.MESSAGE_TRACK: {
      return <IPageMessageTrackMode>{
        trackMode: EPageMessageTrackMode.TRACK_BY_TAG,
      };
    }
    case PageSettingType.CUSTOMER_CLOSED_REASON: {
      return <IPageCloseCustomerOptions>{
        url: '',
      };
    }
    case PageSettingType.CUSTOMER_SLA_TIME: {
      return <IPageCustomerSlaTimeOptions>{
        alertHour: 0,
        alertMinute: 45,
        hour: 3,
        minute: 0,
      };
    }
    case PageSettingType.TERMS_AND_CONDITION: {
      return <IPageTermsAndConditionOptions>{
        textENG: getTermsAndConditionDefault().textENG,
        textTH: getTermsAndConditionDefault().textTH,
      };
    }
    case PageSettingType.WORKING_HOURS: {
      const offTimes = <IPageWorkingHoursOptionOffTime>{
        isActive: false,
        attachment: null,
        message:
          'ระบบอัตโนมัติ : ขณะนี้อยู่นอกเวลาทำการ ระบบจะทำการแจ้งเตือนไปยังพนักงานที่ดูแลลูกค้า หรือฝากข้อความไว้ที่นี่ เพื่อให้พนักงานติดต่อกลับภายหลัง ขออภัย ในความไม่สะดวก',
      };

      const additional = <IPageWorkingHoursOptionAdditional>{
        isActive: false,
        time: 30,
      };

      const notifyList = <IPageWorkingHoursOptionNotifyList>{
        isActive: false,
        emails: [],
      };

      const open = getUTCDayjs().set('hour', 2).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
      const close = getUTCDayjs().set('hour', 11).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
      const times = <IPageWorkingHoursOptionTimes>{
        openTime: open,
        openTimeString: '09:00:+07:00',
        closeTime: close,
        closeTimeString: '18:00:+07:00',
      };
      const weekday = <IPageWorkingHoursOptionDates>{ isActive: true, allTimes: true, times: [times] };
      const weekend = <IPageWorkingHoursOptionDates>{ isActive: false, allTimes: true, times: [times] };

      return <IPageWorkingHoursOptions>{
        offTime: offTimes,
        additional: additional,
        notifyList: notifyList,
        sunday: weekend,
        monday: weekday,
        tuesday: weekday,
        wednesday: weekday,
        thursday: weekday,
        friday: weekday,
        saturday: weekend,
      };
    }

    case PageSettingType.LOGISTIC_SYSTEM: {
      return {
        pricingTable: {
          type: EnumLogisticSystemType.PRICING_TABLE,
          isActive: false,
          provider: EnumLogisticDeliveryProviderType.THAILAND_POST,
        } as IPageLogisticSystemOptionPricingTable,
        flatRate: {
          type: EnumLogisticSystemType.FLAT_RATE,
          isActive: true,
          deliveryFee: 0,
        } as IPageLogisticSystemOptionFlatRate,
        fixedRate: {
          type: EnumLogisticSystemType.FIXED_RATE,
          isActive: false,
          useMin: true,
          amount: 0,
          fallbackType: EnumLogisticSystemType.FLAT_RATE,
        } as IPageLogisticSystemOptionFixedRate,
      } as IPageLogisticSystemOptions;
    }
    case PageSettingType.QUICKPAY_WEBHOOK: {
      return <IPageQuickpayWebhookOptions>{
        url: '',
      };
    }

    default:
      return null;
  }
}
