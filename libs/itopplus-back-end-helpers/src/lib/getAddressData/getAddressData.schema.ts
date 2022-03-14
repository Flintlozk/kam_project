/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateArray } from '../joi.helper';
import { AddressData } from './getAddressData.types';

/**
 * customValidator
 * @param {validator} JSON field name (passed from request)
 * @return {validation array function}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const customValidator =
  (validator: any) =>
  (data: AddressData[]): AddressData[] =>
    validateArray({ ...validator }, data);
