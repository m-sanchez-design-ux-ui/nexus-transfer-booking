import { Injectable } from '@angular/core';
import { Airports } from '../interfaces/flightstats-search-by-flightNumber-route.interface';

@Injectable({
  providedIn: 'root',
})
export class AirportDataService {
    private readonly STORAGE_AIRPORTS = 'airports';

    setAirports(airports: Airports[]){
        localStorage.setItem(this.STORAGE_AIRPORTS, JSON.stringify(airports));
    }

    getAirports(): string | null{
        return localStorage.getItem(this.STORAGE_AIRPORTS);
    }
}
