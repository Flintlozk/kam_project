/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const errorMessageConstraint = (errMessage: any, constraintName: string, valueName: string, operationName: string, objectName: string): string => {
  if (errMessage?.toString().indexOf(constraintName) > 0) {
    return ` '${valueName}' already exists. Please try different value`;
  } else {
    return `Error in ${operationName.toLowerCase()} ${objectName.toLowerCase()}. Please try again later!`;
  }
};
