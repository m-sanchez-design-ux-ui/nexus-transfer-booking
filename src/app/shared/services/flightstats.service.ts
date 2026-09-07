import { inject, Injectable, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  IFlighstatsActiveAirlines,
  IAirlinesToSelect,
} from '@/app/shared/interfaces/flighstats-airlines-active.interface';
import {
  Airports,
  FlightByFlightNumberResponse,
  FlightsByFlightNumberRequest,
  FlightsByRouteRequest,
  FlihtsByRouteResponse,
  IFlightStatsFlightReduce,
} from '../interfaces/flightstats-search-by-flightNumber-route.interface';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';
import {
  MOCK_AIRLINES,
  MOCK_AIRPORTS,
  buildMockRawFlightsByFlightNumber,
  buildMockRawFlightsByRoute,
} from '@/app/shared/mocks/mock-data';

// ---------------------------------------------------------------------------
// DEMO NOTE
// ---------------------------------------------------------------------------
// The real FlightstatsService calls the FlightStats API via
// HttpClient.jsonp(), which this demo has no access to (and shouldn't try
// to reach with fake credentials). JSONP requests are also awkward to
// intercept reliably — Angular's own built-in JsonpInterceptor can grab
// them before a custom HTTP interceptor gets a chance to. So instead,
// this whole service was replaced with local mock data, the same
// approach used for ContentfulService. No real HttpClient.jsonp() call is
// made anywhere in this file.
// ---------------------------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class FlightstatsService {
  private readonly appSettings = inject(AppSettingsService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl = computed(
    () => this.appSettings.flightStatsConfig()?.baseUrl ?? ''
  );

  private readonly appId = computed(
    () => this.appSettings.flightStatsConfig()?.appId ?? ''
  );

  private readonly appKey = computed(
    () => this.appSettings.flightStatsConfig()?.appKey ?? ''
  );

  getAirport() {
    // The real Airports interface has dozens of fields the app never
    // actually reads (only .iata/.name matter downstream), so this mock
    // fills just those two and casts the rest.
    const airports = MOCK_AIRPORTS.map((a) => ({
      iata: a.iata,
      name: a.name,
    })) as unknown as Airports[];
    return of(airports).pipe(delay(400));
  }

  getAirlines(): Observable<IAirlinesToSelect[]> {
    const result = MOCK_AIRLINES.map((a) => ({ id: a.id, name: a.name }));
    return of(result).pipe(delay(400));
  }

  private getAirportData(data: any[], departureAirport: string) {
    if (data[0].iata === departureAirport) {
      return [data[0], data[1]];
    } else {
      return [data[1], data[0]];
    }
  }

  getFlightsByRoute(
    data: FlightsByRouteRequest,
    isArrival: boolean
  ): Observable<IFlightStatsFlightReduce[]> {
    const departureIata = data.departureAirport;
    const raw = buildMockRawFlightsByRoute(
      data.departureAirport,
      data.arrivalAirport,
      isArrival
    );

    return of(raw).pipe(
      delay(500),
      map((data) => {
        if (!data?.scheduledFlights) return [];
        const [departureAirport, arrivalAirport] = this.getAirportData(
          data.appendix.airports,
          departureIata
        );
        return data.scheduledFlights.map((flight) => {
          return {
            arrivalCityName: arrivalAirport.city ?? '',
            departureCityName: departureAirport.city ?? '',
            carrierFsCode: flight.carrierFsCode ?? '',
            arrivalIataCode: arrivalAirport.iata ?? '',
            departureIataCode: departureAirport.iata ?? '',
            arrivalDate: {
              dateLocal: flight.arrivalTime ?? '',
            },
            departureDate: {
              dateLocal: flight.departureTime ?? '',
            },
            flightNumber: flight.flightNumber.toString() ?? '',
            airlineName: data.appendix.airlines[0].name,
            codeshares: flight.codeshares
              ? flight.codeshares.map((codeShare: any) => ({
                  fsCode: codeShare.carrierFsCode ?? '',
                }))
              : [],
          };
        });
      })
    );
  }

  getFlightsByFlightNumber(
    data: FlightsByFlightNumberRequest,
    isArrival: boolean
  ) {
    const raw = buildMockRawFlightsByFlightNumber(data.carrier, data.flight, isArrival);

    return of(raw).pipe(
      delay(500),
      map((data) => {
        if (!data?.scheduledFlights) return [];
        const [departureAirport, arrivalAirport] = this.getAirportData(
          data.appendix.airports,
          data.scheduledFlights.length > 0
            ? data.scheduledFlights[0].departureAirportFsCode
            : ''
        );
        return data.scheduledFlights.map((flight) => {
          return {
            arrivalCityName: arrivalAirport.city ?? '',
            departureCityName: departureAirport.city ?? '',
            carrierFsCode: flight.carrierFsCode ?? '',
            arrivalIataCode: arrivalAirport.iata ?? '',
            departureIataCode: departureAirport.iata ?? '',
            arrivalDate: {
              dateLocal: flight.arrivalTime ?? '',
            },
            departureDate: {
              dateLocal: flight.departureTime ?? '',
            },
            flightNumber: flight.flightNumber ?? '',
            airlineName: data.appendix.airlines[0].name,
            codeshares: flight.codeshares
              ? flight.codeshares.map((codeShare: any) => ({
                  fsCode: codeShare.carrierFsCode ?? '',
                }))
              : [],
          };
        });
      })
    );
  }
}
