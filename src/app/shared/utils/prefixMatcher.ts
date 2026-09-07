import { UrlSegment, Route } from '@angular/router';

export function prefixMatcher(
  segments: UrlSegment[],
  group: any,
  route: Route
) {
  const fixedRoutes = ['reservation', 'arrival-flight', 'departure-flight', 'add-contact' , 'reservation-detail', '404'];

  if (segments.length === 0) {
    return null;
  }

  const firstSegment = segments[0].path;

  if (fixedRoutes.includes(firstSegment)) {
    // Es una ruta fija, no un prefix
    return null;
  }

  return {
    consumed: [segments[0]],
    posParams: {
      prefix: segments[0],
    },
  };
}
