import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrefixContextService {
  private readonly _prefix = signal<string | null>(null);

  setPrefix(prefix: string) {
    this._prefix.set(prefix.toLowerCase());
  }

  prefix = computed(() => this._prefix());

  get current(): string | null {
    return this._prefix();
  }
}
