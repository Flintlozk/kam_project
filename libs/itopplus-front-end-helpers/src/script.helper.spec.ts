import { checkScript } from './script.helper';
describe('test script function', () => {
  test('found script', () => {
    const mockstring = ` <!-- Global site tag (gtag.js) - Google Ads: 955866358 --><script async src="https://www.googletagmanager.com/gtag/js?id=AW-955866358"></script><script>  window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'AW-955866358');</script>`;
    const result = checkScript(mockstring);
    expect(result).toBe(true);
  });
  test('not found', () => {
    const mockstring = 'www.google.com';
    const result = checkScript(mockstring);
    expect(result).toBe(false);
  });
  test('found iframe', () => {
    const mockstring = '<iframe></iframe>';
    const result = checkScript(mockstring);
    expect(result).toBe(true);
  });
});
