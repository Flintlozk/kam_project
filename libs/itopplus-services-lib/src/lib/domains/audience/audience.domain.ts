import { parseTimestampToDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { IAudienceContacts, LeadStatusEnum, LeadStatusTHEnum } from '@reactor-room/itopplus-model-lib';

export const getLeadSubmissionStatusEnums = (search: string): string[] => {
  if (!search) return [];

  const filter = Object.values(LeadStatusTHEnum).map((status, index) => {
    const matchIndex = status.indexOf(search);
    if (matchIndex !== -1) return `'${Object.values(LeadStatusEnum)[index]}'`;
  });
  return filter.filter(Boolean); // filter undefine,null,'' or anything as Falsy
};

export const mapCustomerAudienceData = (customerContacts: IAudienceContacts[]): IAudienceContacts[] => {
  if (customerContacts && customerContacts.length > 0) {
    return customerContacts.map((contact) => {
      let newContact;
      if (contact.a_data) {
        newContact = {
          id: contact.a_data.id,
          parent_id: contact.a_data.parent_id,
          status: contact.a_data.status,
          domain: contact.a_data.domain,
          is_notify: contact.a_data.is_notify,
          is_offtime: contact.a_data.is_offtime,
          last_platform_activity_date: contact.a_data.last_platform_activity_date,
          notify_status: contact.a_data.notify_status,
        };
      } else {
        newContact = {};
      }
      delete contact.a_data;
      const mapNew = { ...contact, ...newContact };
      return mapNew;
    });
  } else {
    return [] as IAudienceContacts[];
  }
};
