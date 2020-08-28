export default () => {
  if (process.env.WEBPACK) {
    return {
      timezone: new Date().getTimezoneOffset() / 60,
      browserEngine: window.navigator.product,
      browserVersion1a: window.navigator.appVersion,
      browserLanguage: navigator.language,
      browserPlatform: navigator.platform,
    };
  }
  return {
    timezone: 0,
    browserEngine: 'default',
    browserVersion1a: 'default',
    browserLanguage: 'default',
    browserPlatform: 'default',
  };
};
