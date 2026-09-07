import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';
import intlTelInput from 'intl-tel-input';
import { concatMap, of } from 'rxjs';
import { IFlightStatsFlightReduce } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { MainLayoutComponent } from "@/app/shared/layouts/main-layout/main-layout.component";
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";
import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { IGetBookingsResponse } from '@/app/start-reservation/interfaces/start-reservation.interface';
import { RequestRegister, ResponseGetIP, ResponseLogin, TransferModifyRequest } from '../interfaces/add-contact.interface';
import { AddContactService } from '../services/add-contact.service';
import { getTime24Format } from '@/app/shared/utils/getHour24Format';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '@/app/shared/components/notifications/notifications.service';
import { NotificationsComponent } from "@/app/shared/components/notifications/notifications.component";
import { PrefixContextService } from '@/app/shared/services/prefix-context.service';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';
import { I18nService } from '@/app/shared/services/I18nService.service';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent,
    TranslatePipe,
    NotificationsComponent
],
  templateUrl: './add-contact.component.html'
})
export class AddContactComponent implements OnInit, AfterViewInit {

  private readonly router = inject(Router);
  private readonly addContactService = inject(AddContactService);
  private readonly prefixContextService = inject(PrefixContextService);
  private readonly dataReservationService = inject(DataReservationService);
  private readonly appSettings = inject(AppSettingsService);
  private readonly notificationService = inject(NotificationsService);
  private readonly i18nService = inject(I18nService);

  @ViewChild('phoneInput') phoneInput!: ElementRef;

  private iti: any;
  private readonly phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

  readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  phoneForm!: FormGroup;

  terms = signal<boolean>(false);
  isEmailValid = signal<boolean>(true);
  isPhoneValid = signal<boolean>(true);
  isTermsValid = signal<boolean>(true);

  dataRegister: RequestRegister = {
    locator: '',
    name: '',
    lastname: '',
    language: '',
    delegation_id: 0,
    lines: [],
    channels: [],
    ip: '',
    terms: false,
    promotions: false,
    app: 'bdr-allin',
  }

  dataTranferModify: TransferModifyRequest = {
    Locator: '',
    AgencyRef: '',
    HotelCodeArrival: '',
    FlightNumberArrival: '',
    FlightDateTimeArrival: '',
    AirportArrival: '',
    HotelCodeDeparture: '',
    FlightNumberDeparture: '',
    FlightDateTimeDeparture: '',
    AirportDeparture: '',
    WhatsappCodCountry: '',
    WhatsappNumber: '',
    SmsCodCountry: '',
    SmsNumber: '',
    Email: '',
  }

  ngOnInit(): void {
    this.phoneForm = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.pattern(this.EMAIL_REGEX),
      ]),
      'phone': new FormControl('', Validators.required),
    });

    this.getIP();

    const dataBooking = this.dataReservationService.getDataBookingValue();

    this.login(dataBooking.booking_response.booking_info.booking_number);

    this.getLanguage();

    this.completeDataTransferWithBooking(dataBooking);

    this.getDataFlights();
  }

  ngAfterViewInit() {
    const inputElement = this.phoneInput.nativeElement;
    
    // Obtener la URL de la API de ubicación desde appSettings
    const ipapiUrl = this.appSettings.apiConfig()?.ipapiApiUrl;
    
    this.iti = intlTelInput(inputElement, {
      initialCountry: 'auto',
      allowDropdown: true,
      geoIpLookup: (callback) => {
        if (ipapiUrl) {
          fetch(ipapiUrl)
            .then(res => res.json())
            .then(data => {
              const countryCode = data.country_code ? data.country_code.toLowerCase() : 'us';
              callback(countryCode);
            })
            .catch(() => {
              callback('us');
            });
        } else {
          console.warn('IP API URL not configured, using default country');
          callback('us');
        }
      },
      separateDialCode: true,
      utilsScript: 'assets/js/utils.js',
    });

    this.iti.promise.then(() => {
      inputElement.addEventListener('countrychange', () => this.updateFormValidation());
      inputElement.addEventListener('blur', () => this.updateFormValidation());
      inputElement.addEventListener('input', () => this.updateFormValidation());
    });
  }

  getLanguage() {
    const language = this.dataReservationService.getLanguageBooking()
    if (language) {
      this.dataRegister.language = language.value.split('-')[0]
    } else {
      this.dataRegister.language = 'en';
    }
  }

  completeDataTransferWithBooking(dataBooking: IGetBookingsResponse) {
    this.dataTranferModify.AgencyRef = dataBooking.booking_response.booking_info.agency_ref;
    this.dataTranferModify.Locator = dataBooking.booking_response.booking_info.booking_number;
    this.dataTranferModify.HotelCodeArrival = dataBooking.booking_response.booking_info.id_delegation_arrival;
    this.dataTranferModify.HotelCodeDeparture = dataBooking.booking_response.booking_info.id_delegation_departure;
  }

  getDataFlights() {
    const departureFlight = localStorage.getItem('selectedDepartureFlight');
    if (departureFlight) {

      const flight: IFlightStatsFlightReduce = JSON.parse(departureFlight);

      this.dataTranferModify.FlightNumberDeparture = `${flight.carrierFsCode}${flight.flightNumber}`;

      const date = (flight.departureDate.dateLocal.split('T')[1]).split('.')[0];

      this.dataTranferModify.FlightDateTimeDeparture = date;

      this.dataTranferModify.AirportDeparture =`${flight.arrivalIataCode}`;
    } else {

      const departureFligthUser = localStorage.getItem('selectedDepartureNoFlightSearch');
      if (departureFligthUser) {

        const flightUser = JSON.parse(departureFligthUser);

        this.dataTranferModify.FlightNumberDeparture = `${flightUser.airline.id}${flightUser.flightNumber}`;

        const hour = getTime24Format(flightUser.hour, flightUser.period);

        this.dataTranferModify.FlightDateTimeDeparture = `${hour}:${flightUser.minute}:00`;
      }
    }

    const arrivalFlight = localStorage.getItem('selectedArrivalFlight');
    if (arrivalFlight) {

      const flight: IFlightStatsFlightReduce = JSON.parse(arrivalFlight);

      this.dataTranferModify.FlightNumberArrival = `${flight.carrierFsCode}${flight.flightNumber}`;

      this.dataTranferModify.FlightDateTimeArrival = flight.arrivalDate.dateLocal;

      const date = (flight.arrivalDate.dateLocal.split('T')[1]).split('.')[0];

      this.dataTranferModify.FlightDateTimeArrival = date;

      this.dataTranferModify.AirportArrival =`${flight.departureIataCode}`;
    } else {

      const arrivalFligthUser = localStorage.getItem('selectedArrivalNoFlightSearch');
      if (arrivalFligthUser) {
        const flightUser = JSON.parse(arrivalFligthUser);

        this.dataTranferModify.FlightNumberArrival = `${flightUser.airline.id}${flightUser.flightNumber}`;

        const hour = getTime24Format(flightUser.hour, flightUser.period);

        this.dataTranferModify.FlightDateTimeArrival = `${hour}:${flightUser.minute}:00`;
      }
    }
  }

  getIP() {
    this.addContactService.getIPAddress().subscribe({
      next: (data: ResponseGetIP) => { this.dataRegister.ip = data.ip },
      error: (err) => { console.log(err) },
      complete: () => { }
    });
  }

  login(code: string) {
    this.addContactService.login(code).subscribe({
      next: (data: ResponseLogin) => {
        if (data.status === 'OK') {
          this.dataRegister.delegation_id = data.delegation_id;
          this.dataRegister.name = data.name;
          this.dataRegister.lastname = data.lastname;
          this.dataRegister.lines = data.lines;
          this.dataRegister.locator = data.locator;
        } else {
          this.notificationService.showAndClear({
            data: { text: this.i18nService.translate('alert_add_contact') }
          });
        }
      },
      error: (err) => {
        this.notificationService.showAndClear({
            data: { text: this.i18nService.translate('alert_add_contact') }
          });
      },
      complete: () => {}
    })
  }

  changeEmail() {
    this.isEmailValid.set(true);
  }

  changePhone() {
    this.isPhoneValid.set(true);
  }

  changeCheckboxTerms() {
    this.terms.set(!this.terms());
    this.isTermsValid.set(true);
  }

  updateFormValidation() {
    const countryData = this.iti.getSelectedCountryData();
    const fullNumber = this.iti.getNumber();

    if (!fullNumber) {
      this.phoneForm.get('phone')?.setErrors({ required: true });
      return;
    }

    try {
      const phoneNumber = this.phoneUtil.parseAndKeepRawInput(fullNumber, countryData.iso2.toUpperCase());

      const isValid = this.phoneUtil.isValidNumber(phoneNumber);
      const isValidForRegion = this.phoneUtil.isValidNumberForRegion(phoneNumber, countryData.iso2.toUpperCase());

      if (isValid && isValidForRegion) {
        this.phoneForm.get('phone')?.setValue(fullNumber);
        this.phoneForm.get('phone')?.setErrors(null);
      } else {
        this.phoneForm.get('phone')?.setErrors({ invalidPhoneNumber: true });
      }

    } catch (e) {
      console.warn('Error parsing phone number:', e);
      this.phoneForm.get('phone')?.setErrors({ invalidPhoneNumber: true });
    }
  }

  saveReservation() {
    this.updateFormValidation();

    if (this.phoneForm.valid && this.terms()) {
      this.dataRegister.promotions = this.terms();
      this.dataRegister.terms = this.terms();

      const chanel1 = {
        rank: 1,
        channel: 'whatsapp',
        value: this.phoneForm.value.phone,
      }
      const chanel3 = {
        rank: 3,
        channel: 'email',
        value: this.phoneForm.value.email,
      }

      this.dataRegister.channels = [chanel1, chanel3];

      const countryData = this.iti.getSelectedCountryData();

      const phoneNumber = this.iti.getNumber();

      this.dataTranferModify.SmsNumber = phoneNumber;

      this.dataTranferModify.WhatsappNumber = phoneNumber;

      const dialCode = `+${countryData.dialCode}`;

      this.dataTranferModify.SmsCodCountry = dialCode;

      this.dataTranferModify.WhatsappCodCountry = dialCode;

      this.dataTranferModify.Email = this.phoneForm.value.email;

      const navigateUrl = this.prefixContextService.prefix() ? `/${this.prefixContextService.prefix()}/reservation-detail` : '/reservation-detail';
      this.addContactService.transferModify(this.dataTranferModify)
      .pipe(
        concatMap((response: any) => {
          if(response) {
            return this.addContactService.register(this.dataRegister);
          }
          this.notificationService.showAndClear({
            data: { text: this.i18nService.translate('alert_add_contact') }
          });
          return of(null);
        })
      )
      .subscribe({
        next: (data) => {},
        error: (err) => {
          this.notificationService.showAndClear({
            data: { text: this.i18nService.translate('alert_add_contact') }
          });
        },
        complete: () => {this.router.navigate(['/reservation-detail'])}
      });
    } else {
      this.phoneForm.markAllAsTouched();

      if (this.phoneForm.controls['email'].hasError('required') || this.phoneForm.controls['email'].hasError('pattern')) {
        this.isEmailValid.set(false);
      }
      if (this.phoneForm.controls['phone'].hasError('required') || this.phoneForm.controls['phone'].hasError('invalidPhoneNumber')) {
        this.isPhoneValid.set(false);
      }
      if (!this.terms()) {
        this.isTermsValid.set(this.terms());
      }
    }
  }
}