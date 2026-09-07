import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IFlightStatsFlightReduce } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { PrefixContextService } from '@/app/shared/services/prefix-context.service';
import { ModalService } from '@/app/shared/services/modal.service';

@Component({
  selector: 'app-card-results',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './card-results.component.html',
})
export class CardResultsComponent implements OnInit {
  flights = input<Array<IFlightStatsFlightReduce>>([]);
  router = inject(Router);
  prefixContextService = inject(PrefixContextService);
  private readonly modalService = inject(ModalService);

  private readonly idModal = signal<string>('search-results');
  isDepartureFlight = signal<boolean>(false);

  ngOnInit(): void {
    if (this.router.url.includes('departure-flight')) {
      this.isDepartureFlight.set(true);
    }
  }

  convertTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onselectFlight(flight: IFlightStatsFlightReduce): void {
    this.isDepartureFlight()
      ? localStorage.setItem('selectedDepartureFlight', JSON.stringify(flight))
      : localStorage.setItem('selectedArrivalFlight', JSON.stringify(flight));

    const urlPath = this.isDepartureFlight()
      ? '/add-contact'
      : '/departure-flight';

    const navigateUrl = this.prefixContextService.prefix()
      ? `/${this.prefixContextService.prefix()}${urlPath}`
      : urlPath;

    if (
      document.activeElement &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }

    this.router.navigate([navigateUrl]);
    this.onCloseModal();
  }

  onCloseModal() {
    const active = document.activeElement as HTMLElement;
    if (active) {
      active.blur();
    }

    const triggerBtn = document.querySelector('#btn-submit') as HTMLElement;
    triggerBtn?.focus();

    this.modalService.close(this.idModal());
  }
}
