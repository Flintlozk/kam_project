import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (isNotEmptyValue(phoneNumber)) {
    const infrontNumber = phoneNumber.substring(0, 2);
    const infrontPhoneNumber = phoneNumber.substring(0, 3);
    const isHomeNumber = infrontNumber === '02' || infrontNumber === '03' || infrontNumber === '04' || infrontNumber === '05' || infrontNumber === '07';
    const checkLenght = phoneNumber.replace(/[^0-9]/g, '').length;
    if (isHomeNumber) {
      if (checkLenght === 9) {
        const phoneHome = phoneNumber.substring(2, phoneNumber.length);
        phoneNumber = `${infrontNumber}- ${phoneHome}`;
      }
    } else {
      if (checkLenght === 10) {
        const phone = phoneNumber.substring(3, phoneNumber.length);
        phoneNumber = `${infrontPhoneNumber} - ${phone}`;
      }
    }
  }
  return phoneNumber;
};
