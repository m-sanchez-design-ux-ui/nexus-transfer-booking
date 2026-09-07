import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { SearchByFormsComponent } from '@/app/shared/components/search-by-forms/search-by-forms.component';
import { SearchResultsComponent } from '@/app/shared/components/search-results/search-results.component';
import { IFlightStatsFlightReduce } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { MainLayoutComponent } from '@/app/shared/layouts/main-layout/main-layout.component';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";
import { NotificationsComponent } from "@/app/shared/components/notifications/notifications.component";

@Component({
  selector: 'app-return-flight',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent,
    SearchResultsComponent,
    SearchByFormsComponent,
    TranslatePipe,
    NotificationsComponent
],
  templateUrl: './return-flight.component.html',
})
export class ReturnFlightComponent implements AfterViewInit {
  dataReservationService = inject(DataReservationService);

  searchResultModalId = signal<string>('search-results');
  flightList = signal<Array<IFlightStatsFlightReduce>>([]);
  invalidFlightNumberSearchForm = signal<boolean>(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 0);
  }

  onSearchFlightList(flights: IFlightStatsFlightReduce[]) {
    this.flightList.set(flights);
  }
}
