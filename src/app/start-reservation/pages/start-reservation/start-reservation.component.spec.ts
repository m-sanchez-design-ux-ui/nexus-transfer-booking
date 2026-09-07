import { DataReservationService } from '@/app/shared/services/dataReservation.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StartReservationService } from '../../services/start-reservation/start-reservation.service';
import { StartReservationComponent } from './start-reservation.component';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ModalService } from '@/app/shared/services/modal.service';

class StartReservationServiceMockNoDeps {
  getBookings = jasmine.createSpy('getBookings').and.returnValue(of({}));
}
class DataReservationServiceMockNoDeps {
  setDataBooking = jasmine.createSpy('setDataBooking');
  getLanguageBooking = jasmine
    .createSpy('getLanguageBooking')
    .and.returnValue('en');
}

describe('StartReservationComponent', () => {
  let fixture: ComponentFixture<StartReservationComponent>;
  let component: StartReservationComponent;

  let mockStartReservationService: StartReservationServiceMockNoDeps;
  let mockStartDataReservationService: DataReservationServiceMockNoDeps;
  let mockModalService: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartReservationComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: StartReservationService,
          useClass: StartReservationServiceMockNoDeps,
        },
        {
          provide: DataReservationService,
          useClass: DataReservationServiceMockNoDeps,
        },
        {
          provide: ModalService,
          useValue: jasmine.createSpyObj('ModalService', ['open']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StartReservationComponent);
    component = fixture.componentInstance;

    mockStartReservationService = TestBed.inject(
      StartReservationService
    ) as unknown as StartReservationServiceMockNoDeps;

    mockStartDataReservationService = TestBed.inject(
      DataReservationService
    ) as unknown as DataReservationServiceMockNoDeps;

    mockModalService = TestBed.inject(
      ModalService
    ) as unknown as jasmine.SpyObj<ModalService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write on input element', () => {
    const debug = fixture.debugElement.query(By.css('#reservation'));
    const inputEl: HTMLInputElement = debug.nativeElement;
    inputEl.value = 'XYZ789';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.codeReservation()).toBe('XYZ789');
  });

  it('should call goToArrivalFlight when press the button', () => {
    const debug = fixture.debugElement.query(By.css('#reservation'));
    const inputEl: HTMLInputElement = debug.nativeElement;
    inputEl.value = 'XYZ789';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const spy = spyOn(component, 'goToArrivalFlight');
    const button = fixture.debugElement.query(By.css('#goToArrivalFlight'));
    button.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should show "Tu reservación no fue encontrada" on modal reservation', () => {
    const debug = fixture.debugElement.query(By.css('#reservation'));
    const inputEl: HTMLInputElement = debug.nativeElement;
    inputEl.value = 'XYZ789';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#goToArrivalFlight'));
    button.nativeElement.click();

    fixture.detectChanges();

    expect(component.messageModal()).toBe('Tu reservación no fue encontrada.');

    const messageText = fixture.debugElement.query(
      By.css('#reservation-modal-text')
    );

    expect(messageText.nativeElement.textContent).toContain(
      'Tu reservación no fue encontrada'
    );
  });

  it('should update language and languageLabel when child component emit a language', () => {
    fixture.detectChanges();

    const langDebug = fixture.debugElement.query(By.css('app-language-select'));
    expect(langDebug).toBeTruthy();

    langDebug.triggerEventHandler('language', {
      label: 'Español',
      value: 'es-ES',
    });

    fixture.detectChanges();

    expect(component.language()).toBe('es');
    expect(component.languageLabel()).toBe('Español');
  });

  it('muestra modal con "Tu reservación no fue encontrada." cuando getBookings lanza No results', () => {
    mockStartReservationService.getBookings.and.returnValue(
      throwError(() => ({ error: { error: { error_message: 'No results' } } }))
    );

    const input = fixture.debugElement.query(By.css('#reservation'))
      .nativeElement as HTMLInputElement;
    input.value = 'XYZ789';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('#goToArrivalFlight'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(component.messageModal()).toBe('Tu reservación no fue encontrada.');
    expect(mockModalService.open).toHaveBeenCalledWith('alert-reservation');
  });

  it('muestra modal con "Tu reserva se encuentra cancelada" cuando getBookings lanza Canceled Status', () => {
    mockStartReservationService.getBookings.and.returnValue(
      throwError(() => ({
        error: { error: { error_message: 'The Booking has Canceled Status.' } },
      }))
    );

    const input = fixture.debugElement.query(By.css('#reservation'))
      .nativeElement as HTMLInputElement;
    input.value = 'XYZ789';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('#goToArrivalFlight'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(component.messageModal()).toBe('Tu reserva se encuentra cancelada');
    expect(mockModalService.open).toHaveBeenCalledWith('alert-reservation');
  });

  it('muestra mensaje genérico para otros errores', () => {
    mockStartReservationService.getBookings.and.returnValue(
      throwError(() => ({
        error: { error: { error_message: 'Some other error' } },
      }))
    );

    const input = fixture.debugElement.query(By.css('#reservation'))
      .nativeElement as HTMLInputElement;
    input.value = 'XYZ789';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('#goToArrivalFlight'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(component.messageModal()).toBe(
      'Por favor contacta a tu agencia o con Nexus para revisar tu reserva.'
    );
    expect(mockModalService.open).toHaveBeenCalledWith('alert-reservation');
  });
});
