export interface AppSettings {
  contentful: IContentfulConfig;
  flightStats: IFlightStatsConfig;
  api: IApiConfig;
  contact: {
    phoneCall: string;
  };
  chatbot: IChatbotConfig;
}

export interface IContentfulConfig {
  space: string;
  accessToken: string;
  environment: string;
  styleContentTypeId: string;
  textContentTypeId: string;
}

export interface IFlightStatsConfig {
  baseUrl: string;
  appId: string;
  appKey: string;
}

export interface IApiConfig {
  blueDiamondApiUrl: string;
  blueDiamondApiKey: string;
  experiencesHubApiUrl: string;
  ipifyApiUrl: string;
  ipapiApiUrl: string;
}

export interface IChatbotConfig {
  apiUrl: string;
  companyName: string;
  primaryColor: string;
  textColor: string;
  position: 'bottom-right' | 'bottom-left';
  enableGlow: boolean;
  enableSound: boolean;
  enablePulse: boolean;
  initialDelay: number;
  reminderInterval: number;
  maxReminders: number;
  pollingInterval: number;
}

export interface IAppSettings {
  contentful: IContentfulConfig;
  flightStats: IFlightStatsConfig;
  api: IApiConfig;
}
