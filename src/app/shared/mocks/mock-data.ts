// ---------------------------------------------------------------------------
// DEMO MOCK DATA
// ---------------------------------------------------------------------------
// This file exists only in this portfolio-demo fork of the project.
// The original project depends on several real, paid third-party services
// (FlightStats, a partner reservation API, an internal experiences API,
// and Contentful for copy/branding) that this demo has no access to and
// must never call with real credentials. Everything below is fictional
// data shaped like those real responses, so the booking flow (search a
// reservation → pick arrival/departure flights → add contact → see the
// reservation detail) works end to end without any real backend.
// ---------------------------------------------------------------------------

// --- i18n text (originally fetched from Contentful) -----------------------

// DEMO NOTE: dates below are calculated relative to "today" (whenever the
// demo is actually opened) instead of a fixed date, so the flow always
// looks current — a fixed date would eventually show as "in the past"
// once enough time goes by.
function daysFromToday(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  spanish: {
    // Start reservation (screen 1)
    start_reservation_title: 'Tu viaje comienza aquí',
    start_reservation_paragraph:
      'Queremos asegurarnos de que tu traslado esté listo justo cuando llegues. Empecemos ingresando tu número de reservación así revisamos los detalles de tu viaje.',
    start_reservation_label: 'Número de reservación',
    start_reservation_main_button: 'Empezar ahora',
    start_reservation_contact_button: 'Contáctanos',
    start_reservation_modal_button: 'Entendido',

    // Stepper
    stepper_step_01_label: 'PASO 1',
    stepper_step_02_label: 'PASO 2',
    stepper_step_03_label: 'PASO 3',
    stepper_step_01_title: 'Vuelo de llegada',
    stepper_step_02_title: 'Vuelo de salida',
    stepper_step_03_title: 'Datos de contacto',
    stepper_step_03_desktop_title: 'Datos de contacto',
    stepper_step_03_mobile_title: 'Contacto',
    steper_welcome: 'Buenas,',

    // Arrival flight
    arrival_flight_greeting: 'Hola,',
    arrival_flight_title: 'Vamos a preparar tu llegada',
    arrival_flight_paragraph:
      'Con la información de tu vuelo, nos aseguramos de que tu transporte esté listo cuando aterrices',
    arrival_flight_arrival_date_label: 'Tu fecha de llegada es el',
    arrival_flight_search_button: 'Buscar mi vuelo',

    // Departure flight
    departure_flight_title: 'Ahora preparemos tu viaje de regreso',
    departure_flight_departure_date_title: 'Tu fecha de salida es el',
    departure_flight_route_airport_from_title: 'Aeropuerto del que sales',
    departure_flight_route_airport_to_text: '¿A que aeropuerto vas?',
    departure_flight_route_airport_to_text_mobile: '¿A que aeropuerto vas?',
    departure_flight_route_airport_to_destination: 'Destino',
    departure_flight_route_departure_time_title: '¿A que hora sale tu vuelo?',

    // Route/airport search (shared)
    tabs_route_origin_question: '¿Desde dónde vienes?',
    tabs_route_origin_question_mobile: '¿Desde dónde sales?',
    tooltip_route_origin_question:
      'Ingresa tu vuelo de origen, en caso de escala, ingresa el último vuelo.',
    tooltip_destination_flight:
      'Seleccioná el aeropuerto al que llega o del que sale tu vuelo.',
    tabs_route_arrival_airport_label: 'Aeropuerto al que llegas',
    tabs_route_arrival_airport_label_mobile: 'Llegada',
    tabs_route_airport_hint: 'Elige un aeropuerto',
    tabs_route_airport_select_placeholder: 'Origen',
    tabs_label: 'Buscar por',
    tabs_route_label: 'Ruta',
    tabs_flight_number_label: 'Número de vuelo',
    tabs_flight_number_description: 'Ingresa tu número de vuelo',

    // Time select
    time_select_label: '¿A que hora llega tu vuelo?',
    time_select_hour_label: 'Hora',
    time_select_minute_label: 'Minuto',

    // Airline select
    airline_select_label: '¿Con qué aerolínea vuelas?',
    airline_select_placeholder: 'Aerolínea o código',
    airline_select_text: 'Selecciona una aerolínea',

    // Airport select
    airport_Select_placeholder: 'Seleccionar...',
    airport_search_placeholder: 'Buscar aeropuerto',

    // Alerts
    alert_add_contact: 'Completa tus datos de contacto para continuar.',
    alert_error_flight_stats:
      'No pudimos encontrar vuelos para esa búsqueda. Intenta de nuevo.',

    // Modal: all set
    modal_all_set_title_orange: '¡Listo! ',
    modal_all_set_title: 'Vamos a llevar tu experiencia al siguiente nivel',
    modal_all_set_text:
      'Tu experiencia está por mejorar. En breve, uno de nuestros agentes te contactará para gestionar tu traslado en un vehículo de lujo, cómodo y exclusivo.',
    modal_all_set_button_wait: 'Esperar',
    modal_all_set_button_call: 'Llamar ahora',

    // Modal: flight not found
    modal_not_appear_title: 'Información de vuelo',
    arrival_flight_modal_not_appear_subtitle:
      'Introduce tu número de vuelo y la hora de llegada si tu vuelo no aparece.',
    departure_flight_modal_not_appear_subtitle:
      'Introduce tu número de vuelo y la hora de salida si tu vuelo no aparece.',
    modal_not_appear_flight_number_title: 'Número de vuelo',
    modal_not_appear_flight_number_subtitle: 'Ingresa tu número de vuelo',
    arrival_flight_modal_not_appear_time_title: '¿A que hora llega tu vuelo?',
    departure_flight_modal_not_appear_time_title: '¿A que hora sale tu vuelo?',
    modal_not_appear_button_confirm: 'Confirmar información',

    // Modal: search results
    modal_result_title_select: 'Selecciona tu vuelo',
    modal_result_title_cant_find: 'No se han encontrado vuelos',
    modal_result_button_cant_find: 'No encuentro mi vuelo',
    modal_result_button_select: 'Seleccionar vuelo',

    // Modal: QR
    modal_qr_title: 'Escanea y descarga la app',
    modal_qr_title_mobile: 'Guardá tu código QR',
    modal_qr_text: 'para llevar todas tus reservaciones contigo. ¡Todo listo para tu viaje!',
    modal_qr_text_mobile: 'Guardá este código para acceder a tu traslado.',
    modal_qr_button: 'Cerrar',

    // Contact center
    contact_select_label: 'Más opciones',
    contact_select_report: 'Reportar un problema',
    contact_select_assistance: 'Solicitar asistencia',

    // Add contact
    add_contact_title: '¿Dónde te avisamos si hay algo importante?',
    add_contact_subtitle:
      'Compártenos tu correo y tu número de teléfono para enviarte tu pase de traslado y avisarte si hay algún cambio importante.',
    add_contact_email_label: 'Correo electrónico',
    add_contact_phone_label: 'Número de teléfono',
    add_contact_checkbox_label:
      'Acepto recibir comunicaciones de NexusTours. Podré darme de baja en cualquier momento. Mis datos serán tratados conforme a la ',
    add_contact_checkbox_label_link: 'Política de Privacidad.',
    add_contact_button: 'Continuar',

    // Reservation detail
    reservation_detail_title: '¡Todo listo!',
    reservation_detail_subtitle:
      'Ya quedó todo listo con tu traslado. Te enviaremos tu pase por correo o mensaje en breve.',
    reservation_detail_arrival_title: 'Vuelo de llegada',
    reservation_detail_departure_title: 'Vuelo de salida',
    reservation_detail_arrival_subtitle: 'Traslado compartido',
    reservation_detail_arrival_on: 'Tu vuelo llega el',
    reservation_detail_departure_on: 'Tu vuelo sale el',
    reservation_detail_arriva_time_at: 'a las',
    reservation_detail_arrival_with: 'Vuelas con',
    reservation_detail_arrival_at: 'Te recogemos en',
    reservation_detail_arrival_to: 'Te llevamos a',
    reservation_detail_middle_card_title: '¿Te gustaría mejorar tu traslado?',
    reservation_detail_middle_card_subtitle:
      'Conoce una opción aún más exclusiva aquí',
    reservation_detail_button_label: 'Mejorar mi traslado',
    demo_hint_start_reservation: 'Demo — cualquier número inicia el flujo.',
    start_reservation_placeholder_example: 'Ej. RB482910',
  },
  english: {
    start_reservation_title: 'Your trip starts here',
    start_reservation_paragraph:
      "We want to make sure your transfer is ready right when you land. Let's start by entering your booking number so we can review your trip details.",
    start_reservation_label: 'Booking number',
    start_reservation_main_button: 'Get started',
    start_reservation_contact_button: 'Contact us',
    start_reservation_modal_button: 'Got it',

    stepper_step_01_label: 'STEP 1',
    stepper_step_02_label: 'STEP 2',
    stepper_step_03_label: 'STEP 3',
    stepper_step_01_title: 'Arrival flight',
    stepper_step_02_title: 'Departure flight',
    stepper_step_03_title: 'Contact details',
    stepper_step_03_desktop_title: 'Contact details',
    stepper_step_03_mobile_title: 'Contact',
    steper_welcome: 'Hello,',

    arrival_flight_greeting: 'Hi,',
    arrival_flight_title: "Let's prepare for your arrival",
    arrival_flight_paragraph:
      "With your flight details, we'll make sure your ride is ready when you land",
    arrival_flight_arrival_date_label: 'Your arrival date is',
    arrival_flight_search_button: 'Search my flight',

    departure_flight_title: "Now let's prepare your trip back",
    departure_flight_departure_date_title: 'Your departure date is',
    departure_flight_route_airport_from_title: 'Airport you\'re leaving from',
    departure_flight_route_airport_to_text: 'Which airport are you flying to?',
    departure_flight_route_airport_to_text_mobile: 'Which airport are you flying to?',
    departure_flight_route_airport_to_destination: 'Destination',
    departure_flight_route_departure_time_title: 'What time does your flight leave?',

    tabs_route_origin_question: 'Where are you coming from?',
    tabs_route_origin_question_mobile: 'Leaving from?',
    tooltip_route_origin_question:
      'Enter your origin flight; if you have a layover, enter the last flight.',
    tooltip_destination_flight: 'Select the airport your flight arrives at or departs from.',
    tabs_route_arrival_airport_label: 'Airport you\'re landing at',
    tabs_route_arrival_airport_label_mobile: 'Arrival',
    tabs_route_airport_hint: 'Choose an airport',
    tabs_route_airport_select_placeholder: 'Origin',
    tabs_label: 'Search by',
    tabs_route_label: 'Route',
    tabs_flight_number_label: 'Flight number',
    tabs_flight_number_description: 'Enter your flight number',

    time_select_label: 'What time does your flight land?',
    time_select_hour_label: 'Hour',
    time_select_minute_label: 'Minute',

    airline_select_label: 'Which airline are you flying?',
    airline_select_placeholder: 'Airline or code',
    airline_select_text: 'Select an airline',

    airport_Select_placeholder: 'Select...',
    airport_search_placeholder: 'Search airport',

    alert_add_contact: 'Complete your contact details to continue.',
    alert_error_flight_stats: "We couldn't find flights for that search. Please try again.",

    modal_all_set_title_orange: "You're all set! ",
    modal_all_set_title: "Let's take your experience to the next level",
    modal_all_set_text:
      "Your experience is about to get better. Shortly, one of our agents will contact you to arrange your transfer in a luxurious, comfortable, and exclusive vehicle.",
    modal_all_set_button_wait: 'Wait',
    modal_all_set_button_call: 'Call now',

    modal_not_appear_title: 'Flight information',
    arrival_flight_modal_not_appear_subtitle:
      "Enter your flight number and arrival time if your flight doesn't appear.",
    departure_flight_modal_not_appear_subtitle:
      "Enter your flight number and departure time if your flight doesn't appear.",
    modal_not_appear_flight_number_title: 'Flight number',
    modal_not_appear_flight_number_subtitle: 'Enter your flight number',
    arrival_flight_modal_not_appear_time_title: 'What time does your flight land?',
    departure_flight_modal_not_appear_time_title: 'What time does your flight leave?',
    modal_not_appear_button_confirm: 'Confirm information',

    modal_result_title_select: 'Select your flight',
    modal_result_title_cant_find: 'No flights were found',
    modal_result_button_cant_find: "I can't find my flight",
    modal_result_button_select: 'Select flight',

    modal_qr_title: 'Scan and download the app',
    modal_qr_title_mobile: 'Save your QR code',
    modal_qr_text: "to keep all your bookings with you. You're all set for your trip!",
    modal_qr_text_mobile: 'Save this code to access your transfer.',
    modal_qr_button: 'Close',

    contact_select_label: 'More options',
    contact_select_report: 'Report an issue',
    contact_select_assistance: 'Request assistance',

    add_contact_title: "Where should we reach you if something important comes up?",
    add_contact_subtitle:
      "Share your email and phone number so we can send you your transfer pass and let you know about any important changes.",
    add_contact_email_label: 'Email',
    add_contact_phone_label: 'Phone number',
    add_contact_checkbox_label:
      'I agree to receive communications from NexusTours. I can unsubscribe at any time. My data will be handled according to the ',
    add_contact_checkbox_label_link: 'Privacy Policy.',
    add_contact_button: 'Continue',

    reservation_detail_title: "You're all set!",
    reservation_detail_subtitle:
      "Your transfer is all set. We'll send your pass by email or message shortly.",
    reservation_detail_arrival_title: 'Arrival flight',
    reservation_detail_departure_title: 'Departure flight',
    reservation_detail_arrival_subtitle: 'Shared transfer',
    reservation_detail_arrival_on: 'Your flight lands on',
    reservation_detail_departure_on: 'Your flight leaves on',
    reservation_detail_arriva_time_at: 'at',
    reservation_detail_arrival_with: 'Flying with',
    reservation_detail_arrival_at: "We'll pick you up at",
    reservation_detail_arrival_to: "We'll take you to",
    reservation_detail_middle_card_title: 'Would you like to upgrade your transfer?',
    reservation_detail_middle_card_subtitle: 'Discover an even more exclusive option here',
    reservation_detail_button_label: 'Upgrade my transfer',
    demo_hint_start_reservation: 'Demo — any number starts the flow.',
    start_reservation_placeholder_example: 'E.g. RB482910',
  },
};

export function buildMockContentfulTextResponse() {
  const items = Object.entries(MOCK_TRANSLATIONS).map(([language, value], i) => ({
    metadata: { tags: [], concepts: [] },
    sys: {
      id: `demo-text-${i}`,
      type: 'Entry',
    },
    fields: {
      title: `Demo text — ${language}`,
      slug: 'default',
      language,
      value,
      isoCode: language === 'spanish' ? 'es-ES' : 'en-US',
    },
  }));

  return {
    sys: { type: 'Array' },
    total: items.length,
    skip: 0,
    limit: items.length,
    items,
  };
}

// The original also fetches CSS variables and background image URLs from
// Contentful for white-label styling. This demo has no live Contentful
// space to read from, but the project's own git history still had the
// real brand palette from before it moved to Contentful-driven values
// (see the "fonts and colors Brands for the proyect" commit), so this
// mock rebuilds the theme from those real colors and fonts (orange
// #FF621D primary, red #E73A4E secondary, DM Sans as the default
// typeface) rather than an invented palette.
// Background image variables are intentionally left unset — the CSS
// gracefully falls back to no background image rather than breaking.
// Real Nexustours brand assets (provided directly by Miguel), used
// instead of a generic white-label look — this demo represents the
// actual Nexustours version of the project, not a blank template.
function mockImage(url: string) {
  return { fields: { file: { url } } };
}

// The original also fetches CSS variables and background image URLs from
// Contentful for white-label styling. This demo has no live Contentful
// space to read from, but a local styles.css from the project's history
// still had the real values as a commented-out :root fallback (from
// before the app moved to fetching them from Contentful) — so this mock
// uses those exact real values instead of an invented palette.
export function buildMockContentfulStyleFields() {
  const cssRoot = `
    --primary: #FF621D;
    --secondary: #FD921E;
    --tertiary: #E73A4E;
    --ColorSuccessStepper: #27C173;
    --ColorPrimaryStepper: #FF621D;
    --ColorTimeButton: #FFDFD0;
    --textPrimaryButton: #ffffff;
    --textSecondaryButton: #5E5E5E;
    --textLinkButton: #444647;
    --iconChatButton: #444647;
    --textTabButton: #797979;
    --textLanguageButton01: #fff;
    --textLanguageButton02: #444647;
    --textTimeButton: #333333;
    --textParagraph01: #333;
    --textParagraph02: #545454;
    --textTitle: #444647;
    --textLabel01: #7e7e7e;
    --textLabel02: #444647;
    --textLabel03: #000;
    --textPlaceholder: #B6B6B6;
    --textInput01: #363537;
    --textInput02: #000;
    --textInput03: #333333;
    --textInputSearch: #878787;
    --textInputList: #323232;
    --textGreetings01: #FD921E;
    --textGreetings02: #fff;
    --textFlightAirport: #333333;
    --bgColorOverlayImage: #000;
    --black: #000;
    --white: #fff;
    --typeDefault: 'DM Sans', sans-serif;
  `;

  return {
    title: 'Nexustours demo style',
    cssRoot,
    fontFace: '',
    slug: 'default',
    backgroundImage01: mockImage('/assets/images/contenful/--backgroundImage01.png'),
    backgroundImage02: mockImage('/assets/images/contenful/--backgroundImage02.png'),
    backgroundImage03: mockImage('/assets/images/contenful/--backgroundImage03.png'),
    backgroundImage04: mockImage('/assets/images/contenful/--backgroundImage04.png'),
    backgroundImage05: mockImage('/assets/images/contenful/--backgroundImage05.png'),
    backgroundImageLogo: mockImage('/assets/images/contenful/--backgroundImageLogo.png'),
    backgroundImageGraphicElement01: mockImage('/assets/images/contenful/--backgroundImageGraphicElement01.png'),
    backgroundImageGraphicElement02: mockImage('/assets/images/contenful/--backgroundImageGraphicElement02.png'),
    backgroundImageGraphicElement03: mockImage('/assets/images/contenful/--backgroundImageGraphicElement03.png'),
    backgroundImageGraphicElement04: mockImage('/assets/images/contenful/--backgroundImageGraphicElement04.png'),
    backgroundImageLogoGroupDesktop: mockImage('/assets/images/contenful/--backgroundImageLogoGroupDesktop.png'),
    backgroundImageLogoGroupMobile: mockImage('/assets/images/contenful/--backgroundImageLogoGroupMobile.png'),
    backgroundImageQr: mockImage('/assets/images/contenful/--backgroundImageQR.png'),
  };
}

// --- Airports & airlines (originally FlightStats) --------------------------

export const MOCK_AIRPORTS = [
  { iata: 'CUN', name: 'Cancún International Airport' },
  { iata: 'MEX', name: 'Mexico City International Airport' },
  { iata: 'SJD', name: 'Los Cabos International Airport' },
  { iata: 'PVR', name: 'Puerto Vallarta International Airport' },
  { iata: 'BJX', name: 'Guanajuato International Airport' },
  { iata: 'MIA', name: 'Miami International Airport' },
  { iata: 'JFK', name: 'John F. Kennedy International Airport' },
  { iata: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport' },
];

export const MOCK_AIRLINES = [
  { id: 'AM', name: 'Aeroméxico' },
  { id: 'AA', name: 'American Airlines' },
  { id: 'DL', name: 'Delta Air Lines' },
  { id: 'UA', name: 'United Airlines' },
  { id: 'IB', name: 'Iberia' },
  { id: 'VB', name: 'VivaAerobus' },
  { id: 'Y4', name: 'Volaris' },
];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function buildMockRawFlightsByRoute(
  departureIata: string,
  arrivalIata: string,
  isArrival: boolean = true
) {
  const departure = MOCK_AIRPORTS.find((a) => a.iata === departureIata) ?? MOCK_AIRPORTS[0];
  const arrival = MOCK_AIRPORTS.find((a) => a.iata === arrivalIata) ?? MOCK_AIRPORTS[1];
  const flightDate = isoDate(daysFromToday(isArrival ? 3 : 10));

  const scheduledFlights = Array.from({ length: 4 }).map((_, i) => {
    const airline = MOCK_AIRLINES[i % MOCK_AIRLINES.length];
    const depHour = 6 + i * 3;
    const arrHour = depHour + 3;

    return {
      carrierFsCode: airline.id,
      flightNumber: 1000 + i * 37,
      departureAirportFsCode: departure.iata,
      arrivalAirportFsCode: arrival.iata,
      departureTime: `${flightDate}T${pad(depHour)}:00:00.000`,
      arrivalTime: `${flightDate}T${pad(arrHour)}:00:00.000`,
      codeshares: [],
    };
  });

  return {
    scheduledFlights,
    appendix: {
      airports: [
        { iata: departure.iata, city: departure.name.split(' ')[0] },
        { iata: arrival.iata, city: arrival.name.split(' ')[0] },
      ],
      airlines: [{ name: MOCK_AIRLINES[0].name }],
    },
  };
}

export function buildMockRawFlightsByFlightNumber(
  carrier: string,
  flight: string,
  isArrival: boolean = true
) {
  const airline = MOCK_AIRLINES.find((a) => a.id === carrier) ?? MOCK_AIRLINES[0];
  const flightDate = isoDate(daysFromToday(isArrival ? 3 : 10));

  return {
    scheduledFlights: [
      {
        carrierFsCode: airline.id,
        flightNumber: flight,
        departureAirportFsCode: MOCK_AIRPORTS[0].iata,
        arrivalAirportFsCode: MOCK_AIRPORTS[1].iata,
        departureTime: `${flightDate}T09:15:00.000`,
        arrivalTime: `${flightDate}T12:30:00.000`,
        codeshares: [],
      },
    ],
    appendix: {
      airports: [
        { iata: MOCK_AIRPORTS[0].iata, city: MOCK_AIRPORTS[0].name.split(' ')[0] },
        { iata: MOCK_AIRPORTS[1].iata, city: MOCK_AIRPORTS[1].name.split(' ')[0] },
      ],
      airlines: [{ name: airline.name }],
    },
  };
}

// --- Reservation lookup (originally BlueDiamond) ---------------------------

export function buildMockBooking(locator: string) {
  return {
    wsdl_url: '#',
    action_url: '#',
    time: Date.now(),
    booking_response: {
      booking_info: {
        pax_name: 'Juan Pérez',
        booking_number: locator || 'DEMO12345',
        agency_ref: 'AG-0099',
        id_delegation_arrival: '1',
        delegation_name_arrival: 'Cancún',
        id_delegation_departure: '1',
        delegation_name_departure: 'Cancún',
        hotel_name: 'Hotel Demo Resort & Spa',
        transfer_type: 'Privado',
        total_pax: { adults: '2', children: '1', infants: '0' },
      },
      arrival: {
        from: 'CUN',
        to: 'Hotel Demo Resort & Spa',
        transfer_type: 'Privado',
        arrival_date: isoDate(daysFromToday(3)),
        flight_number: '',
        flight_time: '',
      },
      departure: {
        from: 'Hotel Demo Resort & Spa',
        to: 'CUN',
        transfer_type: 'Privado',
        departure_date: isoDate(daysFromToday(10)),
        flight_number: '',
        flight_time: '',
      },
      contact_info: {
        whatsapp: { cod_country: null, number: null },
        sms: { cod_country: null, number: null },
        email: null,
      },
    },
  };
}

// --- Contact / registration (originally ExperiencesHub) --------------------

export function buildMockRegisterResponse() {
  return { success: true, id: 'demo-registration-id' };
}

export function buildMockLoginResponse(code: string) {
  return {
    locator: code || 'DEMO12345',
    contact: 'demo@nexustours.com',
    lines: [1],
    name: 'Juan',
    lastname: 'Pérez',
    delegation_id: 1,
    entry_id: 'demo-entry-id',
    language: 'spanish',
    status: 'active',
    is_groups: false,
    is_registered: true,
    is_booking_registered: true,
    token: 'demo-token',
    is_valid: true,
    errors: [],
  };
}

export function buildMockIp() {
  return { ip: '190.191.192.193' };
}
