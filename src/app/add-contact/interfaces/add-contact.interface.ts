interface ChannelsData {
  rank: number;
  channel: string;
  value: string;
}

export interface RequestRegister {
  locator: string;
  name: string;
  lastname: string;
  language: string;
  birthday?: string;
  delegation_id: number;
  lines: number[];
  channels: ChannelsData[];
  ip: string;
  terms: boolean;
  promotions?: boolean;
  send_msn?: boolean;
  app: string;
}

export interface ResponseGetIP {
  ip: string;
}

export interface ResponseLogin {
  locator: string;
  contact: string;
  lines: number[];
  name: string;
  lastname: string;
  delegation_id: number;
  entry_id: string;
  language: string;
  status: string;
  is_groups: boolean;
  is_registered: boolean;
  is_booking_registered: boolean;
  token: string | null;
  is_valid: boolean;
  errors: [];
}

export interface TransferModifyRequest {
  Locator: string;
  AgencyRef: string;
  HotelCodeArrival: string;
  FlightNumberArrival: string;
  FlightDateTimeArrival: string;
  AirportArrival: string;
  HotelCodeDeparture: string;
  FlightNumberDeparture: string;
  FlightDateTimeDeparture: string;
  AirportDeparture: string;
  WhatsappCodCountry: string;
  WhatsappNumber: string;
  SmsCodCountry: string;
  SmsNumber: string;
  Email: string;
}