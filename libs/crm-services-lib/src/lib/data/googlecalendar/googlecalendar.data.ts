import { IAppointmentEdit, IAppointmentInsert, ICalendarDetail, IGoogleCalendar, IGoogleCalendarResponse } from '@reactor-room/crm-models-lib';
import { IGoogleCredential } from '@reactor-room/model-lib';

import { google, calendar_v3 } from 'googleapis';
export async function getCalendarInGoogleCalendar(
  credential: IGoogleCredential,
  calendarDetail: ICalendarDetail,
  url: string,
  client_id: string,
  client_secret: string,
): Promise<IGoogleCalendarResponse> {
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  oAuth2Client.setCredentials({
    access_token: credential.accessToken,
    id_token: credential.id_token,
  });
  const calendar = await google.calendar({ version: 'v3' });
  const response = await calendar.events.get({
    auth: oAuth2Client,
    calendarId: 'primary',
    eventId: calendarDetail.calendarId,
  });
  const noteDetail = response.data.description.split(' link:');
  if (!response.data.description.includes(' link:')) {
    response.data.description = response.data.description + ' link: ' + url + calendarDetail.href;
    await calendar.events.update({
      auth: oAuth2Client,
      calendarId: 'primary',
      eventId: calendarDetail.calendarId,
      requestBody: response.data,
    });
  }
  const googleCalendarResponse: IGoogleCalendarResponse = { noteDetail: noteDetail[0], startDate: response.data.start.dateTime, endDate: response.data.end.dateTime };
  return googleCalendarResponse;
}
export async function insertCalendarInGoogleCalendar(
  credential: IGoogleCredential,
  appointment: IAppointmentInsert,
  url: string,
  client_id: string,
  client_secret: string,
): Promise<IGoogleCalendar> {
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  oAuth2Client.setCredentials({
    access_token: credential.accessToken,
    id_token: credential.id_token,
  });
  const carlndarId = await insertGoogleCalendarEvent(oAuth2Client, appointment, url);
  return carlndarId;
}
export async function editCalendarInGoogleCalendar(
  credential: IGoogleCredential,
  editAppointmentField: IAppointmentEdit,
  calendarDetail: ICalendarDetail,
  url: string,
  client_id: string,
  client_secret: string,
) {
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  oAuth2Client.setCredentials({
    access_token: credential.accessToken,
    id_token: credential.id_token,
  });
  const calendar = await google.calendar({ version: 'v3' });
  const response = await calendar.events.get({
    auth: oAuth2Client,
    calendarId: 'primary',
    eventId: calendarDetail.calendarId,
  });
  response.data.start.dateTime = editAppointmentField.appointmentStartDate;
  response.data.end.dateTime = editAppointmentField.appointmentEndDate;
  if (response.data.description.includes(calendarDetail.description)) {
    response.data.description = editAppointmentField.appointmentNote + ' link: ' + url + editAppointmentField.href;
  }
  await calendar.events.update({
    auth: oAuth2Client,
    calendarId: 'primary',
    eventId: calendarDetail.calendarId,
    requestBody: response.data,
  });
}
export async function deleteCalendarInGoogleCalendar(credential: IGoogleCredential, calendarId: string, client_id: string, client_secret: string) {
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  oAuth2Client.setCredentials({
    access_token: credential.accessToken,
    id_token: credential.id_token,
  });
  const calendar = await google.calendar({ version: 'v3' });
  const event = await calendar.events.delete({
    auth: oAuth2Client,
    calendarId: 'primary',
    eventId: calendarId,
  });
  console.log(event);
}
async function insertGoogleCalendarEvent(auth, appointment: IAppointmentInsert, url: string): Promise<IGoogleCalendar> {
  const calendar = await google.calendar({ version: 'v3', auth });
  const startDate = appointment.appointmentStartDate;
  const endDate = appointment.appointmentEndDate;
  const insertEvent: calendar_v3.Schema$Event = {
    summary: '[CRM Appointment]' + ' ' + appointment.companyName,
    location: 'AIA Capital Center, 89 อาคาร เอไอเอ แคปปิตอล เซ็นเตอร์ ถ. รัชดาภิเษก แขวง ดินแดง เขตดินแดง กรุงเทพมหานคร 10400 ประเทศไทย',
    description: appointment.appointmentNote + ' link: ' + url + appointment.href,
    start: {
      dateTime: startDate,
    },
    end: {
      dateTime: endDate,
    },
  };
  const response = await calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    requestBody: insertEvent,
  });
  return { calendarId: response.data.id, htmlLink: response.data.htmlLink };
}
