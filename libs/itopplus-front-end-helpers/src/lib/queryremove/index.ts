export function queryRemove(attachemntUrl: string): string {
  const url = new URL(attachemntUrl);
  url.search = '';
  return url.href;
}
