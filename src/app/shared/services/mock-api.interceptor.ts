import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  MOCK_AIRLINES,
  MOCK_AIRPORTS,
  buildMockBooking,
  buildMockIp,
  buildMockLoginResponse,
  buildMockRawFlightsByFlightNumber,
  buildMockRawFlightsByRoute,
  buildMockRegisterResponse,
} from '../mocks/mock-data';

// ---------------------------------------------------------------------------
// DEMO MOCK API INTERCEPTOR
// ---------------------------------------------------------------------------
// This interceptor exists only in this portfolio-demo fork of the project.
// The real project depends on paid/private third-party APIs (FlightStats,
// a partner reservation system, an internal experiences API) that this
// demo has no access to — every request below is answered locally with
// fictional data instead. Note this covers regular HTTP calls AND the
// JSONP calls FlightStats uses (Angular's JSONP requests still pass
// through this interceptor chain before the script-tag mechanism kicks
// in, so they can be short-circuited the same way).
//
// Contentful is NOT handled here: it's called through Contentful's own
// SDK, not Angular's HttpClient, so it can't be intercepted this way —
// see ContentfulService, which is mocked directly instead.
// ---------------------------------------------------------------------------

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const path = request.url.split('?')[0];

    // --- FlightStats (JSONP) ---------------------------------------------
    if (request.method === 'JSONP') {
      if (path.includes('/flex/airports/rest/')) {
        return this.mockResponse(MOCK_AIRPORTS);
      }
      if (path.includes('/flex/airlines/rest/')) {
        return this.mockResponse(MOCK_AIRLINES);
      }
      if (path.includes('/flex/schedules/rest/v1/jsonp/from/')) {
        const match = path.match(/\/from\/([A-Z]{3})\/to\/([A-Z]{3})\//);
        const departure = match?.[1] ?? MOCK_AIRPORTS[0].iata;
        const arrival = match?.[2] ?? MOCK_AIRPORTS[1].iata;
        return this.mockResponse(buildMockRawFlightsByRoute(departure, arrival));
      }
      if (path.includes('/flex/schedules/rest/v1/jsonp/flight/')) {
        const match = path.match(/\/flight\/([A-Z0-9]+)\/([0-9]+)\//);
        const carrier = match?.[1] ?? MOCK_AIRLINES[0].id;
        const flight = match?.[2] ?? '1000';
        return this.mockResponse(buildMockRawFlightsByFlightNumber(carrier, flight));
      }
    }

    // --- BlueDiamond reservation lookup -----------------------------------
    if (path.endsWith('/bookings') && request.method === 'GET') {
      const locator = request.params.get('Locator') ?? '';
      return this.mockResponse(buildMockBooking(locator));
    }

    if (path.endsWith('/transferModify') && request.method === 'GET') {
      return this.mockResponse({ success: true });
    }

    // --- ExperiencesHub (contact/registration) ----------------------------
    if (path.endsWith('/register') && request.method === 'POST') {
      return this.mockResponse(buildMockRegisterResponse());
    }

    if (path.endsWith('/login') && request.method === 'GET') {
      const code = request.params.get('code') ?? '';
      return this.mockResponse(buildMockLoginResponse(code));
    }

    // --- IP lookup (ipify) -------------------------------------------------
    if (path.includes('api.ipify.org')) {
      return this.mockResponse(buildMockIp());
    }

    // Anything not explicitly mocked above falls through to the real
    // HTTP pipeline.
    return next.handle(request);
  }

  private mockResponse<T>(body: T): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
  }
}
