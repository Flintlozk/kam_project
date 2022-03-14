const DEFAULT_ANY_NUMBER = 10;
export const convertNumberToPx = (value: number): string => (value ? `${value}px` : '0px');
export const convertPxToNumber = (value: string): number => parseInt(value, DEFAULT_ANY_NUMBER);
