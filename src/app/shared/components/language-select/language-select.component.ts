import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';

import { initFlowbite } from 'flowbite';

import { SelectedLanguage } from '@/app/shared/interfaces/contentful-text-data.interface';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { I18nService } from '@/app/shared/services/I18nService.service';

@Component({
  selector: 'app-language-select',
  standalone: true,
  imports: [NgClass],
  templateUrl: './language-select.component.html',
})
export class LanguageSelectComponent implements AfterViewInit {
  buttonClasses = input<string>('');
  @ViewChild('dropdownBtn') dropdownBtn!: ElementRef<HTMLButtonElement>;

  dataReservationService = inject(DataReservationService);
  I18nService = inject(I18nService);

  languagesFromContentful = computed<SelectedLanguage[]>(() => {
    const languages = this.I18nService.getLanguagesInfo();
    return languages.map((lang) => ({
      code: lang.code ?? '',
      isoCode: lang.isoCode ?? '',
      displayName: lang.displayName ?? '',
    }));
  });

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 0);
  }

  selectLanguage(languageSelected: SelectedLanguage) {
    this.I18nService.setLanguage(languageSelected);
    // this.dataReservationService.setLanguageBooking(this.languagesFromContentful().code);
    this.closeDropdown();
  }

  private closeDropdown() {
    this.dropdownBtn?.nativeElement?.click?.();
  }
}
