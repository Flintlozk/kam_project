export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
export const deEnum = (str: string): string => capitalize(str.replace(/_/g, ' '));
