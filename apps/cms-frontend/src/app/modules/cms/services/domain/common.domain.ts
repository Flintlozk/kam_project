import { ElementRef } from '@angular/core';
import { IDropDown } from '@reactor-room/cms-models-lib';

export const autoCompleteFilter = (value: string, filterArray: IDropDown[] | string[], type: string): IDropDown[] | string[] => {
  const filterValue = autoCompleteNormalizeValue(value);
  switch (type) {
    case 'object':
      filterArray = filterArray as IDropDown[];
      return filterArray.filter((item) => autoCompleteNormalizeValue(item.title).includes(filterValue));
    case 'string':
      filterArray = filterArray as string[];
      return filterArray.filter((item) => autoCompleteNormalizeValue(item).includes(filterValue));
    default:
      break;
  }
};

export const autoCompleteNormalizeValue = (value: string): string => {
  return value?.toLowerCase().replace(/\s/g, '');
};

export const isValidMonacco = async (monacoRef: ElementRef): Promise<boolean> => {
  const monacoElement = monacoRef?.nativeElement as HTMLElement;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const errorClass = monacoElement?.querySelector('.squiggly-error');
  return errorClass ? false : true;
};

export const replaceHrefAttribute = (replaceTerm: string, replaceValue: string) => {
  const styleSheets = document.querySelectorAll("link[rel='stylesheet']");
  const styleSheetsArray = Array.from(styleSheets);
  styleSheetsArray.forEach((styleSheet) => {
    const href = styleSheet.getAttribute('href');
    if (href.includes(replaceTerm)) {
      styleSheet.setAttribute('href', replaceValue);
    }
  });
};
