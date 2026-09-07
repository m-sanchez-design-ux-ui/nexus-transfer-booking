// DEMO NOTE: this file is unused by the app at runtime (config is loaded
// from src/assets/config/appsettings.json instead — see
// AppSettingsService). It's kept only for reference, with all real values
// replaced by placeholders since it's not excluded from git in the
// original project.
export const environment = {
  production: false,
  //contentful
  contentfulSpace: 'demo-space',
  contentfulAccessToken: 'demo-access-token',
  contentfulEnvironment: 'staging',
  contentfulContent_type: 'bdrLandingPageBaseStg',
  contentfulContent_type_text: 'bdrLandingPageTextStg',
  //ApiBlueDiamond
  blueDiamondApiUrl: 'https://demo.api.example.com/APIReservasBlueDiamond/v1/validation/bookingsws',
  blueDiamondApiKey: 'demo-api-key',
  //ApiExperiencesHub
  experiencesHubApiUrl: 'https://demo.api.example.com/ExperiencesHubServices/api/ExperiencesHubGroups',
  //flightstats
  flightstatsBaseUrl: 'https://api.flightstats.com',
  appId: 'demo-app-id',
  appKey: 'demo-app-key',
  //apiIpify
  ipifyApiUrl: 'https://api.ipify.org?format=json',
  //apiIpapi
  ipapiApiUrl: 'https://ipapi.co/json/',
  phoneCall: '+10000000000',
};
