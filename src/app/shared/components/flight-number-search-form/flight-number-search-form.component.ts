import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  inject,
  output,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { AirlineSelectComponentComponent } from '@/app/shared/components/airline-select-component/airline-select-component.component';
import { IAirlinesToSelect } from '@/app/shared/interfaces/flighstats-airlines-active.interface';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';

@Component({
  selector: 'app-flight-number-search-form',
  standalone: true,
  imports: [
    AirlineSelectComponentComponent,
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './flight-number-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightNumberSearchFormComponent {
  formValueChange = output<{ valid: boolean; value: any }>();

  airLinesList = input.required<IAirlinesToSelect[]>();
  arrivalDate = input.required<{
    year: string;
    month: string;
    day: string;
  }>();
  isArrival = input.required<boolean>();
  monthString = input<string>('');

  seleccionada = signal<IAirlinesToSelect | null>(null);

  private readonly fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      const value = this.formValueSignal();
      if (value.flightNumber) {
        value.flightNumber = value.flightNumber.padStart(4, '0');
      }
      const valid = this.form.valid && this.form.value['airline']?.id !== '';

      this.formValueChange.emit({ valid, value });
    });
  }

  form = this.fb.group({
    airline: [{ id: '', name: '' }, Validators.required],
    flightNumber: ['', [Validators.required]],
  });

  readonly formValueSignal = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  get flightNumberControl() {
    return this.form.get('flightNumber');
  }

  onAirlineChange(airline: IAirlinesToSelect | null) {
    if (!airline) return;
    this.form.get('airline')?.setValue(airline);
  }

  get getDateTitle() {
    return this.isArrival()
      ? 'arrival_flight_arrival_date_label'
      : 'departure_flight_departure_date_title';
  }
}
