import { AddressData } from './getAddressData.types';

/**
 * This is init function.
 *
 * @param {field} JSON field name (passed from request)
 * @param {search} search string
 * @param {data} should be passed during init
 * @return {array of address objects}
 *
 */

export function getAddressData(field: string, search: string, data: AddressData[]): AddressData[] {
  return data.filter((item) => String(item[field]).includes(search));
}
