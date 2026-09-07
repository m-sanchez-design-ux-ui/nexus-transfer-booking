import { inject, Injectable, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestRegister, ResponseGetIP, ResponseLogin, TransferModifyRequest } from '../interfaces/add-contact.interface';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AddContactService {
  private readonly httpClient = inject(HttpClient);
  private readonly appSettings = inject(AppSettingsService);

  // Computed signals para las URLs y API Keys
  private readonly blueDiamondApiUrl = computed(() => 
    this.appSettings.apiConfig()?.blueDiamondApiUrl ?? ''
  );

  private readonly blueDiamondApiKey = computed(() => 
    this.appSettings.apiConfig()?.blueDiamondApiKey ?? ''
  );

  private readonly experiencesHubApiUrl = computed(() => 
    this.appSettings.apiConfig()?.experiencesHubApiUrl ?? ''
  );

  private readonly ipifyApiUrl = computed(() => 
    this.appSettings.apiConfig()?.ipifyApiUrl ?? ''
  );

  transferModify(data: TransferModifyRequest) {
    let params = new HttpParams();
    params = params.set('Locator', data.Locator);
    params = params.set('AgencyRef', data.AgencyRef);
    params = params.set('HotelCodeArrival', data.HotelCodeArrival);
    params = params.set('FlightNumberArrival', data.FlightNumberArrival);
    params = params.set('FlightDateTimeArrival', data.FlightDateTimeArrival);
    params = params.set('AirportArrival', data.AirportArrival);
    params = params.set('HotelCodeDeparture', data.HotelCodeDeparture);
    params = params.set('FlightNumberDeparture', data.FlightNumberDeparture);
    params = params.set('FlightDateTimeDeparture', data.FlightDateTimeDeparture);
    params = params.set('AirportDeparture', data.AirportDeparture);
    params = params.set('Whatsapp.CodCountry', data.WhatsappCodCountry);
    params = params.set('Whatsapp.Number', data.WhatsappNumber);
    params = params.set('Sms.CodCountry', data.SmsCodCountry);
    params = params.set('Sms.Number', data.SmsNumber);
    params = params.set('Email', data.Email);

    const headers = new HttpHeaders({
      'X-Api-Key': this.blueDiamondApiKey()
    });

    return this.httpClient.get(
      `${this.blueDiamondApiUrl()}/transferModify`,
      { headers: headers, params: params }
    );
  }

  register(data: RequestRegister) {
    return this.httpClient.post(
      `${this.experiencesHubApiUrl()}/register`,
      data
    );
  }

  login(code: string) {
    return this.httpClient.get<ResponseLogin>(
      `${this.experiencesHubApiUrl()}/login?code=${code}`
    );
  }

  getIPAddress() {
    return this.httpClient.get<ResponseGetIP>(
      `${this.ipifyApiUrl()}`
    );
  }
}
