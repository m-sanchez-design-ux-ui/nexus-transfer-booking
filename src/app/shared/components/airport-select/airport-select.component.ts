import {
  Component,
  signal,
  computed,
  HostListener,
  Output,
  EventEmitter,
  input,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Airports } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { I18nService } from '../../services/I18nService.service';

@Component({
  selector: 'app-airport-select',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './airport-select.component.html',
})
export class AirportSelectComponent {
  @ViewChild('dropdownWrapper', { static: false }) wrapperRef!: ElementRef;
  selectedAirport = signal<Airports | null>(null);
  query = signal('');
  showDropdown = signal(false);
  i18nService = inject(I18nService);
  visibleCount = signal(50);

  placeholderText = input(
    this.i18nService.translate('tabs_route_airport_select_placeholder')
  );
  airportList = input<Airports[]>([]);

  @Output() airport = new EventEmitter<Airports | null>();

  filteredAirports = computed(() => {
    const q = this.query().toLowerCase();
    const filtered = this.airportList().filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.iata.toLowerCase().includes(q)
    );
    return filtered.slice(0, this.visibleCount());
  });
  
  airportPlaceholder = computed(() => {
    return this.i18nService.translate('airport_Select_placeholder');
  });

  airportInputPlaceholder = computed(() => {
    return this.i18nService.translate('airport_search_placeholder');
  });

  loadMore() {
    this.visibleCount.set(this.visibleCount() + 50);
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      this.loadMore();
    }
  }

  selectAirport(airport: Airports) {
    this.selectedAirport.set(airport);
    this.airport.emit(airport);
    this.showDropdown.set(false);
  }

  reset() {
    this.selectedAirport.set(null);
    this.airport.emit(null);
    this.query.set('');
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.airport-select-wrapper')) {
      this.showDropdown.set(false);
    }
  }
}
