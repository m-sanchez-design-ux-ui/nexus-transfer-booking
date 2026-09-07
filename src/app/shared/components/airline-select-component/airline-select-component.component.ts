import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IAirlinesToSelect } from '@/app/shared/interfaces/flighstats-airlines-active.interface';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { I18nService } from '../../services/I18nService.service';

@Component({
  selector: 'app-airline-select-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './airline-select-component.component.html',
})
export class AirlineSelectComponentComponent {
  @Input() CustomLabelClasses: string = ''; // ← Styles Tailwind CCS Class for label text
  @Input() CustomPlaceholderTextClasses: string = ''; // ← Styles Tailwind CCS Class for placeholder text
  @Input() isAirlineSelected: boolean = true;

  @ViewChild('dropdownWrapper', { static: false }) wrapperRef!: ElementRef;
  dropdownDirection = signal<'up' | 'down'>('down');

  airlines = input<IAirlinesToSelect[]>([]);
  @Input() selected: IAirlinesToSelect | null = null;
  @Output() selectedChange = new EventEmitter<IAirlinesToSelect | null>();
  private readonly i18nService = inject(I18nService);

  searchTerm = signal('');
  isOpen = signal(false);
  visibleCount = signal(50);

  // Computed: show filters results
  filteredAirlines = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const filtered = this.airlines().filter(
      (a) =>
        a.name.toLowerCase().includes(term) || a.id.toLowerCase().includes(term)
    );
    return filtered.slice(0, this.visibleCount());
  });

  airlinePlaceholder = computed(() => {
    return this.i18nService.translate('airline_select_placeholder');
  });

  loadMore() {
    this.visibleCount.set(this.visibleCount() + 50);
  }

  resetVisibleCount() {
    this.visibleCount.set(50);
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      this.loadMore();
    }
  }

  selectAirline(airline: IAirlinesToSelect) {
    this.selected = airline;
    this.selectedChange.emit(airline);
    this.isOpen.set(false);
    this.searchTerm.set('');
  }

  clearSelection() {
    this.selected = null;
    this.selectedChange.emit(null);
    this.searchTerm.set('');
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());

    if (this.isOpen() && this.wrapperRef) {
      const rect = this.wrapperRef.nativeElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 250; // ajustá según tamaño del dropdown

      if (spaceBelow < dropdownHeight) {
        this.dropdownDirection.set('up');
      } else {
        this.dropdownDirection.set('down');
      }
    }
  }

  // Close dropdown if click out of the component
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.airline-select-wrapper')) {
      this.isOpen.set(false);
    }
  }
}
