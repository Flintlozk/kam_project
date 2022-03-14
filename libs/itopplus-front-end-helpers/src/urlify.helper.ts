export const urlify = (text: string): string => {
  if (text) {
    const urlRegex = /\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#/%=~_|$?!:,.]*[A-Z0-9+&@#/%=~_|$]/gi;
    return text.replace(urlRegex, function (url) {
      return `<a href="${url.indexOf('ftp://') === -1 ? '//' : ''}` + url.replace('https://', '').replace('http://', '') + '" target="_blank">' + url + '</a>';
    });
  } else {
    return '';
  }
};
