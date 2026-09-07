export interface IAirlinesToSelect {
  id: string;
  name: string;
}

export interface IFlighstatsActiveAirlines {
  fs: string;
  iata?: string;
  icao?: string;
  name: string;
  active: boolean;
  category: Category;
  phoneNumber?: string;
}

export enum Category {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  I = 'I',
  J = 'J',
  K = 'K',
}
