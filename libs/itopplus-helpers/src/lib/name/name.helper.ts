export const getFileNameFromPath = (url: string): string => {
  const filenameSplit = url.split('?')[0].split('/');
  const filename = filenameSplit[filenameSplit.length - 1];
  return filename;
};
