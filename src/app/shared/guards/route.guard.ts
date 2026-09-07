import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PrefixContextService } from '@/app/shared/services/prefix-context.service';

interface BookingData {
  hasDataBooking: boolean;
  hasArrivalFlightData: boolean;
  hasDepartureFlightData: boolean;
  hasAllData: boolean;
}

interface NavigationUrls {
  navigateUrl: string;
  prefixedRoute: string;
}

const getSessionData = (): BookingData => {
  const dataBooking = localStorage.getItem('dataBooking');
  const arrivalFlightData = localStorage.getItem('selectedArrivalFlight');
  const departureFlightData = localStorage.getItem('selectedDepartureFlight');
  const departureNoFlightSearchData = localStorage.getItem(
    'selectedDepartureNoFlightSearch'
  );
  const arrivalNoFlightSearchData = localStorage.getItem(
    'selectedArrivalNoFlightSearch'
  );
  
  const hasDataBooking = !!dataBooking;
  const hasArrivalFlightData = !!(
    arrivalFlightData || arrivalNoFlightSearchData
  );
  const hasDepartureFlightData = !!(
    departureFlightData || departureNoFlightSearchData
  );
  const hasAllData =
    hasDataBooking && hasArrivalFlightData && hasDepartureFlightData;

  return {
    hasDataBooking,
    hasArrivalFlightData,
    hasDepartureFlightData,
    hasAllData,
  };
};

const getNavigationUrls = (
  prefixContextService: PrefixContextService
): NavigationUrls => {
  const prefix = prefixContextService.prefix();
  const navigateUrl = prefix ? `/${prefix}` : '/';
  const prefixedRoute = prefix ? `/${prefix}` : '';

  return { navigateUrl, prefixedRoute };
};

const buildRoute = (prefixedRoute: string, route: string): string => {
  return prefixedRoute ? `${prefixedRoute}/${route}` : `/${route}`;
};

const isRouteMatch = (
  currentUrl: string,
  routeName: string,
  prefixedRoute: string
): boolean => {
  // Verificar rutas con prefijo: /prefijo/ruta
  if (prefixedRoute && currentUrl.includes(`${prefixedRoute}/${routeName}`)) {
    return true;
  }
  // Verificar rutas sin prefijo: /ruta
  if (
    !prefixedRoute &&
    currentUrl.includes(`/${routeName}`) &&
    !currentUrl.includes('/')
  ) {
    return true;
  }
  // Verificar usando includes para mayor flexibilidad
  return currentUrl.includes(routeName);
};

const isHomeRoute = (currentUrl: string, urls: NavigationUrls): boolean => {
  const homeRoutes = ['/', '/reservation'];

  return homeRoutes.includes(currentUrl);
};

const handleArrivalFlightRoute = (
  router: Router,
  bookingData: BookingData,
  urls: NavigationUrls
): boolean => {
  if (!bookingData.hasDataBooking) {
    router.navigate([urls.navigateUrl]);
    return false;
  }
  if (
    bookingData.hasDataBooking &&
    bookingData.hasArrivalFlightData &&
    !bookingData.hasDepartureFlightData
  ) {
    router.navigate([buildRoute(urls.prefixedRoute, 'departure-flight')]);
    return false;
  }
  if (bookingData.hasAllData) {
    router.navigate([buildRoute(urls.prefixedRoute, 'add-contact')]);
    return false;
  }
  return true;
};

const handleDepartureFlightRoute = (
  router: Router,
  bookingData: BookingData,
  urls: NavigationUrls
): boolean => {
  if (!bookingData.hasDataBooking) {
    router.navigate([urls.navigateUrl]);
    return false;
  }
  if (bookingData.hasDataBooking && !bookingData.hasArrivalFlightData) {
    router.navigate([buildRoute(urls.prefixedRoute, 'arrival-flight')]);
    return false;
  }
  if (bookingData.hasAllData) {
    router.navigate([buildRoute(urls.prefixedRoute, 'add-contact')]);
    return false;
  }
  return true;
};

const handleAddContactRoute = (
  router: Router,
  bookingData: BookingData,
  urls: NavigationUrls
): boolean => {
  return handleRouteWithFullValidation(router, bookingData, urls);
};

const handleReservationDataRoute = (
  router: Router,
  bookingData: BookingData,
  urls: NavigationUrls
): boolean => {
  return handleRouteWithFullValidation(router, bookingData, urls);
};

const handleRouteWithFullValidation = (
  router: Router,
  bookingData: BookingData,
  urls: NavigationUrls
): boolean => {
  if (!bookingData.hasDataBooking) {
    router.navigate([urls.navigateUrl]);
    return false;
  }
  if (bookingData.hasDataBooking && !bookingData.hasArrivalFlightData) {
    router.navigate([buildRoute(urls.prefixedRoute, 'arrival-flight')]);
    return false;
  }
  if (
    bookingData.hasDataBooking &&
    bookingData.hasArrivalFlightData &&
    !bookingData.hasDepartureFlightData
  ) {
    router.navigate([buildRoute(urls.prefixedRoute, 'departure-flight')]);
    return false;
  }
  return true;
};

export const routeGuard: CanActivateFn = (_, state) => {
  const router = inject(Router);
  const prefixContextService = inject(PrefixContextService);
  const bookingData = getSessionData();
  const urls = getNavigationUrls(prefixContextService);
  const currentUrl = state.url;

  // Si es una ruta con prefijo pero NO es una ruta del stepper válida, redirigir a home
  if (urls.prefixedRoute && currentUrl.startsWith(urls.prefixedRoute)) {
    const validStepperRoutes = [
      'arrival-flight',
      'departure-flight',
      'add-contact',
      'reservation-detail',
    ];

    const isValidStepperRoute = validStepperRoutes.some((route) =>
      isRouteMatch(currentUrl, route, urls.prefixedRoute)
    );

    if (!isValidStepperRoute) {
      router.navigate(['/']);
      return false;
    }
  }

  // Manejar ruta principal / o /reservation o /prefijo
  if (isHomeRoute(currentUrl, urls)) {
    return true;
  }

  // Manejar rutas específicas del stepper
  if (isRouteMatch(currentUrl, 'arrival-flight', urls.prefixedRoute)) {
    return handleArrivalFlightRoute(router, bookingData, urls);
  }

  if (isRouteMatch(currentUrl, 'departure-flight', urls.prefixedRoute)) {
    return handleDepartureFlightRoute(router, bookingData, urls);
  }

  if (isRouteMatch(currentUrl, 'add-contact', urls.prefixedRoute)) {
    return handleAddContactRoute(router, bookingData, urls);
  }

  if (isRouteMatch(currentUrl, 'reservation-detail', urls.prefixedRoute)) {
    return handleReservationDataRoute(router, bookingData, urls);
  }

  return true;
};
