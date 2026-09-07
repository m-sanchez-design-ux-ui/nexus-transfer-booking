import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightNumberSearchFormComponent } from '@/app/shared/components/flight-number-search-form/flight-number-search-form.component';
import { IAirlinesToSelect } from '@/app/shared/interfaces/flighstats-airlines-active.interface';
import {
  Airports,
  FlightsByFlightNumberRequest,
  FlightsByRouteRequest,
  IFlightStatsFlightReduce,
} from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { SearchByTabsComponent } from '@/app/shared/layouts/search-by-tabs/search-by-tabs.component';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { FlightstatsService } from '@/app/shared/services/flightstats.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { getLocalizedDateFormat } from '@/app/shared/utils/monthNumberDayToText';
import { RouteSearchFormComponent } from '@/app/shared/components/route-search-form/route-search-form.component';
import { AirlinesDataService } from '@/app/shared/services/airlines-data.service';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { I18nService } from '@/app/shared/services/I18nService.service';
import { AirportDataService } from '../../services/airport-data.service';
import { NotificationsService } from '../notifications/notifications.service';

interface IArrivalDate {
  year: string;
  month: string;
  day: string;
}

@Component({
  selector: 'app-search-by-forms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightNumberSearchFormComponent,
    SearchByTabsComponent,
    RouteSearchFormComponent,
    TranslatePipe
],
  templateUrl: './search-by-forms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByFormsComponent implements OnInit {
  onFlightSearch = output<IFlightStatsFlightReduce[]>();
  isArrival = input<boolean>(true);

  private readonly flightstatsService = inject(FlightstatsService);
  private readonly dataReservationService = inject(DataReservationService);
  private readonly I18nService = inject(I18nService);
  private readonly modalService = inject(ModalService);
  private readonly airlinesDataService = inject(AirlinesDataService);
  private readonly airportsDataService = inject(AirportDataService);
  private readonly notificationService = inject(NotificationsService);
  private readonly i18nService = inject(I18nService);

  airLinesList = signal<IAirlinesToSelect[]>([]);
  airportList = signal<Airports[]>([]);

  searchResultModalId = signal<string>('search-results');

  flightFormSignal = signal<{ valid: boolean; value: any } | null>(null);
  routeFormSignal = signal<{ valid: boolean; value: any } | null>(null);

  userName = signal<string>('');
  selectedTab = signal<'route' | 'flight-number'>('route');
  iataAirport = signal<string>('');
  nameAirport = signal<string>('');
  arrivalDate = signal<IArrivalDate>({
    year: '',
    month: '',
    day: '',
  });
  countryNameArr = signal<string>('');
  countryNameDep = signal<string>('');
  invalidFlightNumberSearchForm = signal<boolean>(false);

  ngOnInit(): void {
    this.dataAirlines();
    this.dataAirports();
    this.getArrivalDate();
  }

  monthStringComputed = computed(() => {
    const languageSelected = this.I18nService.language().isoCode ?? 'es-ES';
    const booking = this.dataReservationService.getDataBookingValue();
    const [yearArrival, monthArrival, dayArrival] = this.isArrival()
      ? booking.booking_response.arrival.arrival_date.split('-')
      : booking.booking_response.departure.departure_date.split('-');

    const data = {
      year: yearArrival,
      month: monthArrival,
      day: dayArrival,
    };
    return getLocalizedDateFormat(data, languageSelected);
  });

  dataAirlines() {
    const airlines = this.airlinesDataService.getAirlinesData();
    if(!airlines) {
      this.getAirlines();
    } else {
      const data = JSON.parse(airlines);
      this.manageDataAirline(data);
    }
  }

  manageDataAirline(data: IAirlinesToSelect[]) {
    this.airLinesList.set(data);
    this.airlinesDataService.setAirlines(data);
  }

  dataAirports() {
    const airports = this.airportsDataService.getAirports();
    if(!airports) {
      this.getAirport();
    } else {
      const data = JSON.parse(airports);
      this.manageDataAirports(data);
    }
  }

  manageDataAirports(data: Airports[]){
    this.airportList.set(data);
  }

  getArrivalDate() {
    const booking = this.dataReservationService.getDataBookingValue();
    const [yearArrival, monthArrival, dayArrival] = this.isArrival()
      ? booking.booking_response.arrival.arrival_date.split('-')
      : booking.booking_response.departure.departure_date.split('-');

    const data = {
      year: yearArrival,
      month: monthArrival,
      day: dayArrival,
    };

    const dataDate = this.isArrival()
      ? booking.booking_response.arrival.from
      : booking.booking_response.departure.to;

    this.userName.set(booking.booking_response.booking_info.pax_name);

    this.nameAirport.set(dataDate);

    this.iataAirport.set(dataDate.split(' ')[0]);

    this.countryNameArr.set(booking.booking_response.booking_info.delegation_name_arrival);
    
    this.countryNameDep.set(booking.booking_response.booking_info.delegation_name_departure);

    this.arrivalDate.set({
      ...data,
    });
  }

  getAirlines() {
    this.flightstatsService.getAirlines().subscribe({
      next: (data) => {
        this.airlinesDataService.setAirlinesData(data);
        this.manageDataAirline(data);
      },
      error: (error) => {
        this.notificationService.showAndClear({
          data: { text: this.i18nService.translate('alert_error_flight_stats') }
        });
      },
    });
  }

  getAirport() {
    this.flightstatsService.getAirport().subscribe({
      next: (data) => {
        this.airportsDataService.setAirports(data);
        this.manageDataAirports(data);
      },
      error: (error) => {
        this.notificationService.showAndClear({
          data: { text: this.i18nService.translate('alert_error_flight_stats') }
        });
      },
    });
  }

  onFlightNumberFormChange(event: { valid: boolean; value: any } | null) {
    this.flightFormSignal.set(event);
  }

  onRoutSearchFormChange(event: { valid: boolean; value: any } | null) {
    this.routeFormSignal.set(event);
  }

  serchFligth() {
    // Case valid "route" → search flights
    if (this.selectedTab() === 'route') {
      // "route" invalid form, open modal and emmit []
      if (!this.routeFormSignal()?.valid) {
        this.modalService.open(this.searchResultModalId());
        this.onFlightSearch.emit([]);
        return;
      } 
      this.searchFlightByRoute();
    }
    // Case "flight-number"
    else if (this.selectedTab() === 'flight-number') {
      this.invalidFlightNumberSearchForm.set(!this.flightFormSignal()?.valid);
      if (!this.flightFormSignal()?.valid) {
        this.modalService.open(this.searchResultModalId());
        this.onFlightSearch.emit([]);
        return;
      }
      this.searchFlightByFlightNumber();
    }
  }

  searchFlightByFlightNumber() {
    const data: FlightsByFlightNumberRequest = {
      carrier: this.flightFormSignal()?.value?.airline.id,
      flight: this.flightFormSignal()?.value?.flightNumber,
      year: this.arrivalDate().year,
      month: this.arrivalDate().month,
      day: this.arrivalDate().day,
    };

    this.flightstatsService.getFlightsByFlightNumber(data, this.isArrival()).subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          this.onFlightSearch.emit([]);
        } else {
          this.onFlightSearch.emit(data);
        }
      },
      error: () => {
        this.modalService.open(this.searchResultModalId());
        this.onFlightSearch.emit([]);
      },
      complete: () => {
        this.modalService.open(this.searchResultModalId());
      },
    });
  }

  private getDepartureArrivalAirport () {
    const { airport } = this.routeFormSignal()!.value;

    if(this.isArrival()) {
      return [airport, this.iataAirport()]
    } else {
      return [this.iataAirport(), airport]
    }
  }

  searchFlightByRoute() {
    const [departureAirport, arrivalAirport] = this.getDepartureArrivalAirport()
    const data: FlightsByRouteRequest = {
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
      year: this.arrivalDate().year,
      month: this.arrivalDate().month,
      day: this.arrivalDate().day,
    };

    this.flightstatsService
      .getFlightsByRoute(data, this.isArrival())
      .subscribe({
        next: (data: IFlightStatsFlightReduce[]) => {
          if (!data || data.length === 0) {
            this.onFlightSearch.emit([]);
          } else {
            this.onFlightSearch.emit(this.filterResponse(data));
          }
        },
        error: () => {
          this.modalService.open(this.searchResultModalId());
          this.onFlightSearch.emit([]);
        },
        complete: () => {
          this.modalService.open(this.searchResultModalId());
        },
      });
  }

  filterResponse(data: IFlightStatsFlightReduce[]) {
    let response: IFlightStatsFlightReduce[] = [];
    response = this.filterRouteByAirline(data);
    return response;
  }

  filterRouteByAirline(data: IFlightStatsFlightReduce[]) {
    const { airline } = this.routeFormSignal()!.value;
    if (airline === null) {
      return data;
    } else {
      const response: IFlightStatsFlightReduce[] = [];
      data.forEach((flight: IFlightStatsFlightReduce) => {
        if (flight.carrierFsCode === airline.id) {
          response.push(flight);
        }
        flight.codeshares.forEach((code) => {
          if (code.fsCode === airline.id) {
            response.push(flight);
          }
        });
      });
      return response;
    }
  }

  onChangeTab(tab: 'route' | 'flight-number') {
    this.selectedTab.set(tab);
  }
}
