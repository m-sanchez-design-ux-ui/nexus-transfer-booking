import { DataFlight } from '@/app/reservation-detail/interfaces/data-flight.interface';
import { AfterViewInit, Component, input } from '@angular/core';
import { TranslatePipe } from '../../pipe/TranslatePipe.pipe';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-card-detail-flight',
  standalone: true,
  imports: [ TranslatePipe ],
  templateUrl: './card-detail-flight.component.html',
  styleUrl: './card-detail-flight.component.css'
})
export class CardDetailFlightComponent implements AfterViewInit{
  isArrivalFlight = input<boolean>(true);
  dataFlight = input.required<DataFlight>();
  dateFlight = input.required<string>();
  hourFlight = input.required<string>();

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 0);
  }
}
