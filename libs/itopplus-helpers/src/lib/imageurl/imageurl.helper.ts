export function transformResizeImageURLToNormalUrl(url: string) {
  if (url) {
    const normalUrl = new URL(url.replace('/resize/', '/'));
    normalUrl.search = '';
    return normalUrl.href;
  } else {
    return null;
  }
}
