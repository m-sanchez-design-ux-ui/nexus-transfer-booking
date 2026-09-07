import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SearchByFormsComponent } from '@/app/shared/components/search-by-forms/search-by-forms.component';
import { SearchResultsComponent } from '@/app/shared/components/search-results/search-results.component';
import { IFlightStatsFlightReduce } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { MainLayoutComponent } from '@/app/shared/layouts/main-layout/main-layout.component';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";
import { NotificationsComponent } from "@/app/shared/components/notifications/notifications.component";

@Component({
  selector: 'app-arrival-flight',
  standalone: true,
  imports: [
    SearchByFormsComponent,
    SearchResultsComponent,
    MainLayoutComponent,
    TranslatePipe,
    NotificationsComponent
],
  templateUrl: './arrival-flight.component.html',
})
export class ArrivalFlightComponent implements OnInit, AfterViewInit {
  dataReservationService = inject(DataReservationService);

  searchResultModalId = signal<string>('search-results');
  flightList = signal<Array<IFlightStatsFlightReduce>>([]);
  userName = signal<string>('');
  invalidFlightNumberSearchForm = signal<boolean>(false);

  ngOnInit(): void {
    this.getArrivalDate();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 0);
  }

  getArrivalDate() {
    const booking = this.dataReservationService.getDataBookingValue();

    this.userName.set(booking.booking_response.booking_info.pax_name);
  }

  onSearchFlightList(flights: IFlightStatsFlightReduce[]) {
    this.flightList.set(flights);
  }
}
