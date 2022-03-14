import { Injectable } from '@angular/core';
export enum ChatSearchType {
  STATUS = '',
  NEW_MESSAGE = 'NEW_MESSAGE',
  FOLLOW = 'FOLLOW',
  LEAD_FOLLOW = 'LEAD_FOLLOW',
  LEAD_FINISHED = 'LEAD_FINISHED',
  ORDER_FOLLOW = 'ORDER_FOLLOW',
  ORDER_WAITING_FOR_PAYMENT = 'ORDER_WAITING_FOR_PAYMENT',
  ORDER_CONFIRM_PAYMENT = 'ORDER_CONFIRM_PAYMENT',
}

@Injectable()
export class AudienceContactListConfig {
  statusDropDownData = [
    {
      value: ChatSearchType.STATUS,
      label: 'Status',
    },
    {
      value: ChatSearchType.NEW_MESSAGE,
      label: 'New Message',
    },
    {
      value: ChatSearchType.FOLLOW,
      label: 'Follow',
    },
    {
      value: ChatSearchType.LEAD_FOLLOW,
      label: 'Leads: Follow',
    },
    {
      value: ChatSearchType.LEAD_FINISHED,
      label: 'Leads: Finished',
    },
    {
      value: ChatSearchType.ORDER_FOLLOW,
      label: 'Order: Follow',
    },
    {
      value: ChatSearchType.ORDER_WAITING_FOR_PAYMENT,
      label: 'Order: Waiting for Payment',
    },
    {
      value: ChatSearchType.ORDER_CONFIRM_PAYMENT,
      label: 'Order: Confirm Payment',
    },
  ];
}
