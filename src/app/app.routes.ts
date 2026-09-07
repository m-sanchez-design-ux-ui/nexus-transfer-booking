import { Routes } from '@angular/router';

import { PrefixGuard } from '@/app/shared/guards/prefix.guard';
import { prefixMatcher } from '@/app/shared/utils/prefixMatcher';
import { routeGuard } from '@/app/shared/guards/route.guard';

export const routes: Routes = [
  // Con prefix (usa el guard)
  {
    matcher: prefixMatcher,
     canActivate: [PrefixGuard, routeGuard],
    children: [
      {
        path: 'arrival-flight',
        title: 'Arrival Flight',
        canActivate: [PrefixGuard, routeGuard],
        loadComponent: () =>
          import(
            '@/app/arrival-flight/pages/arrival-flight/arrival-flight.component'
          ).then((c) => c.ArrivalFlightComponent),
      },
      {
        path: 'departure-flight',
        title: 'Departure Flight',
        canActivate: [PrefixGuard, routeGuard],
        loadComponent: () =>
          import(
            '@/app/return-flight/pages/return-flight/return-flight.component'
          ).then((c) => c.ReturnFlightComponent),
      },
      {
        path: 'add-contact',
        title: 'Add Contact',
        canActivate: [PrefixGuard, routeGuard],
        loadComponent: () =>
          import('@/app/add-contact/pages/add-contact.component').then(
            (c) => c.AddContactComponent
          ),
      },
      {
        path: 'reservation-detail',
        title: 'Reservation Detail',
        canActivate: [PrefixGuard, routeGuard],
        loadComponent: () =>
          import(
            '@/app/reservation-detail/pages/reservation-detail.component'
          ).then((c) => c.ReservationDetailComponent),
      },
    ],
  },
  {
    path: 'arrival-flight',
    title: 'Arrival Flight',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import(
        '@/app/arrival-flight/pages/arrival-flight/arrival-flight.component'
      ).then((c) => c.ArrivalFlightComponent),
  },
  {
    path: 'departure-flight',
    title: 'Departure Flight',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import(
        '@/app/return-flight/pages/return-flight/return-flight.component'
      ).then((c) => c.ReturnFlightComponent),
  },
  {
    path: 'add-contact',
    title: 'Add Contact',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import('@/app/add-contact/pages/add-contact.component').then(
        (c) => c.AddContactComponent
      ),
  },
  {
    path: 'reservation-detail',
    title: 'Reservation Detail',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import(
        '@/app/reservation-detail/pages/reservation-detail.component'
      ).then((c) => c.ReservationDetailComponent),
  },
  {
    path: '',
    title: 'Reservation',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import(
        './start-reservation/pages/start-reservation/start-reservation.component'
      ).then((c) => c.StartReservationComponent),
  },
  {
    path: 'reservation',
    title: 'Reservation',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import(
        './start-reservation/pages/start-reservation/start-reservation.component'
      ).then((c) => c.StartReservationComponent),
  },

  // 404
  {
    path: '404',
    title: '404 - Not Found',
    canActivate: [PrefixGuard, routeGuard],
    loadComponent: () =>
      import('@/app/not-found/pages/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
