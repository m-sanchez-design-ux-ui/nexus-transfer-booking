# NexusTours — Airport Transfer Booking (BDR-Landing)

> **Portfolio demo.** This is a personal fork of a real project I worked on
> as UX/UI Designer & UI Developer. The original backend, real credentials,
> and git history are not included here — this fork runs standalone,
> without any real backend, API keys, or a CMS.

## About NexusTours

[NexusTours](https://www.nexustours.com/) is a Destination Management
Company (DMC) with over 25 years of experience, based in Cancún, Mexico.
It operates in 52 destinations across 19 countries in the Caribbean,
Central America, and North America, offering airport transfers, tours,
excursions, and mobility services to travelers arriving at resorts and
hotels in the region.

## About this project

A booking flow ("landing" internally, though it's really a full
multi-step reservation flow rather than a marketing landing page) for
travelers to set up their airport transfer: look up a booking by
reservation number, provide arrival and departure flight details, leave
contact information, and get a confirmation with pickup/drop-off details
for both legs of the trip.

**My role:** UI Designer & UI Developer — design in Figma, and the
front-end implementation in Angular (this repo), including the visual
design system (colors, typography, white-label styling architecture).

**Stack:** Angular 18 (standalone components), Tailwind CSS.

## What's different in this fork

The real project integrates with several paid, private third-party
services this demo has no access to and must never call with real
credentials:

- **FlightStats** — flight search by route or flight number, and the
  airport/airline catalogs. The real service calls this via
  `HttpClient.jsonp()`; this fork replaces the whole
  **`FlightstatsService`** with local mock data instead, since JSONP
  requests are awkward to intercept reliably (Angular's own built-in
  JSONP interceptor can grab them before a custom one gets a chance).
- **A partner reservation system & an internal experiences API** — used
  to look up a booking by reservation number and register contact
  details. Mocked via **`mock-api.interceptor.ts`**, a standard HTTP
  interceptor, since these are regular (non-JSONP) calls.
- **Contentful** — the real project's copy, colors, typography, and
  white-label branding are all fetched at runtime from a Contentful
  space. This fork replaces **`ContentfulService`** directly with local
  mock data (translations for both Spanish and English, and the real
  brand palette/fonts/images — recovered from the project's own git
  history and asset library rather than invented, since the live
  Contentful space isn't reachable here).
- **Fonts** — the real self-hosted fonts (DM Sans, Montserrat, Urbanist)
  are bundled locally via `@font-face` instead of fetched from
  Contentful or a CDN.
- Flight and transfer dates are calculated relative to *today* (not a
  fixed date), so the demo always looks current whenever it's opened.

No other logic was changed — the booking flow, its step-by-step guard
(`route.guard.ts`), and validation all behave exactly as they did
originally.

## Running it locally

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

**Starting a reservation:** any reservation number works — see the note
on the first screen.

## What you can try

- **Start a reservation** (`/`) — enter any number to begin.
- **Arrival flight** (`/arrival-flight`) — search by route or flight
  number.
- **Departure flight** (`/departure-flight`) — same search, for the
  return trip.
- **Contact details** (`/add-contact`)
- **Reservation summary** (`/reservation`) — shows both legs of the
  trip, a QR code, and an "upgrade your transfer" prompt.
- Switch between **Español** and **English** from the language
  selector on any screen.
- Error page: `/404`

## Notes

- All data shown (names, flights, hotels, booking numbers) is
  fictional.
- `npm run build` produces a production build with no dependency on
  the original backend, Contentful, or any external service.

---
Miguel Sánchez — UX/UI Designer & UI Developer
m.sanchez.visual@gmail.com · linkedin.com/in/m-sanchez-murillo
