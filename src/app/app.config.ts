import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withJsonpSupport,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { routes } from './app.routes';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';
import { MockApiInterceptor } from '@/app/shared/services/mock-api.interceptor';

function initializeApp(appSettingsService: AppSettingsService) {
  return (): Promise<void> => {
    return appSettingsService.init();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // DEMO ONLY: intercepts calls to third-party services (FlightStats,
    // partner reservation API, experiences API) with local mock data,
    // since this portfolio demo has no access to the real backends.
    // IMPORTANT: this must be registered BEFORE provideHttpClient() below.
    // withJsonpSupport() registers its own HTTP_INTERCEPTORS entry
    // (JsonpInterceptor), and HTTP_INTERCEPTORS run in the order they were
    // provided — if that interceptor came first, it would hand every
    // JSONP request (airports, airlines, flight search) straight to the
    // real network before this mock ever got a chance to answer it.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockApiInterceptor,
      multi: true,
    },
    provideHttpClient(withJsonpSupport(), withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppSettingsService],
      multi: true
    }
  ]
};
