export function stripFilePath(filepath: string): string {
  const filepathSplit = filepath.split('/');
  const pathArray = filepathSplit.slice(filepathSplit.length - 2, filepathSplit.length);
  return pathArray.join('/');
}
