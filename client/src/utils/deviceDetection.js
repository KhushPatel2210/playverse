// Device detection utility
export const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile devices
  const mobileRegex = /android|webos|iphone|ipad|ipod|/i;
  
  return mobileRegex.test(userAgent.toLowerCase());
};