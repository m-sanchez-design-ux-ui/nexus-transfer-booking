import { Component, ElementRef, EventEmitter, HostListener, Output, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";

@Component({
  selector: 'app-time-select',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './time-select.component.html',
})
export class TimeSelectComponent {

  @Input() customContainerClasses: string = ''; // ← Styles Tailwind CCS Class for container Buttons
  @Input() customButtonAmClasses: string = '';  // ← Styles Tailwind CCS Class for AM Button
  @Input() customButtonPmClasses: string = '';  // ← Styles Tailwind CCS Class for AM Button

  @Output() hour = new EventEmitter<string>();
  
  @Output() minute = new EventEmitter<string>();
  
  @Output() period = new EventEmitter<string>();

  horas: string[] = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  
  minutos: string[] = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );

  selectedHora = '00';
  selectedMinuto = '00';
  selectedPeriodo = 'PM';

  isDropdownOpen: 'hora' | 'minuto' | 'periodo' | null = null;

  toggleDropdown(tipo: 'hora' | 'minuto' | 'periodo') {
    this.isDropdownOpen = this.isDropdownOpen === tipo ? null : tipo;
  }

  selectHora(hora: string) {
    this.selectedHora = hora;
    this.hour.emit(hora);
    this.isDropdownOpen = null;
  }

  selectMinuto(minuto: string) {
    this.selectedMinuto = minuto;
    this.minute.emit(minuto);
    this.isDropdownOpen = null;
  }

  periodo: 'AM' | 'PM' = 'PM';

  seleccionarPeriodo(value: 'AM' | 'PM') {
    this.periodo = value;
    this.period.emit(value);
  }

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.eRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = null;
    }
  }

}
