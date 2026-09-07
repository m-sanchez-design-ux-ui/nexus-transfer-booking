import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AirlineSelectComponentComponent } from '@/app/shared/components/airline-select-component/airline-select-component.component';
import { TimeSelectComponent } from '@/app/shared/components/time-select/time-select.component';
import { IAirlinesToSelect } from '@/app/shared/interfaces/flighstats-airlines-active.interface';
import { AirlinesDataService } from '@/app/shared/services/airlines-data.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { I18nService } from '@/app/shared/services/I18nService.service';
import { PrefixContextService } from '@/app/shared/services/prefix-context.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-flight-search',
  standalone: true,
  imports: [
    AirlineSelectComponentComponent,
    TimeSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './custom-flight-search.component.html',
})
export class CustomFlightSearchComponent implements OnInit {
  private readonly path = signal<string>('');
  private readonly idModal = signal<string>('search-results');
  seleccionada = signal<IAirlinesToSelect | null>(null);
  isAirlineSelected = signal<boolean>(true);
  isFlightSelected = signal<boolean>(true);

  private readonly fb = inject(FormBuilder);
  private readonly prefixContextService = inject(PrefixContextService);
  private readonly route = inject(Router);
  private readonly airlinesDataService = inject(AirlinesDataService);
  private readonly modalService = inject(ModalService);
  activatedRoute = inject(ActivatedRoute);

  form = this.fb.group({
    airline: [{ id: '', name: '' }, Validators.required],
    flightNumber: ['', [Validators.required]],
    hour: ['00', Validators.required],
    minute: ['00', Validators.required],
    period: ['AM', Validators.required],
  });

  ngOnInit(): void {
    const routeConfig = this.activatedRoute.routeConfig;
    this.path.set(routeConfig?.path ?? '');
  }

  i18nService = inject(I18nService);

  constructor(private readonly router: Router) {}

  modalDescription = computed(() => {
    const currentPath = this.router.url;

    if (currentPath.includes('/arrival-flight')) {
      return this.i18nService.translate(
        'arrival_flight_modal_not_appear_subtitle'
      );
    }

    if (currentPath.includes('/departure-flight')) {
      return this.i18nService.translate(
        'departure_flight_modal_not_appear_subtitle'
      );
    }

    return '';
  });

  modalLabelTimePicker = computed(() => {
    const currentPath = this.router.url;

    if (currentPath.includes('/arrival-flight')) {
      return this.i18nService.translate(
        'arrival_flight_modal_not_appear_time_title'
      );
    }

    if (currentPath.includes('/departure-flight')) {
      return this.i18nService.translate(
        'departure_flight_modal_not_appear_time_title'
      );
    }

    return '';
  });

  get airlines(): IAirlinesToSelect[] {
    return this.airlinesDataService.airlines();
  }

  onAirlineChange(airline: IAirlinesToSelect | null) {
    if (!airline) return;
    this.form.get('airline')?.setValue(airline);
  }

  selectHour(hour: string) {
    this.form.patchValue({
      hour: hour,
    });
  }

  selectMinute(minute: string) {
    this.form.patchValue({
      minute: minute,
    });
  }

  selectPeriod(period: string) {
    this.form.patchValue({
      period: period,
    });
  }

  onSubmit() {
    if (this.form.valid && this.form.value['airline']?.id !== '') {
      if (this.form.value.flightNumber) {
        this.form.value.flightNumber = this.form.value.flightNumber.padStart(4, '0');
      }
      const payload = {
        airline: this.form.value.airline,
        flightNumber: this.form.value.flightNumber,
        hour: this.form.value.hour,
        minute: this.form.value.minute,
        period: this.form.value.period,
      };

      const navigateUrlContact = this.prefixContextService.prefix()
        ? `/${this.prefixContextService.prefix()}/add-contact`
        : '/add-contact';
      const navigateUrlDeparture = this.prefixContextService.prefix()
        ? `/${this.prefixContextService.prefix()}/departure-flight`
        : '/departure-flight';

      if (this.path() === 'arrival-flight') {
        localStorage.setItem(
          'selectedArrivalNoFlightSearch',
          JSON.stringify(payload)
        );
        localStorage.removeItem('selectedArrivalFlight');
        this.route.navigate([navigateUrlDeparture]);
      } else {
        localStorage.setItem(
          'selectedDepartureNoFlightSearch',
          JSON.stringify(payload)
        );
        localStorage.removeItem('selectedDepartureFlight');
        this.route.navigate([navigateUrlContact]);
      }
      this.onCloseModal();
    } else {
      this.isFlightSelected.set(this.form.controls.flightNumber.valid);
      if (this.form.value['airline']?.id === '') {
        this.isAirlineSelected.set(false);
      }
    }
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
