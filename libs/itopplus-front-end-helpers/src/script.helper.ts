export const checkScript = (text: string): boolean => {
  const scriptInTextRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  const iframeInTextRegex = /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi;
  const isScript = scriptInTextRegex.test(text);
  const isIFrame = iframeInTextRegex.test(text);
  if (!isScript && !isIFrame) {
    return false;
  } else {
    return true;
  }
};
