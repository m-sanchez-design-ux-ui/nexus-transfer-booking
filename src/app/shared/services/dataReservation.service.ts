import { IGetBookingsResponse } from '@/app/start-reservation/interfaces/start-reservation.interface';
import { Injectable, signal } from '@angular/core';
import { language } from '../interfaces/language.interface';

@Injectable({
  providedIn: 'root',
})
export class DataReservationService {
  private readonly RESERVATION = signal<string>('dataBooking');
  
  private readonly LANGUAGE = signal<string>('language');

  private readonly defatulDataBookings: IGetBookingsResponse = {
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

  setDataBooking(data: IGetBookingsResponse) {
    localStorage.setItem(this.RESERVATION(), JSON.stringify(data));
  }

  getDataBookingValue(): IGetBookingsResponse {
    const data = localStorage.getItem(this.RESERVATION());
    if(data) {
      return JSON.parse(data);
    }
    
    return this.defatulDataBookings;
  }

  setLanguageBooking(language: language) {
    localStorage.setItem(this.LANGUAGE(), JSON.stringify(language));
  }

  getLanguageBooking(): language | null {
    const savedLanguage = localStorage.getItem(this.LANGUAGE());
    if(savedLanguage) {
      return JSON.parse(savedLanguage);
    }
    return null;
  }
}
