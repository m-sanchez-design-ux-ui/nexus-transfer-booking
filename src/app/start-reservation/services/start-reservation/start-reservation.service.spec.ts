import { HttpRequest, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IGetBookingsResponse } from '../../interfaces/start-reservation.interface';
import { StartReservationService } from './start-reservation.service';

const getBookingResponse: IGetBookingsResponse = {
  wsdl_url: '',
  action_url: '',
  time: 0,
  booking_response: {
    booking_info: {
      pax_name: '',
      booking_number: '',
      agency_ref: '',
      id_delegation_arrival: '',
      delegation_name_arrival: '',
      id_delegation_departure: '',
      delegation_name_departure: '',
      hotel_name: '',
      transfer_type: '',
      total_pax: {
        adults: '',
        children: '',
        infants: '',
      },
    },
    arrival: {
      from: '',
      to: '',
      transfer_type: '',
      arrival_date: '',
      flight_number: '',
      flight_time: '',
    },
    departure: {
      from: '',
      to: '',
      transfer_type: '',
      departure_date: '',
      flight_number: '',
      flight_time: '',
    },
    contact_info: {
      whatsapp: {
        cod_country: null,
        number: null,
      },
      sms: {
        cod_country: null,
        number: null,
      },
      email: null,
    },
  },
};

describe('StartReservationService', () => {
  let service: StartReservationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StartReservationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeAll(() => {});
  afterEach(() => {});
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request bookings and return the expected response', () => {
    const payload = {
      locator: 'aeg561aeg6aeeag',
      language: 'es-ES',
    };

    let actualResponse: IGetBookingsResponse | undefined;
    service.getBookings(payload).subscribe((response) => {
      actualResponse = response;
    });

    const req = httpTestingController.expectOne((req: HttpRequest<any>) => {
      return req.method === 'GET';
    });

    expect(req.request.body).toBeNull();

    req.flush(getBookingResponse);

    expect(actualResponse).toEqual(getBookingResponse);
  });
});
