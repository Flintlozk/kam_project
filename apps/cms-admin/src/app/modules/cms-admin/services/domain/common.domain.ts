import { ElementRef } from '@angular/core';

export const isValidMonacco = async (monacoRef: ElementRef): Promise<boolean> => {
  const monacoElement = monacoRef.nativeElement as HTMLElement;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const errorClass = monacoElement.querySelector('.squiggly-error');
  return errorClass ? false : true;
};
