import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { AirlineSelectComponentComponent } from '@/app/shared/components/airline-select-component/airline-select-component.component';
import { AirportSelectComponent } from '@/app/shared/components/airport-select/airport-select.component';
import { Airport } from '@/app/shared/components/airport-select/interface/airports';
import { TimeSelectComponent } from '@/app/shared/components/time-select/time-select.component';
import { IAirlinesToSelect } from '@/app/shared/interfaces/flighstats-airlines-active.interface';
import { Airports } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import * as countryList from 'country-list';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";
import { I18nService } from '@/app/shared/services/I18nService.service';

interface IArrivalDate {
  year: string;
  month: string;
  day: string;
}

@Component({
  selector: 'app-route-search-form',
  standalone: true,
  imports: [
    AirportSelectComponent,
    TimeSelectComponent,
    AirlineSelectComponentComponent,
    ReactiveFormsModule,
    TranslatePipe
],
  templateUrl: './route-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteSearchFormComponent implements OnInit {
  formValueChange = output<{ valid: boolean; value: any }>();

  airportList = input<Airports[]>([]);
  airLinesList = input<IAirlinesToSelect[]>([]);
  arrivalDate = input<IArrivalDate>();
  isArrival = input<boolean>(true);
  monthString = input<string>('');
  iataAirport = input<string>();
  nameAirport = input<string>('');
  countryNameArr = input<string>('');
  countryNameDep = input<string>('');

  private readonly fb = inject(FormBuilder);
  readonly i18nService = inject(I18nService)

  routeForm = this.fb.group({
    airport: ['', Validators.required],
    hour: ['00', Validators.required],
    minute: ['00', Validators.required],
    period: ['AM', Validators.required],
    airline: [{ id: '', name: '' }, Validators.required],
    year: ['', Validators.required],
    month: ['', Validators.required],
    day: ['', Validators.required],
  });

  countryCodeArr = signal<string>('mx')
  
  countryCodeDep = signal<string>('mx')
  placeholderOriginText = computed(() => {
    return this.i18nService.translate('tabs_route_airport_select_placeholder');
  })

  placeholderDepartureText = computed(() => {
    return this.i18nService.translate('departure_flight_route_airport_to_destination');
  })

  constructor() {
    effect(() => {
      const value = this.formValueSignal();
      const valid = this.routeForm.valid && this.routeForm.value['airline']?.id !== '';

      this.formValueChange.emit({ valid, value });
    });
  }

  readonly formValueSignal = toSignal(this.routeForm.valueChanges, {
    initialValue: this.routeForm.getRawValue(),
  });

  ngOnInit(): void {
    const { year, month, day } = this.arrivalDate()!;

    this.routeForm.patchValue({
      year: year,
      month: month,
      day: day,
    });

    const codeArr = countryList.getCode(this.countryNameArr());

    if (codeArr) {
      this.countryCodeArr.set(codeArr.toLowerCase());
    }

    const codeDep = countryList.getCode(this.countryNameDep());

    if(codeDep) {
      this.countryCodeDep.set(codeDep.toLowerCase());
    }

  }

  selectAirport(airport: Airport | null) {
    if (airport) {
      this.routeForm.patchValue({
        airport: airport.iata,
      });
    } else {
      this.routeForm.patchValue({
        airport: null,
      });
    }
  }

  selectHour(hour: string) {
    this.routeForm.patchValue({
      hour: hour,
    });
  }

  selectMinute(minute: string) {
    this.routeForm.patchValue({
      minute: minute,
    });
  }

  selectPeriod(period: string) {
    this.routeForm.patchValue({
      period: period,
    });
  }

  selectAirline(airline: IAirlinesToSelect | null) {
    this.routeForm.patchValue({
      airline: airline,
    });
  }

  get year() {
    return this.routeForm.get('year')?.value;
  }

  get month() {
    return this.routeForm.get('month')?.value;
  }

  get day() {
    return this.routeForm.get('day')?.value;
  }

  get airport() {
    return this.routeForm.get('airport')?.value;
  }
}
