import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { initFlowbite } from 'flowbite';

import {
  IGetBookingsRequest,
  IGetBookingsResponse,
} from '@/app/start-reservation/interfaces/start-reservation.interface';
import { StartReservationService } from '@/app/start-reservation/services/start-reservation/start-reservation.service';

import { AlertReservationComponent } from '@/app/shared/components/alerts/alert-reservation/alert-reservation.component';
import { LanguageSelectComponent } from '@/app/shared/components/language-select/language-select.component';
import { MainLayoutComponent } from '@/app/shared/layouts/main-layout/main-layout.component';
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { I18nService } from '../../../shared/services/I18nService.service';
import { detectMobile } from '@/app/shared/utils/isMobileDevice';
import { PrefixContextService } from '@/app/shared/services/prefix-context.service';
import { AppSettingsService } from '@/app/shared/services';

@Component({
  selector: 'app-start-reservation',
  standalone: true,
  imports: [
    AlertReservationComponent,
    FormsModule,
    LanguageSelectComponent,
    MainLayoutComponent,
    TranslatePipe,
  ],
  templateUrl: './start-reservation.component.html',
})
export class StartReservationComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private readonly router = inject(Router);
  private readonly startResevationService = inject(StartReservationService);
  private readonly dataReservationService = inject(DataReservationService);
  private readonly modalService = inject(ModalService);
  private readonly i18nService = inject(I18nService);
  private readonly prefixContextService = inject(PrefixContextService);
  private readonly appSettingsService = inject(AppSettingsService);

  codeReservation = signal<string>('');
  language = signal<string>('en');
  languageLabel = signal<string>('English');
  messageModal = signal<string>('');
  messageModalText = signal<string>('');

  private readonly subscriptions = signal<Subscription[]>([]);

  isMobileDevice = signal(false);
  phoneCall = signal(this.appSettingsService.settings()?.contact.phoneCall ?? '');

  ngOnInit(): void {
    localStorage.removeItem('dataBooking');
    localStorage.removeItem('selectedArrivalFlight');
    localStorage.removeItem('selectedArrivalNoFlightSearch');
    localStorage.removeItem('selectedDepartureFlight');
    localStorage.removeItem('selectedDepartureNoFlightSearch');
    this.isMobileDevice.set(detectMobile());
  }

  ngAfterViewInit(): void {
    // Usar un timeout más largo para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  openAssistanceMenu() {
    const assistanceMenu = document.getElementById('nexus-widget-button');
    if (assistanceMenu) {
      assistanceMenu.click();
    }
  }

  goToArrivalFlight(): void {
    const bookingRequest: IGetBookingsRequest = {
      locator: this.codeReservation(),
      language: this.language(),
    };
    this.subscriptions().push(
      this.startResevationService.getBookings(bookingRequest).subscribe({
        next: (data) => {
          if (data) {
            this.dataReservationService.setDataBooking(data);
            const prefix = data.booking_response.booking_info.id_delegation_arrival.toLowerCase().trim();
            this.prefixContextService.setPrefix(prefix);
            const urlNavigate = prefix
              ? `/${prefix}/arrival-flight`
              : '/arrival-flight';
            this.router.navigate([urlNavigate]);
          }
        },
        error: (error) => {
          let message = '';
          let messageText = '';
          if (
            error.error.error.error_message === 'No results' ||
            error.error.error.error_message ===
              "The Booking doesn't belong to a BDR All IN Agency"
          ) {
            message = this.i18nService.translate(
              'start_reservation_modal_no_search_flight_title'
            );
            messageText = this.i18nService.translate(
              'start_reservation_modal_no_search_flight_text'
            );
            this.messageModal.set(message);
            this.messageModalText.set(messageText);
          } else if (
            error.error.error.error_message ===
            'The Booking has Canceled Status.'
          ) {
            message = this.i18nService.translate(
              'start_reservation_modal_canceled_flight_title'
            );
            messageText = this.i18nService.translate(
              'start_reservation_modal_canceled_flight_text'
            );
            this.messageModal.set(message);
            this.messageModalText.set(messageText);
          } else {
            this.messageModal.set(
              'Por favor contacta a tu agencia o con Nexus para revisar tu reserva.'
            );
          }
          this.modalService.open('alert-reservation');
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions().forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
