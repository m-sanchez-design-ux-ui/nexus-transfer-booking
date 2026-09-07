export const detectMobile = (): boolean => {
  if (
    // @ts-ignore
    navigator.userAgentData &&
    // @ts-ignore
    typeof navigator.userAgentData.mobile === 'boolean'
  ) {
    // @ts-ignore
    return navigator.userAgentData.mobile;
  }
  const ua = navigator.userAgent || (window as any).opera || '';
  if (
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  ) {
    return true;
  }
  if (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) {
    return true;
  }
  return window?.screen?.width ? window.screen.width <= 800 : false;
};
