import { Injectable, signal } from '@angular/core';
import { IAirlinesToSelect } from '@/app/shared/interfaces/flighstats-airlines-active.interface';

@Injectable({
  providedIn: 'root',
})
export class AirlinesDataService {
  private readonly _airlines = signal<IAirlinesToSelect[]>([]);

  // Observable para consumir en los componentes
  readonly airlines = this._airlines.asReadonly();
  readonly STORAGE_AIRLINES = 'airlines';
  constructor() {}

  setAirlinesData(airlines: IAirlinesToSelect[]): void{
    localStorage.setItem(this.STORAGE_AIRLINES, JSON.stringify(airlines));
  }

  getAirlinesData(): string | null {
    return localStorage.getItem(this.STORAGE_AIRLINES);
  }

  setAirlines(airlines: IAirlinesToSelect[]): void {
    this._airlines.set(airlines);
  }

  getAirlines(): IAirlinesToSelect[] {
    return this._airlines();
  }

  clearAirlines(): void {
    this._airlines.set([]);
  }
}
