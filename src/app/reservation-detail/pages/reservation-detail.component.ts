import { ContactCenterButtonComponent } from '@/app/shared/components/contact-center-button/contact-center-button.component';
import { AfterViewInit, Component, inject, computed, OnInit, signal, } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ModalImproveTransferComponent } from '@/app/shared/components/modals/modal-improve-transfer/modal-improve-transfer.component';
import { PopUpQrComponent } from '@/app/shared/components/pop-up/pop-up-qr/pop-up-qr.component';
import { CardDetailFlightComponent } from '@/app/shared/components/card-detail-flight/card-detail-flight.component';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { IFlightStatsFlightReduce, NoResultFlights } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { DataFlight } from '../interfaces/data-flight.interface';
import { getLocalizedDateFormat } from '@/app/shared/utils/monthNumberDayToText';
import { getTimeAmPm } from '@/app/shared/utils/getHourAmPmFormat';
import { StepperComponent } from "@/app/shared/components/stepper/stepper.component";
import { LanguageSelectComponent } from "@/app/shared/components/language-select/language-select.component";
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { ModalService } from '@/app/shared/services/modal.service';
import { I18nService } from '@/app/shared/services/I18nService.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [
    ContactCenterButtonComponent,
    ModalImproveTransferComponent,
    PopUpQrComponent,
    CardDetailFlightComponent,
    StepperComponent,
    LanguageSelectComponent,
    TranslatePipe,
    CommonModule,
],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css',
})
export class ReservationDetailComponent implements OnInit, AfterViewInit {
  private readonly modalService = inject(ModalService);
  private readonly idModal = 'modal-improve-transfer';

  
  private readonly dataReservationService = inject(DataReservationService);
  private readonly I18nService = inject(I18nService);

  arrivalData: DataFlight = {
    airline: '',
    flightNumber: '',
    from: '',
    to: '',
  }

  departureData: DataFlight = {
    airline: '',
    flightNumber: '',
    from: '',
    to: '',
  }

  userName = signal<string>('');

  language = signal<string>('en');

  languageLabel = signal<string>('English');

  hourArrival = signal<string>('');
  
  hourDeparture = signal<string>('');

  ngOnInit(): void {
    initFlowbite();

    this.getDataBooking();

    this.getDataFlights();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 0);
  }
  monthArrivalStringComputed = computed(() => {
    const languageSelected = this.I18nService.language().isoCode ?? 'en-US';
    const booking = this.dataReservationService.getDataBookingValue();
    const [yearArrival, monthArrival, dayArrival] = booking.booking_response.arrival.arrival_date.split('-');

    const data = {
      year: yearArrival,
      month: monthArrival,
      day: dayArrival,
    };
    
    return getLocalizedDateFormat(data, languageSelected);
  });

  monthDepartureStringComputed = computed(() => {
    const languageSelected = this.I18nService.language().isoCode ?? 'en-US';
    const booking = this.dataReservationService.getDataBookingValue();
    const [yearArrival, monthArrival, dayArrival] = booking.booking_response.departure.departure_date.split('-');

    const data = {
      year: yearArrival,
      month: monthArrival,
      day: dayArrival,
    };

    return getLocalizedDateFormat(data, languageSelected);
  });

  getDataBooking() {
    const booking = this.dataReservationService.getDataBookingValue();

    this.userName.set(booking.booking_response.booking_info.pax_name);
    
    this.arrivalData.from = booking.booking_response.arrival.from;
    this.arrivalData.to = booking.booking_response.arrival.to;

    this.departureData.from = booking.booking_response.departure.from;
    this.departureData.to = booking.booking_response.departure.to;
  }

  getDataFlights() {
    const arrivalFlight = localStorage.getItem('selectedArrivalFlight');
    if(arrivalFlight) {

      const flight: IFlightStatsFlightReduce = JSON.parse(arrivalFlight);

      const [hours, minute] = flight.arrivalDate.dateLocal.split('T')[1].split(':');
      
      const dateAMPM = getTimeAmPm(hours);

      this.hourArrival.set(`${dateAMPM.hour}:${minute} ${dateAMPM.period}`);
      
      this.arrivalData.flightNumber = `${flight.carrierFsCode}${flight.flightNumber}`;

      this.arrivalData.airline = flight.airlineName;
      
    } else {

      const arrivalFligthUser = localStorage.getItem('selectedArrivalNoFlightSearch');
      if(arrivalFligthUser) {
        const flightUser: NoResultFlights = JSON.parse(arrivalFligthUser);

        this.arrivalData.airline = flightUser.airline.name;

        this.arrivalData.flightNumber = `${flightUser.airline.id}${flightUser.flightNumber}`;
        
        const period = flightUser.period.toLowerCase().split('').join('.');

        this.hourArrival.set(`${flightUser.hour}:${flightUser.minute} ${period}`);
      }
    }

    const departureFlight = localStorage.getItem('selectedDepartureFlight');
    if(departureFlight) {

      const flight: IFlightStatsFlightReduce = JSON.parse(departureFlight);

      const [hours, minute] = flight.departureDate.dateLocal.split('T')[1].split(':');
      
      const dateAMPM = getTimeAmPm(hours);
      
      this.hourDeparture.set(`${dateAMPM.hour}:${minute} ${dateAMPM.period}`);
      
      this.departureData.flightNumber = `${flight.carrierFsCode}${flight.flightNumber}`;

      this.departureData.airline = flight.airlineName;
    } else {

      const departureFligthUser = localStorage.getItem('selectedDepartureNoFlightSearch');
      if(departureFligthUser) {
        
        const flightUser: NoResultFlights = JSON.parse(departureFligthUser);

        this.departureData.airline = flightUser.airline.name;

        this.departureData.flightNumber = `${flightUser.airline.id}${flightUser.flightNumber}`

        const period = flightUser.period.toLowerCase().split('').join('.');

        this.hourDeparture.set(`${flightUser.hour}:${flightUser.minute} ${period}`);
      }
    }
  }

  openModal() {
    this.modalService.open(this.idModal);
  }
}
