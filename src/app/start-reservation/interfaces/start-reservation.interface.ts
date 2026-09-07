export interface IGetBookingsRequest {
  locator: string;
  language?: string;
}

export interface IGetBookingsResponse {
  wsdl_url: string;
  action_url: string;
  time: number;
  booking_response: {
    booking_info: {
      pax_name: string;
      booking_number: string;
      agency_ref: string;
      id_delegation_arrival: string;
      delegation_name_arrival: string;
      id_delegation_departure: string;
      delegation_name_departure: string;
      hotel_name: string;
      transfer_type: string;
      total_pax: {
        adults: string;
        children: string;
        infants: string;
      };
    };
    arrival: {
      from: string;
      to: string;
      transfer_type: string;
      arrival_date: string;
      flight_number: string;
      flight_time: string;
    };
    departure: {
      from: string;
      to: string;
      transfer_type: string;
      departure_date: string;
      flight_number: string;
      flight_time: string;
    };
    contact_info: {
      whatsapp: {
        cod_country: string | null;
        number: string | null;
      };
      sms: {
        cod_country: string | null;
        number: string | null;
      };
      email: string | null;
    };
  };
}
