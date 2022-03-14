import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { EnumOpenAPI } from '@reactor-room/itopplus-model-lib';
import { PlusmarService, PagesService } from '@reactor-room/itopplus-services-lib';

export function requireAPIKey(target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDesciptor.value;
  propertyDesciptor.value = async function (...args: any[]) {
    const headerClientID = args[0].headers.clientid;
    const headerClientSecret = args[0].headers.clientsecret;
    if (!headerClientID || !headerClientSecret) throw new Error(EnumOpenAPI.API_NOT_ACCESS);
    const pageClientID = cryptoDecode(headerClientID as string, PlusmarService.environment.more_api_key);
    const pageService = new PagesService();
    const credential = { page_uuid: pageClientID.split('.')[0], page_secret: headerClientSecret };
    args[0].body = Object.assign(args[0].body, credential);
    args[0].query = Object.assign(args[0].query, credential);
    const page = await pageService.getAPIKeyByUUIDAndSecret(args[0].body.page_uuid, args[0].body.page_secret);
    if (page === undefined || page === null) throw Error(EnumOpenAPI.API_CLIENT_ID_OR_SECRET_INVALID);
    if (!page.benabled_api) throw Error(EnumOpenAPI.API_STATUS_DISABLED);
    const result = method.apply(this, args);
    return result;
  };
  return propertyDesciptor;
}
