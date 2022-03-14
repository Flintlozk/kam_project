export const isMobile = (): boolean => {
  const matchMobileDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i);
  return matchMobileDevice !== null && matchMobileDevice.length > 0 ? true : false;
};
