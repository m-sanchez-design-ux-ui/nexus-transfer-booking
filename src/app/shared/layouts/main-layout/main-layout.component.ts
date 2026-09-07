import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

import { ContactCenterButtonComponent } from '@/app/shared/components/contact-center-button/contact-center-button.component';
import { LanguageSelectComponent } from '@/app/shared/components/language-select/language-select.component';
import { StepperComponent } from '@/app/shared/components/stepper/stepper.component';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { ActivatedRoute } from '@angular/router';
import { SelectedLanguage } from '@/app/shared/interfaces/contentful-text-data.interface';

@Component({
  selector: 'main-layout',
  standalone: true,
  imports: [
    LanguageSelectComponent,
    StepperComponent,
    CommonModule,
    ContactCenterButtonComponent,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  backgroundClass = input('bg-bg-image-02');
  step = input<number>(1);
  languageLabel = input('Español');
  isReservationPage = input<boolean>(false);

  dataReservationService = inject(DataReservationService);
  activatedRoute = inject(ActivatedRoute);

  path = signal<string>('');

  ngOnInit(): void {
    const routeConfig = this.activatedRoute.routeConfig;
    this.path.set(routeConfig?.path ?? '');
  }

  searchResultModalId() {
    return 'searchResultModal';
  }

  getRightSideClass() {
    if (this.path() === 'reservation' || this.path() === '') {
      return 'relative z-20 flex flex-col items-center justify-between h-full min-h-[152px] max-h-[152px] lg:min-h-[550px] lg:max-h-[750px]';
    } else {
      return 'relative z-20 flex flex-col items-center justify-between h-full px-0 pb-7 lg:pb-20 min-h-[208px]';
    }
  }

  getContentSectionClass() {
    if (this.path() === 'reservation' || this.path() === '') {
      return 'w-full px-5 py-16 lg:px-10 lg:py-10 flex justify-center items-center min-h-[calc(100vh-208px)] lg:min-h-screen';
    } else {
      return 'z-20 w-full px-5 py-16 lg:px-10 lg:py-20 flex justify-center items-center h-fit lg:min-h-screen';
    }
    return '';
  }

  getStyle(): string {
    if (
      this.path() === 'arrival-flight' ||
      this.path() === 'departure-flight'
    ) {
      return 'max-w-[552px] gap-[36px]';
    } else if (this.path() === 'add-contact') {
      return 'max-w-[616px] gap-[30px]';
    } else if (this.path() === 'reservation-detail') {
      return 'max-w-[566px] gap-[30px]';
    } else {
      return 'max-w-[530px] gap-[34px]';
    }
  }
}
