export interface Airport {
  name: string;
  iata: string;
}

export const AIRPORTS: Airport[] = [
  { iata: 'AKO', name: 'Washington County Airport' },
  { iata: 'EZE', name: 'Ministro Pistarini International Airport (Ezeiza)' },
  { iata: 'JFK', name: 'John F. Kennedy International Airport' },
  { iata: 'LAX', name: 'Los Angeles International Airport' },
  { iata: 'ORD', name: 'O’Hare International Airport' },
  { iata: 'ATL', name: 'Hartsfield–Jackson Atlanta International Airport' },
  { iata: 'CDG', name: 'Charles de Gaulle Airport' },
  { iata: 'LHR', name: 'Heathrow Airport' },
  { iata: 'DFW', name: 'Dallas/Fort Worth International Airport' },
  { iata: 'NRT', name: 'Narita International Airport' },
];
