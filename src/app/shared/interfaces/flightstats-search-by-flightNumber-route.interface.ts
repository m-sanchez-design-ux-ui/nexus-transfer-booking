// interface to return flight information
export interface IFlightStatsFlightReduce {
  arrivalCityName: string;
  departureCityName: string;
  carrierFsCode: string;
  departureIataCode: string;
  arrivalIataCode: string;
  arrivalDate: {
    dateLocal: string;
  };
  departureDate: {
    dateLocal: string;
  };
  flightNumber: string;
  codeshares: {
    fsCode: string;
  }[];
  airlineName: string;
}

// flightStats data returned from the API
export interface FlightsByRouteRequest {
  departureAirport: string;
  arrivalAirport: string;
  year: string;
  month: string;
  day: string;
}

interface Airlines {
  fs: string;
  iata: string;
  icao: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  dateFrom: string;
  dateTo: string;
  category: string;
}

export interface Airports {
  fs: string;
  iata: string;
  icao: string;
  faa: string;
  name: string;
  street1: string;
  street2: string;
  city: string;
  cityCode: string;
  stateCode: string;
  postalCode: string;
  countryCode: string;
  district: string;
  countryName: string;
  regionName: string;
  timeZoneRegionName: string;
  weatherZone: string;
  localTime: string;
  utcOffsetHours: number;
  latitude: number;
  longitude: number;
  elevationFeet: number;
  classification: number;
  active: boolean;
  dateFrom: string;
  dateTo: string;
  weatherUrl: string;
  delayIndexUrl: string;
}

interface Equipments {
  iata: string;
  name: string;
  turboProp: boolean;
  jet: boolean;
  widebody: boolean;
  regional: boolean;
}

interface Carrier {
  fs: string;
  iata: string;
  icao: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  dateFrom: string;
  dateTo: string;
  category: string;
}

interface Codeshares {
  carrierFsCode: string;
  carrier: Carrier;
  flightNumber: number;
  serviceType: string;
  serviceClasses: string;
  trafficRestrictions: string;
  referenceCode: number;
}

interface ScheduledFlights {
  carrierFsCode: string;
  carrier: Carrier;
  flightNumber: number;
  brand: string;
  departureAirportFsCode: string;
  departureAirport: Airports;
  arrivalAirportFsCode: string;
  arrivalAirport: Airports;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  departureTerminal: number;
  arrivalTerminal: number;
  flightEquipmentIataCode: number;
  flightEquipment: {
    iata: string;
    name: string;
    turboProp: boolean;
    jet: boolean;
    widebody: boolean;
    regional: boolean;
  };
  isCodeshare: boolean;
  isWetlease: boolean;
  serviceType: string;
  serviceClasses: string;
  trafficRestrictions: string;
  codeshares: Codeshares[];
  operator: {
    carrierFsCode: string;
    carrier: Carrier;
    flightNumber: number;
    serviceType: string;
    serviceClasses: string;
    trafficRestrictions: string;
    referenceCode: number;
  };
  wetleaseOperator: Carrier;
  wetleaseOperatorFsCode: string;
  referenceCode: string;
  elapsedTime: number;
}

export interface FlihtsByRouteResponse {
  request: {
    carrier: {
      requested: string;
      interpreted: string;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: boolean;
      requestedCode: string;
      fsCode: string;
    };
    flightNumber: {
      requested: string;
      interpreted: string;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: boolean;
      requestedCode: string;
      fsCode: string;
    };
    departing: boolean;
    hourOfDay: {
      requested: string;
      interpreted: number;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: boolean;
      requestedCode: string;
      fsCode: string;
    };
    codeType: {
      requested: string;
      interpreted: string;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: boolean;
      requestedCode: string;
      fsCode: string;
    };
    url: string;
    airport: {
      requested: string;
      interpreted: string;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: boolean;
      requestedCode: string;
      fsCode: string;
    };
    departureAirport: {
      requested: string;
      interpreted: string;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: true;
      requestedCode: string;
      fsCode: string;
    };
    arrivalAirport: {
      requested: string;
      interpreted: string;
      airport: Airports;
      airline: Airlines;
      equipment: Equipments;
      legacyCode: true;
      requestedCode: string;
      fsCode: string;
    };
    date: {
      year: string;
      month: string;
      day: string;
      hour: string;
      minute: string;
      interpreted: string;
    };
  };
  scheduledFlights: ScheduledFlights[];
  appendix: {
    airlines: Airlines[];
    airports: Airports[];
    equipments: Equipments[];
  };
  error?: {
    httpStatusCode: number;
    errorId: string;
    errorMessage: string;
    errorCode: string;
  };
}

/* -----------------------------------------------------FLIGHT BY NUMBER--------------------------------------------------- */

export interface FlightsByFlightNumberRequest {
  carrier: string;
  flight: string;
  year: string;
  month: string;
  day: string;
}

interface CodesharesData {
  carrierFsCode: string;
  flightNumber: string;
  serviceType: string;
  serviceClasses: string[];
  trafficRestrictions: string[];
  referenceCode: number;
}

interface ScheduledFlightsData {
  carrierFsCode: string;
  flightNumber: string;
  departureAirportFsCode: string;
  arrivalAirportFsCode: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  arrivalTerminal: string;
  flightEquipmentIataCode: string;
  isCodeshare: boolean;
  isWetlease: boolean;
  serviceType: string;
  serviceClasses: string[];
  trafficRestrictions: string[];
  codeshares: CodesharesData[];
  referenceCode: string;
}

interface AirlinesData {
  fs: string;
  iata: string;
  icao: string;
  name: string;
  active: true;
}

interface AirportsData {
  fs: string;
  iata: string;
  icao: string;
  faa: string;
  name: string;
  street1: string;
  street2: string;
  city: string;
  cityCode: string;
  stateCode: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  timeZoneRegionName: string;
  weatherZone: string;
  localTime: string;
  utcOffsetHours: number;
  latitude: number;
  longitude: number;
  elevationFeet: number;
  classification: number;
  active: boolean;
}

interface EquipmentsData {
  iata: string;
  name: string;
  turboProp: boolean;
  jet: boolean;
  widebody: boolean;
  regional: boolean;
}

export interface FlightByFlightNumberResponse {
  request: {
    carrier: {
      requestedCode: string;
      fsCode: string;
    };
    flightNumber: {
      requested: string;
      interpreted: string;
    };
    departing: boolean;
    url: string;
    date: {
      year: string;
      month: string;
      day: string;
      interpreted: string;
    };
  };
  scheduledFlights: ScheduledFlightsData[];
  appendix: {
    airlines: AirlinesData[];
    airports: AirportsData[];
    equipments: EquipmentsData[];
  };
  error?: {
    httpStatusCode: number;
    errorId: string;
    errorMessage: string;
    errorCode: string;
  };
}

/* ------------------------------------------------------------------- */

export interface NoResultFlights {
  airline: {
    id: string;
    name: string;
  };
  flightNumber: string;
  hour: string;
  minute: string;
  period: string;
}
